import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, PenLine, BookOpen, Shield, User, ChevronDown, Plus, Crown } from 'lucide-react';
import { useContentStore } from '@/store/useContentStore';

export function Navbar() {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const currentUser = useContentStore(state => state.currentUser);
  const users = useContentStore(state => state.users);
  const switchUser = useContentStore(state => state.switchUser);

  const navItems = [
    { path: '/', label: '经验广场', icon: Heart },
    { path: '/publish', label: '分享经验', icon: PenLine },
    { path: '/guides', label: '入门指南', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSwitchUser = (userId: string) => {
    switchUser(userId);
    setShowUserMenu(false);
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
            {currentUser.role === 'moderator' && (
              <Link
                to="/guides/create"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/guides/create')
                    ? 'bg-purple-50 text-purple-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>创建指南</span>
              </Link>
            )}
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
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-3 border-l border-gray-200 hover:bg-gray-50 py-2 px-2 rounded-lg transition-colors"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                  currentUser.role === 'moderator' 
                    ? 'bg-gradient-to-br from-purple-100 to-pink-100' 
                    : 'bg-gradient-to-br from-teal-100 to-cyan-100'
                }`}>
                  {currentUser.role === 'moderator' ? (
                    <Crown className="w-4 h-4 text-purple-600" />
                  ) : (
                    <User className="w-4 h-4 text-teal-600" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    {currentUser.nickname}
                    {currentUser.role === 'moderator' && (
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                        版主
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {currentUser.role === 'moderator' ? '社区管理员' : '普通病友'}
                    <ChevronDown className="w-3 h-3" />
                  </p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">切换身份（演示用）</p>
                  </div>
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSwitchUser(user.id)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                        currentUser.id === user.id ? 'bg-teal-50' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        user.role === 'moderator'
                          ? 'bg-gradient-to-br from-purple-100 to-pink-100'
                          : 'bg-gradient-to-br from-teal-100 to-cyan-100'
                      }`}>
                        {user.role === 'moderator' ? (
                          <Crown className="w-4 h-4 text-purple-600" />
                        ) : (
                          <User className="w-4 h-4 text-teal-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate flex items-center gap-1">
                          {user.nickname}
                          {user.role === 'moderator' && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                              版主
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.role === 'moderator' ? '可审核、创建指南' : '可发布、评论经验'}
                        </p>
                      </div>
                      {currentUser.id === user.id && (
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
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
            <>
              <Link
                to="/guides/create"
                className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all ${
                  isActive('/guides/create')
                    ? 'text-purple-600'
                    : 'text-gray-500'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs">创建</span>
              </Link>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
