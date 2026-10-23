import React from 'react';

const REFERENCES_LIST = [
  {
    citation: 'Gallup. State of the Global Workplace.',
    url: 'https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx',
    tag: 'Verified in research',
  },
  {
    citation: 'Gallup. U.S. Employee Engagement Sinks to 10-Year Low (January 2025).',
    url: 'https://www.gallup.com/workplace/654911/employee-engagement-sinks-year-low.aspx',
    tag: 'Verified in research',
  },
  {
    citation: 'Gallup. State of the Global Workplace: India country-level data.',
    url: 'https://www.gallup.com/workplace/705650/state-global-workplace-india-country-level-data.aspx',
    tag: 'Verified in research',
  },
  {
    citation: 'Bakker, A. B., & Demerouti, E. (2007). The Job Demands-Resources model: State of the art. Journal of Managerial Psychology, 22(3), 309-328.',
    url: 'https://doi.org/10.1108/02683940710733115',
    tag: 'Verified in research',
  },
  {
    citation: 'Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits. Psychological Inquiry, 11(4), 227-268.',
    url: 'https://doi.org/10.1207/S15327965PLI1104_01',
    tag: 'Recalled, verify before relying on',
  },
  {
    citation: 'Rousseau, D. M. (1989). Psychological and implied contracts in organizations. Employee Responsibilities and Rights Journal, 2(2), 121-139.',
    url: null,
    tag: 'Recalled, verify before relying on',
  },
  {
    citation: 'Robinson, S. L., & Morrison, E. W. (1995). Psychological contracts and OCB: The effect of unfulfilled obligations on civic virtue behavior. Journal of Organizational Behavior, 16(3), 289-298.',
    url: null,
    tag: 'Recalled, verify before relying on',
  },
  {
    citation: 'Edmondson, A. (1999). Psychological safety and learning behavior in work teams. Administrative Science Quarterly, 44(2), 350-383.',
    url: 'https://doi.org/10.2307/2666999',
    tag: 'Recalled, verify before relying on',
  },
  {
    citation: 'Hackman, J. R., & Oldham, G. R. (1976). Motivation through the design of work: Test of a theory. Organizational Behavior and Human Performance, 16(2), 250-279.',
    url: 'https://doi.org/10.1016/0030-5073(76)90016-7',
    tag: 'Verified in research',
  },
  {
    citation: 'Kahn, W. A. (1990). Psychological conditions of personal engagement and disengagement at work. Academy of Management Journal, 33(4), 692-724.',
    url: 'https://doi.org/10.5465/256287',
    tag: 'Verified in research',
  },
  {
    citation: 'Maslach, C., & Leiter, M. P. (2016). Understanding the burnout experience. World Psychiatry, 15(2), 103-111.',
    url: 'https://doi.org/10.1002/wps.20311',
    tag: 'Recalled, verify before relying on',
  },
  {
    citation: 'Herzberg, F. (1968). One more time: How do you motivate employees? Harvard Business Review, 46(1), 53-62.',
    url: null,
    tag: 'Recalled, verify before relying on',
  },
  {
    citation: 'Digital Personal Data Protection Act, 2023 (official text). Ministry of Electronics and Information Technology (MeitY), Government of India.',
    url: 'https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf',
    tag: 'Verified in research',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink py-10 px-4 sm:px-6 max-w-editorial mx-auto space-y-12">
      {/* Header */}
      <header className="border-b border-ink/10 pb-6 space-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-slate">
          FOUNDATIONAL SPECIFICATION &bull; SECTION 21
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink leading-tight">
          About Pulse: Principles, Limits &amp; Research Foundations
        </h1>
        <p className="font-mono text-xs text-slate">
          An anonymous quarterly engagement and operational roadblock diagnostic for IT delivery teams.
        </p>
      </header>

      {/* 1. Why This Exists (Four Foundational Ideas) */}
      <section className="space-y-6">
        <div className="border-b border-ink/10 pb-2">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Why This Exists: Four Theoretical Ideas
          </h2>
          <p className="text-xs text-slate mt-1 font-mono">
            Grounding engineering engagement in validated organizational psychology.
          </p>
        </div>

        <div className="space-y-6 text-xs leading-relaxed divide-y divide-ink/10">
          {/* Idea 1 */}
          <div className="pt-4 space-y-2">
            <h3 className="font-serif text-lg font-semibold text-ink">
              1. Job Demands-Resources (JD-R) Theory
            </h3>
            <p className="text-ink/90">
              Sustained operational demands drain energy; with career resources removed, people reduce effort to protect themselves. When engineers experience continuous sprint scope-creep without compensatory tooling, autonomy, or recovery, disengagement functions as a psychological defense mechanism.
            </p>
            <div className="p-3 bg-paper border border-ink/10 rounded-sm">
              <span className="font-mono uppercase text-[10px] text-slate block mb-1">
                Everyday Engineering Example
              </span>
              <p className="font-serif italic text-ink/80">
                An engineer whose sprint commitments continually expand without added headcount or automated test environments ceases proactive defect investigation, limiting effort strictly to closing assigned tickets before the deadline.
              </p>
            </div>
          </div>

          {/* Idea 2 */}
          <div className="pt-4 space-y-2">
            <h3 className="font-serif text-lg font-semibold text-ink">
              2. Self-Determination Theory (SDT)
            </h3>
            <p className="text-ink/90">
              People need autonomy, competence, and relatedness; weak mobility turns motivation into compliance. In frozen lateral job markets where employees stay out of economic necessity, intrinsic motivation collapses into minimal compliance if opportunities to master new technical frameworks are withheld.
            </p>
            <div className="p-3 bg-paper border border-ink/10 rounded-sm">
              <span className="font-mono uppercase text-[10px] text-slate block mb-1">
                Everyday Engineering Example
              </span>
              <p className="font-serif italic text-ink/80">
                A developer restricted to maintaining legacy codebases with no opportunity to learn modern cloud frameworks complies with daily standups but discontinues discretionary code reviews or peer mentoring.
              </p>
            </div>
          </div>

          {/* Idea 3 */}
          <div className="pt-4 space-y-2">
            <h3 className="font-serif text-lg font-semibold text-ink">
              3. The Psychological Contract
            </h3>
            <p className="text-ink/90">
              Unwritten expectations about growth, pay, and flexibility; when broken, people withdraw extra effort. Beyond the formal employment contract lies an implicit agreement of mutual investment. Breaches of this unwritten contract lead to quiet disengagement.
            </p>
            <div className="p-3 bg-paper border border-ink/10 rounded-sm">
              <span className="font-mono uppercase text-[10px] text-slate block mb-1">
                Everyday Engineering Example
              </span>
              <p className="font-serif italic text-ink/80">
                When implied promises of project rotation after 18 months on a client engagement are repeatedly deferred, engineers stop contributing to internal knowledge-sharing or practice groups.
              </p>
            </div>
          </div>

          {/* Idea 4 */}
          <div className="pt-4 space-y-2">
            <h3 className="font-serif text-lg font-semibold text-ink">
              4. Psychological Safety
            </h3>
            <p className="text-ink/90">
              People raise problems only if it feels safe to do so. In delivery teams where defect post-mortems assign personal blame, engineers hide emerging architectural roadblocks until client delivery dates fail catastrophically.
            </p>
            <div className="p-3 bg-paper border border-ink/10 rounded-sm">
              <span className="font-mono uppercase text-[10px] text-slate block mb-1">
                Everyday Engineering Example
              </span>
              <p className="font-serif italic text-ink/80">
                If an engineer who reports a deployment vulnerability is publicly blamed during sprint retrospectives, peers stop reporting edge-case bugs and silently let deployment pipelines fail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Limits, Stated Plainly */}
      <section className="space-y-4">
        <div className="border-b border-ink/10 pb-2">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            System Limitations (Stated Plainly)
          </h2>
          <p className="text-xs text-slate mt-1 font-mono">
            Pulse is a diagnostic tool, not a panacea.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <li className="p-4 border border-ink/10 bg-paper/60 rounded-sm space-y-1">
            <strong className="text-terracotta block">&bull; Self-Report Bias</strong>
            <span className="text-ink/80">Responses reflect subjective sentiment at the moment of completion, not objective performance.</span>
          </li>
          <li className="p-4 border border-ink/10 bg-paper/60 rounded-sm space-y-1">
            <strong className="text-terracotta block">&bull; Survey Fatigue</strong>
            <span className="text-ink/80">Frequent surveying without visible operational follow-through rapidly breeds cynicism and reduced response rates.</span>
          </li>
          <li className="p-4 border border-ink/10 bg-paper/60 rounded-sm space-y-1">
            <strong className="text-terracotta block">&bull; Weak Job Market Hesitation</strong>
            <span className="text-ink/80">In frozen hiring markets and hierarchical workplaces, employees may fear speaking candidly despite anonymity guarantees.</span>
          </li>
          <li className="p-4 border border-ink/10 bg-paper/60 rounded-sm space-y-1">
            <strong className="text-terracotta block">&bull; Small Squad Deduction</strong>
            <span className="text-ink/80">Even with N &ge; 5, idiosyncratic writing styles or distinct sprint roles can allow managers to deduce authors.</span>
          </li>
          <li className="p-4 border border-ink/10 bg-paper/60 rounded-sm space-y-1">
            <strong className="text-terracotta block">&bull; Calibration Starting Points</strong>
            <span className="text-ink/80">All flag cut-offs (e.g. 3.0, 3.2, 0.40 drop) are operational starting points to calibrate, not validated cut-offs.</span>
          </li>
          <li className="p-4 border border-ink/10 bg-paper/60 rounded-sm space-y-1">
            <strong className="text-terracotta block">&bull; Correlation vs. Causation</strong>
            <span className="text-ink/80">Pulse scores reveal statistical associations, never proven root causes.</span>
          </li>
          <li className="p-4 border border-ink/10 bg-paper/60 rounded-sm space-y-1">
            <strong className="text-terracotta block">&bull; Innocent Explanations for Indicators</strong>
            <span className="text-ink/80">Late-night code updates or leave clusters frequently reflect time-zone handoffs, exams, or family care, not disengagement.</span>
          </li>
          <li className="p-4 border border-ink/10 bg-paper/60 rounded-sm space-y-1">
            <strong className="text-terracotta block">&bull; Not a Grievance Channel</strong>
            <span className="text-ink/80">Pulse is not monitored for urgent alerts and cannot substitute for POSH or Whistleblower grievance routes.</span>
          </li>
        </ul>
      </section>

      {/* 3. Indian Workplace Adaptations */}
      <section className="space-y-4">
        <div className="border-b border-ink/10 pb-2">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Indian Workplace Adaptations
          </h2>
          <p className="text-xs text-slate mt-1 font-mono">
            Practitioner judgements calibrated for high power distance and engineering delivery environments.
          </p>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-ink/90">
          <p>
            IT service delivery environments are characterized by high hierarchy, strong deference to authority, and urban commute stress. Pulse adapts to this reality through structural design choices:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Single-Use Cryptographic Tokens:</strong> Complete absence of login screens, employee IDs, or corporate email credentials to overcome hierarchical fear of surveillance.</li>
            <li><strong>Director Skip-Levels:</strong> Bypassing the immediate line manager to discuss systemic delivery blockers without fear of appraisal retribution.</li>
            <li><strong>Blocker-Focused Diagnostic Questions:</strong> Questions frame disengagement in terms of technical friction, tooling permissions, and environment bottlenecks rather than personal attitude.</li>
            <li><strong>Commute-Aware &amp; Evening Boundaries:</strong> Enforces an explicit 8:00 PM &ndash; 8:00 AM communication buffer and respects peak-hour commute realities during 1:1 scheduling.</li>
          </ul>
        </div>
      </section>

      {/* 4. Verified References */}
      <section className="space-y-4">
        <div className="border-b border-ink/10 pb-2">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Academic &amp; Statutory References
          </h2>
          <p className="text-xs text-slate mt-1 font-mono">
            Section 24 source policy: verified literature and statutory authorities.
          </p>
        </div>

        <ul className="divide-y divide-ink/10 text-xs">
          {REFERENCES_LIST.map((ref, idx) => (
            <li key={idx} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
              <div className="space-y-1">
                {ref.url ? (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink hover:text-terracotta underline underline-offset-4 leading-relaxed"
                  >
                    {ref.citation}
                  </a>
                ) : (
                  <span className="font-medium text-ink leading-relaxed">
                    {ref.citation} {/* <!-- VERIFY --> */}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-xs shrink-0 self-start sm:self-auto ${
                  ref.tag.includes('Verified')
                    ? 'bg-sage/20 text-ink border border-sage/50'
                    : 'bg-ink/5 text-slate border border-ink/15'
                }`}
              >
                {ref.tag}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
