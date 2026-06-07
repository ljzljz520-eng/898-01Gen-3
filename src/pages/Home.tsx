import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, PenLine, BookOpen } from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';
import { FilterBar } from '@/components/FilterBar';
import { ExperienceCard } from '@/components/ExperienceCard';
import { Disclaimer } from '@/components/Disclaimer';
import { useMemo } from 'react';

export default function Home() {
  const experiences = useContentStore(state => state.experiences);
  const guides = useContentStore(state => state.guides);
  const filters = useContentStore(state => state.filters);

  const filteredExperiences = useMemo(() => {
    const published = experiences.filter(e => e.status === 'published');
    return published.filter(exp => {
      if (filters.diseaseStage.length > 0 && !filters.diseaseStage.includes(exp.diseaseStage)) {
        return false;
      }
      if (filters.medicationExperience.length > 0 && !filters.medicationExperience.includes(exp.medicationExperience)) {
        return false;
      }
      if (filters.reviewCity.length > 0 && !filters.reviewCity.includes(exp.reviewCity)) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [experiences, filters]);

  const allExperiences = useMemo(() => {
    return experiences
      .filter(e => e.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [experiences]);

  const topExperiences = [...allExperiences]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30">
      <Disclaimer variant="banner" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-[fadeInUp_0.6s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>我们都是同路人 💙</span>
          </div>
          <h1 
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: 'LXGW WenKai, serif' }}
          >
            分享经验，温暖同行
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            在这里，每一段经历都有意义。按疾病阶段、用药体验、复诊城市找到同路人，
            互相支持，共同成长。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-6">
            <FilterBar />

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-500" />
                入门指南
              </h3>
              <div className="space-y-3">
                {guides.slice(0, 3).map(guide => (
                  <Link
                    key={guide.id}
                    to={`/guides/${guide.id}`}
                    className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <h4 className="font-medium text-gray-800 text-sm group-hover:text-teal-600 transition-colors line-clamp-2">
                      {guide.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {guide.entries.length} 篇经验 · {guide.views.toLocaleString()} 阅读
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                to="/guides"
                className="block mt-4 text-center text-sm text-teal-600 font-medium hover:text-teal-700"
              >
                查看全部指南 →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
              <h3 className="font-bold mb-2">有经验想分享？</h3>
              <p className="text-sm text-teal-100 mb-4">
                你的经历可能会帮助到正在迷茫的同路人
              </p>
              <Link
                to="/publish"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-teal-600 rounded-xl font-medium text-sm hover:bg-teal-50 transition-colors"
              >
                <PenLine className="w-4 h-4" />
                分享我的经验
              </Link>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-8">
            {topExperiences.length > 0 && (
              <section className="animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: 'LXGW WenKai, serif' }}>
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  热门经验
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {topExperiences.map((exp, index) => (
                    <div key={exp.id} style={{ animationDelay: `${0.2 + index * 0.1}s` }} className="animate-[fadeInUp_0.6s_ease-out_both]">
                      <ExperienceCard experience={exp} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
              <h2 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'LXGW WenKai, serif' }}>
                全部经验
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredExperiences.length} 篇)
                </span>
              </h2>

              {filteredExperiences.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">暂无符合条件的经验</h3>
                  <p className="text-gray-500 text-sm">试试调整筛选条件，或者成为第一个分享的人~</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredExperiences.map((exp, index) => (
                    <div key={exp.id} style={{ animationDelay: `${0.5 + index * 0.05}s` }} className="animate-[fadeInUp_0.6s_ease-out_both]">
                      <ExperienceCard experience={exp} showDisclaimer />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
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
