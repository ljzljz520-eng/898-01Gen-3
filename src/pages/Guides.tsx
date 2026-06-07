import { Link } from 'react-router-dom';
import { BookOpen, Eye, FileText, Shield, User } from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';
import { Disclaimer } from '@/components/Disclaimer';

export default function Guides() {
  const guides = useContentStore(state => state.guides);
  const users = useContentStore(state => state.users);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30">
      <Disclaimer variant="banner" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-[fadeInUp_0.5s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm mb-4">
            <Shield className="w-4 h-4" />
            <span>版主精选 · 权威整理</span>
          </div>
          <h1 
            className="text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: 'LXGW WenKai, serif' }}
          >
            入门指南
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            由社区版主精心整理的高质量经验合集，系统化地帮助你了解疾病知识，
            少走弯路，更好地面对治疗和康复。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => {
            const curator = users.find(u => u.id === guide.curatorId);
            return (
              <Link
                key={guide.id}
                to={`/guides/${guide.id}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-[fadeInUp_0.5s_ease-out_both]"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-100">
                  <img
                    src={guide.coverImage}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm text-teal-700 rounded-full text-xs font-medium">
                      <FileText className="w-3 h-3" />
                      {guide.entries.length} 篇经验
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 
                    className="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2"
                    style={{ fontFamily: 'LXGW WenKai, serif' }}
                  >
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {guide.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <img
                        src={curator?.avatar}
                        alt={curator?.nickname}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{curator?.nickname}</p>
                        <p className="text-xs text-gray-500">版主整理</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{guide.views.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-400">
                    发布于 {formatDate(guide.createdAt)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-[fadeInUp_0.5s_ease-out_0.4s_both]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">关于入门指南</h3>
              <p className="text-sm text-gray-600 mb-3">
                入门指南由社区版主从海量经验中精选、整理而成。每一篇入选的经验都经过严格审核，
                确保内容真实、有价值。所有指南均保留原作者署名，尊重原创。
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>保留原作者署名</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>版主严格审核</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>系统化整理</span>
                </div>
              </div>
            </div>
          </div>
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
