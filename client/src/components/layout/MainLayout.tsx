import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Library, UserCircle2 } from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isProfile = location.pathname.startsWith('/profile');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FEFDF9' }}>
      <header
        className="shrink-0 flex items-center px-5 gap-2"
        style={{
          height: 52,
          background: '#FEFDF9',
          borderBottom: '1.5px solid #E8E2D9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mr-3 shrink-0">
          <div
            className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center"
            style={{ background: '#FF5722' }}
          >
            <BookOpen size={15} color="white" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px', color: '#2A2A2A' }}>
            InsightHub
          </span>
          <span style={{ fontSize: 13, fontWeight: 400, color: '#999' }}>· 洞见中枢</span>
        </div>

        {/* Nav tabs — orange style matching TopNavLayout */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-1.5 rounded-lg transition-all"
            style={{
              padding: '6px 14px',
              fontSize: 12.5,
              fontWeight: !isProfile ? 700 : 500,
              color: !isProfile ? '#FF5722' : '#666',
              background: !isProfile ? 'rgba(255,87,34,0.1)' : 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Library size={13} />
            项目库
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1.5 rounded-lg transition-all"
            style={{
              padding: '6px 14px',
              fontSize: 12.5,
              fontWeight: isProfile ? 700 : 500,
              color: isProfile ? '#FF5722' : '#666',
              background: isProfile ? 'rgba(255,87,34,0.1)' : 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <UserCircle2 size={13} />
            用户档案
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
