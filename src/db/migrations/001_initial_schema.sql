-- ==============================================================================
-- PULSE DATABASE INITIAL SCHEMA & SECURITY SPECIFICATION
-- ==============================================================================

-- 1. ROLES & PERMISSIONS SETUP
-- Ensures compatibility across standard Supabase and testing environments
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated;
    END IF;
END
$$;

-- 2. CONFIG TABLE
CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- Seed default configuration (Minimum group size N=5, strictly >= 5)
INSERT INTO app_config (key, value)
VALUES 
    ('min_group_size', '{"value": 5, "description": "Minimum respondents per squad to display results; cannot be set below 5"}'::jsonb),
    ('flag_thresholds', '{"q5_workload_max": 3.0, "q4_safety_max": 3.2, "general_low_score": 3.0, "late_code_pct_max": 35.0, "training_drop_pct_max": 30.0}'::jsonb),
    ('retention_days', '{"responses_days": 90, "comments_days": 90, "invites_days": 90}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 3. ORGANISATIONAL HIERARCHY
CREATE TABLE IF NOT EXISTS business_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    director_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS squads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_unit_id UUID NOT NULL REFERENCES business_units(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    manager_user_id UUID,
    target_headcount INT NOT NULL DEFAULT 8,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_unit_id, name)
);

-- 4. SURVEY CYCLES
CREATE TABLE IF NOT EXISTS cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cycle_type TEXT NOT NULL CHECK (cycle_type IN ('full', 'follow_up')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVITES TABLE (Zero email persistence, token hashes only)
CREATE TABLE IF NOT EXISTS invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    used_on DATE NULL
);

-- 6. RESPONSES TABLE (Zero join path to invites, no user ID, no IP, no fine timestamps)
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    q1 SMALLINT CHECK (q1 BETWEEN 1 AND 5),
    q2 SMALLINT CHECK (q2 BETWEEN 1 AND 5),
    q3 SMALLINT CHECK (q3 BETWEEN 1 AND 5),
    q4 SMALLINT CHECK (q4 BETWEEN 1 AND 5),
    q5 SMALLINT CHECK (q5 BETWEEN 1 AND 5),
    q6 SMALLINT CHECK (q6 BETWEEN 1 AND 5),
    comment TEXT CHECK (length(comment) <= 600)
);

-- ACCESS LOCKDOWN: REVOKE ALL from anon and authenticated on responses table
REVOKE ALL ON responses FROM PUBLIC, anon, authenticated;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
-- No RLS policies are created for responses; default deny applies to all direct table queries.

-- 7. SQUAD-LEVEL OPERATIONAL INDICATORS (Optional, pre-aggregated only)
CREATE TABLE IF NOT EXISTS operational_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    off_hours_code_pct NUMERIC(5,2) CHECK (off_hours_code_pct BETWEEN 0 AND 100),
    leave_pattern_ratio NUMERIC(3,2) CHECK (leave_pattern_ratio BETWEEN 0 AND 1.0),
    internal_transfers_count INT DEFAULT 0,
    training_attendance_pct NUMERIC(5,2) CHECK (training_attendance_pct BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(squad_id, cycle_id)
);

-- 8. ACTIONS WORKFLOW PLAYBOOK
CREATE TABLE IF NOT EXISTS actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    trigger_name TEXT NOT NULL,
    likely_cause TEXT NOT NULL,
    response_plan TEXT NOT NULL,
    owner_role TEXT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In progress', 'Done', 'Blocked')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MANAGER FOLLOW-THROUGH (Compliance counts only, no individual notes or names)
CREATE TABLE IF NOT EXISTS manager_follow_through (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_user_id UUID NOT NULL,
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    stay_interviews_completed INT NOT NULL DEFAULT 0,
    action_plan_logged_on_time BOOLEAN NOT NULL DEFAULT FALSE,
    check_back_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(manager_user_id, cycle_id)
);

-- 10. SKIP-LEVEL THEMES (Themes only, no personal attribution)
CREATE TABLE IF NOT EXISTS skip_level_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_unit_id UUID NOT NULL REFERENCES business_units(id) ON DELETE CASCADE,
    squad_id UUID REFERENCES squads(id) ON DELETE SET NULL,
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    theme_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. APPEND-ONLY AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    actor_role TEXT NOT NULL,
    target_group_id UUID,
    cycle_id UUID,
    action TEXT NOT NULL,
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM PUBLIC, anon, authenticated;

-- 12. SUMMARY CACHE (Business Unit Level Only)
CREATE TABLE IF NOT EXISTS summary_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_unit_id UUID NOT NULL REFERENCES business_units(id) ON DELETE CASCADE,
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    summary_text JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_unit_id, cycle_id)
);

