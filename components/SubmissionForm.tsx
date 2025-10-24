import React, { useState } from 'react';
import { SCORE_TABLE, TEAM_NAMES } from '../constants';
import { Submission } from '../types';

interface SubmissionFormProps {
    onAddSubmission: (submission: Omit<Submission, 'id' | 'score'>) => void;
    submissions: Submission[];
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onAddSubmission, submissions }) => {
    const [name, setName] = useState('');
    const [team, setTeam] = useState(TEAM_NAMES[0]);
    const [activity, setActivity] = useState(Object.keys(SCORE_TABLE)[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [proofs, setProofs] = useState<string[]>([]);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            const currentImages = proofs.filter(p => p.startsWith('data:image')).length;
            const currentVideos = proofs.filter(p => p.startsWith('data:video')).length;

            const newImageFiles = newFiles.filter(f => f.type.startsWith('image/'));
            const newVideoFiles = newFiles.filter(f => f.type.startsWith('video/'));

            if (currentImages + newImageFiles.length > 3) {
                setError('You can upload a maximum of 3 photos.');
                return;
            }
            if (currentVideos + newVideoFiles.length > 1) {
                setError('You can upload a maximum of 1 video.');
                return;
            }

            setError('');

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    setProofs(prevProofs => [...prevProofs, result]);
                };
                reader.readAsDataURL(file);
            });
            
            // Clear the file input to allow re-selecting the same file if removed
            e.target.value = '';
        }
    };

    const handleRemoveProof = (indexToRemove: number) => {
        setProofs(prevProofs => prevProofs.filter((_, index) => index !== indexToRemove));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName || !team.trim()) {
            setError('Name and Team are required.');
            return;
        }

        if (proofs.length === 0) {
            setError('Proof is required. Please upload at least one photo or video.');
            return;
        }

        const submissionsToday = submissions.filter(
            sub => sub.name.trim().toLowerCase() === trimmedName.toLowerCase() && sub.date === date
        );

        if (submissionsToday.length >= 3) {
            setError('You have reached the maximum of 3 submissions for this day.');
            return;
        }

        setError('');
        onAddSubmission({
            name: trimmedName,
            team,
            activity,
            date,
            time,
            proofs
        });
        // Reset form fields, but keep name and team for convenience
        setActivity(Object.keys(SCORE_TABLE)[0]);
        setDate(new Date().toISOString().split('T')[0]);
        setTime(new Date().toTimeString().slice(0, 5));
        setProofs([]);
        const fileInput = document.getElementById('proof-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">🔥 Log a New Workout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600">👤 Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="team" className="block text-sm font-medium text-slate-600">👥 Team</label>
                        <select
                            id="team"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {TEAM_NAMES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="activity" className="block text-sm font-medium text-slate-600">🏋️ Activity</label>
                    <select
                        id="activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {Object.keys(SCORE_TABLE).map(act => (
                            <option key={act} value={act}>{act}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-slate-600">📅 Date</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-slate-600">⏰ Time</label>
                        <input
                            id="time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="proof-upload" className="block text-sm font-medium text-slate-600">📸 Proof (Required - 3 photos, 1 video max)</label>
                    <input
                        id="proof-upload"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                     {proofs.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {proofs.map((proof, index) => (
                                <div key={index} className="relative group">
                                    {proof.startsWith('data:image') ? (
                                        <img src={proof} alt={`Proof ${index + 1}`} className="h-24 w-full object-cover rounded-lg shadow-md" />
                                    ) : (
                                        <div className="h-24 w-full bg-black rounded-lg shadow-md flex items-center justify-center">
                                            <video src={proof} className="max-h-full max-w-full" controls={false} />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProof(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold opacity-50 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none"
                                        aria-label="Remove proof"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-200 hover:scale-105"
                >
                    Submit Score
                </button>
            </form>
        </div>
    );
};

export default SubmissionForm;