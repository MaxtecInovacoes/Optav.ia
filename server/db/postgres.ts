import pkg from 'pg';
const { Pool } = pkg;
import { logger } from '../logger.js';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://fralib_user:fralib_dev_password@localhost:5432/fralib_db';

let poolInstance: pkg.Pool | null = null;

export function getPostgresPool(): pkg.Pool {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    poolInstance.on('error', (err) => {
      logger.error({ err }, '[Postgres] Unexpected error on idle client');
    });
  }
  return poolInstance;
}

export async function initPostgresTables(): Promise<boolean> {
  const pool = getPostgresPool();
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        -- Tenants Table
        CREATE TABLE IF NOT EXISTS tenants (
          id VARCHAR(64) PRIMARY KEY,
          name TEXT NOT NULL,
          segment VARCHAR(32) NOT NULL,
          region TEXT,
          plan VARCHAR(32) DEFAULT 'pro',
          target_queue_goal INT DEFAULT 300,
          min_queue_threshold INT DEFAULT 50,
          auto_refill_enabled BOOLEAN DEFAULT false,
          exhausted_warning TEXT,
          sdr_config JSONB NOT NULL DEFAULT '{}',
          whatsapp_connected BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Leads Table
        CREATE TABLE IF NOT EXISTS leads (
          id VARCHAR(64) PRIMARY KEY,
          tenant_id VARCHAR(64) REFERENCES tenants(id),
          name TEXT NOT NULL,
          category TEXT,
          segment VARCHAR(32) NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          address TEXT NOT NULL,
          opening_hours TEXT,
          existing_site_url TEXT,
          rating NUMERIC(3,1),
          reviews_count INT DEFAULT 0,
          has_website BOOLEAN DEFAULT false,
          site_health_score INT DEFAULT 0,
          qualification_score INT,
          qualification_reason TEXT,
          is_disqualified BOOLEAN DEFAULT false,
          disqualification_reason TEXT,
          manual_override BOOLEAN DEFAULT false,
          email_sent BOOLEAN DEFAULT false,
          email_sent_at TIMESTAMPTZ,
          review_quotes TEXT[],
          pipeline_status VARCHAR(32) DEFAULT 'aguardando',
          pipeline_stage VARCHAR(32) DEFAULT 'pending',
          sale_value NUMERIC(10,2),
          sale_date DATE,
          site_created_at TIMESTAMPTZ,
          site_deployed_at TIMESTAMPTZ,
          site_url TEXT,
          last_message_at TIMESTAMPTZ,
          last_reply_at TIMESTAMPTZ,
          reviews_sample JSONB DEFAULT '[]',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_leads_tenant_status ON leads(tenant_id, pipeline_status);
        CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(pipeline_stage);

        -- Personas Table
        CREATE TABLE IF NOT EXISTS personas (
          lead_id VARCHAR(64) PRIMARY KEY REFERENCES leads(id),
          tenant_id VARCHAR(64) REFERENCES tenants(id),
          publico_alvo TEXT,
          dores TEXT[],
          tom_mensagem TEXT,
          keywords TEXT[],
          persona_summary TEXT,
          recommended_colors JSONB DEFAULT '{}',
          recommended_fonts JSONB DEFAULT '{}'
        );

        -- Sites Table
        CREATE TABLE IF NOT EXISTS sites (
          lead_id VARCHAR(64) PRIMARY KEY REFERENCES leads(id),
          tenant_id VARCHAR(64) REFERENCES tenants(id),
          template VARCHAR(32),
          provider VARCHAR(32),
          prd JSONB,
          copy JSONB DEFAULT '{}',
          colors JSONB DEFAULT '{}',
          fonts JSONB DEFAULT '{}',
          images JSONB DEFAULT '{}',
          logo_url TEXT,
          sections JSONB DEFAULT '[]',
          faqs JSONB DEFAULT '[]',
          deployed_url TEXT,
          deployed_at TIMESTAMPTZ,
          compiled_html TEXT,
          vision_score NUMERIC(3,1),
          chunks_count INT,
          version INT DEFAULT 1,
          history JSONB DEFAULT '[]'
        );

        -- Conversation Messages Table
        CREATE TABLE IF NOT EXISTS conversation_messages (
          id VARCHAR(64) PRIMARY KEY,
          lead_id VARCHAR(64) REFERENCES leads(id),
          tenant_id VARCHAR(64) REFERENCES tenants(id),
          role VARCHAR(16) NOT NULL CHECK (role IN ('sdr','lead','human')),
          text TEXT NOT NULL,
          sent_at TIMESTAMPTZ DEFAULT NOW(),
          sdr_name TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_messages_lead ON conversation_messages(lead_id, sent_at);

        -- Decision Records Table
        CREATE TABLE IF NOT EXISTS decision_records (
          id VARCHAR(64) PRIMARY KEY,
          agent VARCHAR(64) NOT NULL,
          tenant_id VARCHAR(64) REFERENCES tenants(id),
          lead_id VARCHAR(64) REFERENCES leads(id),
          context JSONB DEFAULT '{}',
          decision JSONB DEFAULT '{}',
          outcome VARCHAR(32) CHECK (outcome IN ('success','fail','partial')),
          metrics JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Learning Patterns Table
        CREATE TABLE IF NOT EXISTS learning_patterns (
          id VARCHAR(64) PRIMARY KEY,
          pattern TEXT NOT NULL,
          agent VARCHAR(64) NOT NULL,
          scope VARCHAR(32) CHECK (scope IN ('global','segment','region')),
          segment VARCHAR(32),
          region TEXT,
          confidence NUMERIC(3,2) DEFAULT 0.85,
          n_examples INT DEFAULT 0,
          prompt_delta TEXT,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Audit Logs Table
        CREATE TABLE IF NOT EXISTS audit_logs (
          id VARCHAR(64) PRIMARY KEY,
          actor TEXT NOT NULL,
          action TEXT NOT NULL,
          details TEXT,
          timestamp TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

        -- Pipeline Events Table
        CREATE TABLE IF NOT EXISTS pipeline_events (
          id VARCHAR(64) PRIMARY KEY,
          lead_id VARCHAR(64) REFERENCES leads(id),
          tenant_id VARCHAR(64) REFERENCES tenants(id),
          stage VARCHAR(64) NOT NULL,
          event VARCHAR(32) CHECK (event IN ('started','completed','failed','retried')),
          agent VARCHAR(64),
          output JSONB,
          error TEXT,
          duration_ms INT,
          trace_id VARCHAR(64),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Lost Leads Table
        CREATE TABLE IF NOT EXISTS lost_leads (
          id VARCHAR(64) PRIMARY KEY,
          lead_id VARCHAR(64) REFERENCES leads(id),
          tenant_id VARCHAR(64) REFERENCES tenants(id),
          reason VARCHAR(32) CHECK (reason IN ('preco','timing','concorrente','sem_interesse','outro')),
          notes TEXT,
          value_lost NUMERIC(10,2),
          lost_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Agent Prompt Versions Table
        CREATE TABLE IF NOT EXISTS agent_prompt_versions (
          id VARCHAR(64) PRIMARY KEY,
          agent VARCHAR(64) NOT NULL,
          version INT NOT NULL,
          prompt_text TEXT NOT NULL,
          active BOOLEAN DEFAULT false,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Cakto Events Table (Idempotency)
        CREATE TABLE IF NOT EXISTS cakto_events (
          id VARCHAR(64) PRIMARY KEY,
          cakto_event_id VARCHAR(255) UNIQUE NOT NULL,
          tenant_id VARCHAR(255) NOT NULL,
          event_type VARCHAR(50) NOT NULL,
          payload JSONB NOT NULL,
          processed BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Admins Table
        CREATE TABLE IF NOT EXISTS admins (
          id VARCHAR(64) PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(32) NOT NULL DEFAULT 'admin',
          tenant_id VARCHAR(64),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          last_login_at TIMESTAMPTZ
        );

        -- Sessions Table
        CREATE TABLE IF NOT EXISTS sessions (
          id VARCHAR(64) PRIMARY KEY,
          admin_user_id VARCHAR(64) REFERENCES admins(id),
          token TEXT NOT NULL,
          refresh_token TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Whatsmeow LID Map Table
        CREATE TABLE IF NOT EXISTS whatsmeow_lid_map (
          lid VARCHAR(64) PRIMARY KEY,
          phone VARCHAR(32) NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      client.release();
      logger.info('[Postgres] Schema initialized successfully');
      return true;
    } catch (err) {
      client.release();
      logger.warn({ err }, '[Postgres] Failed executing table init script');
      return false;
    }
  } catch (err) {
    logger.warn('[Postgres] Could not connect to PostgreSQL pool on startup. Operating in dual mode.');
    return false;
  }
}
