import React from 'react';

const SleepInsights = ({ duration, getSleepCategory }) => {
    const category = getSleepCategory(duration);

    if (!category) return null;

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Sleep Insights</h2>
            <div className="flex flex-wrap justify-center gap-6">
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-green-400 mb-2">Pros</h3>
                    <p className="text-gray-300 text-center">{category.pros}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-red-400 mb-2">Cons</h3>
                    <p className="text-gray-300 text-center">{category.cons}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-gray-400 mb-2">Health Issues</h3>
                    <p className="text-gray-300 text-center">{category.healthIssues}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-gray-400 mb-2">Cognitive Effects</h3>
                    <p className="text-gray-300 text-center">{category.cognitiveEffects}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-gray-400 mb-2">Productivity Impact</h3>
                    <p className="text-gray-300 text-center">{category.productivityImpact}</p>
                </div>
                <div className="box bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-48 h-48 flex flex-col justify-center items-center rounded-lg border border-gray-700">
                    <h3 className="font-semibold text-gray-400 mb-2">Recommended For</h3>
                    <p className="text-gray-300 text-center">{category.recommendedFor}</p>
                </div>
            </div>
        </div>
    );
};

export default SleepInsights;
