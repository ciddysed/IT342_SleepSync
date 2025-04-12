// SleepInsights.jsx
import React from 'react';

const SleepInsights = ({ duration, getSleepCategory }) => {
    const category = getSleepCategory(duration);
    
    const getRecommendations = () => {
        if (duration < 6) {
            return [
                "Try to go to bed 30-60 minutes earlier tonight",
                "Limit screen time 2 hours before bedtime",
                "Avoid caffeine after noon",
                "Keep your bedroom cool and dark"
            ];
        } else if (duration < 7) {
            return [
                "You're close to the recommended amount! Try to get to bed 15-30 minutes earlier",
                "Maintain a consistent sleep schedule",
                "Consider a relaxing bedtime routine"
            ];
        } else if (duration <= 9) {
            return [
                "Great job maintaining healthy sleep habits!",
                "Keep your sleep schedule consistent, even on weekends",
                "Continue to prioritize good sleep hygiene"
            ];
        } else {
            return [
                "You might be oversleeping. Try to maintain 7-9 hours of sleep",
                "Ensure you're getting enough physical activity during the day",
                "Check if your sleep quality is good - you may be compensating for poor quality"
            ];
        }
    };
    
    const recommendations = getRecommendations();
    
    return (
        <div className="sleep-insights">
            <h2 className="sleep-insights-title">Your Sleep Insights</h2>
            <div className="insights-grid">
                <div className="insight-card">
                    <h3>Sleep Duration</h3>
                    <p className="insight-value">{duration.toFixed(1)} hours</p>
                    <p>
                        {category.description}
                    </p>
                </div>
                
                <div className="insight-card">
                    <h3>Sleep Quality Category</h3>
                    <p className="insight-category" style={{ color: category.color }}>
                        {category.label}
                    </p>
                    <p>
                        Adults typically need 7-9 hours of quality sleep per night.
                    </p>
                </div>
                
                <div className="insight-card">
                    <h3>Recommendations</h3>
                    <ul className="recommendations-list">
                        {recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SleepInsights;