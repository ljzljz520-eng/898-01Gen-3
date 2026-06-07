import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'banner' | 'inline' | 'compact';
}

export function Disclaimer({ variant = 'banner' }: DisclaimerProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <div className="flex items-start gap-2 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>本社区经验仅供参考，不替代专业医疗建议。</p>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800 mb-1">重要声明</h4>
            <p className="text-sm text-red-700 leading-relaxed">
              本文内容为用户个人经验分享，仅供病友交流参考，<strong>不能替代专业医生的诊断和治疗建议</strong>。
              任何用药、治疗方案的调整，请务必咨询您的主治医生。如有紧急情况，请立即就医。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <p className="text-center font-medium">
            ⚠️ 本社区所有内容仅为用户经验分享，<strong className="underline">不构成任何医疗建议</strong>。
            用药和治疗请务必遵循专业医生指导。
          </p>
        </div>
      </div>
    </div>
  );
}
