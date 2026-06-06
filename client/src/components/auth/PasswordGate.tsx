import React from 'react';

const STORAGE_KEY = 'yy_access_pw';
const ROLE_KEY = 'yy_auth_role';

export type AuthRole = 'viewer' | 'editor';

// ── Auth state (module-level, shared) ──────────────────────────────────────

let _authed = (() => {
  try {
    return !!sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
})();

let _role: AuthRole = (() => {
  try {
    return (sessionStorage.getItem(ROLE_KEY) as AuthRole) || 'viewer';
  } catch {
    return 'viewer';
  }
})();

const _listeners = new Set<() => void>();

function _notify() {
  _listeners.forEach((fn) => fn());
}

export function isAuthed() {
  return _authed;
}

export function getAuthRole(): AuthRole {
  return _authed ? _role : 'viewer';
}

export function isEditor(): boolean {
  return _authed && _role === 'editor';
}

export function setAuthed(pw: string, role: AuthRole = 'viewer') {
  try {
    sessionStorage.setItem(STORAGE_KEY, pw);
    sessionStorage.setItem(ROLE_KEY, role);
  } catch { /* ignore */ }
  _authed = true;
  _role = role;
  _notify();
}

/** 站内解锁编辑权限：调用 /api/auth/verify-editor，成功则升级为 editor */
export async function unlockEditor(pw: string): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/verify-editor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (!res.ok) return false;
    _role = 'editor';
    try { sessionStorage.setItem(ROLE_KEY, 'editor'); } catch { /* ignore */ }
    _notify();
    return true;
  } catch {
    return false;
  }
}

/** 退出编辑模式，恢复为 viewer */
export function lockEditor() {
  _role = 'viewer';
  try { sessionStorage.setItem(ROLE_KEY, 'viewer'); } catch { /* ignore */ }
  _notify();
}

export function getStoredPassword(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

// ── Hooks ───────────────────────────────────────────────────────────────────

export function useIsAuthed() {
  const [, rerender] = React.useReducer((x: number) => x + 1, 0);
  React.useEffect(() => {
    _listeners.add(rerender);
    return () => { _listeners.delete(rerender); };
  }, []);
  return _authed;
}

export function useAuthRole(): AuthRole {
  const [, rerender] = React.useReducer((x: number) => x + 1, 0);
  React.useEffect(() => {
    _listeners.add(rerender);
    return () => { _listeners.delete(rerender); };
  }, []);
  return _authed ? _role : 'viewer';
}

export function useIsEditor(): boolean {
  const role = useAuthRole();
  return role === 'editor';
}

// ── PasswordGate component — 入口已开放，直接渲染 ────────────────────────────

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
