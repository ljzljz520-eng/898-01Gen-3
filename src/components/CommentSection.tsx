import { useState, useMemo } from 'react';
import { Send, User } from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';
import { checkSensitiveContent } from '@/utils/sensitiveCheck';
import { Disclaimer } from './Disclaimer';

interface CommentSectionProps {
  experienceId: string;
}

export function CommentSection({ experienceId }: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPendingMsg, setShowPendingMsg] = useState(false);

  const comments = useContentStore(state => state.comments);
  const users = useContentStore(state => state.users);
  const addComment = useContentStore(state => state.addComment);
  const currentUser = useContentStore(state => state.currentUser);

  const publishedComments = useMemo(() => {
    return comments
      .filter(c => c.experienceId === experienceId && c.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [comments, experienceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    const sensitiveResult = checkSensitiveContent(content);
    const comment = addComment(experienceId, content.trim());
    
    if (comment.status === 'pending') {
      setShowPendingMsg(true);
      setTimeout(() => setShowPendingMsg(false), 5000);
    }

    setContent('');
    
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'LXGW WenKai, serif' }}>
        病友交流 ({publishedComments.length})
      </h3>

      <Disclaimer variant="compact" />

      <form onSubmit={handleSubmit} className="mt-4 mb-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1 space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的看法... 请文明交流，涉及医疗建议的内容会进入审核"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
              rows={3}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{content.length}/500</span>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium text-sm hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
                发表评论
              </button>
            </div>
          </div>
        </div>
      </form>

      {showPendingMsg && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 animate-pulse">
          您的评论包含敏感内容，已进入审核队列，通过后将显示。
        </div>
      )}

      <div className="space-y-4">
        {publishedComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">暂无评论，来说两句吧~</p>
          </div>
        ) : (
          publishedComments.map((comment) => {
            const author = users.find(u => u.id === comment.userId);
            return (
              <div key={comment.id} className="flex gap-3 group">
                <img
                  src={author?.avatar}
                  alt={author?.nickname}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800 text-sm">{author?.nickname}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
