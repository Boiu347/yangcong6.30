import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Request } from 'express';
import { isEditorPassword } from '../../middleware/password.middleware';
import {
  createUser,
  getPortrait,
  getUserHistory,
  hasResearchDb,
  listPortraits,
  listUsers,
  savePortrait,
  updateUser,
} from './research.db';
import type { ResearchUserData } from './research.types';

function requireDb() {
  if (!hasResearchDb()) throw new ServiceUnavailableException('数据库未配置');
}

function requireEditor(req: Request) {
  const password = (req.headers['x-access-password'] as string) ?? '';
  if (!isEditorPassword(password)) throw new ForbiddenException('需要编辑权限');
}

@Controller('api/research')
export class ResearchController {
  @Get('portraits')
  async portraits() {
    requireDb();
    return listPortraits();
  }

  @Get('portraits/:projectId')
  async portrait(@Param('projectId') projectId: string) {
    requireDb();
    const portrait = await getPortrait(projectId);
    if (!portrait) throw new NotFoundException('项目画像尚未保存');
    return portrait;
  }

  @Put('portraits/:projectId')
  async savePortrait(
    @Param('projectId') projectId: string,
    @Body() body: { data: unknown; version: number },
    @Req() req: Request,
  ) {
    requireDb();
    requireEditor(req);
    const saved = await savePortrait(projectId, body.data, body.version);
    if (!saved) throw new ConflictException('画像已被其他编辑者更新，请刷新后重试');
    return saved;
  }

  @Get('users')
  async users(@Query('projectId') projectId?: string) {
    requireDb();
    return listUsers(projectId);
  }

  @Post('users')
  async addUser(
    @Body() body: { projectId: string; data: ResearchUserData },
    @Req() req: Request,
  ) {
    requireDb();
    requireEditor(req);
    return createUser(body.projectId, body.data);
  }

  @Put('users/:id')
  async editUser(
    @Param('id') id: string,
    @Body() body: { data: ResearchUserData; version: number },
    @Req() req: Request,
  ) {
    requireDb();
    requireEditor(req);
    const result = await updateUser(id, body.data, body.version);
    if (result.status === 'missing') throw new NotFoundException('用户记录不存在');
    if (result.status === 'conflict') throw new ConflictException('记录已被其他编辑者更新，请刷新后重试');
    return result.user;
  }

  @Get('users/:id/history')
  async history(@Param('id') id: string) {
    requireDb();
    return getUserHistory(id);
  }
}
