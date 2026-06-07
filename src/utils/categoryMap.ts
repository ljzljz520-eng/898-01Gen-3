export const DISEASE_STAGES = [
  { value: '初诊', label: '初诊阶段', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: '治疗中', label: '治疗中', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: '康复期', label: '康复期', color: 'bg-green-100 text-green-700 border-green-200' }
];

export const MEDICATION_EXPERIENCES = [
  { value: '刚开始用药', label: '刚开始用药' },
  { value: '长期用药', label: '长期用药' },
  { value: '换药调整', label: '换药调整' },
  { value: '停药观察', label: '停药观察' }
];

export const CITIES = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '成都',
  '武汉', '西安', '重庆', '天津', '苏州', '长沙', '郑州'
];

export const SENSITIVE_TYPE_LABELS: Record<string, string> = {
  prescription: '涉及处方',
  dosage: '涉及剂量',
  privacy: '涉及隐私',
  medicalAdvice: '医疗建议'
};

export const getStageColor = (stage: string) => {
  const found = DISEASE_STAGES.find(s => s.value === stage);
  return found?.color || 'bg-gray-100 text-gray-700 border-gray-200';
};
