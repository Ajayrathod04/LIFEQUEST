import type { Mission } from "../types/mission";

export const missions: Mission[] = [
  {
    id: "consumer-refund-001",
    title: "The Refund Problem",
    description:
      "A realistic consumer situation where you must understand the problem and decide what to do next.",
    domain: "solve",
    difficulty: "beginner",
    estimatedMinutes: 3,
    skills: ["decision-making", "problem-solving"],
    steps: [
      {
        id: "step-1",
        type: "scenario",
        title: "Understand the situation",
        description:
          "You purchased a product that does not work as expected. What should you do first?",
      },
      {
        id: "step-2",
        type: "choice",
        title: "Choose your next action",
        description: "Select the action you think is most appropriate.",
        options: [
          "Ignore the issue",
          "Collect the purchase and product details",
          "Immediately post about it online",
        ],
      },
      {
        id: "step-3",
        type: "feedback",
        title: "See the consequence",
        description: "Your decision is evaluated and you receive feedback.",
      },
      {
        id: "step-4",
        type: "result",
        title: "Mission complete",
        description: "You completed your first real-world mission.",
      },
    ],
  },
];
