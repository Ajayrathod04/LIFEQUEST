import type { PlayScenario } from "../types/mission";

export const executiveCrisisScenario: PlayScenario = {
  id: "executive-crisis-001",
  title: "The Midnight Breach",
  subtitle: "High-Stakes Crisis Management Simulation",
  description:
    "At 1:15 AM, your SOC monitoring system detects unauthorized data egress from an unpatched API endpoint. Your decisions will alter Trust, Time, Resources, and Reputation in real time.",
  initialStats: {
    trust: 75,
    time: 80,
    resources: 85,
    reputation: 80,
  },
  startNodeId: "node-1",
  nodes: {
    "node-1": {
      id: "node-1",
      stepNumber: 1,
      situationTitle: "Step 1: The Initial Egress Alert",
      situationDescription:
        "Your lead security engineer alerts you: 5,000 customer records are vulnerable. A major tech tech journal holds a draft story for their 8:00 AM morning edition. How do you direct your team right now?",
      contextBanner: "CRISIS STATUS: Uncontained API Egress • 6h 45m before media deadline",
      choices: [
        {
          id: "choice-1a",
          text: "Contain & Disclose: Sever API access immediately, audit logs, and issue a transparent incident notice.",
          consequenceText:
            "API access severed immediately. Egress stopped. 3 enterprise clients experience overnight downtime.",
          statImpact: { trust: 15, time: -25, resources: -15, reputation: 10 },
          nextBranchNodeId: "node-2a",
        },
        {
          id: "choice-1b",
          text: "Quiet Hotfix: Apply a silent patch without bringing servers down to avoid media attention.",
          consequenceText:
            "Patch deployed without downtime, but unnotified vulnerability remains logged on public security tracker.",
          statImpact: { trust: -25, time: 10, resources: 5, reputation: -20 },
          nextBranchNodeId: "node-2b",
        },
        {
          id: "choice-1c",
          text: "Delegate & Isolation: Mandate SecOps Lead handle all decisions without executive involvement.",
          consequenceText:
            "SecOps lead feels isolated under high stakes and requests executive backing before proceeding.",
          statImpact: { trust: -15, time: -15, resources: -10, reputation: -10 },
          nextBranchNodeId: "node-2c",
        },
      ],
    },
    "node-2a": {
      id: "node-2a",
      stepNumber: 2,
      situationTitle: "Step 2: Client & Board Reaction",
      situationDescription:
        "Severing the API contained the breach, but caused a 20-minute outage during overnight client syncs. The Board Chair calls at 2:30 AM demanding answers.",
      contextBanner: "STAKEHOLDER STATUS: Breach Contained • Board Chair Demanding Status Report",
      choices: [
        {
          id: "choice-2a1",
          text: "Transparent Briefing: Share full technical audit logs with the Board and issue SLA credits to affected clients.",
          consequenceText:
            "The Board commends your executive transparency. Clients accept SLA credits and reaffirm partnership.",
          statImpact: { trust: 25, time: -15, resources: -20, reputation: 20 },
          nextBranchNodeId: "node-3a",
        },
        {
          id: "choice-2a2",
          text: "Shift Blame: Blame the outage on an external analytics vendor integration error.",
          consequenceText:
            "Vendor refutes claims with public access logs, creating a second public relations crisis.",
          statImpact: { trust: -35, time: -10, resources: -10, reputation: -30 },
          nextBranchNodeId: "node-3b",
        },
      ],
    },
    "node-2b": {
      id: "node-2b",
      stepNumber: 2,
      situationTitle: "Step 2: Security Researcher Leak",
      situationDescription:
        "An independent security researcher notices your silent patch and posts proof of the leak to 40,000 followers on social media.",
      contextBanner: "MEDIA ESCALATION: Public Tweet Trending • 40k Security Professional Views",
      choices: [
        {
          id: "choice-2b1",
          text: "Pivot to Transparency: Issue an immediate public apology, acknowledge oversight, and post post-mortem.",
          consequenceText:
            "Public respects the rapid pivot to honest communication. Security community offers collaborative assistance.",
          statImpact: { trust: 15, time: -20, resources: -10, reputation: 10 },
          nextBranchNodeId: "node-3a",
        },
        {
          id: "choice-2b2",
          text: "Legal Threats: Threaten legal action against the researcher for unauthorized vulnerability probing.",
          consequenceText:
            "Threatening the researcher triggers massive online backlash and tech community boycott calls.",
          statImpact: { trust: -45, time: -20, resources: -30, reputation: -45 },
          nextBranchNodeId: "node-3c",
        },
      ],
    },
    "node-2c": {
      id: "node-2c",
      stepNumber: 2,
      situationTitle: "Step 2: Leadership Alignment Crisis",
      situationDescription:
        "Your SecOps Lead threatens to resign if executive leadership doesn't co-sign technical remediation plans publicly.",
      contextBanner: "INTERNAL CRISIS: SecOps Resignation Risk • Team Morale Critical",
      choices: [
        {
          id: "choice-2c1",
          text: "Joint Front: Stand shoulder-to-shoulder with engineering, co-hosting the emergency press briefing.",
          consequenceText:
            "Internal team trust soars. Unified leadership presentation calms enterprise client concerns.",
          statImpact: { trust: 30, time: -15, resources: -10, reputation: 15 },
          nextBranchNodeId: "node-3a",
        },
        {
          id: "choice-2c2",
          text: "Replace Lead: Reassign SecOps Lead and hire an external crisis PR consulting firm.",
          consequenceText:
            "Key engineering staff resign in protest. PR firm releases generic statements that fail to satisfy clients.",
          statImpact: { trust: -40, time: -20, resources: -35, reputation: -25 },
          nextBranchNodeId: "node-3b",
        },
      ],
    },
    "node-3a": {
      id: "node-3a",
      stepNumber: 3,
      situationTitle: "Step 3: Long-Term Security Investment Mandate",
      situationDescription:
        "Your decisive containment and transparent communication protected core business trust. Now, decide how to allocate remaining operational reserves.",
      contextBanner: "RECOVERY STAGE: Stakeholder Trust Rebuilt • Allocating Strategic Reserves",
      choices: [
        {
          id: "choice-3a1",
          text: "SOC 2 & Automated Telemetry: Invest $50k in continuous automated security compliance and external auditing.",
          consequenceText:
            "Automated continuous security telemetry established. Enterprise clients upgrade contract tier.",
          statImpact: { trust: 20, time: -10, resources: -20, reputation: 25 },
          nextBranchNodeId: "outcome-master-strategist",
        },
        {
          id: "choice-3a2",
          text: "Minimal Patch & Feature Push: Return immediately to feature sprint deliverables to meet sales targets.",
          consequenceText:
            "Features ship on schedule, but baseline security posture remains fragile.",
          statImpact: { trust: -10, time: 20, resources: 10, reputation: -5 },
          nextBranchNodeId: "outcome-pragmatic-leader",
        },
      ],
    },
    "node-3b": {
      id: "node-3b",
      stepNumber: 3,
      situationTitle: "Step 3: Vendor Log Retaliation",
      situationDescription:
        "The vendor publishes access logs proving your team misconfigured permissions. The Board demands immediate resolution.",
      contextBanner: "CRISIS PEAK: Blame Refuted • Board Demanding Accountability",
      choices: [
        {
          id: "choice-3b1",
          text: "Retract & Apologize: Issue a full public apology, retract vendor claims, and submit to independent audit.",
          consequenceText:
            "Apology accepted with strict probation conditions. Recovery will take several quarters.",
          statImpact: { trust: 10, time: -30, resources: -25, reputation: -15 },
          nextBranchNodeId: "outcome-crisis-containment",
        },
        {
          id: "choice-3b2",
          text: "Stonewall Press: Block journalists and refuse further public comment.",
          consequenceText:
            "Enterprise clients cancel contracts en masse. Major security publications publish damning exposé.",
          statImpact: { trust: -40, time: -30, resources: -40, reputation: -50 },
          nextBranchNodeId: "outcome-system-collapse",
        },
      ],
    },
    "node-3c": {
      id: "node-3c",
      stepNumber: 3,
      situationTitle: "Step 3: Backlash Mitigation",
      situationDescription:
        "Public backlash peaks. Tech influencers call for a platform boycott unless executive leadership rectifies legal threats.",
      contextBanner: "BOYCOTT RISK: Public Reputation -45% • Executive Decision Required",
      choices: [
        {
          id: "choice-3c1",
          text: "Withdraw Threats & Fund Security Grant: Drop legal actions and create a $25k open-source security research fund.",
          consequenceText:
            "Security community accepts the research fund initiative. Boycott calls subside slowly.",
          statImpact: { trust: 15, time: -20, resources: -30, reputation: 10 },
          nextBranchNodeId: "outcome-crisis-containment",
        },
        {
          id: "choice-3c2",
          text: "Persist In Injunctions: File emergency court injunctions against online discussion forums.",
          consequenceText:
            "Court rejects injunctions. Platform reputation drops to historical lows.",
          statImpact: { trust: -50, time: -30, resources: -50, reputation: -50 },
          nextBranchNodeId: "outcome-system-collapse",
        },
      ],
    },
  },
  outcomes: {
    "outcome-master-strategist": {
      id: "outcome-master-strategist",
      title: "Outcome: Master Strategist",
      summary:
        "Exemplary executive crisis leadership! Your transparent disclosure, proactive stakeholder alignment, and long-term security investments turned a critical breach into an enterprise trust multiplier.",
      finalGrade: "Master Strategist",
      recapPath: [
        "Contained & disclosed API vulnerability immediately",
        "Briefed Board with complete technical transparency",
        "Invested reserves into automated SOC 2 compliance",
      ],
    },
    "outcome-pragmatic-leader": {
      id: "outcome-pragmatic-leader",
      title: "Outcome: Pragmatic Leader",
      summary:
        "Balanced operational crisis containment. You successfully contained the initial breach and protected revenue targets, though long-term security posture requires further reinforcement.",
      finalGrade: "Pragmatic Leader",
      recapPath: [
        "Contained vulnerability with transparent client notice",
        "Maintained commercial delivery schedules",
        "Achieved pragmatic operational recovery",
      ],
    },
    "outcome-crisis-containment": {
      id: "outcome-crisis-containment",
      title: "Outcome: Damage Recovered",
      summary:
        "Crisis containment achieved after initial missteps. By pivoting to honest disclosure and open-source security commitments, you prevented total business collapse.",
      finalGrade: "Crisis Containment",
      recapPath: [
        "Initial reactive response caused stakeholder friction",
        "Pivoted to public disclosure and apology",
        "Stabilized core platform operations under probation",
      ],
    },
    "outcome-system-collapse": {
      id: "outcome-system-collapse",
      title: "Outcome: System Collapse",
      summary:
        "Suboptimal crisis management. Attempting to hide breaches, shift blame, and stonewall media destroyed stakeholder trust and led to mass client churn.",
      finalGrade: "System Collapse",
      recapPath: [
        "Attempted silent hotfix and denied vulnerability",
        "Blamed external partners and threatened researchers",
        "Stonewalled press resulting in enterprise contract cancellations",
      ],
    },
  },
};

