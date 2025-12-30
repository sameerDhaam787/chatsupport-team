import React from "react";
import {
  Mail,
  Phone,
  Star,
  Building,
  Users,
  Clock,
  ClipboardCheck,
  MapPin,
} from "lucide-react";
import { Agent } from "../hooks/useAgents";
import { ShimmerGridCards } from "./Shimmer";

interface AgentCardViewProps {
  agents: Agent[];
  loading: boolean;
  limit: number;
  filteredAgents: Agent[];
  getStatusColor: (status: string) => string;
  setSelectedAgentId: (id: string | null) => void;
}

const AgentCardView: React.FC<AgentCardViewProps> = ({
  loading,
  limit,
  filteredAgents,
  getStatusColor,
  setSelectedAgentId,
}) => {
  if (loading) {
    return (
      <div className="overflow-y-auto max-h-[calc(100vh-350px)] p-6">
        <ShimmerGridCards count={limit} />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-350px)] p-6 custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAgents.map((a: Agent) => {
          // FIX: Ensure we use account_status to match your Table View data
          const currentStatus =
            a.account_status || (a as any).status || "inactive";
          const rating = (a.performanceScore / 20).toFixed(1);

          return (
            <div
              key={a.id}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => setSelectedAgentId(a.id ?? null)}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={a.avatar}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                        alt={a.name}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-50 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base truncate mb-0.5">
                        {a.name}
                      </h3>
                      <p className="text-gray-500 text-xs truncate">
                        {a.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status and Rating */}
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      currentStatus
                    )}`}
                  >
                    <div className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></div>
                    {currentStatus}
                  </span>

                  <div
                    className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
                      Number((a?.agent_rating || 0).toFixed(1)) >= 4
                        ? "bg-green-50 text-green-600"
                        : Number((a?.agent_rating || 0).toFixed(1)) >= 3
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    <span className="text-sm font-bold">{Number(a?.agent_rating || 0).toFixed(1)}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-0.5">
                      <ClipboardCheck className="w-3 h-3 text-blue-600" />
                      <p className="text-gray-500 text-[10px] font-medium">
                        Tickets
                      </p>
                    </div>
                    <p className="text-blue-600 font-bold text-base">
                      {a.ticketsClosed}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Clock className="w-3 h-3 text-purple-600" />
                      <p className="text-gray-500 text-[10px] font-medium">
                        Response
                      </p>
                    </div>
                    <p className="text-purple-600 font-bold text-base">
                      {a.avgResponseTime}
                    </p>
                  </div>
                </div>

                {/* Department/Team */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-[10px] uppercase font-bold">
                      Role
                    </p>
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700 font-medium text-xs truncate">
                        {a.role}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-1 min-w-0">
                    <p className="text-gray-400 text-[10px] uppercase font-bold">
                      Team
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700 font-medium text-xs truncate">
                        {a.team}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FIX: Progress Bar Animation */}
     
            {/* Performance Score Bar */}
<div className="mb-2">
  <div className="flex items-center justify-between mb-1">
    <p className="text-gray-500 text-[10px] font-medium">Performance</p>
    <span className="text-gray-900 font-bold text-xs">{a.performanceScore}%</span>
  </div>

  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
    <div
      className="h-full rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 relative"
      style={{
        width: `${a.performanceScore}%`,
        // This triggers the "grow" effect on mount
        animation: 'growBar 1.5s ease-out forwards'
      }}
    >
      {/* Shimmer Layer */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          animation: "shimmer 2s infinite",
          backgroundSize: "200% 100%",
        }}
      ></div>
    </div>
  </div>
</div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${a.email}`;
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-xs font-semibold"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${a.phone}`;
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#7c43df] hover:bg-[#6a36c4] text-white rounded-lg transition-colors text-xs font-semibold shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentCardView;
