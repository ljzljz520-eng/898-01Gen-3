import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showActions?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  type = 'info',
  onConfirm,
  confirmText = '确认',
  cancelText = '取消',
  showActions = true
}: ModalProps) {
  if (!isOpen) return null;

  const iconMap = {
    info: <AlertTriangle className="w-6 h-6 text-blue-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-orange-500" />,
    success: <CheckCircle2 className="w-6 h-6 text-green-500" />
  };

  const borderColorMap = {
    info: 'border-blue-200',
    warning: 'border-orange-200',
    success: 'border-green-200'
  };

  const bgColorMap = {
    info: 'bg-blue-50',
    warning: 'bg-orange-50',
    success: 'bg-green-50'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-t-4 ${borderColorMap[type]} animate-[fadeInUp_0.3s_ease-out]`}
      >
        <div className={`${bgColorMap[type]} rounded-t-2xl p-5 border-b border-gray-100`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {iconMap[type]}
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'LXGW WenKai, serif' }}>
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="text-gray-600 text-sm leading-relaxed">
            {children}
          </div>
        </div>

        {showActions && (
          <div className="px-5 pb-5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium text-sm hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