-- ==============================================================================
-- SECURITY DEFINER FUNCTIONS (The ONLY read/write gateway for survey responses)
-- ==============================================================================

-- 1. SUBMIT RESPONSE
CREATE OR REPLACE FUNCTION submit_response(
    p_token_hash TEXT,
    p_cycle_id UUID,
    p_squad_id UUID,
    p_q1 INT DEFAULT NULL,
    p_q2 INT DEFAULT NULL,
    p_q3 INT DEFAULT NULL,
    p_q4 INT DEFAULT NULL,
    p_q5 INT DEFAULT NULL,
    p_q6 INT DEFAULT NULL,
    p_comment TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_cycle_status TEXT;
    v_invite_id UUID;
BEGIN
    -- Verify cycle is open
    SELECT status INTO v_cycle_status FROM cycles WHERE id = p_cycle_id;
    IF v_cycle_status IS NULL OR v_cycle_status != 'open' THEN
        RETURN jsonb_build_object('success', false, 'error', 'CYCLE_NOT_OPEN');
    END IF;

    -- Verify and atomically burn the token
    UPDATE invites
    SET used = TRUE, used_on = CURRENT_DATE
    WHERE token_hash = p_token_hash
      AND cycle_id = p_cycle_id
      AND squad_id = p_squad_id
      AND used = FALSE
    RETURNING id INTO v_invite_id;

    IF v_invite_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'INVALID_OR_USED_TOKEN');
    END IF;

    -- Insert response (random UUID, no token, no fine timestamps)
    INSERT INTO responses (id, cycle_id, squad_id, q1, q2, q3, q4, q5, q6, comment)
    VALUES (
        gen_random_uuid(),
        p_cycle_id,
        p_squad_id,
        p_q1,
        p_q2,
        p_q3,
        p_q4,
        p_q5,
        p_q6,
        p_comment
    );

    RETURN jsonb_build_object('success', true);
END;
$$;

