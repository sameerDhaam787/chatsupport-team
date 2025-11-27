// CreateAgentModal.tsx
import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  Calendar,
  Shield,
  AlertCircle,
  Check,
  Camera,
  Building,
} from 'lucide-react';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    team: '',
    location: '',
    department: '',
    status: 'Active',
    startDate: '',
    expertise: [] as string[],
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = ['Agent', 'Senior Agent', 'Team Lead', 'Manager', 'Supervisor'];
  const teams = ['Support Team A', 'Support Team B', 'Technical Support', 'Sales Support', 'Customer Success'];
  const departments = ['Customer Service', 'Technical', 'Sales', 'Billing', 'Operations'];
  const expertiseOptions = ['Technical Support', 'Billing', 'Account Management', 'Product Knowledge', 'Customer Relations'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleExpertise = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(skill)
        ? prev.expertise.filter(s => s !== skill)
        : [...prev.expertise, skill]
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }
    
    if (step === 2) {
      if (!formData.role) newErrors.role = 'Role is required';
      if (!formData.team) newErrors.team = 'Team is required';
      if (!formData.department) newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
      onClose();
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        team: '',
        location: '',
        department: '',
        status: 'Active',
        startDate: '',
        expertise: [],
      });
      setAvatarPreview(null);
      setCurrentStep(1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="relative bg-white border-b border-gray-200 px-6 py-5">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="pr-10">
              <h2 className="text-2xl font-bold text-gray-900">Add New Agent</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in the details to create a new team member</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { num: 1, label: 'Personal' },
                { num: 2, label: 'Work' },
                { num: 3, label: 'Review' }
              ].map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-all ${
                      currentStep >= step.num 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                    </div>
                    <span className={`text-xs font-medium hidden sm:inline ${
                      currentStep >= step.num ? 'text-purple-600' : 'text-gray-500'
                    }`}>{step.label}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`flex-1 h-0.5 transition-all ${
                      currentStep > step.num ? 'bg-purple-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-purple-300" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-purple-700 shadow-lg transition-all hover:scale-110">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@company.com"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="New York, USA"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Work Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none ${
                      errors.role ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select a role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.role}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Team <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none ${
                      errors.team ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select a team</option>
                    {teams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
                {errors.team && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.team}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none ${
                      errors.department ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select a department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.department}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Initial Status
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Training">Training</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Expertise & Final Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Areas of Expertise
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {expertiseOptions.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleExpertise(skill)}
                      className={`px-4 py-3 rounded-lg border-2 text-left transition-all ${
                        formData.expertise.includes(skill)
                          ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                          : 'border-gray-200 hover:border-purple-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{skill}</span>
                        {formData.expertise.includes(skill) && (
                          <Check className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-600" />
                  Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-900">{formData.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-900">{formData.email || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-semibold text-gray-900">{formData.role || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team:</span>
                    <span className="font-semibold text-gray-900">{formData.team || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-semibold text-gray-900">{formData.department || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-white">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={currentStep === 1 ? onClose : handleBack}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </button>
              
              <div className="flex items-center gap-3">
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    style={{ background: 'linear-gradient(135deg, #7c43df 0%, #9b6edb 100%)' }}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #7c43df 0%, #9b6edb 100%)' }}
                  >
                    <Check className="w-4 h-4" />
                    Create Agent
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAgentModal;