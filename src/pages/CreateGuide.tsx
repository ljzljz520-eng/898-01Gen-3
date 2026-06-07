import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Search, Plus, Trash2, Save,
  Image, FileText, AlertCircle, Check
} from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';
import { Disclaimer } from '@/components/Disclaimer';
import { Modal } from '@/components/Modal';
import { getStageColor } from '@/utils/categoryMap';

export default function CreateGuide() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperiences, setSelectedExperiences] = useState<{ experienceId: string; sectionTitle: string }[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const currentUser = useContentStore(state => state.currentUser);
  const experiences = useContentStore(state => state.experiences);
  const createGuide = useContentStore(state => state.createGuide);
  const addExperienceToGuide = useContentStore(state => state.addExperienceToGuide);
  const users = useContentStore(state => state.users);

  const publishedExperiences = useMemo(() => {
    return experiences
      .filter(e => e.status === 'published')
      .filter(e => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return e.title.toLowerCase().includes(term) || e.content.toLowerCase().includes(term);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [experiences, searchTerm]);

  const isFormValid = 
    title.trim().length >= 5 && 
    description.trim().length >= 20 && 
    selectedExperiences.length >= 1;

  const addToGuide = (experienceId: string) => {
    const exp = experiences.find(e => e.id === experienceId);
    if (exp && !selectedExperiences.find(s => s.experienceId === experienceId)) {
      setSelectedExperiences([...selectedExperiences, {
        experienceId,
        sectionTitle: exp.title
      }]);
    }
  };

  const removeFromGuide = (experienceId: string) => {
    setSelectedExperiences(selectedExperiences.filter(s => s.experienceId !== experienceId));
  };

  const updateSectionTitle = (experienceId: string, newTitle: string) => {
    setSelectedExperiences(selectedExperiences.map(s => 
      s.experienceId === experienceId 
        ? { ...s, sectionTitle: newTitle }
        : s
    ));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...selectedExperiences];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newItems.length) return;
    
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setSelectedExperiences(newItems);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const newGuide = createGuide({
      title: title.trim(),
      description: description.trim(),
      coverImage: coverImage.trim() || `https://picsum.photos/seed/${Date.now()}/800/400`,
      curatorId: currentUser.id,
      entries: []
    });

    selectedExperiences.forEach((item, index) => {
      addExperienceToGuide(newGuide.id, item.experienceId, item.sectionTitle || '未命名章节');
    });

    setShowSuccessModal(true);
  };

  const getAuthor = (userId: string) => users.find(u => u.id === userId);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('zh-CN');

  if (currentUser.role !== 'moderator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">权限不足</h2>
          <p className="text-gray-500 mb-4">只有版主可以创建入门指南</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30">
      <Disclaimer variant="banner" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/guides')}
          className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回指南列表</span>
        </button>

        <div className="mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 
                className="text-3xl font-bold text-gray-800"
                style={{ fontFamily: 'LXGW WenKai, serif' }}
              >
                创建入门指南
              </h1>
              <p className="text-gray-500">整理高质量经验，帮助更多同路人</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                指南基本信息
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    指南标题 *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例如：新手指南：从初诊到治疗的完整 roadmap"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">至少5个字符</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    指南描述 *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="简要介绍这份指南的内容和价值，帮助读者快速了解是否适合自己..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">至少20个字符</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    封面图片（可选）
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="输入图片URL，留空将自动生成"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                    <div className="w-24 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                      <Image className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                已选经验 ({selectedExperiences.length})
              </h3>

              {selectedExperiences.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Plus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>还没有选择经验</p>
                  <p className="text-sm">从右侧列表中选择高质量经验加入指南</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedExperiences.map((item, index) => {
                    const exp = experiences.find(e => e.id === item.experienceId);
                    const author = exp ? getAuthor(exp.userId) : null;
                    return (
                      <div 
                        key={item.experienceId}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={item.sectionTitle}
                              onChange={(e) => updateSectionTitle(item.experienceId, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-medium mb-2"
                              placeholder="章节标题"
                            />
                            {exp && (
                              <>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {exp.title}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span>原作者：{author?.nickname}</span>
                                  <span>{formatDate(exp.createdAt)}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs border ${getStageColor(exp.diseaseStage)}`}>
                                    {exp.diseaseStage}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveItem(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveItem(index, 'down')}
                              disabled={index === selectedExperiences.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => removeFromGuide(item.experienceId)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.3s_both] sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-teal-500" />
                选择经验
              </h3>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索经验..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {publishedExperiences.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">没有找到相关经验</p>
                  </div>
                ) : (
                  publishedExperiences.map((exp) => {
                    const author = getAuthor(exp.userId);
                    const isSelected = selectedExperiences.some(s => s.experienceId === exp.id);
                    return (
                      <div
                        key={exp.id}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 border-purple-200'
                            : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                        }`}
                        onClick={() => !isSelected && addToGuide(exp.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                              {exp.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{author?.nickname}</span>
                              <span className={`px-1.5 py-0.5 rounded-full ${getStageColor(exp.diseaseStage)}`}>
                                {exp.diseaseStage}
                              </span>
                            </div>
                          </div>
                          {isSelected ? (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <button
                              className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center flex-shrink-0 hover:border-purple-400 hover:bg-purple-50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToGuide(exp.id);
                              }}
                            >
                              <Plus className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-5 animate-[fadeInUp_0.5s_ease-out_0.4s_both]">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                创建规范
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>选择真实、有价值的高质量经验</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>章节标题要清晰，有逻辑性</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>必须保留原作者署名</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>确保内容不包含医疗建议</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl animate-[fadeInUp_0.5s_ease-out_0.5s_both]"
            >
              <Save className="w-5 h-5" />
              发布指南
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/guides');
        }}
        title="创建成功"
        type="success"
        onConfirm={() => navigate('/guides')}
        confirmText="查看指南"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-700 mb-2">指南创建成功！</p>
          <p className="text-sm text-gray-500">已收录 {selectedExperiences.length} 篇经验，感谢您的整理分享</p>
        </div>
      </Modal>
    </div>
  );
}
