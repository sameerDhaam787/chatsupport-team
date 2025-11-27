// AgentSystem.tsx

import React, { useState, lazy, Suspense, useContext, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Users,
  UserPlus,
  Star,
  ChevronDown,
  Grid,
  List,
  Settings,
  MoreHorizontal,
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  MessageSquare,
  Calendar,
  Building,
  CreditCard,
  TrendingUp,
  UserCheck,
  Clock,
  ClipboardCheck,
  Check,
} from "lucide-react";


import { FilterIcon,DensityIcon,ColumnIcon } from '../../public/assets/svg';

import useAgents, { Agent } from '../hooks/useAgents'; 
import { ShimmerTableRows, ShimmerGridCards } from './Shimmer';
import AgentQuickView from './AgentQuickView';
import AgentDetail from './AgentDetail';
import CreateAgentModal from './CreateAgentModal';

const AgentSystem = () => {
  const { agents, loading, error, load, page, limit, total, search, setSearch } = useAgents();
  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const densityOptions = ['Comfortable', 'Standard', 'Compact'] as const;
  type Density = typeof densityOptions[number];
  const [density, setDensity] = useState<Density>('Standard');
  const [isDensityDropdownOpen, setIsDensityDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const densityClasses = useMemo(() => {
    switch (density) {
      case 'Compact': return 'py-1 text-sm';
      case 'Standard': return 'py-2.5 text-sm';
      case 'Comfortable': return 'py-4 text-sm';
      default: return 'py-4 text-sm';
    }
  }, [density]);

  // Derive counts for tabs
  const tabData = [
    { id: 'all', label: 'All Agents', count: (agents || []).length },
    { id: 'active', label: 'Active', count: (agents || []).filter((a: Agent) => a.status === 'Active').length },
    { id: 'on leave', label: 'On Leave', count: (agents || []).filter((a: Agent) => a.status === 'On Leave').length },
    { id: 'manager', label: 'Managers', count: (agents || []).filter((a: Agent) => a.role === 'Manager').length },
    { id: 'training', label: 'In Training', count: (agents || []).filter((a: Agent) => a.status === 'Training').length },
  ];

  // Filtering for UI
  const filteredAgents = (agents || []).filter((agent: Agent) => {
    if (activeTab === 'all') return true;
    
    const statusMatch = (agent.status || '').toLowerCase() === activeTab.toLowerCase();
    const roleMatch = activeTab === 'manager' && (agent.role || '').toLowerCase() === 'manager';
    
    return statusMatch || roleMatch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'bg-green-50 text-green-800 border border-green-200',
      Inactive: 'bg-gray-100 text-gray-700 border border-gray-300',
      Manager: 'bg-purple-50 text-purple-800 border border-purple-200',
      Training: 'bg-blue-50 text-blue-800 border border-blue-200',
      New: 'bg-blue-50 text-blue-800 border border-blue-200',
    };
    return colors[status] || colors.Active;
  };

  const toggleAgentSelection = (id: string) => {
    const newSelection = new Set(selectedAgents);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedAgents(newSelection);
  };

  const toggleAllAgents = () => {
    if (selectedAgents.size === filteredAgents.length && filteredAgents.length > 0) {
      setSelectedAgents(new Set());
    } else {
      setSelectedAgents(new Set(filteredAgents.map((a: Agent) => a.id)));
    }
  };

  useEffect(()=>{
console.log("Create modal open state changed:", isCreateModalOpen);
  },[isCreateModalOpen])
  const selectedAgent = (agents || []).find((a: Agent) => a.id === selectedAgentId);

  const handleMouseEnter = (agentId: string) => {
    const agent = agents?.find((a) => a.id === agentId);
    if (agent) {
      setHoveredAgent(agentId);
      const rowElement = document.getElementById(`agent-row-${agentId}`);
      if (rowElement) {
        const { top, left, height } = rowElement.getBoundingClientRect();
        setPopoverPosition({ top: top + height + window.scrollY, left });
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredAgent(null);
  };

  if (selectedAgent) {
    return (
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <AgentDetail agent={selectedAgent} onClose={() => setSelectedAgentId(null)} />
      </Suspense>
    );
  }

  return (
    <div className=" bg-gray-50">
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              More Actions
              <ChevronDown className="w-4 h-4 inline ml-1" />
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c43df 0%, #9b6edb 100%)' }}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add Agent
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 px-4 overflow-x-auto">
              {tabData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'all') {
                      load({ page: 1, limit });
                    } else if (tab.id === 'manager') {
                      load({ page: 1, limit, role: [tab.id] });
                    } else {
                      load({ page: 1, limit, status: [tab.id] });
                    }
                  }}
                  className={`px-4 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'font-bold border-b-2 border-purple-600 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-gray-900 font-extrabold'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                <FilterIcon />
                
                Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200${activeTab === 'columns' ? ' shadow-sm' : ''}`}> 
                <ColumnIcon  />
                Columns
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsDensityDropdownOpen(!isDensityDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200${isDensityDropdownOpen ? ' shadow-sm' : ''}`}
                >

                  <DensityIcon />
                  Density
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDensityDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                {isDensityDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-40 rounded-lg shadow-xl bg-white z-20 border border-gray-200 overflow-hidden">
                    {densityOptions.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setDensity(d); setIsDensityDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${density === d ? 'bg-gray-200 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {d}
                        {density === d && <Check className="w-4 h-4 text-gray-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={inputValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    setInputValue(v);
                    setSearch(v);
                  }}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm text-sm"
                />
              </div>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white shadow text-purple-600"
                      : "text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white shadow text-purple-600"
                      : "text-gray-600"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "list" ? (
            loading ? (
              <div className="overflow-x-auto max-h-[calc(100vh-350px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-purple-100 border-b border-purple-200">
                    <tr>
                      <th className="px-4 py-3 text-left w-12">
                        <input
                      
                          type="checkbox"
                          checked={selectedAgents.size === filteredAgents.length && filteredAgents.length > 0}
                          onChange={toggleAllAgents}
                          className="w-4 h-4 rounded border-gray-400 text-[#7c43df] accent-[#7c43df]   cursor-pointer transition-colors"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Agent</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Team</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Tickets Closed</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Avg. Response</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    <ShimmerTableRows count={limit} />
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar" style={{ overflowX: 'hidden' }}>
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-sm border-b border-purple-200/50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left w-12">
                        <input
                          type="checkbox"
                           style={{accentColor:"#7c43df"}}
                          checked={selectedAgents.size === filteredAgents.length && filteredAgents.length > 0}
                          onChange={toggleAllAgents}
                          className="w-4 h-4 rounded border-gray-400 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Agent</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Team</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Tickets Closed</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Avg. Response</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100/50">
                    {filteredAgents.map((a) => (
                      <tr
                        key={a.id}
                        className={`cursor-pointer group transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] hover:shadow-[0_2px_8px_0_rgba(60,60,60,0.06),0_-2px_8px_0_rgba(60,60,60,0.06)] hover:z-10 border-b border-gray-200`}
                        onClick={() => setSelectedAgentId(a.id ?? null)}
                        id={`agent-row-${a.id}`}
                        style={{ transformOrigin: 'center' }}
                      >
                        <td className={`px-4 ${densityClasses}`} onClick={(e) => e.stopPropagation()}>
                          <div className="transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.008]">
                            <input
                              type="checkbox"
                              checked={selectedAgents.has(a.id ?? '')}
                              onChange={() => toggleAgentSelection(a.id ?? '')}
                              className="w-4 h-4 rounded border-gray-400 accent-[#7c43df] cursor-pointer transition-colors"
                            />
                          </div>
                        </td>
                        <td className={`px-4 ${densityClasses}`}>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={a.avatar}
                                className="w-10 h-10 rounded-full shadow-md object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
                                alt={`${a.name}'s avatar`}
                              />
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 transition-colors">{a.name}</div>
                              <div className="text-xs text-gray-500">{a.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 ${densityClasses} text-sm font-medium text-gray-700`}>{a.role}</td>
                        <td className={`px-4 ${densityClasses} text-xs text-gray-600`}>
                          <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-purple-500" />{a.email}</div>
                          <div className="flex items-center gap-1 text-gray-400"><Phone className="w-3 h-3" />{a.phone}</div>
                        </td>
                        <td className={`px-4 ${densityClasses} text-sm font-medium text-gray-700`}>{a.team}</td>
                        <td className={`px-4 ${densityClasses}`}>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-sm ${getStatusColor(a.status)}`}>{a.status}</span>
                        </td>
                        <td className={`px-4 ${densityClasses}`}>
                          <span className="font-bold text-gray-900">{a.ticketsClosed}</span>
                          <div className="text-xs text-gray-500">Tickets</div>
                        </td>
                        <td className={`px-4 ${densityClasses} text-sm font-medium text-gray-700`}>{a.avgResponseTime}</td>
                        <td className={`px-4 ${densityClasses}`}>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all"
                                style={{ width: `${a.performanceScore}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-purple-600 text-sm whitespace-nowrap">{a.performanceScore}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            loading ? (
              <ShimmerGridCards count={limit} />
            ) : (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredAgents.map((a: Agent) => (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAgentId(a.id ?? null)}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="p-5 pb-4 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={a.avatar}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
                              alt={`${a.name}'s avatar`}
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{a.name}</h3>
                            <p className="text-xs text-gray-500">{a.role}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(a.status)}`}>
                          {a.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>{a.team}</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{a.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{a.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{a.location}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <ClipboardCheck className="w-4 h-4 text-purple-600"/>
                            <span className="font-bold text-gray-900">{a.ticketsClosed}</span>
                          </div>
                          <div className="text-xs text-gray-500">Tickets</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-600"/>
                            <span className="font-bold text-green-600">{a.performanceScore}%</span>
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Clock className="w-4 h-4 text-blue-600"/>
                            <span className="font-bold text-gray-900 text-sm">{a.avgResponseTime.split(' ')[0]}</span>
                          </div>
                          <div className="text-xs text-gray-500">Avg</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <div className="bg-white rounded-b-xl border border-gray-200 px-4 py-3 flex items-center justify-between mt-0">
          <div className="text-sm text-gray-600">
            {(() => {
              const current = agents?.length ?? 0;
              const start = total > 0 ? (page - 1) * limit + 1 : 0;
              const end = total > 0 ? start + current - 1 : 0;
              return `Showing ${start}–${end} of ${total} agents`;
            })()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load({ page: 1, limit })}
              disabled={page <= 1}
              className={`px-2 py-1 text-sm font-semibold rounded-lg transition-all bg-white/60 backdrop-blur-md border border-gray-200 text-gray-700 hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              «
            </button>
            <button
              onClick={() => load({ page: Math.max(1, page - 1), limit })}
              disabled={page <= 1}
              className={`px-2 py-1 text-sm font-semibold rounded-lg transition-all bg-white/60 backdrop-blur-md border border-gray-200 text-gray-700 hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ‹
            </button>

            <div className="px-3 py-1 rounded-lg font-bold text-sm bg-white/70 backdrop-blur-md border-2 border-purple-400 text-purple-700 shadow-sm">{page}</div>

            <button
              onClick={() => load({ page: Math.min(Math.max(1, Math.ceil((total || 1) / limit)), page + 1), limit })}
              disabled={page >= Math.ceil((total || 0) / limit)}
              className={`px-2 py-1 text-sm font-semibold rounded-lg transition-all bg-white/60 backdrop-blur-md border border-gray-200 text-gray-700 hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${page >= Math.ceil((total || 0) / limit) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ›
            </button>
            <button
              onClick={() => load({ page: Math.max(1, Math.ceil((total || 1) / limit)), limit })}
              disabled={page >= Math.ceil((total || 0) / limit)}
              className={`px-2 py-1 text-sm font-semibold rounded-lg transition-all bg-white/60 backdrop-blur-md border border-gray-200 text-gray-700 hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${page >= Math.ceil((total || 0) / limit) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              »
            </button>

            <select
              value={limit}
              onChange={(e) => load({ page: 1, limit: Number(e.target.value) })}
              className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <CreateAgentModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={(data) => { /* handle agent creation here */ }} 
        />
      </div>
    </div>
  );
};

export default AgentSystem;