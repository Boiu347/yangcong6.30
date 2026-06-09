import { BookOpen, Library, UserRoundSearch, UsersRound } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const items = [
  { path: '/projects', label: '项目库', icon: Library },
  { path: '/profile', label: '用户画像', icon: UserRoundSearch },
  { path: '/users', label: '用户库', icon: UsersRound },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8f5]">
      <header className="flex h-[52px] shrink-0 items-center gap-1 border-b border-[#dddcd5] bg-white px-2 sm:gap-5 sm:px-5">
        <button onClick={() => navigate('/projects')} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e65532]"><BookOpen size={16} color="white" /></span>
          <span className="hidden text-[15px] font-extrabold text-[#282826] sm:inline">InsightHub</span>
        </button>
        <nav className="flex h-full items-center">
          {items.map(({ path, label, icon: Icon }) => {
            const active = location.pathname.startsWith(path);
            return (
              <button key={path} onClick={() => navigate(path)} className={`relative flex h-full items-center gap-1 px-2 text-xs sm:gap-1.5 sm:px-4 sm:text-[13px] ${active ? 'font-bold text-[#e65532]' : 'font-medium text-[#666]'}`}>
                <Icon size={14} />{label}
                {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#e65532]" />}
              </button>
            );
          })}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
