import React from 'react';
import './ComprehensiveSleepChart.css'; // Add custom styles or use Tailwind CSS classes

const sleepCategories = [
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

const ComprehensiveSleepChart = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {sleepCategories.map((category, index) => (
                <div
                    key={index}
                    className="card bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow"
                >
                    <h3 className="text-xl font-bold text-purple-700 mb-2">{category.range}</h3>
                    <div className="mb-2">
                        <span className="font-semibold text-green-600">Pros:</span> {category.pros}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold text-red-600">Cons:</span> {category.cons}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold text-gray-700">Health Issues:</span> {category.healthIssues}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold text-gray-700">Cognitive Effects:</span> {category.cognitiveEffects}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold text-gray-700">Productivity Impact:</span> {category.productivityImpact}
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Recommended For:</span> {category.recommendedFor}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ComprehensiveSleepChart;
