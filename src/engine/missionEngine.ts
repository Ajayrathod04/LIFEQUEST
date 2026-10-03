import type {
  ImpactEvidenceRecord,
  Mission,
  MissionResultSummary,
  SessionImpactPassport,
  SessionSkillPassport,
  SkillEvidenceItem,
  SkillEvidenceRecord,
  SkillSummaryEntry,
} from "../types/mission";

// In-memory session store for current app session
let sessionPassportState: SessionSkillPassport = {
  totalMissionsCompleted: 0,
  completedMissionIds: [],
  latestResults: {},
  accumulatedEvidence: [],
  skillSummaries: {},
};

let sessionImpactPassportState: SessionImpactPassport = {
  totalImpactMissionsCompleted: 0,
  totalImpactPoints: 450,
  accumulatedImpactRecords: [],
  aggregatedMetrics: {},
};

export function getMissionProgress(
  mission: Mission,
  currentStep: number,
): number {
  if (!mission || mission.steps.length === 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(((currentStep + 1) / mission.steps.length) * 100),
  );
}

export function evaluateMissionChoice(
  mission: Mission,
  selectedOptionIndex: number,
): MissionResultSummary {
  const choiceStep = mission.steps.find((s) => s.type === "choice");
  const optionFeedback = choiceStep?.optionFeedbacks?.[selectedOptionIndex];
  const selectedText = choiceStep?.options?.[selectedOptionIndex] ?? "";

  const score = optionFeedback?.score ?? 70;
  const isOptimal = optionFeedback?.isOptimal ?? false;

  const grade: "Exemplary" | "Proficient" | "Needs Revision" = isOptimal
    ? "Exemplary"
    : score >= 50
    ? "Proficient"
    : "Needs Revision";

  const summary = isOptimal
    ? mission.domain === "impact"
      ? "High-impact environmental leadership! Your strategic intervention achieved 450 kWh monthly power reduction and secured $4,200 annual budget recovery for local youth & senior programs."
      : "Outstanding leadership under high pressure. You protected release stability while proactively managing stakeholder expectations with transparent data."
    : score >= 50
    ? "Acceptable resolution under pressure, though alternative approaches offer stronger protection of stakeholder trust and sustainable outcomes."
    : "Suboptimal resolution. The chosen action compromised long-term quality standards, operational efficiency, or stakeholder trust.";

  const skillsDemonstrated = mission.skills && mission.skills.length > 0
    ? mission.skills
    : [
        "Decision Making",
        "Communication",
        "Problem Solving",
        "Situational Judgment",
      ];

  const evidenceExplanation = isOptimal
    ? mission.domain === "impact"
      ? "Demonstrated verified sustainability leadership by executing field energy retrofits, automating thermal controls, and securing municipal grants."
      : "Demonstrated high workplace situational judgment by conducting transparent, data-driven client negotiations while upholding release quality standards."
    : "Demonstrated baseline situational response, highlighting key opportunities to strengthen stakeholder alignment and risk mitigation.";

  const defaultEvidences: SkillEvidenceItem[] = optionFeedback?.skillEvidence ?? [
    {
      skill: "Communication",
      level: isOptimal ? "Proficient" : "Developing",
      description: isOptimal
        ? "Proactively aligned with key stakeholders using clear risk metrics and milestone timelines."
        : "Communicated under pressure without offering structured risk containment details.",
    },
    {
      skill: "Decision Making",
      level: isOptimal ? "Proficient" : "Developing",
      description: isOptimal
        ? "Weighed production release risks against client retention priorities before acting."
        : "Prioritized immediate short-term resolution over long-term system stability.",
    },
    {
      skill: "Problem Solving",
      level: isOptimal ? "Proficient" : "Developing",
      description: isOptimal
        ? "Structured a multi-phase delivery path to safeguard quality while meeting launch needs."
        : "Selected a single-step workaround without addressing root operational constraints.",
    },
    {
      skill: "Situational Judgment",
      level: isOptimal ? "Proficient" : "Needs Improvement",
      description: isOptimal
        ? "Maintained executive composure under urgency and preserved engineering team integrity."
        : "Responded reactively to high urgency, impacting cross-functional trust.",
    },
  ];

  return {
    missionId: mission.id,
    overallScore: score,
    grade,
    summary,
    selectedOptionText: selectedText,
    skillsDemonstrated,
    evidenceExplanation,
    skillEvidences: defaultEvidences,
    completedAt: Date.now(),
  };
}

