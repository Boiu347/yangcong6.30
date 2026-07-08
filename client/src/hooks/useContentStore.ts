import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchContent, saveContent, seedContent } from '../api/content';
import { isEditor } from '../components/auth/PasswordGate';
import { toast } from 'sonner';

interface UseContentStoreResult<T> {
  data: T;
  saving: boolean;
  save: (next: T) => Promise<void>;
  seed: () => Promise<void>;
  reload: () => Promise<void>;
}

/** 后台轮询间隔（毫秒）：让其他浏览者不刷新也能准实时看到编辑更新 */
const POLL_INTERVAL_MS = 30_000;

export function useContentStore<T>(
  key: string,
  defaultData: T,
): UseContentStoreResult<T> {
  const [data, setData] = useState<T>(defaultData);
  const [saving, setSaving] = useState(false);
  const defaultRef = useRef(defaultData);
  const dataRef = useRef(data);
  const savingRef = useRef(false);

  useEffect(() => {
    defaultRef.current = defaultData;
  }, [defaultData]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    savingRef.current = saving;
  }, [saving]);

  const load = useCallback(async () => {
    const remote = await fetchContent<T>(key);
    if (remote !== null) {
      setData(remote);
    } else {
      setData(defaultRef.current);
    }
  }, [key]);

  useEffect(() => { void load(); }, [load]);

  // 智能轮询：后台比对远端数据，仅在有变化且未在保存时更新，避免整页刷新/打断编辑
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      if (savingRef.current || document.hidden) return;
      const remote = await fetchContent<T>(key);
      if (cancelled || remote === null || savingRef.current) return;
      if (JSON.stringify(remote) !== JSON.stringify(dataRef.current)) {
        setData(remote);
      }
    };
    const id = setInterval(() => { void tick(); }, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [key]);

  const save = useCallback(async (next: T) => {
    setData(next);
    setSaving(true);
    try {
      const ok = await saveContent(key, next);
      if (ok) {
        toast.success('保存成功');
      } else {
        toast.error('保存失败，数据库可能未配置');
      }
    } finally {
      setSaving(false);
    }
  }, [key]);

  const seed = useCallback(async () => {
    if (!isEditor()) return;
    setSaving(true);
    try {
      const ok = await seedContent(key, defaultRef.current);
      if (ok) {
        setData(defaultRef.current);
        toast.success('数据已重置为默认值');
      } else {
        toast.error('重置失败');
      }
    } finally {
      setSaving(false);
    }
  }, [key]);

  return { data, saving, save, seed, reload: load };
}
