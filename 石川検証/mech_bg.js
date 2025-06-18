// メカニカルな動きの背景アニメーション（Canvas）
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'mech-bg';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = 0;
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.38';
  document.body.prepend(canvas);
  
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  // 歯車やラインなどのパーツ定義
  const gears = Array.from({length: 7}, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 42 + Math.random() * 32,
    speed: 0.12 + Math.random() * 0.08,
    angle: Math.random() * Math.PI * 2,
    teeth: 8 + Math.floor(Math.random() * 6),
    color: `rgba(25,118,210,0.19)`
  }));
  const lines = Array.from({length: 14}, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    len: 120 + Math.random() * 120,
    angle: Math.random() * Math.PI * 2,
    speed: 0.05 + Math.random() * 0.06,
    color: 'rgba(110,180,255,0.10)'
  }));
  // 光る円（パルス）
  const pulses = Array.from({length: 5}, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    baseR: 36 + Math.random() * 42,
    t: Math.random() * 1000,
    color: 'rgba(25,118,210,0.13)'
  }));
  // サイバーなドット
  const dots = Array.from({length: 18}, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 2.8 + Math.random() * 2.2,
    angle: Math.random() * Math.PI * 2,
    speed: 0.08 + Math.random() * 0.08,
    color: 'rgba(110,180,255,0.22)'
  }));
  // 回転グリッド
  const grid = { cx: w/2, cy: h/2, r: Math.min(w,h)/2.2, angle: 0 };

  function drawPulse(p) {
    ctx.save();
    ctx.beginPath();
    const r = p.baseR + Math.sin(p.t/30)*12;
    ctx.arc(p.x, p.y, r, 0, Math.PI*2);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2.5 + Math.sin(p.t/20)*1.2;
    ctx.shadowColor = '#7eb0ff';
    ctx.shadowBlur = 18;
    ctx.globalAlpha = 0.55 + 0.15*Math.sin(p.t/40);
    ctx.stroke();
    ctx.restore();
  }
  function drawDot(d) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
    ctx.fillStyle = d.color;
    ctx.shadowColor = '#7eb0ff';
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.restore();
  }
  function drawGrid(g) {
    ctx.save();
    ctx.translate(g.cx, g.cy);
    ctx.rotate(g.angle);
    ctx.strokeStyle = 'rgba(25,118,210,0.12)';
    ctx.lineWidth = 1.4;
    for(let i=0; i<8; i++) {
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(Math.cos(i*Math.PI/4)*g.r, Math.sin(i*Math.PI/4)*g.r);
      ctx.stroke();
    }
    for(let r=0.25; r<1; r+=0.25) {
      ctx.beginPath();
      ctx.arc(0,0,g.r*r,0,Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawGear(g) {
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.angle);
    ctx.beginPath();
    for(let i=0; i<g.teeth; i++) {
      const a = (i/g.teeth)*Math.PI*2;
      ctx.lineTo(Math.cos(a)*g.r, Math.sin(a)*g.r);
      ctx.lineTo(Math.cos(a+0.15)*g.r*0.78, Math.sin(a+0.15)*g.r*0.78);
    }
    ctx.closePath();
    ctx.strokeStyle = g.color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#1976d2';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, g.r*0.7, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(36,52,74,0.19)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.stroke();
    ctx.restore();
  }
  function drawLine(l) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.angle);
    ctx.beginPath();
    ctx.moveTo(-l.len/2, 0);
    ctx.lineTo(l.len/2, 0);
    ctx.strokeStyle = l.color;
    ctx.lineWidth = 2.1;
    ctx.shadowColor = '#1976d2';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    // グリッド
    grid.cx = w/2; grid.cy = h/2; grid.r = Math.min(w,h)/2.2;
    drawGrid(grid);
    grid.angle += 0.0007;
    // パルス
    for(const p of pulses) {
      drawPulse(p);
      p.t += 1.6 + Math.random()*0.2;
      if(p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
        p.x = Math.random() * w; p.y = Math.random() * h;
      }
    }
    // ドット
    for(const d of dots) {
      drawDot(d);
      d.x += Math.cos(d.angle) * d.speed;
      d.y += Math.sin(d.angle) * d.speed;
      if(d.x < -20 || d.x > w+20 || d.y < -20 || d.y > h+20) {
        d.x = Math.random() * w; d.y = Math.random() * h;
      }
    }
    // 歯車・ライン
    for(const g of gears) {
      drawGear(g);
      g.angle += g.speed * 0.008;
    }
    for(const l of lines) {
      drawLine(l);
      l.x += Math.cos(l.angle) * l.speed;
      l.y += Math.sin(l.angle) * l.speed;
      if(l.x < -200 || l.x > w+200 || l.y < -200 || l.y > h+200) {
        l.x = Math.random() * w;
        l.y = Math.random() * h;
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
});
