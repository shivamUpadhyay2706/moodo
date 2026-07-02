import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, LogOut, Menu, X, User } from 'lucide-react';
import { useDashboard } from './useDashboard';
import { SIDEBAR_NAV_ITEMS } from './constant';

const Dashboard = () => {
  const {
    user,
    currentPath,
    handleLogout,
    isMobileOpen,
    toggleMobileSidebar,
  } = useDashboard();

  const isLinkActive = (path) => {
    if (path === '/') {
      return currentPath === '/' || currentPath.startsWith('/tasks');
    }
    return currentPath.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0d0e12] border-r border-slate-800/80 p-5 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-8 pl-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="text-white" size={18} />
        </div>
        <span className="text-xl font-black tracking-tight text-white font-sans">
          moodo
        </span>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-3 p-3 mb-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <User size={18} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-bold text-slate-200 truncate">
            {user?.username || 'Guest'}
          </span>
          <span className="text-xs font-medium text-slate-500">
            Gen Z Hacker
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-2">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => isMobileOpen && toggleMobileSidebar()}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                active
                  ? 'bg-indigo-650 text-white shadow-md shadow-indigo-600/15 border-l-4 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#07080d] text-slate-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="w-64 h-full relative z-50">
            <SidebarContent />
          </div>
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileSidebar}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-900"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-bold text-slate-200 m-0 leading-none">
              {currentPath === '/' ? 'My Workspace' : currentPath.startsWith('/groups') ? 'Collaboration Hub' : 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-glow" />
            <span className="text-xs font-semibold text-slate-500 select-none">
              API Server Online
            </span>
          </div>
        </header>

        {/* View Router Outlet */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
