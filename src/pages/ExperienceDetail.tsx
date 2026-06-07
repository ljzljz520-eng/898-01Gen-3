import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Heart, MessageCircle, Eye, Share2, Bookmark,
  MapPin, Pill, Activity, Calendar, User, Clock
} from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';
import { getStageColor } from '@/utils/categoryMap';
import { Disclaimer } from '@/components/Disclaimer';
import { CommentSection } from '@/components/CommentSection';

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const experiences = useContentStore(state => state.experiences);
  const users = useContentStore(state => state.users);
  const currentUser = useContentStore(state => state.currentUser);
  const toggleLike = useContentStore(state => state.toggleLike);
  const incrementView = useContentStore(state => state.incrementView);

  const experience = useMemo(() => id ? experiences.find(e => e.id === id) : undefined, [id, experiences]);
  const author = useMemo(() => experience ? users.find(u => u.id === experience.userId) : undefined, [experience, users]);

  useEffect(() => {
    if (id && experience) {
      incrementView(id);
    }
  }, [id]);

  if (!experience) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">经验不存在</h2>
          <p className="text-gray-500 mb-4">该经验可能已被删除或正在审核中</p>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30">
      <Disclaimer variant="banner" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>返回</span>
        </button>

        <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-[fadeInUp_0.5s_ease-out]">
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(experience.diseaseStage)}`}>
                {experience.diseaseStage}
              </span>
              {experience.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: 'LXGW WenKai, serif' }}
            >
              {experience.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={author?.avatar}
                  alt={author?.nickname}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100"
                />
                <div>
                  <p className="font-medium text-gray-800">{author?.nickname}</p>
                  <p className="text-sm text-gray-500">{author?.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(experience.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{experience.views} 阅读</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl">
                <Activity className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-orange-600">疾病阶段</p>
                  <p className="text-sm font-medium text-orange-700">{experience.diseaseStage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                <Pill className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-purple-600">用药体验</p>
                  <p className="text-sm font-medium text-purple-700">{experience.medicationExperience}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-cyan-50 rounded-xl">
                <MapPin className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-xs text-cyan-600">复诊城市</p>
                  <p className="text-sm font-medium text-cyan-700">{experience.reviewCity}</p>
                </div>
              </div>
            </div>

            <Disclaimer variant="inline" />

            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-base">
              {formatContent(experience.content)}
            </div>

            <Disclaimer variant="inline" />

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleLike(experience.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors group"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{experience.likes}</span>
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{experience.comments}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{experience.views}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
          <CommentSection experienceId={experience.id} />
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-500" />
            关于作者
          </h3>
          <div className="flex items-center gap-4">
            <img
              src={author?.avatar}
              alt={author?.nickname}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800">{author?.nickname}</h4>
                <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                  {author?.role === 'moderator' ? '社区版主' : '认证病友'}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                {author?.city} · 已分享 {useContentStore.getState().experiences.filter(e => e.userId === author?.id).length} 篇经验
              </p>
            </div>
            <button className="px-4 py-2 border border-teal-500 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors">
              关注
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            ← 返回经验广场，查看更多分享
          </Link>
        </div>
      </div>

      <footer className="mt-16 py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            同路人病友互助社区 · 本平台所有内容仅供经验交流，不构成医疗建议
          </p>
          <p className="text-xs text-gray-400">
            如有健康问题，请及时咨询专业医生。紧急情况请立即就医。
          </p>
        </div>
      </footer>
    </div>
  );
}
