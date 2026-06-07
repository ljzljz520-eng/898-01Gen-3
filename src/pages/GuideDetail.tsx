import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, User, Eye, Clock, ChevronRight,
  FileText, Shield, Heart, ExternalLink
} from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';
import { Disclaimer } from '@/components/Disclaimer';
import { getStageColor } from '@/utils/categoryMap';

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  const guides = useContentStore(state => state.guides);
  const experiences = useContentStore(state => state.experiences);
  const users = useContentStore(state => state.users);

  const guide = useMemo(() => {
    if (!id) return undefined;
    const g = guides.find(item => item.id === id);
    if (g) {
      const entriesWithExperience = g.entries.map(entry => ({
        ...entry,
        experience: experiences.find(e => e.id === entry.experienceId)
      }));
      return { ...g, entries: entriesWithExperience };
    }
    return undefined;
  }, [id, guides, experiences]);

  const curator = useMemo(() => guide ? users.find(u => u.id === guide.curatorId) : undefined, [guide, users]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">指南不存在</h2>
          <p className="text-gray-500 mb-4">该指南可能已被删除</p>
          <button
            onClick={() => navigate('/guides')}
            className="px-6 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
          >
            返回指南列表
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

  const scrollToSection = (index: number) => {
    setActiveSection(index);
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-[fadeInUp_0.5s_ease-out]">
              <div className="aspect-[3/1] relative overflow-hidden bg-gradient-to-br from-teal-400 to-cyan-500">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs mb-3">
                    <Shield className="w-3 h-3" />
                    版主精选指南
                  </div>
                  <h1 
                    className="text-3xl md:text-4xl font-bold text-white mb-2"
                    style={{ fontFamily: 'LXGW WenKai, serif' }}
                  >
                    {guide.title}
                  </h1>
                  <p className="text-white/80">{guide.description}</p>
                </div>
              </div>

              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={curator?.avatar}
                      alt={curator?.nickname}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{curator?.nickname}</span>
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                          社区版主
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        整理发布 · {formatDate(guide.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{guide.entries.length} 篇经验</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{guide.views.toLocaleString()} 阅读</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Disclaimer variant="inline" />

            <div className="space-y-6">
              {guide.entries
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((entry, index) => {
                  const expAuthor = entry.experience ? users.find(u => u.id === entry.experience.userId) : undefined;
                  return (
                    <section
                      key={entry.id}
                      id={`section-${index}`}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-[fadeInUp_0.5s_ease-out_both]"
                      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                    >
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <h2 
                            className="text-xl font-bold text-gray-800"
                            style={{ fontFamily: 'LXGW WenKai, serif' }}
                          >
                            {entry.sectionTitle}
                          </h2>
                        </div>
                      </div>

                      <div className="p-6">
                        {entry.experience && (
                          <>
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(entry.experience.diseaseStage)}`}>
                                  {entry.experience.diseaseStage}
                                </span>
                                <span className="text-sm text-gray-500">
                                  原作者：{expAuthor?.nickname}
                                </span>
                              </div>
                              <Link
                                to={`/experience/${entry.experience.id}`}
                                className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
                              >
                                查看原文
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                              {entry.experience.title}
                            </h3>

                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <User className="w-4 h-4 text-teal-500" />
                                <span className="font-medium">{expAuthor?.nickname}</span>
                                <span className="text-gray-400">的经验分享：</span>
                              </div>
                              <div className="text-gray-700 leading-relaxed">
                                {formatContent(entry.experience.content)}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4 text-rose-500" />
                                  <span>{entry.experience.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{entry.experience.views}</span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                <Clock className="w-3 h-3 inline mr-1" />
                                发布于 {formatDate(entry.experience.createdAt)}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </section>
                  );
                })}
            </div>

            <Disclaimer variant="inline" />

            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">觉得这份指南有帮助？</h3>
                  <p className="text-white/80 text-sm mb-4">
                    分享给更多需要的病友，让我们一起温暖同行。
                    所有内容均保留原作者署名，感谢每一位分享者的付出。
                  </p>
                  <div className="flex gap-3">
                    <button className="px-5 py-2 bg-white text-teal-600 rounded-xl font-medium text-sm hover:bg-teal-50 transition-colors">
                      分享指南
                    </button>
                    <Link
                      to="/publish"
                      className="px-5 py-2 bg-white/20 text-white rounded-xl font-medium text-sm hover:bg-white/30 transition-colors"
                    >
                      我也想分享
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-500" />
                  指南目录
                </h3>
                <nav className="space-y-1">
                  {guide.entries
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((entry, index) => (
                      <button
                        key={entry.id}
                        onClick={() => scrollToSection(index)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition-all ${
                          activeSection === index
                            ? 'bg-teal-50 text-teal-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          activeSection === index
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="flex-1 truncate">{entry.sectionTitle}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          activeSection === index ? 'translate-x-0' : '-translate-x-1 opacity-0'
                        }`} />
                      </button>
                    ))}
                </nav>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-500" />
                  关于整理者
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={curator?.avatar}
                    alt={curator?.nickname}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{curator?.nickname}</p>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                      社区版主
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  本指南由版主从社区高质量经验中精选整理，
                  所有内容均保留原作者署名。
                </p>
              </div>
            </div>
          </aside>
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
