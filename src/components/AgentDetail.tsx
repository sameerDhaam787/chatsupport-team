import React from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  Calendar,
  MessageSquare,
  Star,
  Users,
  Activity,
  BarChart3
} from 'lucide-react';
import { Agent } from '../hooks/useAgents';

const AgentDetail = ({ agent, onClose }: { agent: Agent, onClose: () => void }) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'bg-green-50 text-green-700 border-green-200',
      Inactive: 'bg-gray-100 text-gray-700 border-gray-300',
      'On Leave': 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[status] || colors.Active;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-0
     p-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Agents
          </button>
        </div>

        {/* Profile Card */}
        {/* Profile Card */}
        <div className="bg-white/40 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/60 overflow-hidden mb-6">
          {/* Header with subtle gradient background */}
          <div className="relative px-8 py-10 overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/60 to-indigo-50/80"></div>
            
            {/* Decorative blur circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img 
                    src={agent.avatar} 
                    className="w-28 h-28 rounded-2xl border-4 border-white/80 shadow-2xl object-cover backdrop-blur-sm" 
                    alt={agent.name} 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-7 h-7 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-gray-900">{agent.name}</h1>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gray-700 text-lg font-medium">{agent.role}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 font-medium">{agent.team}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border backdrop-blur-sm shadow-sm ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl px-8 py-5 border border-white/80 shadow-xl">
                  <div className="text-sm text-gray-600 font-semibold mb-2 uppercase tracking-wide">Performance Score</div>
                  <div className="text-5xl font-bold flex items-center gap-3 text-gray-900">
                    {agent.performanceScore}%
                    <TrendingUp className="w-7 h-7 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="px-8 py-5 bg-white/50 backdrop-blur-xl border-t border-white/60">
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">{agent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                  <Phone className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">{agent.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-6 hover:shadow-xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50/80 backdrop-blur-sm px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{agent.ticketsClosed}</div>
            <div className="text-sm text-gray-600">Tickets Closed</div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-6 hover:shadow-xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50/80 backdrop-blur-sm px-2 py-1 rounded-full">-8%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{agent.avgResponseTime}</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-6 hover:shadow-xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50/80 backdrop-blur-sm px-2 py-1 rounded-full">+5%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">4.8/5.0</div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-6 hover:shadow-xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50/80 backdrop-blur-sm px-2 py-1 rounded-full">Top 10%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{agent.performanceScore}%</div>
            <div className="text-sm text-gray-600">Performance Score</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/50 to-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Recent Activity
                  </h3>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:bg-purple-50 px-3 py-1 rounded-lg transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-sm sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100/50">
                    {[...Array(12)].map((_, i) => (
                      <tr key={i} className="hover:bg-purple-50/70 hover:shadow-sm transition-all cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{new Date(Date.now() - i * 3600000).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{new Date(Date.now() - i * 3600000).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-semibold">Resolved Ticket #{1000 + i}</div>
                          <div className="text-xs text-gray-500">Technical Support</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                              {String.fromCharCode(65 + (i % 26))}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">Customer {i + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-full text-xs font-semibold border border-green-200/50 shadow-sm">
                            Resolved
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Performance & Info Sidebar */}
          <div className="space-y-6">
            {/* Performance Chart */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Weekly Performance
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Tickets Resolved</span>
                    <span className="font-semibold text-gray-900">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-gray-900">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-semibold text-gray-900">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/60 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Conversations</div>
                      <div className="text-lg font-bold text-gray-900">1,247</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Resolution Rate</div>
                      <div className="text-lg font-bold text-gray-900">94.5%</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Days Active</div>
                      <div className="text-lg font-bold text-gray-900">487</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;
