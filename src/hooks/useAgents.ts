// hooks/useAgents.ts
import { useState, useEffect } from 'react';

// Define the Agent type for better typing
export interface Agent {
  id: string;
  avatar: string; // Dummy image URL
  name: string;
  role: 'Sales' | 'Support' | 'Tech' | 'Manager';
  team: string;
  email: string;
  phone: string;
  location: string;
  status: 'Active' | 'On Leave' | 'Training' | 'New';
  ticketsClosed: number;
  avgResponseTime: string; // e.g., '3m 20s'
  performanceScore: number; // 0-100
}

// Generate dummy agent data
const createDummyAgents = (count: number): Agent[] => {
  const roles: Agent['role'][] = ['Sales', 'Support', 'Tech', 'Manager'];
  const teams = ['Alpha', 'Beta', 'Gamma', 'Delta'];
  const statuses: Agent['status'][] = ['Active', 'On Leave', 'Training', 'New'];

  return Array.from({ length: count }, (_, i) => ({
    id: `A${1000 + i}`,
    avatar: `https://i.pravatar.cc/150?img=${i + 1}`, // Dummy avatars
    name: `Agent Name ${i + 1}`,
    role: roles[i % roles.length],
    team: teams[i % teams.length],
    email: `agent${i + 1}@example.com`,
    phone: `+1 555-00${1000 + i}`,
    location: i % 3 === 0 ? 'Remote' : 'Office A',
    status: statuses[i % statuses.length],
    ticketsClosed: Math.floor(Math.random() * 200) + 50,
    avgResponseTime: `${Math.floor(Math.random() * 10) + 1}m ${Math.floor(Math.random() * 59) + 1}s`,
    performanceScore: Math.floor(Math.random() * 40) + 60, // 60-100
  }));
};

const initialAgents: Agent[] = createDummyAgents(100);

// Mock useAgents hook
const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents.slice(0, 10));
    // Add agent function
    const addAgent = (agent: Agent) => {
      setAgents(prev => [agent, ...prev]);
      setTotal(prev => prev + 1);
    };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(initialAgents.length);
  const [search, setSearch] = useState('');

  const load = ({ page: newPage = page, limit: newLimit = limit, status = [], role = [] }: { page?: number, limit?: number, status?: string[], role?: string[] } = {}) => {
    setLoading(true);
    setPage(newPage);
    setLimit(newLimit);
    setError(null);
    
    // Simulate API delay
    setTimeout(() => {
      let filtered = initialAgents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) || 
                              agent.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status.length === 0 || status.includes(agent.status.toLowerCase());
        const matchesRole = role.length === 0 || role.includes(agent.role.toLowerCase());
        if (role.includes('manager')) {
          return matchesSearch && agent.role.toLowerCase() === 'manager';
        }
        return matchesSearch && matchesStatus && matchesRole;
      });

      setTotal(filtered.length);
      const startIndex = (newPage - 1) * newLimit;
      const endIndex = startIndex + newLimit;
      
      setAgents(filtered.slice(startIndex, endIndex));
      setLoading(false);
    }, 500);
  };

  // Re-load data when search changes
  useEffect(() => {
    load({ page: 1, limit });
  }, [search, limit]); // Added limit to dependency array for correct initial load

  return { agents, loading, error, load, page, limit, total, search, setSearch, addAgent };
};

export default useAgents;