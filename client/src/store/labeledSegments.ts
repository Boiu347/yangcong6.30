// 定性调研「片段标签」统一数据集：家庭包（人工标注）+ 小学物理（映射标注）。
import { JIATINGBAO_SEGMENTS } from './jiatingbaoSegments';
import { PHYSICS_SEGMENTS } from './physicsSegments';
import type { LabeledSegment } from './segmentTaxonomy';

export const ALL_SEGMENTS: LabeledSegment[] = [
  ...JIATINGBAO_SEGMENTS,
  ...PHYSICS_SEGMENTS,
];

export const SEGMENT_PROJECTS = [
  { id: 'all', name: '全部项目' },
  { id: 'jiatingbao', name: '洋葱家庭包' },
  { id: 'physics', name: '小学物理' },
] as const;
