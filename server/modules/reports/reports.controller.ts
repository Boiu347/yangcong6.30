import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const REPORTS_DIR = path.join(process.cwd(), 'uploads', 'reports');

function ensureDir() {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function sidecarPath(filename: string) {
  return path.join(REPORTS_DIR, filename + '.name');
}

@Controller('api/reports')
export class ReportsController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => { ensureDir(); cb(null, REPORTS_DIR); },
        filename: (_req, _file, cb) => {
          cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.md`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() === '.md') cb(null, true);
        else cb(new BadRequestException('只支持上传 .md 文件'), false);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const displayName = path.basename(originalName, '.md');
    fs.writeFileSync(sidecarPath(file.filename), displayName, 'utf-8');
    return { id: path.basename(file.filename, '.md'), name: displayName, size: file.size };
  }

  @Get()
  list() {
    ensureDir();
    return fs.readdirSync(REPORTS_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((filename) => {
        const stat = fs.statSync(path.join(REPORTS_DIR, filename));
        const sc = sidecarPath(filename);
        const name = fs.existsSync(sc) ? fs.readFileSync(sc, 'utf-8').trim() : path.basename(filename, '.md');
        return { id: path.basename(filename, '.md'), name, createdAt: stat.birthtime.toISOString() };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  @Get(':id/content')
  content(@Param('id') id: string, @Res() res: Response) {
    const filepath = path.join(REPORTS_DIR, `${id}.md`);
    if (!fs.existsSync(filepath)) throw new NotFoundException('报告不存在');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.sendFile(filepath);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const filepath = path.join(REPORTS_DIR, `${id}.md`);
    if (!fs.existsSync(filepath)) throw new NotFoundException('报告不存在');
    fs.unlinkSync(filepath);
    const sc = sidecarPath(path.basename(filepath));
    if (fs.existsSync(sc)) fs.unlinkSync(sc);
    return { ok: true };
  }
}
