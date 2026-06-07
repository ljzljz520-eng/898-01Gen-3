import { Link, useLocation } from 'react-router-dom';
import { Heart, PenLine, BookOpen, Shield, User } from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';

export function Navbar() {
  const location = useLocation();
  const currentUser = useContentStore(state => state.currentUser);

  const navItems = [
    { path: '/', label: '经验广场', icon: Heart },
    { path: '/publish', label: '分享经验', icon: PenLine },
    { path: '/guides', label: '入门指南', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'LXGW WenKai, serif' }}>
                同路人
              </h1>
              <p className="text-xs text-gray-500">病友互助社区</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-teal-50 text-teal-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {currentUser.role === 'moderator' && (
              <Link
                to="/review"
                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive('/review')
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm">审核中心</span>
              </Link>
            )}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center border-2 border-white shadow-sm">
                <User className="w-4 h-4 text-teal-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{currentUser.nickname}</p>
                <p className="text-xs text-gray-500">
                  {currentUser.role === 'moderator' ? '版主' : '病友'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-around py-2 border-t border-gray-100">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'text-teal-600'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
          {currentUser.role === 'moderator' && (
            <Link
              to="/review"
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all ${
                isActive('/review')
                  ? 'text-orange-600'
                  : 'text-gray-500'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-xs">审核</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
