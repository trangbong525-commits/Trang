import React from 'react';

interface ActivityDuration {
    activity: string;
    duration: number; // in minutes
}

interface ActivityBreakdownProps {
    data: ActivityDuration[];
}

const ActivityBreakdown: React.FC<ActivityBreakdownProps> = ({ data }) => {
    if (data.length === 0) {
        return null; // Don't render if no data
    }
    
    const maxDuration = Math.max(...data.map(d => d.duration), 0);

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        let result = '';
        if (hours > 0) {
            result += `${hours}h `;
        }
        if (mins > 0 || hours === 0) {
            result += `${mins}m`;
        }
        return result.trim();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">⏱️ Time Spent Per Activity</h2>
            <div className="space-y-4">
                {data.map(({ activity, duration }) => (
                    <div key={activity}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-600">{activity}</span>
                            <span className="text-sm font-bold text-indigo-600">{formatDuration(duration)}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" 
                                style={{ width: `${(duration / maxDuration) * 100}%` }}
                                role="progressbar"
                                aria-valuenow={duration}
                                aria-valuemin={0}
                                aria-valuemax={maxDuration}
                                aria-label={`${activity} duration`}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityBreakdown;
