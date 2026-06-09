import { completeness, diffUserData } from './research.db';
import type { ResearchUserData } from './research.types';

const completeUser: ResearchUserData = {
  region: '北京 / 海淀',
  guardianRole: '母亲',
  source: '定性访谈',
  notes: '',
  children: [{
    id: 'child-1',
    birthOrder: 1,
    grade: '四年级',
    schoolingMode: 'day',
    schoolType: 'public',
  }],
};

describe('research user helpers', () => {
  it('calculates completeness from household and child fields', () => {
    expect(completeness(completeUser)).toBe(100);
    expect(completeness({
      ...completeUser,
      region: '',
      children: [{ ...completeUser.children[0], grade: '', schoolingMode: 'unknown' }],
    })).toBe(57);
  });

  it('creates field-level changes without logging untouched fields', () => {
    const changes = diffUserData(completeUser, {
      ...completeUser,
      region: '上海 / 徐汇',
      notes: '已确认住宿信息',
    });
    expect(changes).toHaveLength(2);
    expect(changes.map((change) => change.field)).toEqual(['region', 'notes']);
    expect(changes[0]).toMatchObject({
      label: '地区',
      before: '北京 / 海淀',
      after: '上海 / 徐汇',
    });
  });
});
