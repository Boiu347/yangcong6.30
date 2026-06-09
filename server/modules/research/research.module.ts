import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ensureResearchTables, hasResearchDb } from './research.db';

@Module({ controllers: [ResearchController] })
export class ResearchModule implements OnModuleInit {
  private readonly logger = new Logger(ResearchModule.name);

  async onModuleInit() {
    if (!hasResearchDb()) {
      this.logger.warn('DATABASE_URL not set - research API will return 503');
      return;
    }
    await ensureResearchTables();
  }
}