export const quantumMeltdownScenario: PlayScenario = {
  id: "quantum-meltdown-002",
  title: "Quantum Grid Meltdown & Board Mutiny",
  subtitle: "PRO HIGH-STAKES SIMULATION",
  description:
    "A cascading firmware malfunction on Quantum AI Node 7 threatens global cloud data centers. Lead executive crisis response while preventing board member mutiny.",
  initialStats: {
    trust: 60,
    time: 50,
    resources: 90,
    reputation: 70,
  },
  startNodeId: "q-node-1",
  nodes: {
    "q-node-1": {
      id: "q-node-1",
      stepNumber: 1,
      situationTitle: "Step 1: Core Temperature Thermal Runaway",
      situationDescription:
        "Quantum Cluster Alpha reports thermal runaway (98°C). If not cooled within 15 minutes, $40M of hardware melts down. A rogue board member demands shutting down power globally without data backup.",
      contextBanner: "CRISIS STATUS: Thermal Runaway at 98°C • Board Division Escalating",
      choices: [
        {
          id: "q-choice-1a",
          text: "Automated Cryo-Dump: Initiate liquid nitrogen flooding. Saves core processing nodes but risks $2M fluid cost.",
          consequenceText:
            "Cryo-dump successful! Thermal runaway halted. Processing cores cooled safely.",
          statImpact: { trust: 25, time: 20, resources: -20, reputation: 15 },
          nextBranchNodeId: "q-node-2a",
        },
        {
          id: "q-choice-1b",
          text: "Rogue Board Power Cut: Cut all grid power immediately as requested by rogue board faction.",
          consequenceText:
            "Power cut corrupted 40,000 active database transactions across 12 countries.",
          statImpact: { trust: -40, time: -30, resources: -40, reputation: -35 },
          nextBranchNodeId: "outcome-system-collapse",
        },
      ],
    },
    "q-node-2a": {
      id: "q-node-2a",
      stepNumber: 2,
      situationTitle: "Step 2: Boardroom Vote of Confidence",
      situationDescription:
        "The Rogue Board Faction calls an emergency vote of no confidence against executive leadership, claiming liquid nitrogen costs were unbudgeted.",
      contextBanner: "BOARDROOM VOTING: Executive Confidence Motion Active",
      choices: [
        {
          id: "q-choice-2a1",
          text: "Present ROI Audit: Show that $2M nitrogen cost saved $40M hardware and preserved $150M contract ARR.",
          consequenceText:
            "The Board votes 8-1 to retain executive leadership and censures the rogue board faction.",
          statImpact: { trust: 30, time: 10, resources: 10, reputation: 25 },
          nextBranchNodeId: "outcome-master-strategist",
        },
        {
          id: "q-choice-2a2",
          text: "Resign Under Pressure: Step down during the vote to avoid public controversy.",
          consequenceText:
            "Executive vacancy causes company stock to drop 22% in aftermarket trading.",
          statImpact: { trust: -30, time: -20, resources: -20, reputation: -30 },
          nextBranchNodeId: "outcome-crisis-containment",
        },
      ],
    },
  },
  outcomes: {
    "outcome-master-strategist": {
      id: "outcome-master-strategist",
      title: "PRO Outcome: Master Quantum Strategist",
      summary:
        "Flawless executive crisis resolution! You saved $40M in physical quantum computing infrastructure while defeating boardroom mutiny with quantitative ROI transparency.",
      finalGrade: "Master Strategist",
      recapPath: [
        "Executed liquid nitrogen cryo-dump to stop thermal runaway",
        "Protected 40,000 global transactions from data corruption",
        "Defeated boardroom mutiny through data-backed financial audit",
      ],
    },
    "outcome-crisis-containment": {
      id: "outcome-crisis-containment",
      title: "PRO Outcome: Emergency Containment",
      summary:
        "Hardware saved, but executive leadership vacated amidst boardroom division.",
      finalGrade: "Crisis Containment",
      recapPath: [
        "Cooled quantum cluster safely",
        "Resigned during board vote of confidence",
      ],
    },
    "outcome-system-collapse": {
      id: "outcome-system-collapse",
      title: "PRO Outcome: Global Power Failure",
      summary:
        "Power cut corrupted multi-national databases and caused catastrophic enterprise client loss.",
      finalGrade: "System Collapse",
      recapPath: [
        "Forced hard power shutdown without transaction backup",
        "Triggered global data corruption and legal liability",
      ],
    },
  },
};

