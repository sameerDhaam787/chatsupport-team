import React from 'react';
import { ClipboardCheck, Clock, ArrowLeft } from 'lucide-react';
import { Agent } from '../hooks/useAgents';

const AgentQuickView = ({ agent, position }: { agent: Agent, position: { top: number, left: number } }) => {
    const getStatusColor = (status: string) => {
        const colors = {
            Active: 'bg-green-50 text-green-800 border-green-200',
            'On Leave': 'bg-red-50 text-red-800 border-red-200',
            Training: 'bg-yellow-50 text-yellow-800 border-yellow-200',
            New: 'bg-blue-50 text-blue-800 border-blue-200',
        };
        return colors[status] || colors.Active;
    };

    return (
        <div
            className="absolute z-50 w-72 p-4 bg-white rounded-xl shadow-2xl border border-gray-100 transform transition-all duration-300 ease-out scale-100 opacity-100"
            style={{ top: position.top + 10, left: position.left }}
            onMouseEnter={(e) => e.stopPropagation()}
        >
            <div className="flex items-start mb-3">
                <img
                    src={agent.avatar}
                    className="w-12 h-12 rounded-full object-cover shadow-sm mr-4"
                    alt={`${agent.name}'s avatar`}
                />
                <div>
                    <h4 className="text-base font-bold text-gray-900">{agent.name}</h4>
                    <p className="text-sm text-purple-600">{agent.role} - {agent.team}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-purple-500" /> Tickets Closed:</span>
                    <span className="font-semibold">{agent.ticketsClosed}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-500" /> Avg. Response Time:</span>
                    <span className="font-semibold">{agent.avgResponseTime}</span>
                </div>
            </div>
            <div className="mt-3 border-t pt-3 flex justify-between items-center">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(agent.status)}`}>
                    {agent.status}
                </span>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors">
                    Full Profile <ArrowLeft className="w-3 h-3 inline rotate-180 ml-1" />
                </button>
            </div>
        </div>
    );
};

export default AgentQuickView;
