import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye, MapPin, Pill } from 'lucide-react';
import type { Experience } from '@/types';
import { useContentStore } from '@/store/useContentStore';
import { getStageColor } from '@/utils/categoryMap';
import { Disclaimer } from './Disclaimer';

interface ExperienceCardProps {
  experience: Experience;
  showDisclaimer?: boolean;
}

export function ExperienceCard({ experience, showDisclaimer = false }: ExperienceCardProps) {
  const users = useContentStore(state => state.users);
  const toggleLike = useContentStore(state => state.toggleLike);
  const author = users.find(u => u.id === experience.userId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={author?.avatar}
              alt={author?.nickname}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100"
            />
            <div>
              <p className="font-medium text-gray-800">{author?.nickname}</p>
              <p className="text-xs text-gray-500">{formatDate(experience.createdAt)}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(experience.diseaseStage)}`}>
            {experience.diseaseStage}
          </span>
        </div>

        <Link to={`/experience/${experience.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2" style={{ fontFamily: 'LXGW WenKai, serif' }}>
            {experience.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {truncateContent(experience.content)}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {experience.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-100"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Pill className="w-4 h-4 text-purple-500" />
            <span className="text-xs">{experience.medicationExperience}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span className="text-xs">{experience.reviewCity}</span>
          </div>
        </div>

        {showDisclaimer && (
          <div className="mb-4">
            <Disclaimer variant="compact" />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleLike(experience.id);
              }}
              className="flex items-center gap-1 text-gray-500 hover:text-rose-500 transition-colors group/like"
            >
              <Heart className="w-4 h-4 group-hover/like:fill-rose-100" />
              <span className="text-xs">{experience.likes}</span>
            </button>
            <div className="flex items-center gap-1 text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{experience.comments}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{experience.views}</span>
            </div>
          </div>
          <Link
            to={`/experience/${experience.id}`}
            className="text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            阅读全文 →
          </Link>
        </div>
      </div>
    </article>
  );
}
