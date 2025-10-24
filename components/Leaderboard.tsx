import React, { useState } from 'react';
import { IndividualRanking, TeamRanking } from '../types';
import ScoreTable from './ScoreTable';

interface LeaderboardProps {
    individualData: IndividualRanking[];
    teamData: TeamRanking[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ individualData, teamData }) => {
    const [activeTab, setActiveTab] = useState<'individual' | 'team'>('individual');

    const getRankContent = (index: number) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return index + 1;
    };

    const getRowClass = (index: number) => {
        let baseClass = "transition-colors duration-200";
        if (index === 0) return `${baseClass} bg-yellow-100 hover:bg-yellow-200`;
        if (index === 1) return `${baseClass} bg-slate-200 hover:bg-slate-300`;
        if (index === 2) return `${baseClass} bg-orange-200 hover:bg-orange-300`;
        return `${baseClass} hover:bg-slate-50`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">🔥 Leaderboard 🏆</h2>
            
            <div className="mb-4 border-b border-gray-200">
                <nav className="flex space-x-4" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('individual')}
                        className={`px-3 py-2 font-medium text-sm rounded-md ${
                            activeTab === 'individual'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        aria-current={activeTab === 'individual' ? 'page' : undefined}
                    >
                        👤 Individual
                    </button>
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`px-3 py-2 font-medium text-sm rounded-md ${
                            activeTab === 'team'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        aria-current={activeTab === 'team' ? 'page' : undefined}
                    >
                        👥 Team
                    </button>
                </nav>
            </div>

            {activeTab === 'individual' && (
                 <ScoreTable
                    headers={['Rank', 'Name', 'Total Score']}
                    data={individualData}
                    renderRow={(item: IndividualRanking, index) => (
                        <tr key={item.name} className={getRowClass(index)}>
                            <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-slate-900 text-center">{getRankContent(index)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-lg text-indigo-600 font-extrabold">{item.score}</td>
                        </tr>
                    )}
                />
            )}
            {activeTab === 'team' && (
                <ScoreTable
                    headers={['Rank', 'Team', 'Average Score']}
                    data={teamData}
                    renderRow={(item: TeamRanking, index) => (
                        <tr key={item.team} className={getRowClass(index)}>
                            <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-slate-900 text-center">{getRankContent(index)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.team}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-lg text-indigo-600 font-extrabold">{Math.round(item.score * 100) / 100}</td>
                        </tr>
                    )}
                />
            )}
        </div>
    );
};

export default Leaderboard;