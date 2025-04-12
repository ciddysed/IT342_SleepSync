export const sleepCategories = [
    {
        range: "Less than 4 hours",
        pros: "None",
        cons: "Severe fatigue, impaired judgment",
        healthIssues: "Increased risk of heart disease, diabetes",
        cognitiveEffects: "Poor memory, reduced focus",
        productivityImpact: "Low efficiency, high burnout risk",
        recommendedFor: "Not recommended for anyone",
    },
    {
        range: "4–6 hours",
        pros: "Short-term productivity boost",
        cons: "Chronic sleep debt, stress",
        healthIssues: "Weakened immune system, weight gain",
        cognitiveEffects: "Slower reaction times, poor decision-making",
        productivityImpact: "Unsustainable over time",
        recommendedFor: "Emergency workers, short-term deadlines",
    },
    {
        range: "7–9 hours",
        pros: "Optimal energy, improved mood",
        cons: "None for most people",
        healthIssues: "Reduced risk of chronic diseases",
        cognitiveEffects: "Enhanced memory and focus",
        productivityImpact: "High efficiency, balanced workload",
        recommendedFor: "Students, professionals, athletes",
    },
    {
        range: "More than 9 hours",
        pros: "Recovery for sleep-deprived individuals",
        cons: "Grogginess, potential oversleeping effects",
        healthIssues: "Linked to depression, obesity",
        cognitiveEffects: "Diminished alertness",
        productivityImpact: "Reduced daytime activity",
        recommendedFor: "Recovering from illness or extreme fatigue",
    },
];

export const getSleepCategory = (duration) => {
    if (duration < 4) return sleepCategories[0];
    if (duration >= 4 && duration < 7) return sleepCategories[1];
    if (duration >= 7 && duration <= 9) return sleepCategories[2];
    if (duration > 9) return sleepCategories[3];
    return null;
};