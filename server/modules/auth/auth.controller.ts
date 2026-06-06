import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';

export type AuthRole = 'viewer' | 'editor';

@Controller('api/auth')
export class AuthController {
  /** 入口验证：READ_PASSWORD 或 EDIT_PASSWORD 均可进入，统一给 viewer 权限 */
  @Post('verify')
  verify(@Body() body: { password?: string }): { ok: true; role: 'viewer' } {
    const readPw = process.env.READ_PASSWORD || process.env.ACCESS_PASSWORD || '';
    const editPw = process.env.EDIT_PASSWORD || '';
    if (!readPw && !editPw) return { ok: true, role: 'viewer' };

    const pw = body?.password ?? '';
    if ((readPw && pw === readPw) || (editPw && pw === editPw)) {
      return { ok: true, role: 'viewer' };
    }
    throw new UnauthorizedException('密码错误');
  }

  /** 站内编辑解锁：验证编辑密码，成功后前端自行升级为 editor */
  @Post('verify-editor')
  verifyEditor(@Body() body: { password?: string }): { ok: true } {
    const editPw = process.env.EDIT_PASSWORD || '';
    if (!editPw) return { ok: true };

    const pw = body?.password ?? '';
    if (pw !== editPw) throw new UnauthorizedException('编辑密码错误');
    return { ok: true };
  }
}
