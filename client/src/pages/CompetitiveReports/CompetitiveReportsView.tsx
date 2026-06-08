import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, FileUp, Trash2 } from 'lucide-react';
import {
  listReports,
  uploadReport,
  fetchReportContent,
  deleteReport,
  ReportMeta,
} from '../../api/reports';

const DEFAULT_PRESET_REPORTS = [
  { id: 'preset-miaodong',       label: '妙懂',     color: '#4ECDC4' },
  { id: 'preset-wulishifentong', label: '物理十分通', color: '#45B7D1' },
  { id: 'preset-sanwuxiaoxing',  label: '三五小星',  color: '#FF5722' },
];

const JISUANYING_PRESET_REPORTS = [
  { id: 'preset-jisuanying-survey1',     label: '产品定位与商业策略报告',         color: '#5B7BBF' },
  { id: 'preset-jisuanying-survey2',     label: '用户需求和购买决策调研报告',     color: '#BF9455' },
  { id: 'preset-jisuanying-integrated',  label: '行业与用户调研整合版报告',       color: '#4BA69E' },
  { id: 'preset-jisuanying-business',    label: '商业模式和提升续费的阶段性思考', color: '#E07A6E' },
];

export default function CompetitiveReportsView() {
  const { projectId } = useParams<{ projectId: string }>();
  const PRESET_REPORTS = projectId === 'jisuanying_project' ? JISUANYING_PRESET_REPORTS : DEFAULT_PRESET_REPORTS;

  const [reports, setReports] = useState<ReportMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    try {
      const list = await listReports();
      setReports(list);
      if (!activeId) setActiveId(PRESET_REPORTS[0].id);
    } catch {
      setError('加载报告列表失败');
    }
  }, [activeId, PRESET_REPORTS]);

  useEffect(() => { setActiveId(PRESET_REPORTS[0].id); }, [projectId]);
  useEffect(() => { loadList(); }, []);

  useEffect(() => {
    if (!activeId) { setContent(''); return; }
    setLoading(true);
    setError(null);

    // Preset reports are static files in /preset-reports/ — fetch directly,
    // bypassing the backend API (which relies on ephemeral server-side storage).
    const isPreset = PRESET_REPORTS.some((p) => p.id === activeId);
    const fetchFn = isPreset
      ? () => fetch(`/preset-reports/${activeId}.md`).then((r) => {
          if (!r.ok) throw new Error(`${r.status}`);
          return r.text();
        })
      : () => fetchReportContent(activeId);

    fetchFn()
      .then(setContent)
      .catch(() => setError('加载报告内容失败'))
      .finally(() => setLoading(false));
  }, [activeId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    setError(null);
    try {
      const meta = await uploadReport(file);
      setReports((prev) => [meta, ...prev]);
      setActiveId(meta.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteReport(id);
      const remaining = reports.filter((r) => r.id !== id);
      setReports(remaining);
      if (activeId === id) setActiveId(remaining[0]?.id ?? null);
    } catch {
      setError('删除失败');
    }
  }

  return (
    <div className="flex h-full min-h-0">
      {/* Sidebar */}
      <aside
        className="shrink-0 flex flex-col"
        style={{ width: 220, borderRight: '1.5px solid #E8E2D9', background: '#FAF8F4' }}
      >
        <div className="p-3 border-b border-[#E8E2D9]">
          <label
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg cursor-pointer transition-colors text-[12px] font-semibold"
            style={{
              background: uploading ? '#E8E2D9' : '#FF5722',
              color: uploading ? '#999' : 'white',
              pointerEvents: uploading ? 'none' : 'auto',
            }}
          >
            <FileUp size={13} />
            {uploading ? '上传中…' : '上传 Markdown'}
            <input type="file" accept=".md" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {/* Preset report buttons */}
        <div className="px-2 pt-2 pb-1 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 pb-0.5">竞品分析</p>
          {PRESET_REPORTS.map(({ id, label, color }) => {
            const isActive = id === activeId;
            return (
              <button
                key={id}
                onClick={() => setActiveId(id)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all"
                style={{
                  background: isActive ? `${color}18` : 'transparent',
                  border: `1.5px solid ${isActive ? color : 'transparent'}`,
                }}
              >
                <span className="shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[12px] font-semibold truncate" style={{ color: isActive ? color : '#555' }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mx-3 border-t border-[#E8E2D9]" />

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {reports.filter((r) => !PRESET_REPORTS.some((p) => p.id === r.id)).length === 0 && !uploading && (
            <p className="text-[11px] text-center text-gray-400 mt-4 px-4 leading-relaxed">
              可上传更多 .md 报告
            </p>
          )}
          {reports.filter((r) => !PRESET_REPORTS.some((p) => p.id === r.id)).map((r) => {
            const isActive = r.id === activeId;
            return (
              <div
                key={r.id}
                className="group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                style={{
                  background: isActive ? '#FFF4F0' : 'transparent',
                  border: isActive ? '1.5px solid #FFCCBC' : '1.5px solid transparent',
                }}
                onClick={() => setActiveId(r.id)}
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: isActive ? '#FF5722' : '#E8E2D9' }}
                >
                  <FileText size={13} color={isActive ? 'white' : '#999'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate" style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? '#D84315' : '#333' }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
                    {new Date(r.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                  onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                >
                  <Trash2 size={12} color="#bbb" />
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {error && (
          <div className="m-6 p-3 rounded-lg bg-red-50 border border-red-200 text-[12px] text-red-600">{error}</div>
        )}
        {!activeId && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center py-24">
            <FileText size={40} className="text-gray-200 mb-4" />
            <p className="text-[14px] font-medium text-gray-400">上传 Markdown 报告后在此查看</p>
            <p className="text-[12px] text-gray-300 mt-1">支持标题、表格、代码块等标准 Markdown 语法</p>
          </div>
        )}
        {activeId && loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-[13px] text-gray-400">加载中…</p>
          </div>
        )}
        {activeId && !loading && content && (
          <article className="mx-auto px-10 py-8" style={{ maxWidth: 780 }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 16, marginTop: 32, lineHeight: 1.3 }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2a2a2a', marginBottom: 12, marginTop: 28, paddingBottom: 6, borderBottom: '1.5px solid #E8E2D9' }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: 15, fontWeight: 700, color: '#333', marginBottom: 8, marginTop: 20 }}>{children}</h3>,
                p: ({ children }) => <p style={{ fontSize: 14, color: '#444', lineHeight: 1.85, marginBottom: 14 }}>{children}</p>,
                ul: ({ children }) => <ul style={{ paddingLeft: 20, marginBottom: 14, fontSize: 14, color: '#444', lineHeight: 1.85 }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ paddingLeft: 20, marginBottom: 14, fontSize: 14, color: '#444', lineHeight: 1.85 }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
                blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #FF5722', paddingLeft: 14, margin: '16px 0', color: '#666', fontStyle: 'italic' }}>{children}</blockquote>,
                code: ({ children, className }) => {
                  const isBlock = className?.startsWith('language-');
                  return isBlock
                    ? <code style={{ display: 'block', background: '#F5F3EF', borderRadius: 8, padding: '12px 16px', fontSize: 12.5, lineHeight: 1.7, overflowX: 'auto', color: '#333' }}>{children}</code>
                    : <code style={{ background: '#F5F3EF', borderRadius: 4, padding: '1px 5px', fontSize: 12.5, color: '#D84315' }}>{children}</code>;
                },
                pre: ({ children }) => <pre style={{ background: '#F5F3EF', borderRadius: 8, padding: '12px 16px', marginBottom: 14, overflowX: 'auto' }}>{children}</pre>,
                table: ({ children }) => (
                  <div style={{ overflowX: 'auto', marginBottom: 14 }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>{children}</table>
                  </div>
                ),
                th: ({ children }) => <th style={{ background: '#F5F3EF', padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#333', border: '1px solid #E8E2D9', fontSize: 12 }}>{children}</th>,
                td: ({ children }) => <td style={{ padding: '8px 12px', color: '#555', border: '1px solid #E8E2D9', lineHeight: 1.6 }}>{children}</td>,
                hr: () => <hr style={{ border: 'none', borderTop: '1.5px solid #E8E2D9', margin: '24px 0' }} />,
                strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#222' }}>{children}</strong>,
                a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#FF5722', textDecoration: 'underline' }}>{children}</a>,
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
