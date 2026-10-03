import type { Mission } from "../types/mission";

export const missions: Mission[] = [
  // 1. CAREER - Enterprise Escalation
  {
    id: "career-escalation-001",
    title: "High-Stakes Client Escalation",
    description:
      "Navigate an urgent enterprise client crisis balancing launch deadlines, quality assurance, and stakeholder communication.",
    domain: "career",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    skills: [
      "Decision Making",
      "Communication",
      "Problem Solving",
      "Situational Judgment",
    ],
    steps: [
      {
        id: "step-1",
        type: "scenario",
        title: "Mission Brief: Enterprise Launch Crisis",
        description:
          "You are the Senior Product Lead at LifeQuest Enterprise Solutions. It is Friday at 4:30 PM. Your team is preparing to launch a major platform update for an enterprise client whose $150k annual renewal depends on Monday's live debut.",
      },
      {
        id: "step-2",
        type: "scenario",
        title: "The Workplace Scenario",
        description:
          "Lead Engineer Priya alerts you: 'We found a memory leak in the core analytics module. Deploying now will crash dashboard views under load. We need 48 hours to patch and verify safely.' Minutes later, the Client VP emails: 'If analytics isn't live Monday at 9:00 AM, we are canceling our contract.'",
      },
      {
        id: "step-3",
        type: "choice",
        title: "Choose Your Strategic Response",
        description: "Select the action that best balances risk, quality, and stakeholder alignment:",
        options: [
          "Promise full deployment by Monday 9 AM and instruct engineering to bypass remaining safety tests.",
          "Schedule an urgent call with the Client VP, share data on technical risk, and propose a stable phased release (Core UI Monday, Analytics Wednesday).",
          "Avoid responding over the weekend and wait to discuss internally with executive leadership on Monday morning.",
          "Blame the engineering delay in an email reply to the client and ask the client for an extended deadline.",
        ],
        optionFeedbacks: {
          0: {
            feedback:
              "High-Risk Decision: Bypassing safety testing risks a major production crash on launch morning, damaging client trust severely.",
            isOptimal: false,
            score: 35,
            skillEvidence: [
              {
                skill: "Communication",
                level: "Developing",
                description:
                  "Promised unverified delivery dates under high client pressure without risk disclosure.",
              },
              {
                skill: "Decision Making",
                level: "Needs Improvement",
                description:
                  "Overrode essential quality assurance protocols to achieve temporary deadline compliance.",
              },
            ],
          },
          1: {
            feedback:
              "Optimal Executive Decision! Transparent communication builds client confidence while the phased rollout preserves system stability and launch value.",
            isOptimal: true,
            score: 95,
            skillEvidence: [
              {
                skill: "Communication",
                level: "Proficient",
                description:
                  "Proactively engaged executive client leadership with data-driven transparency and clear options.",
              },
              {
                skill: "Decision Making",
                level: "Proficient",
                description:
                  "Balanced high-value client retention against critical software quality and operational risk.",
              },
              {
                skill: "Problem Solving",
                level: "Proficient",
                description:
                  "Designed an actionable two-stage release contingency protecting core launch functionality.",
              },
              {
                skill: "Situational Judgment",
                level: "Proficient",
                description:
                  "Maintained composure under high stakes while upholding cross-functional engineering integrity.",
              },
            ],
          },
          2: {
            feedback:
              "Suboptimal Response: Silence during an active escalation heightens client anxiety and projects poor accountability.",
            isOptimal: false,
            score: 40,
            skillEvidence: [
              {
                skill: "Communication",
                level: "Needs Improvement",
                description: "Delayed essential stakeholder response during a time-sensitive deadline crisis.",
              },
            ],
          },
          3: {
            feedback:
              "Suboptimal Response: Blaming colleagues externally damages team cohesion and signals unprofessional team leadership.",
            isOptimal: false,
            score: 25,
            skillEvidence: [
              {
                skill: "Communication",
                level: "Needs Improvement",
                description: "Transferred blame to internal team members in external client correspondence.",
              },
            ],
          },
        },
      },
      {
        id: "step-4",
        type: "feedback",
        title: "Impact & Executive Feedback",
        description: "Your strategic choice was evaluated against industry leadership benchmark standards.",
      },
      {
        id: "step-5",
        type: "result",
        title: "Mission Completed",
        description: "You have completed the High-Stakes Client Escalation career mission.",
      },
      {
        id: "step-6",
        type: "evidence",
        title: "Preliminary Skill Evidence",
        description: "Competency assessment generated based on your workplace decision performance:",
      },
    ],
  },

  // 2. SOLVE / SCAM INVESTIGATOR - Fake Lottery Scam Mission
  {
    id: "solve-scam-lottery-001",
    title: "Scam Investigator: The ₹50,000 Prize Claim",
    description:
      "Analyze a high-urgency message offering ₹50,000 requiring a ₹999 processing fee. Identify phishing triggers, fake authority, and suspicious URLs.",
    domain: "solve",
    difficulty: "beginner",
    estimatedMinutes: 3,
    skills: ["Scam Investigation", "Risk Analysis", "Digital Literacy", "Decision Making"],
    steps: [
      {
        id: "scam-step-1",
        type: "scenario",
        title: "Urgent SMS Alert Received",
        description:
          "SMS from 'KBC-WINNER': 'CONGRATULATIONS! Your mobile number won ₹50,000 in National Lucky Draw! Claim within 2 hours or prize expires. Deposit ₹999 processing fee to UPI id fast-claim@fakebank to release funds. Click http://bit.ly/claim50k-now'",
      },
      {
        id: "scam-step-2",
        type: "scenario",
        title: "Analyze Scam Indicators",
        description:
          "Evaluate the message structure: 1) Artificial time urgency, 2) Advance fee demand for non-existent winnings, 3) Generic shortener URL, 4) Unverified sender handle.",
      },
      {
        id: "scam-step-3",
        type: "choice",
        title: "What is your investigative action?",
        description: "Select the response that protects financial security and reports the scam:",
        options: [
          "Pay the ₹999 fee immediately before the 2-hour window expires.",
          "Click the shortener link to verify if your name is listed on the winner page.",
          "Identify as advance-fee phishing fraud, block sender, and report to official cyber crime portal (cybercrime.gov.in).",
          "Reply asking for proof of lottery license and bank manager identity.",
        ],
        optionFeedbacks: {
          0: {
            feedback:
              "CRITICAL RISK: Legitimate lotteries never require advance fee payments or UPI transfers to claim prizes. Paying results in total financial loss.",
            isOptimal: false,
            score: 10,
            skillEvidence: [
              {
                skill: "Risk Analysis",
                level: "Needs Improvement",
                description: "Fell for artificial urgency and paid advance fee to unverified scammer.",
              },
            ],
          },
          1: {
            feedback:
              "HIGH RISK: Clicking unknown shortened URLs exposes your browser to credential harvesting and malware.",
            isOptimal: false,
            score: 30,
            skillEvidence: [
              {
                skill: "Digital Literacy",
                level: "Developing",
                description: "Interacted with unverified phishing links.",
              },
            ],
          },
          2: {
            feedback:
              "EXPERT INVESTIGATIVE DECISION! You correctly recognized advance-fee fraud, artificial urgency, and phishing link risks without exposing funds.",
            isOptimal: true,
            score: 98,
            skillEvidence: [
              {
                skill: "Scam Investigation",
                level: "Proficient",
                description: "Accurately identified 4 distinct indicators of advance-fee phishing fraud.",
              },
              {
                skill: "Risk Analysis",
                level: "Proficient",
                description: "Refused financial transfer under high artificial time pressure.",
              },
              {
                skill: "Digital Literacy",
                level: "Proficient",
                description: "Utilized official cybercrime reporting channels for fraud containment.",
              },
            ],
          },
          3: {
            feedback:
              "SUBOPTIMAL: Engaging with scammers confirms your phone number is active and invites further targeted attacks.",
            isOptimal: false,
            score: 45,
            skillEvidence: [
              {
                skill: "Decision Making",
                level: "Developing",
                description: "Engaged in dialogue with active phishing threat actor.",
              },
            ],
          },
        },
      },
      {
        id: "scam-step-4",
        type: "feedback",
        title: "Scam Reasoning Breakdown",
        description:
          "WHY THIS WAS RISKY: Real prizes never require non-refundable fees. Urgency is designed to bypass logical reasoning.",
      },
      {
        id: "scam-step-5",
        type: "result",
        title: "Scam Investigator Mission Complete",
        description: "You successfully defended against advance-fee phishing fraud.",
      },
    ],
  },

  // 3. SOLVE / CONSUMER CLAIMKIT - Warranty & Document Dispute
  {
    id: "solve-claimkit-warranty-001",
    title: "ClaimKit: Appliance Warranty Dispute",
    description:
      "Gather evidence, organize invoices and service records, and file a formal consumer claim for a defective electronic product.",
    domain: "solve",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    skills: ["Evidence Organization", "Consumer Advocacy", "Documentation", "Problem Solving"],
    steps: [
      {
        id: "claim-step-1",
        type: "scenario",
        title: "Defective Product & Seller Refusal",
        description:
          "Your $600 laptop motherboard failed 4 months after purchase. The manufacturer warranty covers hardware failures for 12 months, but the retailer refuses repair, claiming 'user physical damage' without opening the unit.",
      },
      {
        id: "claim-step-2",
        type: "scenario",
        title: "Evidence Preservation",
        description:
          "You inspect the laptop chassis: zero scratches, intact serial numbers, original invoice present, and official service technician diagnostics confirming factory power rail defect.",
      },
      {
        id: "claim-step-3",
        type: "choice",
        title: "Formulate Your Claim Strategy",
        description: "Select the structured claim action that secures warranty fulfillment or legal resolution:",
        options: [
          "Accept the refusal and pay $350 out-of-pocket for third-party repair.",
          "Compile purchase invoice, technician hardware log, high-res photos, and issue a written formal claim letter giving 7 days for resolution under Consumer Protection Act.",
          "Post negative reviews on social media while discarding repair records.",
          "Attempt to open the laptop case yourself to prove hardware innocence.",
        ],
        optionFeedbacks: {
          1: {
            feedback:
              "Optimal Consumer Advocacy! Organizing documented evidence and citing formal statutory consumer rights forces retailer accountability or provides foolproof evidence for Consumer Forum filing.",
            isOptimal: true,
            score: 95,
            skillEvidence: [
              {
                skill: "Evidence Organization",
                level: "Proficient",
                description: "Assembled invoice, diagnostic reports, and photo logs into a legal-grade claim file.",
              },
              {
                skill: "Consumer Advocacy",
                level: "Proficient",
                description: "Leveraged statutory warranty protections to enforce seller compliance.",
              },
            ],
          },
        },
      },
      {
        id: "claim-step-4",
        type: "result",
        title: "ClaimKit Evidence Logged",
        description: "Warranty claim bundle organized and ready for submission.",
      },
    ],
  },

  // 4. SOLVE / LEGAL AWARENESS - Tenant Rights & Deposit Dispute
  {
    id: "solve-legal-tenant-001",
    title: "Legal Awareness: Security Deposit Retention",
    description:
      "Evaluate a tenancy security deposit dispute under local rental law guidelines. Note: This scenario provides educational awareness, not legal advice.",
    domain: "solve",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    skills: ["Legal Awareness", "Evidence Preservation", "Dispute Resolution"],
    steps: [
      {
        id: "legal-step-1",
        type: "scenario",
        title: "Situation: Unauthorized Deposit Deduction",
        description:
          "Disclaimer: LIFEQUEST provides educational decision simulations, not formal legal advice. Upon vacating your apartment, the landlord retains your full $1,500 security deposit citing 'painting and wear', despite move-in move-out inspection logs showing normal wear and tear.",
      },
      {
        id: "legal-step-2",
        type: "scenario",
        title: "Identify Jurisdiction & Relevant Legal Topic",
        description:
          "This situation relates to statutory rental deposit regulations (Model Tenancy / Local Rent Control Acts). Landlords must provide itemized receipts for deductions beyond normal wear and tear within statutory timelines.",
      },
      {
        id: "legal-step-3",
        type: "choice",
        title: "Select Preservative Action",
        description: "Choose the action that aligns with tenant rights and evidence preservation:",
        options: [
          "Threaten immediate litigation without gathering move-in condition reports.",
          "Send a formal written notice citing tenancy agreement terms, attached dated move-out photos, inspection sign-off, and requesting itemized receipts within 14 days.",
          "Abandon the deposit funds to avoid communication.",
        ],
        optionFeedbacks: {
          1: {
            feedback:
              "Optimal Educational Resolution! Written demand backed by move-in/out photo logs and statutory references establishes a clear evidentiary trail for tenant mediation or legal aid referral.",
            isOptimal: true,
            score: 92,
            skillEvidence: [
              {
                skill: "Legal Awareness",
                level: "Proficient",
                description: "Applied statutory deposit disclosure requirements to dispute unjustified deductions.",
              },
              {
                skill: "Evidence Preservation",
                level: "Proficient",
                description: "Utilized move-in inspection logs and dated photography as documentary proof.",
              },
            ],
          },
        },
      },
      {
        id: "legal-step-4",
        type: "result",
        title: "Legal Awareness Pack Completed",
        description: "Educational evidence trail preserved with legal-aid referral resources linked.",
      },
    ],
  },

  // 5. FIELD / FIELDGUIDE - Electrical Safety & HVAC Field Inspection
  {
    id: "field-hvac-inspection-001",
    title: "FieldGuide: Industrial HVAC Diagnostic",
    description:
      "Execute on-site diagnostic procedure for an overheating commercial HVAC compressor. Use visual inspection, QR verification, and safety checklist reporting.",
    domain: "field",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    skills: ["Field Operations", "Safety Protocol", "Technical Diagnostics", "Service Reporting"],
    steps: [
      {
        id: "field-step-1",
        type: "scenario",
        title: "On-Site Dispatch: Commercial Cooling Failure",
        description:
          "You arrive at Data Center Hub B. Alarm code E-402 indicates high pressure and thermal overload on Compressor Line 3. Ambient temperature is rising rapidly.",
      },
      {
        id: "field-step-2",
        type: "scenario",
        title: "Field Procedure & Lockout/Tagout (LOTO)",
        description:
          "Before inspecting internal electrical terminals: 1) Scan unit QR code for schematics, 2) Perform Lockout/Tagout on Breaker B-14, 3) Verify zero voltage with calibrated multimeter.",
      },
      {
        id: "field-step-3",
        type: "choice",
        title: "Select Field Action",
        description: "Select the safe diagnostic step:",
        options: [
          "Open high-voltage junction box immediately without Lockout/Tagout because time is critical.",
          "Execute complete LOTO protocol, scan unit QR code for service history, verify zero voltage, and inspect fan capacitor for physical bulge.",
          "Bypass high-pressure switch manually to force compressor restart.",
        ],
        optionFeedbacks: {
          1: {
            feedback:
              "Optimal Technical Execution! Adhering to safety LOTO protocols prevents arc flash hazard while QR schematic access isolates bad capacitor within 3 minutes.",
            isOptimal: true,
            score: 96,
            skillEvidence: [
              {
                skill: "Safety Protocol",
                level: "Proficient",
                description: "Executed flawless Lockout/Tagout and voltage verification prior to physical inspection.",
              },
              {
                skill: "Technical Diagnostics",
                level: "Proficient",
                description: "Isolated blown startup capacitor using QR service schematics and visual inspection.",
              },
            ],
          },
        },
      },
      {
        id: "field-step-4",
        type: "result",
        title: "Field Service Report Generated",
        description: "Diagnostic log, photo evidence, and replacement sign-off recorded in FieldGuide.",
      },
    ],
  },

  // 6. WOMEN'S SAFETY - Situational Awareness & Resource Guidance
  {
    id: "safety-night-commute-001",
    title: "Safety Mission Pack: Night Transit Commute",
    description:
      "Evaluate safest transit options during late night commuting. Disclaimer: Guidance pack for situational awareness, not a guaranteed safety system.",
    domain: "solve",
    difficulty: "beginner",
    estimatedMinutes: 3,
    skills: ["Situational Awareness", "Risk Assessment", "Resource Utilization"],
    steps: [
      {
        id: "ws-step-1",
        type: "scenario",
        title: "Situation: Late Night Transport Decision",
        description:
          "Disclaimer: LIFEQUEST provides scenario-based awareness guidance; no action guarantees absolute safety. You finish a late shift at 11:15 PM. Public bus services are running with 45-minute delays, and the station area has poor lighting.",
      },
      {
        id: "ws-step-2",
        type: "scenario",
        title: "Safest Available Options",
        description:
          "Compare options: A) Waiting alone in unlit bus stop, B) Booking verified ride-share with live trip sharing active to trusted contacts, C) Accepting ride from unverified stranger offering help.",
      },
      {
        id: "ws-step-3",
        type: "choice",
        title: "Select Action Strategy",
        description: "Choose the action that maximizes security and trusted resource connectivity:",
        options: [
          "Accept ride from unverified bystander.",
          "Book verified ride-share from well-lit station interior, share live trip tracking with trusted contact, and keep official emergency hotline (112 / Women Helpline) pinned.",
          "Walk alone along unlit shortcut through isolated alley.",
        ],
        optionFeedbacks: {
          1: {
            feedback:
              "Optimal Safety Decision! Using verified transport in illuminated zones with active location sharing and emergency hotlines ready provides strong situational risk mitigation.",
            isOptimal: true,
            score: 95,
            skillEvidence: [
              {
                skill: "Situational Awareness",
                level: "Proficient",
                description: "Prioritized well-lit waiting zones and active trip monitoring.",
              },
              {
                skill: "Risk Assessment",
                level: "Proficient",
                description: "Eliminated unverified transport and unlit isolated routes.",
              },
            ],
          },
        },
      },
      {
        id: "ws-step-4",
        type: "result",
        title: "Safety Awareness Pack Completed",
        description: "Emergency helpline contacts and situational protocol saved to your personal reference kit.",
      },
    ],
  },

  // 7. TRAVEL - Smart Booking & Flight Overbooking Dispute
  {
    id: "travel-flight-overbooking-001",
    title: "Travel Mission: Flight Overbooking Rights",
    description:
      "Navigate an unexpected airline denied boarding situation. Learn passenger compensation rules, hotel voucher claims, and rebooking rights.",
    domain: "solve",
    difficulty: "beginner",
    estimatedMinutes: 4,
    skills: ["Travel Negotiation", "Passenger Rights", "Problem Solving"],
    steps: [
      {
        id: "travel-step-1",
        type: "scenario",
        title: "Involuntary Denied Boarding",
        description:
          "At the gate for your connecting international flight, gate agents announce the flight is overbooked and involuntarily bump you to a flight 14 hours later.",
      },
      {
        id: "travel-step-2",
        type: "choice",
        title: "Assert Passenger Protections",
        description: "Select the response that secures mandatory statutory compensation and accommodation:",
        options: [
          "Accept a minor food voucher and sleep on the airport floor without asking for written confirmation.",
          "Request written confirmation of involuntary denied boarding, claim statutory cash compensation (up to 400% of one-way fare), and obtain hotel & meal vouchers.",
          "Shout at gate agents and leave the airport terminal.",
        ],
        optionFeedbacks: {
          1: {
            feedback:
              "Optimal Passenger Advocacy! Involuntary denied boarding mandates written compensation notices and airline-provided lodging under aviation regulations.",
            isOptimal: true,
            score: 94,
            skillEvidence: [
              {
                skill: "Passenger Rights",
                level: "Proficient",
                description: "Enforced statutory cash compensation and hotel accommodation rights.",
              },
            ],
          },
        },
      },
      {
        id: "travel-step-3",
        type: "result",
        title: "Travel Mission Completed",
        description: "Travel rights claim organized with airline voucher receipts.",
      },
    ],
  },

  // 8. IMPACT - Community Solar & Energy Optimization
  {
    id: "community-energy-audit-001",
    title: "Community Solar & Energy Optimization",
    description:
      "Execute a real-world energy audit and solar optimization strategy for community hubs to deliver verified cost and carbon reduction.",
    domain: "impact",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    skills: [
      "Sustainability Leadership",
      "Resource Optimization",
      "Community Stakeholder Management",
      "Data-Driven Problem Solving",
    ],
    steps: [
      {
        id: "impact-step-1",
        type: "scenario",
        title: "Real-World Problem: Energy Waste in Local Hub",
        description:
          "The Midtown Community Center faces rising utility costs. Over 40% of their annual budget is wasted on legacy HVAC and lighting inefficiencies, directly reducing funds for youth education and elderly care.",
      },
      {
        id: "impact-step-2",
        type: "scenario",
        title: "Field Audit & Local Context",
        description:
          "You conduct an on-site audit with the Facility Director. You identify uninsulated roofing, legacy lighting operating 16 hours/day, and high-exposure rooftop solar potential.",
      },
      {
        id: "impact-step-3",
        type: "choice",
        title: "Select Real-World Impact Action",
        description: "Select the execution strategy that maximizes measurable cost reduction and carbon offset:",
        options: [
          "Replace bulbs passively whenever old ones fail over the next two years.",
          "Mobilize local green tech volunteers for an immediate LED conversion, automated thermal controls, and a municipal solar grant application.",
          "Advise the community center to close two days a week to forcibly reduce energy usage.",
        ],
        optionFeedbacks: {
          1: {
            feedback:
              "High-Impact Optimal Action! LED retrofitting, automated smart thermostats, and grant-funded solar deliver 450 kWh monthly savings and $4,200 annual budget recovery.",
            isOptimal: true,
            score: 95,
            skillEvidence: [
              {
                skill: "Sustainability Leadership",
                level: "Proficient",
                description: "Mobilized volunteer networks and municipal solar grant programs for local infrastructure.",
              },
              {
                skill: "Resource Optimization",
                level: "Proficient",
                description: "Reduced facility power overhead by 38%, unlocking $4,200 annually for youth and senior care.",
              },
            ],
          },
        },
      },
      {
        id: "impact-step-4",
        type: "feedback",
        title: "Action & Impact Analysis",
        description: "Your field strategy was evaluated for verified environmental and community outcomes.",
      },
      {
        id: "impact-step-5",
        type: "result",
        title: "Impact Mission Completed",
        description: "You completed the Community Solar & Energy Optimization impact mission.",
      },
      {
        id: "impact-step-6",
        type: "evidence",
        title: "Impact Evidence Record Generated",
        description: "Measurable impact metrics and competency proof added to your portable Impact Passport.",
      },
    ],
  },

  // 9. PRO CAREER - Global Tech Merger Crisis
  {
    id: "career-advanced-002",
    title: "Global Tech Merger & Regulatory Crisis",
    description:
      "PRO CAREER SCENARIO: Lead a high-stakes cross-border compliance strategy amidst antitrust scrutiny and executive board division.",
    domain: "career",
    difficulty: "advanced",
    estimatedMinutes: 8,
    isProRequired: true,
    skills: [
      "Executive Decision Making",
      "Strategic Risk Management",
      "Regulatory Compliance",
      "Boardroom Communication",
    ],
    steps: [
      {
        id: "adv-step-1",
        type: "scenario",
        title: "Mission Brief: $4.2B Cross-Border Merger Scrutiny",
        description:
          "As Chief Strategy Officer at NexaCorp, you are hours away from finalizing a $4.2B acquisition of AI Infrastructure Partner DataCore. EU regulatory authorities unexpectedly issue a Statement of Objections alleging anti-competitive market concentration.",
      },
      {
        id: "adv-step-2",
        type: "scenario",
        title: "The Executive Board Dilemma",
        description:
          "The Board Chairman demands you proceed with a hostile legal challenge in court. Your Chief Legal Officer warns: 'Litigation has a 70% failure rate and will freeze capital for 24 months. Offering divestment concessions will satisfy regulators within 60 days but sacrifices 12% projected synergy.'",
      },
      {
        id: "adv-step-3",
        type: "choice",
        title: "Select Your Executive Counter-Strategy",
        description: "Choose the strategic posture that preserves enterprise valuation and regulatory clearance:",
        options: [
          "File an aggressive court challenge against regulators and demand the board proceed without concessions.",
          "Propose targeted divestment of DataCore's non-core European assets while negotiating structural ring-fencing with regulators.",
          "Withdraw the acquisition offer completely and pay a $250M termination fee to avoid legal scrutiny.",
        ],
        optionFeedbacks: {
          1: {
            feedback:
              "Optimal PRO Executive Strategy! Targeted asset divestment satisfied antitrust regulators within 45 days, securing 88% core synergy while maintaining transaction velocity.",
            isOptimal: true,
            score: 98,
            skillEvidence: [
              {
                skill: "Executive Decision Making",
                level: "Proficient",
                description: "Balanced long-term enterprise valuation against regulatory compliance realities.",
              },
              {
                skill: "Strategic Risk Management",
                level: "Proficient",
                description: "Designed targeted asset ring-fencing that mitigated 90% of antitrust objections.",
              },
            ],
          },
        },
      },
      {
        id: "adv-step-4",
        type: "feedback",
        title: "Executive Board Evaluation",
        description: "Your strategic negotiation posture was evaluated against Fortune 500 merger benchmarks.",
      },
      {
        id: "adv-step-5",
        type: "result",
        title: "PRO Mission Completed",
        description: "You completed the Global Tech Merger & Regulatory Crisis executive mission.",
      },
      {
        id: "adv-step-6",
        type: "evidence",
        title: "PRO Skill Evidence Generated",
        description: "Executive-grade competency evidence recorded in your verified Skill Passport.",
      },
    ],
  },
];