export function saveMissionResultToSession(
  result: MissionResultSummary,
  missionTitle: string,
): SessionSkillPassport {
  const timestamp = result.completedAt ?? Date.now();

  // Create individual skill evidence records
  const newEvidenceRecords: SkillEvidenceRecord[] = result.skillEvidences.map(
    (item, index) => ({
      ...item,
      id: `${result.missionId}-${index}-${timestamp}`,
      missionId: result.missionId,
      missionTitle,
      score: result.overallScore,
      timestamp,
    }),
  );

  const updatedCompletedIds = sessionPassportState.completedMissionIds.includes(
    result.missionId,
  )
    ? sessionPassportState.completedMissionIds
    : [...sessionPassportState.completedMissionIds, result.missionId];

  const updatedAccumulated = [
    ...sessionPassportState.accumulatedEvidence,
    ...newEvidenceRecords,
  ];

  // Re-calculate skill summaries for each skill
  const skillSummaries: Record<string, SkillSummaryEntry> = {
    ...sessionPassportState.skillSummaries,
  };

  newEvidenceRecords.forEach((record) => {
    const existing = skillSummaries[record.skill] ?? {
      skill: record.skill,
      totalEvaluations: 0,
      proficientCount: 0,
      averageScore: 0,
      latestLevel: record.level,
    };

    const newTotal = existing.totalEvaluations + 1;
    const newProficient =
      existing.proficientCount + (record.level === "Proficient" ? 1 : 0);
    const newAvg = Math.round(
      (existing.averageScore * existing.totalEvaluations + record.score) /
        newTotal,
    );

    skillSummaries[record.skill] = {
      skill: record.skill,
      totalEvaluations: newTotal,
      proficientCount: newProficient,
      averageScore: newAvg,
      latestLevel: record.level,
    };
  });

  sessionPassportState = {
    totalMissionsCompleted: updatedCompletedIds.length,
    completedMissionIds: updatedCompletedIds,
    latestResults: {
      ...sessionPassportState.latestResults,
      [result.missionId]: result,
    },
    accumulatedEvidence: updatedAccumulated,
    skillSummaries,
  };

  // If this is an impact mission, automatically append an ImpactEvidenceRecord
  if (result.missionId.includes("energy") || result.missionId.includes("impact")) {
    const isOptimal = result.overallScore >= 80;
    const impactRecord: ImpactEvidenceRecord = {
      id: `impact-${result.missionId}-${timestamp}`,
      missionId: result.missionId,
      missionTitle,
      problemStatement: "40% operational utility waste at Midtown Community Hub.",
      actionTaken: result.selectedOptionText,
      measurement: "Smart-meter power baseline logging & facility thermal imaging audit",
      outcome: result.summary,
      evidenceStatus: "Simulated Model",
      measurableImpact: [
        {
          label: "Energy Reduction",
          value: isOptimal ? "450" : "80",
          unit: "kWh / month",
          category: "Sustainability",
          status: "Simulated Model",
          measurementContext: "Calculated from retrofitted LED wattage and thermal control schedule model",
        },
        {
          label: "Budget Savings",
          value: isOptimal ? "$4,200" : "$600",
          unit: "Annual",
          category: "Economic",
          status: "Projected",
          measurementContext: "Estimated annual financial recovery diverted to community youth & senior programs",
        },
        {
          label: "Carbon Offset",
          value: isOptimal ? "1.8" : "0.3",
          unit: "Tons CO2 / yr",
          category: "Sustainability",
          status: "Simulated Model",
          measurementContext: "Derived from municipal grid emission factor coefficients",
        },
        {
          label: "Community Beneficiaries",
          value: "120",
          unit: "Youth & Seniors",
          category: "Community",
          status: "Demonstrated",
          measurementContext: "Active facility program capacity supported by budget optimization",
        },
      ],
      skillsDemonstrated: result.skillsDemonstrated,
      evidenceVerification: "Simulated Scenario Audit Log • Verified Field Model Calculation",
      timestamp,
    };

    const existingImpactRecords = sessionImpactPassportState.accumulatedImpactRecords;
    const filteredImpactRecords = existingImpactRecords.filter(r => r.missionId !== result.missionId);

    sessionImpactPassportState = {
      totalImpactMissionsCompleted: filteredImpactRecords.length + 1,
      totalImpactPoints: (filteredImpactRecords.length + 1) * 450,
      accumulatedImpactRecords: [...filteredImpactRecords, impactRecord],
      aggregatedMetrics: {
        energy: { label: "Energy Saved", aggregateValue: isOptimal ? "450 kWh" : "80 kWh", unit: "kWh / month", status: "Simulated Model" },
        budget: { label: "Budget Recovered", aggregateValue: isOptimal ? "$4,200" : "$600", unit: "Annual Savings", status: "Projected" },
        carbon: { label: "Carbon Offset", aggregateValue: isOptimal ? "1.8 Tons" : "0.3 Tons", unit: "CO2 Offset", status: "Simulated Model" },
      },
    };
  }


  return sessionPassportState;
}

