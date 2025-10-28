import React, { useState, useEffect } from 'react';
import { User, Mail, Award, Mountain, Package, Settings, Save } from 'lucide-react';
import { apiService } from '../services/api';

const ProfilePage = ({ user: propUser }) => {
  const [user, setUser] = useState(propUser || {});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    experience_level: 'Beginner',
    equipment: [],
    preferences: {}
  });

  useEffect(() => {
    if (propUser) {
      // Ensure equipment is always an array
      const userWithSafeEquipment = {
        ...propUser,
        equipment: Array.isArray(propUser.equipment) ? propUser.equipment : []
      };
      setUser(userWithSafeEquipment);
      setFormData({
        name: propUser.name || '',
        description: propUser.description || '',
        experience_level: propUser.experience_level || 'Beginner',
        equipment: Array.isArray(propUser.equipment) ? propUser.equipment : [],
        preferences: propUser.preferences || {}
      });
    } else {
      fetchProfile();
    }
  }, [propUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await apiService.getUserProfile();
      if (profile) {
        // Ensure equipment is always an array
        const profileWithSafeEquipment = {
          ...profile,
          equipment: Array.isArray(profile.equipment) ? profile.equipment : []
        };
        setUser(profileWithSafeEquipment);
        setFormData({
          name: profile.name || '',
          description: profile.description || '',
          experience_level: profile.experience_level || 'Beginner',
          equipment: Array.isArray(profile.equipment) ? profile.equipment : [],
          preferences: profile.preferences || {}
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await apiService.updateUserProfile(formData);
      
      if (result.success && result.user) {
        setUser(result.user);
        setEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentToggle = (item) => {
    setFormData(prev => ({
      ...prev,
      equipment: (Array.isArray(prev.equipment) ? prev.equipment : []).includes(item)
        ? (Array.isArray(prev.equipment) ? prev.equipment : []).filter(e => e !== item)
        : [...(Array.isArray(prev.equipment) ? prev.equipment : []), item]
    }));
  };

  const equipmentOptions = [
    'Sleeping Bag',
    'Tent',
    'Bivvy Bag',
    'Backpack',
    'GPS Device',
    'First Aid Kit',
    'Water Filter',
    'Camping Stove',
    'Headlamp',
    'Trekking Poles'
  ];

  if (loading && !user.id) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{user.name || 'User Profile'}</h1>
                <p className="text-slate-600">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {user.role || 'Explorer'}
                </span>
              </div>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {editing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{user.total_routes || 0}</div>
              <div className="text-sm text-slate-600">Routes Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user.total_distance || '0 km'}</div>
              <div className="text-sm text-slate-600">Total Distance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{user.experience_level || 'Beginner'}</div>
              <div className="text-sm text-slate-600">Experience Level</div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <p className="text-slate-800">{user.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
              {editing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-slate-800">{user.description || 'No bio yet'}</p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center space-x-2">
                <Mountain className="w-4 h-4" />
                <span>Experience Level</span>
              </label>
              {editing ? (
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              ) : (
                <p className="text-slate-800">{user.experience_level || 'Beginner'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Equipment</span>
          </h2>

          {editing ? (
            <div className="grid grid-cols-2 gap-3">
              {equipmentOptions.map((item) => (
                <label key={item} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Array.isArray(formData.equipment) ? formData.equipment.includes(item) : false}
                    onChange={() => handleEquipmentToggle(item)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-slate-700">{item}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(user.equipment && Array.isArray(user.equipment) && user.equipment.length > 0) ? (
                user.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">No equipment listed</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

