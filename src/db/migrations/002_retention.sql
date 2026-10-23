-- ==============================================================================
-- PULSE RETENTION & HISTORICAL AGGREGATE SCHEMA
-- ==============================================================================

-- Table to store historical squad aggregates before raw responses are purged
CREATE TABLE IF NOT EXISTS squad_historical_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    response_count INT NOT NULL,
    q1_mean NUMERIC(3,2),
    q2_mean NUMERIC(3,2),
    q3_mean NUMERIC(3,2),
    q4_mean NUMERIC(3,2),
    q5_mean NUMERIC(3,2),
    q6_mean NUMERIC(3,2),
    average_pulse NUMERIC(3,2),
    archived_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(squad_id, cycle_id)
);

-- ==============================================================================
-- RETENTION EXECUTION FUNCTION (SECURITY DEFINER)
-- Deletes raw responses, comments, and invites for cycles closed >= retention days
-- ==============================================================================
CREATE OR REPLACE FUNCTION run_retention_purge(
    p_retention_days INT DEFAULT 90
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_cycle RECORD;
    v_deleted_responses INT := 0;
    v_deleted_invites INT := 0;
    v_archived_squads INT := 0;
    v_cutoff_date DATE;
BEGIN
    v_cutoff_date := CURRENT_DATE - (p_retention_days || ' days')::interval;

    -- Find all closed cycles whose end_date is older than the cutoff date
    FOR v_cycle IN
        SELECT id, name, end_date
        FROM cycles
        WHERE status = 'closed'
          AND end_date <= v_cutoff_date
    LOOP
        -- 1. Archive squad-level aggregates for any squad meeting N >= 5
        INSERT INTO squad_historical_aggregates (
            squad_id, cycle_id, response_count,
            q1_mean, q2_mean, q3_mean, q4_mean, q5_mean, q6_mean, average_pulse
        )
        SELECT 
            squad_id,
            cycle_id,
            COUNT(*),
            ROUND(AVG(q1)::numeric, 2),
            ROUND(AVG(q2)::numeric, 2),
            ROUND(AVG(q3)::numeric, 2),
            ROUND(AVG(q4)::numeric, 2),
            ROUND(AVG(q5)::numeric, 2),
            ROUND(AVG(q6)::numeric, 2),
            ROUND(((AVG(q1) + AVG(q2) + AVG(q3) + AVG(q4) + AVG(q5) + AVG(q6)) / 6.0)::numeric, 2)
        FROM responses
        WHERE cycle_id = v_cycle.id
        GROUP BY squad_id, cycle_id
        HAVING COUNT(*) >= 5
        ON CONFLICT (squad_id, cycle_id) DO NOTHING;

        GET DIAGNOSTICS v_archived_squads = ROW_COUNT;

        -- 2. Permanently delete raw responses and comments
        DELETE FROM responses WHERE cycle_id = v_cycle.id;
        GET DIAGNOSTICS v_deleted_responses = ROW_COUNT;

        -- 3. Permanently delete invites (token hashes and used_on dates)
        DELETE FROM invites WHERE cycle_id = v_cycle.id;
        GET DIAGNOSTICS v_deleted_invites = ROW_COUNT;

        -- 4. Record audit event
        INSERT INTO audit_log (actor_id, actor_role, target_group_id, cycle_id, action)
        VALUES (
            NULL,
            'system',
            NULL,
            v_cycle.id,
            'RETENTION_PURGE_EXECUTED: Deleted raw responses, comments, and invites'
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'cutoff_date', v_cutoff_date,
        'deleted_responses', v_deleted_responses,
        'deleted_invites', v_deleted_invites
    );
END;
$$;
