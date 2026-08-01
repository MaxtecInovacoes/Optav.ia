import { logger } from './logger.js';

export interface PipelineJobData {
  jobId: string;
  leadId: string;
  tenantId: string;
  stage: 'scrape' | 'persona' | 'build' | 'deploy' | 'outreach' | 'sdr';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

const jobStore = new Map<string, PipelineJobData>();

export const pipelineQueue = {
  async addJob(leadId: string, tenantId: string, stage: PipelineJobData['stage']): Promise<PipelineJobData> {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const job: PipelineJobData = {
      jobId,
      leadId,
      tenantId,
      stage,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    jobStore.set(jobId, job);
    logger.info({ jobId, leadId, stage }, '[PipelineQueue] Job added');
    return job;
  },

  getJob(jobId: string): PipelineJobData | undefined {
    return jobStore.get(jobId);
  },

  updateJobStatus(jobId: string, updates: Partial<PipelineJobData>): void {
    const job = jobStore.get(jobId);
    if (job) {
      Object.assign(job, updates, { updatedAt: new Date().toISOString() });
      jobStore.set(jobId, job);
    }
  }
};
