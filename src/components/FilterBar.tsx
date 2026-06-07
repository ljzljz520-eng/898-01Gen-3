import { X, Filter } from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';
import { DISEASE_STAGES, MEDICATION_EXPERIENCES, CITIES } from '@/utils/categoryMap';

export function FilterBar() {
  const filters = useContentStore(state => state.filters);
  const setFilters = useContentStore(state => state.setFilters);

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    const current = filters[category];
    const newValues = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters({ ...filters, [category]: newValues });
  };

  const clearFilters = () => {
    setFilters({
      diseaseStage: [],
      medicationExperience: [],
      reviewCity: []
    });
  };

  const hasActiveFilters = 
    filters.diseaseStage.length > 0 || 
    filters.medicationExperience.length > 0 || 
    filters.reviewCity.length > 0;

  const FilterGroup = ({ 
    title, 
    options, 
    category, 
    colorClass 
  }: { 
    title: string; 
    options: { value: string; label: string; color?: string }[]; 
    category: keyof typeof filters;
    colorClass: (value: string) => string;
  }) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <Filter className="w-3.5 h-3.5 text-gray-400" />
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const isActive = filters[category].includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => toggleFilter(category, option.value)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                isActive
                  ? colorClass(option.value) + ' border-transparent shadow-sm scale-105'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {option.label}
              {isActive && <X className="w-3 h-3 inline ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">筛选经验</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-teal-600 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            清除筛选
          </button>
        )}
      </div>

      <div className="space-y-5">
        <FilterGroup
          title="疾病阶段"
          options={DISEASE_STAGES}
          category="diseaseStage"
          colorClass={(value) => {
            const stage = DISEASE_STAGES.find(s => s.value === value);
            return stage?.color || 'bg-gray-100 text-gray-700';
          }}
        />

        <FilterGroup
          title="用药体验"
          options={MEDICATION_EXPERIENCES}
          category="medicationExperience"
          colorClass={() => 'bg-purple-100 text-purple-700'}
        />

        <FilterGroup
          title="复诊城市"
          options={CITIES.map(c => ({ value: c, label: c }))}
          category="reviewCity"
          colorClass={() => 'bg-cyan-100 text-cyan-700'}
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            已选择 {filters.diseaseStage.length + filters.medicationExperience.length + filters.reviewCity.length} 个筛选条件
          </p>
        </div>
      )}
    </div>
  );
}
