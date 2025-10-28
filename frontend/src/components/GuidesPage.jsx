import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Eye, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';

const GuidesPage = () => {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchGuides();
  }, [categoryFilter]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const filters = categoryFilter !== 'All' ? { category: categoryFilter } : {};
      const data = await apiService.getGuides(filters);
      setGuides(data);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuideClick = async (guide) => {
    try {
      const fullGuide = await apiService.getGuide(guide.slug);
      setSelectedGuide(fullGuide);
    } catch (error) {
      console.error('Error fetching guide details:', error);
    }
  };

  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['All', 'Basics', 'Equipment', 'Safety', 'Techniques', 'Locations'];

  if (selectedGuide) {
    return (
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Back Button */}
          <button
            onClick={() => setSelectedGuide(null)}
            className="mb-6 flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Guides</span>
          </button>

          {/* Guide Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {selectedGuide.featured_image && (
              <img
                src={selectedGuide.featured_image}
                alt={selectedGuide.title}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {selectedGuide.category}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {selectedGuide.difficulty_level}
                </span>
                <div className="flex items-center text-slate-500 text-sm ml-auto">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{selectedGuide.view_count} views</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                {selectedGuide.title}
              </h1>

              <div className="prose max-w-none text-slate-700">
                {selectedGuide.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span>Educational Guides</span>
          </h1>
          <p className="text-slate-600">
            Learn about safe and responsible vivac practices in the mountains
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No guides found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => handleGuideClick(guide)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {guide.featured_image && (
                  <img
                    src={guide.featured_image}
                    alt={guide.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {guide.category}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {guide.difficulty_level}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {guide.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{guide.view_count} views</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-2">
            🌲 Vivac Responsable
          </h3>
          <p className="text-green-700 text-sm">
            Remember: Always practice Leave No Trace principles, respect local regulations, 
            and prioritize safety when camping in the mountains. Check weather conditions 
            and inform someone of your plans before heading out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;

