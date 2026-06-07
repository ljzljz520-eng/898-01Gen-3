import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, CheckCircle, Clock, MapPin, Pill, 
  Activity, Send, Eye, Shield, Hash
} from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';
import { DISEASE_STAGES, MEDICATION_EXPERIENCES, CITIES, SENSITIVE_TYPE_LABELS } from '@/utils/categoryMap';
import { checkSensitiveContent, highlightSensitiveContent } from '@/utils/sensitiveCheck';
import { Disclaimer } from '@/components/Disclaimer';
import { Modal } from '@/components/Modal';
import type { SensitiveResult } from '@/types';

export default function Publish() {
  const navigate = useNavigate();
  const addExperience = useContentStore(state => state.addExperience);
  const currentUser = useContentStore(state => state.currentUser);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [diseaseStage, setDiseaseStage] = useState('');
  const [medicationExperience, setMedicationExperience] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sensitiveResult, setSensitiveResult] = useState<SensitiveResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [needsReview, setNeedsReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkContent = useCallback(() => {
    if (!content.trim()) {
      setSensitiveResult(null);
      return;
    }
    setIsChecking(true);
    setTimeout(() => {
      const result = checkSensitiveContent(title + ' ' + content);
      setSensitiveResult(result);
      setIsChecking(false);
    }, 500);
  }, [title, content]);

  useEffect(() => {
    const timer = setTimeout(checkContent, 800);
    return () => clearTimeout(timer);
  }, [checkContent]);

  const isFormValid = 
    title.trim().length >= 5 &&
    content.trim().length >= 50 &&
    diseaseStage &&
    medicationExperience &&
    reviewCity;

  const handleSubmit = () => {
    if (!isFormValid) return;
    setShowPublishModal(true);
  };

  const confirmPublish = () => {
    setIsSubmitting(true);
    
    const tags = tagsInput
      .split(/[,，#\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const result = addExperience({
      userId: currentUser.id,
      title: title.trim(),
      content: content.trim(),
      diseaseStage: diseaseStage as '初诊' | '治疗中' | '康复期',
      medicationExperience,
      reviewCity,
      tags
    });

    setNeedsReview(result.needsReview);
    setIsSubmitting(false);
    setShowPublishModal(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    if (!needsReview) {
      navigate('/');
    }
  };

  const CategoryButton = ({ 
    selected, 
    onClick, 
    icon: Icon, 
    label,
    colorClass 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    icon: any; 
    label: string;
    colorClass: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
        selected
          ? `${colorClass} border-transparent shadow-md scale-[1.02]`
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30">
      <Disclaimer variant="banner" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <h1 
            className="text-3xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: 'LXGW WenKai, serif' }}
          >
            分享你的经验
          </h1>
          <p className="text-gray-600">
            你的经历可能会帮助到正在迷茫的同路人。请真实分享，避免涉及医疗建议和个人隐私。
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="用一句话概括你想分享的内容..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              maxLength={100}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{title.length}/100</span>
              <span className="text-gray-500">至少5个字符</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              分类信息 <span className="text-red-500">*</span>
            </label>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">疾病阶段</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DISEASE_STAGES.map(stage => (
                    <CategoryButton
                      key={stage.value}
                      selected={diseaseStage === stage.value}
                      onClick={() => setDiseaseStage(stage.value)}
                      icon={Activity}
                      label={stage.label}
                      colorClass={stage.color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">用药体验</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MEDICATION_EXPERIENCES.map(exp => (
                    <CategoryButton
                      key={exp.value}
                      selected={medicationExperience === exp.value}
                      onClick={() => setMedicationExperience(exp.value)}
                      icon={Pill}
                      label={exp.label}
                      colorClass="bg-purple-100 text-purple-700"
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm font-medium text-gray-700">复诊城市</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setReviewCity(city)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        reviewCity === city
                          ? 'bg-cyan-100 text-cyan-700 font-medium shadow-sm'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-800">
                内容详情 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {isChecking && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3 animate-spin" />
                    内容检测中...
                  </span>
                )}
                {sensitiveResult && !sensitiveResult.hasSensitive && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    内容合规
                  </span>
                )}
                {sensitiveResult?.hasSensitive && (
                  <span className="flex items-center gap-1 text-xs text-orange-600">
                    <Shield className="w-3 h-3" />
                    需人工审核
                  </span>
                )}
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="详细分享你的经历，包括当时的情况、你的做法、最终的结果、给其他人的建议..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all min-h-[200px]"
              maxLength={5000}
            />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{content.length}/5000</span>
              <span className="text-gray-500">至少50个字符</span>
            </div>

            {sensitiveResult?.hasSensitive && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800 mb-2">
                      检测到以下敏感内容，发布后需人工审核：
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {sensitiveResult.flags.map(flag => (
                        <span 
                          key={flag}
                          className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                        >
                          {SENSITIVE_TYPE_LABELS[flag] || flag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-orange-700">
                      敏感词：{sensitiveResult.matchedWords.join('、')}
                    </p>
                    {content && (
                      <div 
                        className="mt-3 p-3 bg-white rounded-lg text-sm text-gray-700 max-h-32 overflow-y-auto"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightSensitiveContent(
                            content.slice(0, 300) + (content.length > 300 ? '...' : ''),
                            sensitiveResult.matchedWords
                          )
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.4s_both]">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-teal-500" />
              <label className="block text-sm font-semibold text-gray-800">
                标签（可选）
              </label>
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="用逗号或空格分隔，例如：心理调适, 饮食注意, 北京就医"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            <p className="mt-2 text-xs text-gray-400">
              添加标签可以让更多同路人找到你的经验
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 animate-[fadeInUp_0.5s_ease-out_0.5s_both]">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <h4 className="font-semibold mb-2">发布须知</h4>
                <ul className="space-y-1 text-amber-700">
                  <li>• 本社区仅支持经验分享，<strong>禁止提供医疗建议</strong></li>
                  <li>• 禁止分享具体处方、用药剂量、个人联系方式等敏感内容</li>
                  <li>• 涉及敏感内容的帖子将进入人工审核，通过后才会显示</li>
                  <li>• 请对自己的发言负责，尊重他人，文明交流</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8 animate-[fadeInUp_0.5s_ease-out_0.6s_both]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              预览
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? '发布中...' : '发布经验'}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="发布确认"
        type="warning"
        onConfirm={confirmPublish}
        confirmText="确认发布"
      >
        <div className="space-y-3">
          <p>我已阅读并理解以下内容：</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>本平台仅提供经验分享，<strong>不构成任何医疗建议</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>我所分享的内容仅为个人真实经历，不涉及专业医疗意见</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>如内容涉及敏感信息，我同意由版主进行审核和处理</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>其他病友参考我的经验时，应先咨询专业医生</span>
            </li>
          </ul>
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={needsReview ? '发布成功，等待审核' : '发布成功！'}
        type={needsReview ? 'warning' : 'success'}
        showActions={true}
        confirmText={needsReview ? '查看我的帖子' : '返回首页'}
        onConfirm={handleSuccessClose}
      >
        {needsReview ? (
          <div className="space-y-3">
            <p>您的经验已提交，但由于内容包含敏感信息，需要经过版主审核后才能公开展示。</p>
            <p className="text-sm text-orange-700">
              审核通常会在 24 小时内完成，请耐心等待。您可以在个人中心查看审核状态。
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>🎉 感谢您的分享！您的经验已经成功发布。</p>
            <p className="text-sm text-green-700">
              希望您的经历能帮助到更多同路人，一起加油！
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
