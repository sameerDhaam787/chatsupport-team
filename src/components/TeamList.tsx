import React from 'react';
import { Users, Plus, Mail, Phone } from 'lucide-react';

const TeamList = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Jones',
      role: 'Senior Support Agent',
      email: 'sarah.jones@company.com',
      phone: '+1 234 567 8900',
      avatar: 'SJ',
      status: 'online',
      tickets: 24,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Support Agent',
      email: 'mike.chen@company.com',
      phone: '+1 234 567 8901',
      avatar: 'MC',
      status: 'online',
      tickets: 18,
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Aisha Khan',
      role: 'Support Agent',
      email: 'aisha.khan@company.com',
      phone: '+1 234 567 8902',
      avatar: 'AK',
      status: 'away',
      tickets: 15,
      rating: 4.7,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your support team members</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            {/* Avatar & Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                  {member.avatar}
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                member.status === 'online' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {member.status}
              </span>
            </div>

            {/* Info */}
            <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{member.role}</p>

            {/* Contact */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {member.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {member.phone}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{member.tickets}</p>
                <p className="text-xs text-gray-500">Active Tickets</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{member.rating}</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
