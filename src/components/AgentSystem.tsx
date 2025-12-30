// AgentSystem.tsx

import React, { useState, lazy, Suspense, useContext, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Grid,
  List,
  Check,
  UserPlus,
  Download,
  ArrowLeft,
  XCircle,
  Copy,
  Edit,
} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { FilterIcon, DensityIcon, ColumnIcon, GridViewIcon, ListViewIcon, Editbutton, BlockIcon, DeleteIcon } from '../../public/assets/svg';

import useAgents, { Agent } from '../hooks/useAgents'; 
import { AppDispatch, RootState } from '../store/store';
import { updateAgentStatus, deleteAgent } from '../store/agentSlice';
import AgentQuickView from './AgentQuickView';
import AgentDetail from './AgentDetail';
import CreateAgentModal from './CreateAgentModal';
import { ReusableTable } from 'chatsupport-ui';
import type { TableColumn } from 'chatsupport-ui';
import AgentCardView from './AgentCardView';

const AgentSystem = () => {
  const dispatch = useDispatch<AppDispatch>();
  const deleteLoading = useSelector((state: RootState) => state.agents.loading);
  const { agents, loading, error, load, page, limit, total, search, setSearch } = useAgents();
  
  // Define columns for the reusable table to match AgentTableView
  const agentColumns: TableColumn[] = [
    {
      key: 'agent',
      label: 'Agent',
      width: 'auto',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={row.avatar}
              className="w-10 h-10 rounded-full shadow-md object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
              alt={`${row.name}'s avatar`}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div className="font-semibold transition-colors" style={{ color: '#2b2b2b' }}>{row.name}</div>
            <div className="text-xs" style={{ color: '#2b2b2b' }}>{row.agentId}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      width: 'auto',
      render: (value: any, row: any) => (
        <span className="text-sm font-medium pb-[2px] hover:underline" style={{ color: '#2b2b2b' }}>
          {row.role}
        </span>
      )
    },
    {
      key: 'email',
      label: 'Email',
      width: 'auto',
      render: (value: any, row: any) => (
        <div className="flex text-[14px] font-medium items-center gap-1" style={{ color: '#2b2b2b' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {row.email}
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      width: 'auto',
      render: (value: any, row: any) => (
        <div className="flex text-[13px] font-medium items-center gap-1" style={{ color: '#2b2b2b' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {row.phone}
        </div>
      )
    },
    {
      key: 'team',
      label: 'Team',
      width: 'auto',
      render: (value: any, row: any) => (
        <span className="text-sm font-medium" style={{ color: '#2b2b2b' }}>
          {row.team}
        </span>
      )
    },
    {
      key: 'account_status',
      label: 'account_status',
      width: 'auto',
      render: (value: any, row: any) => (
        <span className={`px-2 py-0.5 rounded-full text-[14px] font-bold tracking-wider shadow-sm ${row.statusColor}`}>
          {row.account_status}
        </span>
      )
    },
    {
      key: 'tickets',
      label: 'Tickets',
      width: 'auto',
      render: (value: any, row: any) => (
        <div style={{ color: '#2b2b2b' }}>
          <span className="font-bold">{row.ticketsClosed}</span>
          <div className="text-xs">Tickets</div>
        </div>
      )
    },
    {
      key: 'avgResponseTime',
      label: 'Avg. Response',
      width: 'auto',
      render: (value: any, row: any) => (
        <span className="text-sm font-medium" style={{ color: '#2b2b2b' }}>
          {row.avgResponseTime}
        </span>
      )
    },
    {
  key: 'active',
  label: 'Active',
  width: 'auto',
  render: (value: any, row: any) => (
    <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        checked={agentActiveState[row.id] || false}  // <-- This might be undefined
        disabled={pendingUpdates.has(row.id)}
        onChange={(e) => {
          e.stopPropagation();
          handleToggleActive(row.id, !agentActiveState[row.id]);
        }}
        className="sr-only peer"
      />
      <div className={`w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${pendingUpdates.has(row.id) ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
    </label>
  )
},
    {
      key: 'actions',
      label: 'Actions',
      width: 'auto',
      render: (value: any, row: any) =>  (<div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit:', row.id);
            }}
            className="p-1.5 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            style={{ color: '#2b2b2b' }}
            title="Edit"
          >
            <Editbutton></Editbutton>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBlockAgent(row.id);
            }}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            style={{ color: '#2b2b2b' }}
            title="Block"
          >
       <BlockIcon></BlockIcon>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModalOpen(true);
              setAgentToDelete(row);
            }}
            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            style={{ color: '#2b2b2b' }}
            title="Delete"
          >
            <DeleteIcon></DeleteIcon>
          </button>
        </div>)
      
    }
  ];
  
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
  const [agentActiveState, setAgentActiveState] = useState<Record<string, boolean>>({});
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<any>(null);

  const densityClasses = useMemo(() => {
    switch (density) {
      case 'Compact': return 'py-1 text-sm';
      case 'Standard': return 'py-2.5 text-sm';
      case 'Comfortable': return 'py-4 text-sm';
      default: return 'py-2.5 text-sm';
    }
  }, [density]);

  const tabData = [
    { id: 'all', label: 'All', count: (agents || []).length },
    { id: 'active', label: 'Active', count: (agents || []).filter(a => (a.account_status || '').toLowerCase() === 'active').length },
    { id: 'inactive', label: 'Inactive', count: (agents || []).filter(a => (a.account_status || '').toLowerCase() === 'inactive').length },
    { id: 'block', label: 'Block', count: (agents || []).filter(a => (a.account_status || '').toLowerCase() === 'block' || (a.account_status || '').toLowerCase() === 'blocked').length },
  ];

  useEffect(() => {
    if (!tabData.some(tab => tab.id === activeTab)) {
      setActiveTab('active');
    }
  }, [activeTab, tabData]);

  // Initialize toggle state based on agent account_status
  useEffect(() => {
    const newState: Record<string, boolean> = {};
    agents?.forEach((agent) => {
      const agentId = agent.agent_id?.toString() || agent.id || '';
      newState[agentId] = (agent.account_status || '').toLowerCase() === 'active';
    });
    setAgentActiveState(newState);
  }, [agents]);

  const filteredAgents = (agents || []).filter(agent => {
    if (activeTab === 'all') return true;
    return (agent.account_status || '').toLowerCase() === activeTab.toLowerCase() ||
      (activeTab === 'block' && ((agent.account_status || '').toLowerCase() === 'blocked'));
  });

  const getStatusColor = (account_status: string) => {
    const normalizedStatus = (account_status || '').toLowerCase();
    const colors: Record<string, string> = {
      'active': 'bg-green-50 text-green-800 border border-green-200',
      'block': 'bg-red-50 text-red-800 border border-red-200',
      'blocked': 'bg-red-50 text-red-800 border border-red-200',
      'inactive': 'bg-blue-50 text-blue-800 border border-blue-200',
      'manager': 'bg-purple-50 text-purple-800 border border-purple-200',
      'training': 'bg-blue-50 text-blue-800 border border-blue-200',
      'new': 'bg-blue-50 text-blue-800 border border-blue-200',
    };
    return colors[normalizedStatus] || 'bg-gray-50 text-gray-800 border border-gray-200';
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
      setSelectedAgents(new Set(filteredAgents.map(a => a.agent_id?.toString() || a.id || '').filter(id => id)));
    }
  };


useEffect(() => {    console.log("agnet columns ", agentColumns);  }, [agentColumns]);

  const handleToggleActive = async (agentId: string, isActive: boolean): Promise<boolean> => {
    try {
      const newStatus = isActive ? 'active' : 'inactive';
      
      setPendingUpdates(prev => new Set(prev).add(agentId));
      
      const result = await dispatch(updateAgentStatus({
        agentId,
        account_status: newStatus,
      }));

      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(agentId);
        return next;
      });

      if (result.type.endsWith('/fulfilled')) {
        setAgentActiveState(prev => ({
          ...prev,
          [agentId]: isActive
        }));
        toast.success(`Agent account_status updated to ${newStatus}!`);
        return true;
      }
      
      setAgentActiveState(prev => ({
        ...prev,
        [agentId]: !isActive
      }));
      toast.error('Failed to update agent account_status');
      return false;
    } catch (error) {
      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(agentId);
        return next;
      });
      toast.error('Failed to update agent account_status');
      return false;
    }
  };

  const handleDeleteAgent = async (agentId: string): Promise<boolean> => {
    try {
      const result = await dispatch(deleteAgent({
        agentId,
      }));

      if (result.type.endsWith('/fulfilled')) {
        setDeleteModalOpen(false);
        setAgentToDelete(null);
        toast.success('Agent deleted successfully!');
        return true;
      }
      toast.error('Failed to delete agent');
      return false;
    } catch (error) {
      toast.error('Failed to delete agent');
      return false;
    }
  };

  const handleBlockAgent = async (agentId: string) => {
    try {
      const agent = agents?.find(a => (a.agent_id?.toString() || a.id) === agentId);
      const currentStatus = (agent?.account_status || '').toLowerCase();
      const newStatus = currentStatus === 'block' ? 'inactive' : 'block';
      
      setPendingUpdates(prev => new Set(prev).add(agentId));
      
      const result = await dispatch(updateAgentStatus({
        agentId: agentId,
        account_status: newStatus,
      }));

      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(agentId);
        return next;
      });
      
      if (result.type.endsWith('/fulfilled')) {
        toast.success(`Agent ${newStatus === 'block' ? 'blocked' : 'unblocked'} successfully!`);
      } else {
        toast.error('Failed to update agent account_status');
      }
    } catch (error) {
      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(agentId);
        return next;
      });
      toast.error('Failed to update agent account_status');
    }
  };

  useEffect(() => {
    console.log("Create modal open state changed:", isCreateModalOpen);
  }, [isCreateModalOpen]);

  const selectedAgent = (agents || []).find(a => (a.agent_id?.toString() || a.id) === selectedAgentId);

  const handleMouseEnter = (agentId: string) => {
    const agent = agents?.find((a) => (a.agent_id?.toString() || a.id) === agentId);
    if (agent) {
      setHoveredAgent(agentId);
      const rowElement = document.getElementById(`row-${agentId}`);
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
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedAgentId(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedAgent.name}</h1>
                <p className="text-sm text-gray-600 mt-0.5">{selectedAgent.role} • {selectedAgent.team}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full font-semibold text-sm ${
                selectedAgent.account_status === 'Active' 
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {selectedAgent.account_status || 'Inactive'}
              </span>
              <button className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200">
                <XCircle className="w-3.5 h-3.5" /> Deactivate User
              </button>
              <button className="flex items-center gap-2 text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm hover:bg-white transition-all">
                <Copy className="w-3.5 h-3.5 text-gray-400" /> Reset Password
              </button>
              <button className="flex items-center gap-2 bg-[#7c43df] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm hover:bg-[#6a36c4] transition-all">
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <AgentDetail agent={{
              ...selectedAgent,
              id: Number(selectedAgent.agent_id || selectedAgent.id),
              phone: selectedAgent.contact_no || selectedAgent.phone || '',
              location: selectedAgent.location || '',
              role: selectedAgent.role || 'Agent',
              team: selectedAgent.team || 'Unassigned',
              avatar: selectedAgent.profile_picture || selectedAgent.avatar || 'https://i.pravatar.cc/150?img=1',
              ticketsClosed: selectedAgent.tickets_count || selectedAgent.ticketsClosed || 0,
              avgResponseTime: selectedAgent.avgResponseTime || '0m 0s',
              performanceScore: selectedAgent.performanceScore || 0
            }} onClose={() => setSelectedAgentId(null)} />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              More Actions
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-xl hover:from-purple-700 hover:to-purple-600 transition-all duration-300 flex items-center gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add Agent
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 px-4 overflow-x-auto">
              {tabData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    load({ page: 1, limit });
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
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"> 
                <ColumnIcon />
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

              <div className="flex items-center gap-1 border-[0.5px] border-gray-300 bg-gray-100 rounded-lg p-1 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)]">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded-[8px] ${
                    viewMode === "list"
                      ? "bg-white shadow text-purple-600"
                      : "text-gray-600"
                  }`}
                >
                  <ListViewIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded-[8px] ${
                    viewMode === "grid"
                      ? "bg-white shadow text-purple-600"
                      : "text-gray-600"
                  }`}
                >
                  <GridViewIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "list" ? (
            <ReusableTable
              columns={agentColumns}
             rows={filteredAgents.map(agent => {
  const agentId = agent.agent_id?.toString() || agent.id || '';
  const rowData = {
    id: agentId,
    agentId: agentId,
    name: agent.name || 'Unknown',
    role: agent.role || '-',
    email: agent.email || '',
    phone: agent.contact_no || agent.phone || '',
    team: agent.team || '-',
    account_status: agent.account_status || 'inactive',
    statusColor: getStatusColor(agent.account_status || 'inactive'),
    ticketsClosed: agent.tickets_count || agent.ticketsClosed || 0,
    avgResponseTime: agent.avgResponseTime || '-',
    avatar: agent.avatar || 'https://i.pravatar.cc/150?img=1'
  };
  console.log('Row data:', rowData);
  return rowData;
})}
              loading={loading}
              limit={limit}
              densityClasses={densityClasses}
              selectedRows={selectedAgents}
              onSelectRow={toggleAgentSelection}
              onSelectAll={toggleAllAgents}
              onRowClick={setSelectedAgentId}
              keyField="id"
            />
          ) : (
            <AgentCardView
              agents={agents.map(a => ({
                ...a,
                specialties: a.specialties || [],
                rate: a.rate || 0,
                availability: a.availability || 'Offline',
              }))}
              loading={loading}
              limit={limit}
              filteredAgents={filteredAgents.map(a => ({
                ...a,
                specialties: a.specialties || [],
                rate: a.rate || 0,
                availability: a.availability || 'Offline',
              }))}
              getStatusColor={getStatusColor}
              setSelectedAgentId={setSelectedAgentId}
            />
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
              <option value={5}>5</option>
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

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-110">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h2 className="text-lg font-semibold mb-2">Delete Agent</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{agentToDelete?.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setAgentToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (agentToDelete) {
                      handleDeleteAgent(agentToDelete.id);
                    }
                  }}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentSystem;