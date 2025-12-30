import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  MessageSquare,
  Star,
  Filter,
  CheckCircle,
  Bot,
  ClipboardCheck,
  ChevronRight,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";

// Helper Component for the Metric Cards
const MetricCard = ({ icon, label, value, trend, trendUp, isStatus }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
        isStatus ? 'bg-green-100 text-green-700' : (trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
      }`}>
        {trend}
      </span>
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
    </div>
  </div>
);

// Ticket Row Component
const TicketRow = ({ ticket, status }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-purple-50 rounded-xl border border-gray-100 hover:border-purple-200 transition-all cursor-pointer group">
    <div className="flex items-center gap-4 flex-1">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
        <ClipboardCheck className="w-5 h-5 text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
          {ticket.subject || 'Unable to access dashboard from mobile app'}
        </p>
        <p className="text-xs text-gray-500">
          #TR-{ticket.id || ticket.ticket_id} • <span className="text-gray-600">Updated 24m ago</span> • 
          <span className={`font-semibold ml-1 ${
            ticket.priority === 'Urgent' ? 'text-red-500' :
            ticket.priority === 'High' ? 'text-orange-500' :
            ticket.priority === 'Medium' ? 'text-yellow-600' :
            'text-blue-500'
          }`}>
            {ticket.priority || 'High'} Priority
          </span>
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
        status === 'Open' ? 'bg-blue-100 text-blue-700' :
        status === 'Resolved' ? 'bg-green-100 text-green-700' :
        status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {status || ticket.status}
      </span>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
    </div>
  </div>
);

const AgentDetail = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const agent = {
    name: "Sarah Mitchell",
    role: "Senior Support Specialist",
    email: "sarah.mitchell@company.com",
    phone: "+1 (555) 123-4567",
    team: "Enterprise Support",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    ticketsClosed: 24,
    avgResponseTime: "1h 15m",
    agent_rating: "4.9"
  };

  const tickets = [
    { id: "8321", subject: "Unable to access dashboard from mobile app", priority: "High" },
    { id: "8320", subject: "Payment processing delay for subscription", priority: "Urgent" },
    { id: "8319", subject: "Feature request: Dark mode implementation", priority: "Low" },
    { id: "8318", subject: "API integration timeout errors", priority: "High" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Details</h1>
            <p className="text-sm text-gray-500 mt-1">Complete profile and performance overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: PROFILE CARD */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
              {/* Profile Header */}
              <div className="p-8 text-center bg-gradient-to-br from-purple-500 to-purple-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-5"></div>
                <div className="relative z-10">
                  <div className="relative inline-block mb-4">
                    <img
                      src={agent.avatar}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      alt={agent.name}
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{agent.name}</h2>
                  <p className="text-purple-100 text-sm mb-4">{agent.role}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                      Tier 2 Agent
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                      Team Lead
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Contact & Info */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700 hover:text-purple-600 transition-colors cursor-pointer group">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 hover:text-purple-600 transition-colors cursor-pointer group">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{agent.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="text-sm font-semibold text-gray-900">{agent.team}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-semibold text-gray-900">{agent.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Joined</p>
                        <p className="text-sm font-semibold text-gray-900">March 12, 2021</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Technical Support', 'Billing', 'API Integration', 'SaaS'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors cursor-pointer">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: METRICS & CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                icon={<MessageSquare className="w-5 h-5 text-purple-600"/>} 
                label="Active Tickets" 
                value={agent.ticketsClosed} 
                trend="↑ 12%" 
                trendUp={true} 
              />
              <MetricCard 
                icon={<CheckCircle className="w-5 h-5 text-blue-600"/>} 
                label="Solved This Month" 
                value="142" 
                trend="↑ 8%" 
                trendUp={true} 
              />
              <MetricCard 
                icon={<Star className="w-5 h-5 text-yellow-600"/>} 
                label="CSAT Score" 
                value="4.9" 
                trend="↑ 0.2" 
                trendUp={true} 
              />
              <MetricCard 
                icon={<Clock className="w-5 h-5 text-green-600"/>} 
                label="Avg Response" 
                value={agent.avgResponseTime} 
                trend="On Track" 
                isStatus
              />
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 px-6">
                <div className="flex gap-8 overflow-x-auto">
                  {['Overview', 'Assigned Tickets', 'Performance', 'Activity'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
                      className={`py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                        activeTab === tab.toLowerCase().replace(' ', '')
                          ? 'text-purple-600 border-purple-600'
                          : 'text-gray-500 border-transparent hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900">Current Workload</h3>
                      <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all">
                        <Filter className="w-4 h-4" /> Filter
                      </button>
                    </div>
                    <div className="space-y-3">
                      {tickets.map((ticket, idx) => (
                        <TicketRow key={idx} ticket={ticket} status={['Open', 'In Progress', 'Resolved', 'Open'][idx]} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ASSIGNED TICKETS TAB */}
                {activeTab === 'assignedtickets' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h3 className="text-lg font-bold text-gray-900">All Assigned Tickets</h3>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <input 
                          type="text" 
                          placeholder="Search tickets..." 
                          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex-1 sm:flex-none"
                        />
                        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
                          <option>All Status</option>
                          <option>Open</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {tickets.map((ticket, idx) => (
                        <TicketRow key={idx} ticket={ticket} status={['Open', 'In Progress', 'Resolved', 'Closed'][idx % 4]} />
                      ))}
                    </div>
                  </div>
                )}

                {/* PERFORMANCE TAB */}
                {activeTab === 'performance' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Performance Bars */}
                      <div>
                        <h4 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          Key Performance Indicators
                        </h4>
                        <div className="space-y-6">
                          {[
                            { label: 'Tickets Resolved', value: 92, color: 'purple' },
                            { label: 'Response Time', value: 88, color: 'blue' },
                            { label: 'Customer Satisfaction', value: 96, color: 'green' },
                          ].map((metric) => (
                            <div key={metric.label}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
                                <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div 
                                  className={`bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 h-full rounded-full transition-all duration-500`}
                                  style={{ width: `${metric.value}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div>
                        <h4 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <Award className="w-5 h-5 text-purple-600" />
                          Performance Stats
                        </h4>
                        <div className="space-y-4">
                          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                            <p className="text-xs text-gray-600 font-medium mb-1">Avg Resolution Time</p>
                            <p className="text-3xl font-bold text-gray-900">2h 15m</p>
                          </div>
                          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                            <p className="text-xs text-gray-600 font-medium mb-1">Customer Rating</p>
                            <p className="text-3xl font-bold text-gray-900">{agent.agent_rating}/5.0 ⭐</p>
                          </div>
                          <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                            <p className="text-xs text-gray-600 font-medium mb-1">First Response Time</p>
                            <p className="text-3xl font-bold text-gray-900">15m</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTIVITY TAB */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      Recent Activity
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {[
                        { action: 'Resolved Ticket #STR-8321', time: '2 hours ago', type: 'resolved' },
                        { action: 'Created Ticket #STR-8320', time: '4 hours ago', type: 'created' },
                        { action: 'Updated Status to Active', time: 'Yesterday', type: 'status' },
                        { action: 'Assigned 3 New Tickets', time: '2 days ago', type: 'assigned' },
                        { action: 'Completed Training Module', time: '3 days ago', type: 'training' },
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 hover:bg-purple-50 rounded-xl transition-colors border border-gray-100 hover:border-purple-200">
                          <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${
                            activity.type === 'resolved' ? 'bg-green-500' :
                            activity.type === 'created' ? 'bg-blue-500' :
                            activity.type === 'status' ? 'bg-purple-500' :
                            activity.type === 'assigned' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;