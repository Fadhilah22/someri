<template>
  <div class="grid-bg" ref="gridRef">
    <canvas ref="canvasRef" class="grid-canvas" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const gridRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();

let animationId: number;
let mouse = { x: -999, y: -999 };

const GRID_SIZE = 20;
const GLOW_RADIUS = 150;
const PRIMARY = '#EE5717';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  const { r, g, b } = hexToRgb(PRIMARY);

  ctx.clearRect(0, 0, W, H);

  const cols = Math.ceil(W / GRID_SIZE);
  const rows = Math.ceil(H / GRID_SIZE);

  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      const x = i * GRID_SIZE;
      const y = j * GRID_SIZE;

      const dist = Math.hypot(mouse.x - x, mouse.y - y);
      const intensity = Math.max(0, 1 - dist / GLOW_RADIUS);

      // dot at each grid intersection
      const dotSize = 1 + intensity * 2.5;
      const alpha = 0.15 + intensity * 0.85;

      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();
    }
  }

  animationId = requestAnimationFrame(draw);
}

function resize() {
  const canvas = canvasRef.value;
  const grid = gridRef.value;
  if (!canvas || !grid) return;
  canvas.width = grid.offsetWidth;
  canvas.height = grid.offsetHeight;
}

function onMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
}

function onMouseLeave() {
  mouse = { x: -999, y: -999 };
}

onMounted(() => {
  resize();
  draw();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', resize);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseleave', onMouseLeave);
});
</script>

<style scoped>
.grid-bg {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.grid-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* make sure page content sits above canvas */
:deep(> *:not(.grid-canvas)) {
  position: relative;
  z-index: 1;
}
</style>