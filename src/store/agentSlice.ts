// Params for fetchAgentTickets thunk
interface FetchAgentTicketsParams {
  agent_id: number;
  app_id: string;
  page?: number;
  limit?: number;
  search?: string;
  user_id?: number;
  user_role?: string;
  priority?: string[];
  account_status?: string[];
  category?: number;
  sort_by?: string;
  sort_order?: string;
  start_date?: string;
  end_date?: string;
}
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AgentDetail from '../components/AgentDetail';
import { apiClient } from '../services/apiClient';


// Thunk to fetch agent tickets
export const fetchAgentTickets = createAsyncThunk(
  'agents/fetchAgentTickets',
  async (
    params: FetchAgentTicketsParams,
    { rejectWithValue }
  ) => {
    const {
      agent_id,
      app_id,
      page = 1,
      limit = 10,
      search = '',
      user_id = 1,
      user_role = 'agent',
      priority = [],
      account_status = [],
      category = [],
      sort_by = '',
      sort_order = 'desc',
      start_date = '',
      end_date = '',
    } = params;

    const payload = {
      search,
      app_id,
      agent_id,
      user_id,
      user_role,
      priority,
      account_status,
      category,
      sort_by,
      sort_order,
      start_date,
      end_date,
      page,
      limit,
    };



    

    const response = await apiClient.post(
      `/tickets/agent/`,
      payload
    );

    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to fetch agent tickets');
    }

    return response.data;
  }
);
// Thunk to fetch agent detail
export const fetchAgentDetail = createAsyncThunk(
  'agents/fetchAgentDetail',
  async (
    { agent_id, app_id }: { agent_id: number; app_id: string },
    { rejectWithValue }
  ) => {
    const response = await apiClient.post(
      '/agent/detail/page',
      { agent_id, app_id }
    );

    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to fetch agent detail');
    }

    return response.data;
  }
);

export interface Ticket {
  ticket_id: number;
  title: string;
  account_status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface agentDetail {
  agent_id: number;
  app_id: string;
  name: string;
  status_id: number;
  account_status: string;
  address: string;
  performance_score: number;
  profile_picture: string;
  email: string;
  contact_no: string;
  last_active: string;
  tickets_count: number;
  ticket_page: number;
  ticket_limit: number;
  tickets: Ticket[];
  // For UI compatibility
  id?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  team?: string;
  role?: string;
  ticketsClosed?: number;
  agent_rating: number;
  avgResponseTime?: string;
  performanceScore?: number;
}



export interface Agent {
  agent_id: number;
  app_id: string;
  name: string;
  status_id: number;
  account_status: string;
  address: string;
  performance_score: number;
  profile_picture: string;
  email: string;
  contact_no: string;
  last_active: string;
  tickets_count: number;
  ticket_page: number;
  ticket_limit: number;
  tickets: Ticket[];
  // For UI compatibility
  id?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  team?: string;
  role?: string;
  ticketsClosed?: number;
  avgResponseTime?: string;
  performanceScore?: number;
}


export interface AgentState {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  search: string;
  filters: {
    account_status: string[];
  };
  agentDetail: AgentDetail | null;
  agentDetailLoading: boolean;
  agentDetailError: string | null;
  agentTickets: any[];
  agentTicketsTotal: number;
  agentTicketsLoading: boolean;
  agentTicketsError: string | null;
}

const initialState: AgentState = {
  agents: [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  search: '',
  filters: {
    account_status: [],
  },
  agentDetail: null,
  agentDetailLoading: false,
  agentDetailError: null,
  agentTickets: [],
  agentTicketsTotal: 0,
  agentTicketsLoading: false,
  agentTicketsError: null,
};

interface FetchAgentsParams {
  search?: string;
  account_status?: string[];
  page?: number;
  limit?: number;
  app_id?: string;
  start_date?: string;
  end_date?: string;
  sort_order?: 'asc' | 'desc';
  ticket_page?: number;
  ticket_limit?: number;
}

export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (params: FetchAgentsParams, { rejectWithValue }) => {
    const response = await apiClient.post('/agent/', {
      search: params.search || '',
      account_status: params.account_status || [],
      app_id: params.app_id || 'fastapi-6222d6',
      start_date: params.start_date || '',
      end_date: params.end_date || '',
      sort_order: params.sort_order || 'asc',
      page: params.page || 1,
      limit: params.limit || 10,
      ticket_page: params.ticket_page || 1,
      ticket_limit: params.ticket_limit || 10,
    });

    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to fetch agents');
    }

    return response.data;
  }
);

interface UpdateStatusParams {
  agentId: string | number;
  account_status: string;
  appId?: string;
}

export const updateAgentStatus = createAsyncThunk(
  'agents/updateStatus',
  async (params: UpdateStatusParams, { rejectWithValue }) => {
    const appId = params.appId || 'fastapi-6222d6';
    const response = await apiClient.put(
      `/agent/status`,
      { 
        app_id: appId,
      agent_id: params.agentId,
       status: params.account_status
       }
    );

    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to update agent account_status');
    }

    return { agentId: params.agentId, account_status: params.account_status, ...response.data };
  }
);

