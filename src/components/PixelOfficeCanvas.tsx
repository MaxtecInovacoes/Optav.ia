import React, { useEffect, useRef, useState } from 'react';

interface PixelOfficeCanvasProps {
  isRunning?: boolean;
  activeAgent?: string;
  latestLogMessage?: string;
}

export const PixelOfficeCanvas: React.FC<PixelOfficeCanvasProps> = ({
  isRunning = false,
  activeAgent = 'Liam',
  latestLogMessage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({ agentCount: 9, productivity: 85, lastEvent: 'STANDBY' });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 800;
    const H = 400;
    canvas.width = W;
    canvas.height = H;

    let animFrameId: number;

    // Palette
    const P = {
      floorA: '#f0ece0',
      floorB: '#e8e4d8',
      floorGrid: '#d8d4c8',
      glassWall: '#5b8fa8',
      glassWallLight: '#7ab0c8',
      glassWallDark: '#3d6e88',
      glassFrame: '#8ab8cc',
      deskTop: '#d4a843',
      deskFront: '#b8882a',
      deskShadow: '#8a6010',
      bigTop: '#c8922a',
      bigFront: '#a07018',
      meetTop: '#4a9fd4',
      meetFront: '#2a7ab0',
      meetEdge: '#6ab8e8',
      chairSeat: '#e07060',
      chairBack: '#c05040',
      chairLeg: '#1a1a2a',
      leafDark: '#1b5e20',
      leafMid: '#2e7d32',
      leafLight: '#43a047',
      skinA: '#fdbcb4',
      skinB: '#f0c27f',
      shadow: 'rgba(0,0,0,0.18)',
      cafeWall: '#8b6f47',
    };

    // Helper to create mini canvas
    function mc(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return [c, c.getContext('2d')!];
    }

    // Agent class
    class Agent {
      name: string;
      role: string;
      female: boolean;
      homeX: number;
      homeY: number;
      x: number;
      y: number;
      spd: number;
      color: string;
      fr = 0;
      ft = 0;
      fd = 0.13;
      state = 'working';
      st = 0;
      sd = 4 + Math.random() * 8;
      bubbleText: string | null = null;
      bubbleTimer = 0;
      path: { x: number; y: number }[] = [];

      constructor(def: { name: string; role: string; color: string; female: boolean; homeX: number; homeY: number }) {
        this.name = def.name;
        this.role = def.role;
        this.color = def.color;
        this.female = def.female;
        this.homeX = def.homeX;
        this.homeY = def.homeY;
        this.x = def.homeX;
        this.y = def.homeY;
        this.spd = 45 + Math.random() * 20;
      }

      say(msg: string) {
        this.bubbleText = msg;
        this.bubbleTimer = 4.5;
      }

      navigateTo(tx: number, ty: number) {
        this.path = [{ x: tx, y: ty }];
      }

      update(dt: number) {
        this.st += dt;
        if (this.st >= this.sd) {
          this.st = 0;
          this.sd = 5 + Math.random() * 10;
          if (Math.random() < 0.25) {
            this.state = 'walking';
            const tx = 50 + Math.random() * 500;
            const ty = 50 + Math.random() * 300;
            this.navigateTo(tx, ty);
          } else {
            this.state = 'working';
            this.navigateTo(this.homeX + (Math.random() - 0.5) * 6, this.homeY + (Math.random() - 0.5) * 6);
          }
        }

        if (this.bubbleTimer > 0) {
          this.bubbleTimer -= dt;
          if (this.bubbleTimer <= 0) this.bubbleText = null;
        }

        if (this.path.length > 0) {
          const target = this.path[0];
          const dx = target.x - this.x;
          const dy = target.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 4) {
            this.path.shift();
          } else {
            const step = this.spd * dt;
            this.x += (dx / dist) * Math.min(step, dist);
            this.y += (dy / dist) * Math.min(step, dist);
            this.ft += dt;
            if (this.ft >= this.fd) {
              this.ft = 0;
              this.fr = (this.fr + 1) % 4;
            }
          }
        } else {
          this.fr = 1;
        }
      }

      draw(cCtx: CanvasRenderingContext2D) {
        // Draw character
        cCtx.save();
        // Shadow
        cCtx.fillStyle = 'rgba(0,0,0,0.2)';
        cCtx.beginPath();
        cCtx.ellipse(this.x, this.y + 4, 10, 3, 0, 0, Math.PI * 2);
        cCtx.fill();

        // Body
        cCtx.fillStyle = this.color;
        cCtx.fillRect(this.x - 7, this.y - 18, 14, 16);

        // Head
        cCtx.fillStyle = this.female ? P.skinA : P.skinB;
        cCtx.beginPath();
        cCtx.arc(this.x, this.y - 24, 7, 0, Math.PI * 2);
        cCtx.fill();

        // Hair
        cCtx.fillStyle = this.female ? '#6d1b7b' : '#1a1a1a';
        cCtx.beginPath();
        cCtx.arc(this.x, this.y - 27, 7, Math.PI, Math.PI * 2);
        cCtx.fill();

        // Name tag
        cCtx.font = 'bold 8px "JetBrains Mono", monospace';
        cCtx.textAlign = 'center';
        const tw = cCtx.measureText(this.name).width;
        cCtx.fillStyle = 'rgba(10,12,20,0.9)';
        cCtx.fillRect(this.x - tw / 2 - 4, this.y - 38, tw + 8, 12);
        cCtx.strokeStyle = '#00FFB3';
        cCtx.lineWidth = 1;
        cCtx.strokeRect(this.x - tw / 2 - 4, this.y - 38, tw + 8, 12);
        cCtx.fillStyle = '#00FFB3';
        cCtx.fillText(this.name, this.x, this.y - 29);

        // Speech Bubble
        if (this.bubbleText) {
          cCtx.font = 'bold 10px "DM Sans", sans-serif';
          const bw = Math.min(180, cCtx.measureText(this.bubbleText).width + 16);
          const bh = 22;
          const bx = Math.max(10, Math.min(W - bw - 10, this.x - bw / 2));
          const by = this.y - 62;

          cCtx.fillStyle = '#ffffff';
          cCtx.strokeStyle = '#9333ea';
          cCtx.lineWidth = 1.5;
          cCtx.beginPath();
          cCtx.roundRect(bx, by, bw, bh, 6);
          cCtx.fill();
          cCtx.stroke();

          // Tail
          cCtx.beginPath();
          cCtx.moveTo(this.x - 4, by + bh);
          cCtx.lineTo(this.x, by + bh + 6);
          cCtx.lineTo(this.x + 4, by + bh);
          cCtx.fill();
          cCtx.stroke();

          cCtx.fillStyle = '#0a0714';
          cCtx.textAlign = 'center';
          cCtx.fillText(
            this.bubbleText.length > 28 ? this.bubbleText.substring(0, 26) + '...' : this.bubbleText,
            bx + bw / 2,
            by + 15
          );
        }

        cCtx.restore();
      }
    }

    // Define Agents
    const agentsData = [
      { name: 'Liam', role: 'Dev', color: '#3730a3', female: false, homeX: 90, homeY: 85 },
      { name: 'Theo', role: 'Designer', color: '#7e22ce', female: false, homeX: 200, homeY: 85 },
      { name: 'Liz', role: 'QA', color: '#92400e', female: true, homeX: 90, homeY: 195 },
      { name: 'Bryan', role: 'Marketing', color: '#7c2d12', female: false, homeX: 200, homeY: 195 },
      { name: 'Alex', role: 'Fotos', color: '#b45309', female: false, homeX: 320, homeY: 85 },
      { name: 'Hunter', role: 'Hunter', color: '#065f46', female: false, homeX: 320, homeY: 195 },
      { name: 'Caio', role: 'Analista', color: '#7c3aed', female: false, homeX: 440, homeY: 85 },
      { name: 'Renata', role: 'CEO', color: '#4a044e', female: true, homeX: 680, homeY: 110 },
      { name: 'Franz', role: 'SEO', color: '#064e3b', female: false, homeX: 680, homeY: 300 },
    ];

    const agents = agentsData.map((d) => new Agent(d));

    // Render floor & static furniture
    function drawEnvironment() {
      // Floor
      for (let x = 0; x < W; x += 32) {
        for (let y = 0; y < H; y += 32) {
          ctx.fillStyle = ((x / 32) + (y / 32)) % 2 === 0 ? P.floorA : P.floorB;
          ctx.fillRect(x, y, 32, 32);
          ctx.strokeStyle = P.floorGrid;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, 32, 32);
        }
      }

      // Glass Wall Left
      ctx.fillStyle = P.glassWall;
      ctx.fillRect(0, 0, 20, H);
      ctx.fillStyle = P.glassWallLight;
      ctx.fillRect(0, 0, 20, 4);

      // Office Desks
      const desks = [
        { x: 60, y: 60 },
        { x: 170, y: 60 },
        { x: 60, y: 170 },
        { x: 170, y: 170 },
        { x: 290, y: 60 },
        { x: 290, y: 170 },
        { x: 410, y: 60 },
      ];

      desks.forEach((d) => {
        // Desk
        ctx.fillStyle = P.deskFront;
        ctx.fillRect(d.x, d.y + 20, 50, 8);
        ctx.fillStyle = P.deskTop;
        ctx.fillRect(d.x, d.y, 50, 20);
        ctx.strokeStyle = P.deskShadow;
        ctx.strokeRect(d.x, d.y, 50, 20);

        // Monitor
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(d.x + 14, d.y - 12, 22, 14);
        ctx.fillStyle = '#00FFB3';
        ctx.fillRect(d.x + 16, d.y - 10, 18, 10);
      });

      // Meeting Table in middle
      ctx.fillStyle = P.meetFront;
      ctx.fillRect(280, 280, 130, 10);
      ctx.fillStyle = P.meetTop;
      ctx.fillRect(280, 240, 130, 40);
      ctx.strokeStyle = P.meetEdge;
      ctx.strokeRect(280, 240, 130, 40);

      // Glass Divider for CEO/Audit Rooms on Right
      ctx.fillStyle = P.glassWall;
      ctx.fillRect(590, 0, 16, H);
      ctx.fillRect(590, 195, 210, 10);

      // Room Labels
      ctx.font = 'bold 9px "Press Start 2P", monospace';
      ctx.fillStyle = '#c084fc';
      ctx.fillText('RENATA // CEO', 620, 20);
      ctx.fillStyle = '#00FFB3';
      ctx.fillText('FRANZ // AUDITORIA', 620, 220);
    }

    let lastTime = performance.now();

    function renderLoop(time: number) {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, W, H);
      drawEnvironment();

      // Trigger message on active agent if log message arrives
      if (latestLogMessage) {
        const targetAg = agents.find(a => a.name.toLowerCase() === activeAgent.toLowerCase()) || agents[0];
        if (targetAg && !targetAg.bubbleText) {
          targetAg.say(latestLogMessage);
        }
      }

      // Random speech if running
      if (isRunning && Math.random() < 0.02) {
        const randomAg = agents[Math.floor(Math.random() * agents.length)];
        if (!randomAg.bubbleText) {
          const msgs = ['Scraping Google Places...', 'Otimizando SEO...', 'Deploy Cloudflare OK!', 'WhatsApp lead contatado!'];
          randomAg.say(msgs[Math.floor(Math.random() * msgs.length)]);
        }
      }

      agents.sort((a, b) => a.y - b.y);
      agents.forEach((ag) => {
        ag.update(dt);
        ag.draw(ctx);
      });

      animFrameId = requestAnimationFrame(renderLoop);
    }

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isRunning, activeAgent, latestLogMessage]);

  return (
    <div className="w-full bg-[#0d0d12] border border-purple-500/20 rounded-lg overflow-hidden font-mono text-xs shadow-2xl">
      {/* Top Header Bar */}
      <div className="bg-[#060608] px-4 py-2 border-b border-purple-500/20 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center space-x-2 font-brand text-cyan-400">
          <span>🖥️ PIXEL OFFICE // OPTAV.IA AGENTS</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>AGENTES: <strong className="text-cyan-400">{stats.agentCount} ACTIVE</strong></span>
          <span>PRODUTIVIDADE: <strong className="text-purple-400">{isRunning ? '98%' : '20%'}</strong></span>
          <span className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`}></span>
            <span className="text-slate-300 uppercase">{isRunning ? 'PIPELINE RUNNING' : 'STANDBY'}</span>
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-[#0a0714] w-full flex justify-center p-2">
        <canvas
          ref={canvasRef}
          className="w-full h-auto max-w-[800px] aspect-[2/1] rounded border border-slate-800 shadow-inner"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
};