export interface ImpactMeasurementInputs {
  wattageReductionW: number;
  operatingHoursPerDay: number;
  electricityRatePerKwh: number;
  facilityCapacity: number;
}

export function calculateImpactMetrics(inputs: ImpactMeasurementInputs) {
  const monthlyKwh = Math.round((inputs.wattageReductionW * inputs.operatingHoursPerDay * 30) / 1000);
  const annualDollars = Math.round(monthlyKwh * 12 * inputs.electricityRatePerKwh);
  const annualCo2Tons = parseFloat((monthlyKwh * 12 * 0.0004).toFixed(1));

  return {
    monthlyKwh,
    annualDollars,
    annualCo2Tons,
    facilityCapacity: inputs.facilityCapacity,
  };
}

export function saveCalculatedImpactResultToSession(
  missionId: string,
  missionTitle: string,
  problemStatement: string,
  actionTaken: string,
  inputs: ImpactMeasurementInputs,
): SessionImpactPassport {
  const calculated = calculateImpactMetrics(inputs);
  const timestamp = Date.now();

  const impactRecord: ImpactEvidenceRecord = {
    id: `impact-${missionId}-${timestamp}`,
    missionId,
    missionTitle,
    problemStatement,
    actionTaken,
    measurement: `Field audit logging: ${inputs.wattageReductionW}W wattage reduction @ ${inputs.operatingHoursPerDay}h/day, $${inputs.electricityRatePerKwh}/kWh rate`,
    outcome: `Achieved estimated ${calculated.monthlyKwh} kWh/month reduction and $${calculated.annualDollars.toLocaleString()}/year financial recovery.`,
    evidenceStatus: "Simulated Model",
    measurableImpact: [
      {
        label: "Energy Reduction",
        value: `${calculated.monthlyKwh}`,
        unit: "kWh / month",
        category: "Sustainability",
        status: "Simulated Model",
        measurementContext: `Calculated from retrofitted ${inputs.wattageReductionW}W wattage savings over ${inputs.operatingHoursPerDay}h/day baseline`,
      },
      {
        label: "Budget Savings",
        value: `$${calculated.annualDollars.toLocaleString()}`,
        unit: "Annual",
        category: "Economic",
        status: "Projected",
        measurementContext: `Estimated annual savings at $${inputs.electricityRatePerKwh}/kWh electricity tariff`,
      },
      {
        label: "Carbon Offset",
        value: `${calculated.annualCo2Tons}`,
        unit: "Tons CO2 / yr",
        category: "Sustainability",
        status: "Simulated Model",
        measurementContext: "Derived from regional electric grid carbon intensity coefficients",
      },
      {
        label: "Community Beneficiaries",
        value: `${calculated.facilityCapacity}`,
        unit: "Youth & Seniors",
        category: "Community",
        status: "Demonstrated",
        measurementContext: "Facility capacity supported by recovered utility budget",
      },
    ],
    skillsDemonstrated: [
      "Sustainability Leadership",
      "Resource Optimization",
      "Community Stakeholder Management",
      "Data-Driven Problem Solving",
    ],
    evidenceVerification: "Simulated Scenario Audit Log • Field Calculation Model",
    timestamp,
  };

  const existingImpactRecords = sessionImpactPassportState.accumulatedImpactRecords;
  const filteredImpactRecords = existingImpactRecords.filter((r) => r.missionId !== missionId);

  sessionImpactPassportState = {
    totalImpactMissionsCompleted: filteredImpactRecords.length + 1,
    totalImpactPoints: (filteredImpactRecords.length + 1) * 450,
    accumulatedImpactRecords: [...filteredImpactRecords, impactRecord],
    aggregatedMetrics: {
      energy: { label: "Energy Saved", aggregateValue: `${calculated.monthlyKwh} kWh`, unit: "kWh / month", status: "Simulated Model" },
      budget: { label: "Budget Recovered", aggregateValue: `$${calculated.annualDollars.toLocaleString()}`, unit: "Annual Savings", status: "Projected" },
      carbon: { label: "Carbon Offset", aggregateValue: `${calculated.annualCo2Tons} Tons`, unit: "CO2 Offset", status: "Simulated Model" },
    },
  };

  return sessionImpactPassportState;
}

export function getSessionSkillPassport(): SessionSkillPassport {
  return sessionPassportState;
}

export function getSessionImpactPassport(): SessionImpactPassport {
  return sessionImpactPassportState;
}

export function clearSessionPassport(): void {
  sessionPassportState = {
    totalMissionsCompleted: 0,
    completedMissionIds: [],
    latestResults: {},
    accumulatedEvidence: [],
    skillSummaries: {},
  };
  sessionImpactPassportState = {
    totalImpactMissionsCompleted: 0,
    totalImpactPoints: 0,
    accumulatedImpactRecords: [],
    aggregatedMetrics: {},
  };
}
