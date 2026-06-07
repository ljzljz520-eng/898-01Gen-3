import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, AlertTriangle, Check, X, Clock, Eye, User,
  FileText, Trash2, ArrowLeft, Search
} from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';
import { Disclaimer } from '@/components/Disclaimer';
import { Modal } from '@/components/Modal';
import { SENSITIVE_TYPE_LABELS } from '@/utils/categoryMap';
import { highlightSensitiveContent } from '@/utils/sensitiveCheck';

export default function ReviewCenter() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filter, setFilter] = useState<'all' | 'prescription' | 'dosage' | 'privacy' | 'medicalAdvice'>('all');

  const experiences = useContentStore(state => state.experiences);
  const currentUser = useContentStore(state => state.currentUser);
  const approveExperience = useContentStore(state => state.approveExperience);
  const rejectExperience = useContentStore(state => state.rejectExperience);
  const getUserById = useContentStore(state => state.getUserById);

  const pendingExperiences = useMemo(() => {
    return experiences
      .filter(e => e.status === 'pending')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [experiences]);

  const filteredExperiences = pendingExperiences.filter(exp => {
    const matchesSearch = 
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || exp.sensitiveFlags.includes(filter);
    
    return matchesSearch && matchesFilter;
  });

  const selectedExperience = selectedId ? pendingExperiences.find(e => e.id === selectedId) : null;
  const selectedAuthor = selectedExperience ? getUserById(selectedExperience.userId) : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = (id: string) => {
    approveExperience(id);
    setSelectedId(null);
  };

  const handleReject = () => {
    if (selectedId) {
      rejectExperience(selectedId);
      setShowRejectModal(false);
      setSelectedId(null);
      setRejectReason('');
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedId(id);
    setShowRejectModal(true);
  };

  if (currentUser.role !== 'moderator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">权限不足</h2>
          <p className="text-gray-500 mb-4">您没有访问审核中心的权限</p>
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
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回首页</span>
        </button>

        <div className="mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 
                className="text-3xl font-bold text-gray-800"
                style={{ fontFamily: 'LXGW WenKai, serif' }}
              >
                内容审核中心
              </h1>
              <p className="text-gray-500">审核待发布的用户经验，确保社区内容安全合规</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="搜索待审核内容..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'prescription', 'dosage', 'privacy', 'medicalAdvice'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        filter === type
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'all' ? '全部' : SENSITIVE_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    待审核列表
                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                      {filteredExperiences.length} 条
                    </span>
                  </h3>
                </div>
              </div>

              {filteredExperiences.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">暂无待审核内容</h4>
                  <p className="text-sm text-gray-500">所有内容已审核完毕，辛苦了！</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredExperiences.map((exp, index) => {
                    const author = getUserById(exp.userId);
                    return (
                      <div
                        key={exp.id}
                        className={`p-5 cursor-pointer transition-all ${
                          selectedId === exp.id 
                            ? 'bg-teal-50 border-l-4 border-teal-500' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedId(exp.id)}
                        style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <img
                              src={author?.avatar}
                              alt={author?.nickname}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-800 truncate">{exp.title}</span>
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                {exp.content}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs text-gray-400">
                                  作者：{author?.nickname}
                                </span>
                                <span className="text-xs text-gray-400">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {formatDate(exp.createdAt)}
                                </span>
                                {exp.sensitiveFlags.map(flag => (
                                  <span
                                    key={flag}
                                    className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full"
                                  >
                                    {SENSITIVE_TYPE_LABELS[flag] || flag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(exp.id);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="通过审核"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openRejectModal(exp.id);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="驳回"
                            >
                              <X className="w-5 h-5" />
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

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                审核统计
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">待审核总数</span>
                  <span className="font-bold text-orange-600">{pendingExperiences.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">涉及处方</span>
                  <span className="font-medium text-gray-800">
                    {pendingExperiences.filter(e => e.sensitiveFlags.includes('prescription')).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">涉及剂量</span>
                  <span className="font-medium text-gray-800">
                    {pendingExperiences.filter(e => e.sensitiveFlags.includes('dosage')).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">涉及隐私</span>
                  <span className="font-medium text-gray-800">
                    {pendingExperiences.filter(e => e.sensitiveFlags.includes('privacy')).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">医疗建议</span>
                  <span className="font-medium text-gray-800">
                    {pendingExperiences.filter(e => e.sensitiveFlags.includes('medicalAdvice')).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-5 animate-[fadeInUp_0.5s_ease-out_0.4s_both]">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                审核规范
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>禁止分享具体处方、用药剂量信息</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>禁止包含个人联系方式、地址等隐私</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>禁止提供医疗建议、诊断和治疗方案</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>禁止推荐非正规医疗机构和药品</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>鼓励真实、有价值的经验分享</span>
                </li>
              </ul>
            </div>

            {selectedExperience && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.5s_both]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-teal-500" />
                    内容详情
                  </h3>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedAuthor?.avatar}
                      alt={selectedAuthor?.nickname}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{selectedAuthor?.nickname}</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedExperience.createdAt)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{selectedExperience.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedExperience.sensitiveFlags.map(flag => (
                        <span
                          key={flag}
                          className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full"
                        >
                          {SENSITIVE_TYPE_LABELS[flag] || flag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                    <div 
                      className="text-sm text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlightSensitiveContent(
                          selectedExperience.content,
                          ['处方', '开药', '药方', '配药', 'mg', 'g', 'ml', '毫克', '克', '毫升', '每次', '每日', '剂量', '服用量', '手机号', '电话', '微信', 'QQ', '地址', '身份证', '医保号', '建议你', '你应该', '必须', '不要吃', '一定要']
                        )
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(selectedExperience.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium text-sm hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      通过
                    </button>
                    <button
                      onClick={() => openRejectModal(selectedExperience.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium text-sm hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      驳回
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="驳回内容"
        type="warning"
        onConfirm={handleReject}
        confirmText="确认驳回"
      >
        <div className="space-y-4">
          <p className="text-gray-700">请填写驳回原因（将通知给作者）：</p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="例如：内容涉及具体用药剂量，不符合社区规范..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
            rows={3}
          />
          <div className="text-xs text-gray-500">
            提示：驳回后内容将不会公开展示，作者会收到驳回通知。
          </div>
        </div>
      </Modal>
    </div>
  );
}