-- 2. GET SQUAD RESULTS (Enforces N >= 5)
CREATE OR REPLACE FUNCTION get_squad_results(
    p_squad_id UUID,
    p_cycle_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INT;
    v_q1 NUMERIC;
    v_q2 NUMERIC;
    v_q3 NUMERIC;
    v_q4 NUMERIC;
    v_q5 NUMERIC;
    v_q6 NUMERIC;
    v_min_n INT := 5;
    v_config_val INT;
BEGIN
    -- Read configured min_group_size (never allow below 5)
    SELECT (value->>'value')::int INTO v_config_val FROM app_config WHERE key = 'min_group_size';
    IF v_config_val IS NOT NULL AND v_config_val >= 5 THEN
        v_min_n := v_config_val;
    END IF;

    -- Aggregate scores
    SELECT 
        COUNT(*),
        ROUND(AVG(q1)::numeric, 2),
        ROUND(AVG(q2)::numeric, 2),
        ROUND(AVG(q3)::numeric, 2),
        ROUND(AVG(q4)::numeric, 2),
        ROUND(AVG(q5)::numeric, 2),
        ROUND(AVG(q6)::numeric, 2)
    INTO v_count, v_q1, v_q2, v_q3, v_q4, v_q5, v_q6
    FROM responses
    WHERE squad_id = p_squad_id AND cycle_id = p_cycle_id;

    -- Enforcement: Under N = 5 returns only {squad_id, hidden: true}
    IF v_count < v_min_n THEN
        RETURN jsonb_build_object(
            'squad_id', p_squad_id,
            'hidden', true
        );
    END IF;

    RETURN jsonb_build_object(
        'squad_id', p_squad_id,
        'hidden', false,
        'response_count', v_count,
        'means', jsonb_build_object(
            'q1', v_q1,
            'q2', v_q2,
            'q3', v_q3,
            'q4', v_q4,
            'q5', v_q5,
            'q6', v_q6
        ),
        'average_pulse', ROUND(((v_q1 + v_q2 + v_q3 + v_q4 + v_q5 + v_q6) / 6.0)::numeric, 2)
    );
END;
$$;

-- 3. GET UNIT RESULTS WITH ROLLUP & COMPLEMENTARY SUPPRESSION
CREATE OR REPLACE FUNCTION get_unit_results_with_rollup(
    p_unit_id UUID,
    p_cycle_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_min_n INT := 5;
    v_config_val INT;
    v_squad RECORD;
    v_squad_results JSONB := '[]'::jsonb;
    v_hidden_squads_count INT := 0;
    v_total_squads_count INT := 0;
    v_pool_count INT := 0;
    v_pool_q1_sum INT := 0;
    v_pool_q2_sum INT := 0;
    v_pool_q3_sum INT := 0;
    v_pool_q4_sum INT := 0;
    v_pool_q5_sum INT := 0;
    v_pool_q6_sum INT := 0;
    v_unit_total_count INT := 0;
    v_unit_q1_sum INT := 0;
    v_unit_q2_sum INT := 0;
    v_unit_q3_sum INT := 0;
    v_unit_q4_sum INT := 0;
    v_unit_q5_sum INT := 0;
    v_unit_q6_sum INT := 0;
    v_suppress_unit_total BOOLEAN := FALSE;
    v_merged_pool JSONB := NULL;
    v_unit_aggregate JSONB := NULL;
BEGIN
    SELECT (value->>'value')::int INTO v_config_val FROM app_config WHERE key = 'min_group_size';
    IF v_config_val IS NOT NULL AND v_config_val >= 5 THEN
        v_min_n := v_config_val;
    END IF;

    -- Iterate all squads in this unit
    FOR v_squad IN 
        SELECT s.id, s.name, s.target_headcount
        FROM squads s
        WHERE s.business_unit_id = p_unit_id
        ORDER BY s.name ASC
    LOOP
        v_total_squads_count := v_total_squads_count + 1;
        
        DECLARE
            v_cnt INT;
            v_q1 NUMERIC; v_q2 NUMERIC; v_q3 NUMERIC;
            v_q4 NUMERIC; v_q5 NUMERIC; v_q6 NUMERIC;
            v_q1_s INT; v_q2_s INT; v_q3_s INT;
            v_q4_s INT; v_q5_s INT; v_q6_s INT;
        BEGIN
            SELECT 
                COUNT(*),
                COALESCE(SUM(q1), 0), COALESCE(SUM(q2), 0), COALESCE(SUM(q3), 0),
                COALESCE(SUM(q4), 0), COALESCE(SUM(q5), 0), COALESCE(SUM(q6), 0),
                ROUND(AVG(q1)::numeric, 2), ROUND(AVG(q2)::numeric, 2), ROUND(AVG(q3)::numeric, 2),
                ROUND(AVG(q4)::numeric, 2), ROUND(AVG(q5)::numeric, 2), ROUND(AVG(q6)::numeric, 2)
            INTO v_cnt, v_q1_s, v_q2_s, v_q3_s, v_q4_s, v_q5_s, v_q6_s,
                 v_q1, v_q2, v_q3, v_q4, v_q5, v_q6
            FROM responses
            WHERE squad_id = v_squad.id AND cycle_id = p_cycle_id;

            -- Accumulate into Unit Totals
            v_unit_total_count := v_unit_total_count + v_cnt;
            v_unit_q1_sum := v_unit_q1_sum + v_q1_s;
            v_unit_q2_sum := v_unit_q2_sum + v_q2_s;
            v_unit_q3_sum := v_unit_q3_sum + v_q3_s;
            v_unit_q4_sum := v_unit_q4_sum + v_q4_s;
            v_unit_q5_sum := v_unit_q5_sum + v_q5_s;
            v_unit_q6_sum := v_unit_q6_sum + v_q6_s;

            IF v_cnt < v_min_n THEN
                v_hidden_squads_count := v_hidden_squads_count + 1;
                v_squad_results := v_squad_results || jsonb_build_object(
                    'squad_id', v_squad.id,
                    'name', v_squad.name,
                    'hidden', true
                );
                -- Pool into below-threshold squads pool
                v_pool_count := v_pool_count + v_cnt;
                v_pool_q1_sum := v_pool_q1_sum + v_q1_s;
                v_pool_q2_sum := v_pool_q2_sum + v_q2_s;
                v_pool_q3_sum := v_pool_q3_sum + v_q3_s;
                v_pool_q4_sum := v_pool_q4_sum + v_q4_s;
                v_pool_q5_sum := v_pool_q5_sum + v_q5_s;
                v_pool_q6_sum := v_pool_q6_sum + v_q6_s;
            ELSE
                v_squad_results := v_squad_results || jsonb_build_object(
                    'squad_id', v_squad.id,
                    'name', v_squad.name,
                    'hidden', false,
                    'response_count', v_cnt,
                    'means', jsonb_build_object(
                        'q1', v_q1, 'q2', v_q2, 'q3', v_q3,
                        'q4', v_q4, 'q5', v_q5, 'q6', v_q6
                    ),
                    'average_pulse', ROUND(((v_q1 + v_q2 + v_q3 + v_q4 + v_q5 + v_q6) / 6.0)::numeric, 2)
                );
            END IF;
        END;
    END LOOP;

    -- ROLL-UP RULE EVALUATION:
    -- If below-threshold squads pool has >= 5 responses, it can be reported as a merged pool
    IF v_hidden_squads_count > 1 AND v_pool_count >= v_min_n THEN
        v_merged_pool := jsonb_build_object(
            'name', 'Merged Delivery Squads (Roll-up)',
            'hidden', false,
            'response_count', v_pool_count,
            'means', jsonb_build_object(
                'q1', ROUND((v_pool_q1_sum::numeric / v_pool_count), 2),
                'q2', ROUND((v_pool_q2_sum::numeric / v_pool_count), 2),
                'q3', ROUND((v_pool_q3_sum::numeric / v_pool_count), 2),
                'q4', ROUND((v_pool_q4_sum::numeric / v_pool_count), 2),
                'q5', ROUND((v_pool_q5_sum::numeric / v_pool_count), 2),
                'q6', ROUND((v_pool_q6_sum::numeric / v_pool_count), 2)
            )
        );
    END IF;

    -- COMPLEMENTARY SUPPRESSION:
    -- If exactly 1 squad is hidden (or hidden count > 0 and pool < min_n such that subtracting visible from total reveals the hidden group)
    IF v_hidden_squads_count = 1 AND v_total_squads_count > 1 THEN
        v_suppress_unit_total := TRUE;
    END IF;

    -- Construct Unit Aggregate
    IF v_suppress_unit_total OR v_unit_total_count < v_min_n THEN
        v_unit_aggregate := jsonb_build_object(
            'unit_id', p_unit_id,
            'total_suppressed', true,
            'reason', 'COMPLEMENTARY_SUPPRESSION_TO_PROTECT_HIDDEN_GROUP'
        );
    ELSE
        v_unit_aggregate := jsonb_build_object(
            'unit_id', p_unit_id,
            'total_suppressed', false,
            'response_count', v_unit_total_count,
            'means', jsonb_build_object(
                'q1', ROUND((v_unit_q1_sum::numeric / v_unit_total_count), 2),
                'q2', ROUND((v_unit_q2_sum::numeric / v_unit_total_count), 2),
                'q3', ROUND((v_unit_q3_sum::numeric / v_unit_total_count), 2),
                'q4', ROUND((v_unit_q4_sum::numeric / v_unit_total_count), 2),
                'q5', ROUND((v_unit_q5_sum::numeric / v_unit_total_count), 2),
                'q6', ROUND((v_unit_q6_sum::numeric / v_unit_total_count), 2)
            ),
            'average_pulse', ROUND((((v_unit_q1_sum + v_unit_q2_sum + v_unit_q3_sum + v_unit_q4_sum + v_unit_q5_sum + v_unit_q6_sum)::numeric / v_unit_total_count) / 6.0), 2)
        );
    END IF;

    RETURN jsonb_build_object(
        'unit_id', p_unit_id,
        'squads', v_squad_results,
        'merged_pool', v_merged_pool,
        'unit_aggregate', v_unit_aggregate
    );
END;
$$;

-- 4. GET BU COMMENTS FOR SUMMARY (Strictly BU level, N >= 10, comments >= 5, shuffled, capped at 40)
CREATE OR REPLACE FUNCTION get_bu_comments_for_summary(
    p_unit_id UUID,
    p_cycle_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_resp INT;
    v_total_comments INT;
    v_comments JSONB;
BEGIN
    -- Check total respondents in the business unit
    SELECT COUNT(*), COUNT(r.comment)
    INTO v_total_resp, v_total_comments
    FROM responses r
    JOIN squads s ON s.id = r.squad_id
    WHERE s.business_unit_id = p_unit_id
      AND r.cycle_id = p_cycle_id;

    -- Gate check: respondents >= 10 AND comments >= 5
    IF v_total_resp < 10 OR v_total_comments < 5 THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'BELOW_THRESHOLD_REQUIRES_10_RESPONSES_AND_5_COMMENTS',
            'comments', '[]'::jsonb
        );
    END IF;

    -- Fetch comments randomly ordered (ORDER BY random() prevents insertion order correlation)
    SELECT jsonb_agg(c.comment)
    INTO v_comments
    FROM (
        SELECT r.comment
        FROM responses r
        JOIN squads s ON s.id = r.squad_id
        WHERE s.business_unit_id = p_unit_id
          AND r.cycle_id = p_cycle_id
          AND r.comment IS NOT NULL
          AND trim(r.comment) != ''
        ORDER BY random()
        LIMIT 40
    ) c;

    RETURN jsonb_build_object(
        'allowed', true,
        'comment_count', v_total_comments,
        'comments', COALESCE(v_comments, '[]'::jsonb)
    );
END;
$$;