interface DeleteAgentParams {
  agentId: string | number;
  appId?: string;
}

export const deleteAgent = createAsyncThunk(
  'agents/deleteAgent',
  async (params: DeleteAgentParams, { rejectWithValue }) => {
    const appId = params.appId || 'fastapi-6222d6';
    const response = await apiClient.post(
      `/agent/delete`,
      {
        app_id: appId,
        agent_id: params.agentId,
      }
    );

    if (!response.success) {
      return rejectWithValue(response.error || 'Failed to delete agent');
    }

    return { agentId: params.agentId, ...response.data };
  }
);

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // Reset to first page on search
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset to first page on limit change
    },
    setStatusFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.account_status = action.payload;
      state.page = 1; // Reset to first page on filter change
    },
  },
  extraReducers: (builder) => {
    builder
      // Agent Detail
      .addCase(fetchAgentDetail.pending, (state) => {
        state.agentDetailLoading = true;
        state.agentDetailError = null;
        state.agentDetail = null;
      })
      .addCase(fetchAgentDetail.fulfilled, (state, action) => {
        state.agentDetailLoading = false;
        const agent = action.payload;
        if (agent) {
          // Map API fields to UI fields, but keep all original fields for type compatibility
          state.agentDetail = {
            ...agent,
            id: agent.agent_id || agent.id,
            name: agent.agent_name || agent.name,
            phone: agent.contact_no || agent.phone,
            location: agent.address || agent.location,
            role: agent.role || 'Agent',
            team: agent.team || 'Unassigned',
            account_status: agent.account_status || '',
            agent_rating: agent.agent_rating ? Number(agent.agent_rating).toFixed(1) : '0.0',
            avatar:  `https://i.pravatar.cc/150?img=${(agent.agent_id || agent.id || 1) % 70 + 1}`,
            ticketsClosed: agent.total_tickets || 0,
            avgResponseTime: agent.avg_response_time ? String(Math.floor(agent.avg_response_time)) : '0',
            performanceScore: agent.performance_score || 0,
          };
        } else {
          state.agentDetail = null;
        }
      })
      .addCase(fetchAgentDetail.rejected, (state, action) => {
        state.agentDetailLoading = false;
        state.agentDetailError = action.payload as string;
      })
      // Agent Tickets
      .addCase(fetchAgentTickets.pending, (state) => {
        state.agentTicketsLoading = true;
        state.agentTicketsError = null;
        state.agentTickets = [];
        state.agentTicketsTotal = 0;
      })
      .addCase(fetchAgentTickets.fulfilled, (state, action) => {
        state.agentTicketsLoading = false;
        // API response may have tickets in different field, adapt as needed
        state.agentTickets = action.payload.tickets || action.payload.data || [];
        state.agentTicketsTotal = action.payload.total_records || action.payload.total || action.payload.total_tickets || (state.agentTickets ? state.agentTickets.length : 0);
      })
      .addCase(fetchAgentTickets.rejected, (state, action) => {
        state.agentTicketsLoading = false;
        state.agentTicketsError = action.payload as string;
        state.agentTicketsTotal = 0;
      })
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        // Transform API response to match UI expectations
        const transformedAgents = (action.payload.agents || []).map((agent: any, index: number) => {
          // Use dummy avatar - always fallback since DB images aren't working
          const dummyAvatarIndex = (index % 70) + 1; // Use avatars 1-70
          return {
            ...agent,
            id: String(agent.agent_id || agent.id),
            avatar: `https://i.pravatar.cc/150?img=${dummyAvatarIndex}`,
            phone: agent.contact_no || agent.phone || '',
            location: agent.address || agent.location || '',
            team: agent.team || 'Unassigned',
            role: agent.role || 'Agent',
            ticketsClosed: agent.tickets_count || 0,
            performanceScore: agent.performance_score || 0,
            avgResponseTime: agent.avgResponseTime || '0m 0s',
            specialties: agent.specialties || [],
            rate: agent.rate || 0,
            availability: agent.last_active ? 'Online' : 'Offline',
          };
        });
        state.agents = transformedAgents;
        state.total = action.payload.total_agents || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAgentStatus.fulfilled, (state, action) => {
        // Update the agent account_status in the state
        const agentIndex = state.agents.findIndex(
          (agent) => (agent.id || agent.agent_id) === action.payload.agentId
        );
        if (agentIndex !== -1) {
          state.agents[agentIndex].account_status = action.payload.account_status;
        }
      })
      .addCase(updateAgentStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteAgent.fulfilled, (state, action) => {
        // Remove the deleted agent from the state
        state.agents = state.agents.filter(
          (agent) => (agent.id || agent.agent_id) !== action.payload.agentId
        );
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteAgent.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSearch, setPage, setLimit, setStatusFilter } = agentSlice.actions;
export default agentSlice.reducer;
