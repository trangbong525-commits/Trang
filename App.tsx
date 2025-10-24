import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import SubmissionForm from './components/SubmissionForm';
import ScoreTable from './components/ScoreTable';
import Leaderboard from './components/Leaderboard';
import { Submission, IndividualRanking, TeamRanking } from './types';
import { SCORE_TABLE } from './constants';

const App: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>(() => {
        try {
            const savedSubmissions = localStorage.getItem('fit_fight_scores');
            if (!savedSubmissions) return [];
            const parsed = JSON.parse(savedSubmissions);
            // Data migration from old format
            return parsed.map((sub: any) => {
                if (sub.proof && !sub.proofs) {
                    return { ...sub, proofs: [sub.proof], proof: undefined };
                }
                if (!sub.proofs) {
                    return { ...sub, proofs: [] };
                }
                return sub;
            });
        } catch (error) {
            console.error("Could not parse submissions from localStorage", error);
            return [];
        }
    });
    const [successMessage, setSuccessMessage] = useState('');


    useEffect(() => {
        try {
            localStorage.setItem('fit_fight_scores', JSON.stringify(submissions));
        } catch (error) {
            console.error("Could not save submissions to localStorage", error);
        }
    }, [submissions]);

    const handleAddSubmission = useCallback((newSubmission: Omit<Submission, 'id' | 'score'>) => {
        const score = SCORE_TABLE[newSubmission.activity] || 0;
        const submissionWithScore: Submission = {
            ...newSubmission,
            id: new Date().toISOString() + Math.random(),
            score,
        };
        setSubmissions(prev => [...prev, submissionWithScore]);
        setSuccessMessage(`✅ Recorded ${score} points for ${newSubmission.name} (${newSubmission.activity}) – Team ${newSubmission.team}`);
        setTimeout(() => setSuccessMessage(''), 3000);
    }, []);

    const individualRanking = useMemo<IndividualRanking[]>(() => {
        const scores: { [key: string]: number } = {};
        submissions.forEach(sub => {
            scores[sub.name] = (scores[sub.name] || 0) + sub.score;
        });
        return Object.entries(scores)
            .map(([name, score]) => ({ name, score }))
            .sort((a, b) => b.score - a.score);
    }, [submissions]);

    const teamRanking = useMemo<TeamRanking[]>(() => {
        const teamScores: { [key: string]: { totalScore: number, count: number } } = {};
        submissions.forEach(sub => {
            if (!teamScores[sub.team]) {
                teamScores[sub.team] = { totalScore: 0, count: 0 };
            }
            teamScores[sub.team].totalScore += sub.score;
            teamScores[sub.team].count += 1;
        });

        return Object.entries(teamScores)
            .map(([team, data]) => ({ team, score: data.totalScore / data.count }))
            .sort((a, b) => b.score - a.score);
    }, [submissions]);

    const sortedSubmissions = useMemo(() => {
        return [...submissions].sort((a, b) => {
            const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
            const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
            return dateB.getTime() - dateA.getTime();
        });
    }, [submissions]);

    return (
        <div className="min-h-screen text-slate-800 flex flex-col">
            <header className="bg-slate-900 shadow-lg p-6 mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-fuchsia-500">
                    🏆 FIT & FIGHT – Sports Competition Tracker 🏃‍♀️
                </h1>
            </header>

            <main className="container mx-auto p-4 md:p-6 flex-grow">
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                    <Sidebar />
                    <div className="flex-1">
                        {successMessage && (
                            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg relative mb-4 shadow" role="alert">
                                <span className="block sm:inline">{successMessage}</span>
                            </div>
                        )}
                        <SubmissionForm onAddSubmission={handleAddSubmission} submissions={submissions} />
                        
                        <Leaderboard 
                            individualData={individualRanking}
                            teamData={teamRanking}
                        />

                        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200">
                             <h2 className="text-2xl font-bold text-slate-800 mb-4">📜 Recent Activities</h2>
                             <ScoreTable
                                headers={['Name', 'Team', 'Activity', 'Date', 'Time', 'Score', 'Proof']}
                                data={sortedSubmissions}
                                renderRow={(item: Submission) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.team}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.activity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.time || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{item.score}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <div className="flex items-center space-x-1">
                                                {item.proofs && item.proofs.length > 0 ? (
                                                    item.proofs.map((proof, index) => (
                                                        <a key={index} href={proof} target="_blank" rel="noopener noreferrer" title={`View proof ${index + 1}`}>
                                                            {proof.startsWith('data:image') ? (
                                                                <img src={proof} alt={`Proof ${index + 1}`} className="h-10 w-10 object-cover rounded shadow-sm hover:scale-110 transition-transform duration-200" />
                                                            ) : (
                                                                <div className="h-10 w-10 bg-slate-200 rounded shadow-sm flex items-center justify-center hover:scale-110 transition-transform duration-200">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.002v3.996a1 1 0 001.555.832l3.197-2.001a1 1 0 000-1.664l-3.197-1.999z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </a>
                                                    ))
                                                ) : 'N/A'}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <footer className="text-center py-6 bg-slate-900 text-slate-400 text-sm mt-8">
                <p>⏰ Valid tracking time: Monday – Sunday each week. Reports must be submitted within 12 hours after training.</p>
            </footer>
        </div>
    );
};

export default App;