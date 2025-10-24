import React from 'react';
import { RULES } from '../constants';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-full md:w-64 lg:w-72 bg-slate-900 text-white p-6 rounded-lg shadow-lg md:sticky md:top-6 md:self-start">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-slate-600 pb-2 text-slate-100">📋 Scoring Rules</h2>
            <ul className="space-y-3 list-disc list-inside text-slate-300">
                {RULES.map((rule, index) => (
                    <li key={index}>{rule}</li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;