import { LayoutGrid } from 'lucide-react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import EditorModeButton from '../auth/EditorModeButton';
import FileBar from './FileBar';

const standardItems = [
  { label: '调研背景', path: 'background' },
  { label: '项目总结', path: 'summary' },
  { label: '定性洞察', path: 'qualitative' },
  { label: '竞品分析', path: 'competitive' },
  { label: '定量报告', path: 'quantitative' },
  { label: '营销落地', path: 'marketing' },
];

const computingItems = [
  { label: '调研背景', path: 'background' },
  { label: '总览', path: 'summary' },
  { label: '研究洞察', path: 'qualitative' },
  { label: '竞品与市场', path: 'competitive' },
];

const familyItems = [
  { label: '调研背景', path: 'background' },
  { label: '项目总览', path: 'summary' },
  { label: '用户访谈', path: 'qualitative' },
  { label: '定性洞察', path: 'family-insights' },
];

export default function TopNavLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const pathAfterProject = location.pathname.split(`/projects/${projectId}/`)[1] ?? 'summary';
  const active = pathAfterProject.split('/')[0] || 'summary';
  const isFamily = projectId === 'jiatingbao_project';
  const isPaisou = projectId === 'paisou_project';
  const items = isFamily ? familyItems : projectId === 'jisuanying_project' ? computingItems : standardItems;
  const showFileBar = !isFamily && !isPaisou && (active === 'qualitative' || active === 'competitive');

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f8f8f5]">
      <nav className="flex h-12 shrink-0 items-center gap-1 border-b border-[#dddcd5] bg-white px-2 sm:px-5">
        <button onClick={() => navigate('/projects')} className="mr-1 flex shrink-0 items-center gap-2 sm:mr-5">
          <img src="/insighthub-icon.png?v=2" alt="" className="h-7 w-7 rounded-md object-cover" />
          <span className="hidden text-sm font-extrabold text-[#282826] sm:inline">InsightHub（内测版）</span>
        </button>
        <button onClick={() => navigate('/projects')} title="切换项目" className="mr-1 flex shrink-0 items-center gap-1.5 rounded-md border border-[#dddcd5] p-2 text-xs font-semibold text-[#777] sm:mr-3 sm:px-3 sm:py-1.5">
          <LayoutGrid size={12} /><span className="hidden sm:inline">切换项目</span>
        </button>
        <div className="flex h-full min-w-0 flex-1 items-center overflow-x-auto">
          {items.map(({ label, path }) => {
            const current = active === path;
            return (
              <button key={path} onClick={() => navigate(`/projects/${projectId}/${path}`)} className={`relative h-full shrink-0 whitespace-nowrap px-3 text-xs sm:px-4 sm:text-[13px] ${current ? 'font-bold text-[#e65532]' : 'font-medium text-[#666]'}`}>
                {label}{current && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#e65532]" />}
              </button>
            );
          })}
        </div>
        <EditorModeButton compact className="ml-auto" />
      </nav>
      {showFileBar && <FileBar />}
      <div className="min-h-0 flex-1 overflow-y-auto"><Outlet /></div>
    </div>
  );
}
