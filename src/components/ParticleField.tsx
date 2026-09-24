import { useEffect, useRef } from 'react'

// A field of drifting particles that briefly settles into a shape, holds, then dissolves.
// Shapes are hints only: code braces, a signature, a diamond, the Azrieli towers.

type Draw = (ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) => void

const MONO = "'JetBrains Mono', ui-monospace, monospace"

const HOUSE: Draw = (ctx, cx, cy, s) => {
    const w = s * 0.9
    const h = s * 0.55
    ctx.lineWidth = Math.max(4, s * 0.05)
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(cx - w / 2, cy - h / 2 + h * 0.05)
    ctx.lineTo(cx, cy - h / 2 - h * 0.7)
    ctx.lineTo(cx + w / 2, cy - h / 2 + h * 0.05)
    ctx.moveTo(cx - w * 0.38, cy - h * 0.35)
    ctx.lineTo(cx - w * 0.38, cy + h / 2)
    ctx.lineTo(cx + w * 0.38, cy + h / 2)
    ctx.lineTo(cx + w * 0.38, cy - h * 0.35)
    ctx.stroke()
  }

const AZRIELI: Draw = (ctx, cx, cy, s) => {
  // the three Azrieli towers, in real proportion: square (left), round (centre, tallest), triangular (right)
  const P = (x: number, y: number): [number, number] => [cx + x * s, cy + (y + 0.1) * s]
  const G = 0.5 // street level
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.lineWidth = Math.max(4, s * 0.032)
  ctx.beginPath()

  // square tower
  ctx.moveTo(...P(-0.5, G))
  ctx.lineTo(...P(-0.5, -0.34))
  ctx.lineTo(...P(-0.24, -0.34))
  ctx.lineTo(...P(-0.24, G))

  // round tower: straight walls under an elliptical roof rim
  const rx0 = -0.18, rx1 = 0.1, rTop = -0.7
  const [ex, ey] = P((rx0 + rx1) / 2, rTop)
  const rrx = ((rx1 - rx0) / 2) * s
  ctx.moveTo(...P(rx0, G))
  ctx.lineTo(...P(rx0, rTop))
  ctx.moveTo(...P(rx1, rTop))
  ctx.lineTo(...P(rx1, G))
  ctx.moveTo(ex + rrx, ey)
  ctx.ellipse(ex, ey, rrx, 0.045 * s, 0, 0, Math.PI * 2)

  // triangular tower: two faces meeting at a front edge
  ctx.moveTo(...P(0.16, G))
  ctx.lineTo(...P(0.16, -0.52))
  ctx.lineTo(...P(0.28, -0.47))
  ctx.lineTo(...P(0.46, -0.53))
  ctx.lineTo(...P(0.46, G))
  ctx.moveTo(...P(0.28, -0.47))
  ctx.lineTo(...P(0.28, G))
  ctx.stroke()

  // street
  ctx.lineWidth = Math.max(3, s * 0.026)
  ctx.beginPath()
  ctx.moveTo(...P(-0.62, G))
  ctx.lineTo(...P(0.58, G))
  ctx.stroke()
}

// The real-estate hint. Dev only: ?re=house or ?re=skyline overrides it for comparison.
const RE_CHOICE = import.meta.env.DEV ? new URLSearchParams(location.search).get('re') : null
const REAL_ESTATE: Draw = RE_CHOICE === 'house' ? HOUSE : AZRIELI

// The code hint. Dev only: ?code=tags shows </> instead of { } for comparison.
const CODE_GLYPH = import.meta.env.DEV && new URLSearchParams(location.search).get('code') === 'tags' ? '</>' : '{ }'
const CODE: Draw = (ctx, cx, cy, s) => {
  ctx.font = `300 ${CODE_GLYPH === '</>' ? s * 0.8 : s}px ${MONO}`
  ctx.fillText(CODE_GLYPH, cx, cy)
}

const SHAPES: Draw[] = [
  CODE,
  (ctx, cx, cy, s) => {
    // "sign here": X, a signature line, a handwritten squiggle and the pen finishing it
    const P = (x: number, y: number): [number, number] => [cx + x * s, cy + y * s]
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    // baseline + X
    ctx.lineWidth = Math.max(3, s * 0.026)
    ctx.beginPath()
    ctx.moveTo(...P(-0.58, 0.34))
    ctx.lineTo(...P(0.42, 0.34))
    ctx.moveTo(...P(-0.56, 0.18))
    ctx.lineTo(...P(-0.46, 0.28))
    ctx.moveTo(...P(-0.46, 0.18))
    ctx.lineTo(...P(-0.56, 0.28))
    ctx.stroke()

    // signature
    ctx.lineWidth = Math.max(3, s * 0.03)
    ctx.beginPath()
    ctx.moveTo(...P(-0.36, 0.24))
    ctx.bezierCurveTo(...P(-0.37, 0.1), ...P(-0.3, 0.0), ...P(-0.26, 0.04))
    ctx.bezierCurveTo(...P(-0.22, 0.08), ...P(-0.25, 0.26), ...P(-0.2, 0.26))
    ctx.bezierCurveTo(...P(-0.15, 0.26), ...P(-0.15, 0.12), ...P(-0.11, 0.12))
    ctx.bezierCurveTo(...P(-0.07, 0.12), ...P(-0.08, 0.24), ...P(-0.04, 0.24))
    ctx.bezierCurveTo(...P(0.0, 0.24), ...P(0.02, 0.16), ...P(0.05, 0.16))
    ctx.stroke()

    // pen, tip resting where the signature ends, body rising to the upper right
    const L = (v: number) => v * s
    ctx.save()
    ctx.translate(...P(0.05, 0.16))
    ctx.rotate(-Math.PI / 4)
    ctx.lineWidth = Math.max(4, s * 0.034)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(L(0.15), -L(0.07))
    ctx.lineTo(L(0.72), -L(0.07))
    ctx.lineTo(L(0.72), L(0.07))
    ctx.lineTo(L(0.15), L(0.07))
    ctx.closePath()
    ctx.moveTo(L(0.15), -L(0.07))
    ctx.lineTo(L(0.15), L(0.07))
    // cap button
    ctx.rect(L(0.72), -L(0.028), L(0.06), L(0.056))
    // clip
    ctx.moveTo(L(0.66), -L(0.07))
    ctx.lineTo(L(0.66), -L(0.115))
    ctx.lineTo(L(0.44), -L(0.115))
    ctx.stroke()
    ctx.restore()
  },
  (ctx, cx, cy, s) => {
    // brilliant-cut diamond: table, crown facets, girdle, pavilion
    const W = s * 1.05
    const H = s * 0.85
    const yT = cy - H * 0.42
    const yG = cy - H * 0.14
    const yP = cy + H * 0.52
    const X = (f: number) => cx + W * f
    ctx.lineWidth = Math.max(4, s * 0.04)
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(X(-0.25), yT)
    ctx.lineTo(X(0.25), yT)
    ctx.lineTo(X(0.5), yG)
    ctx.lineTo(cx, yP)
    ctx.lineTo(X(-0.5), yG)
    ctx.closePath()
    ctx.moveTo(X(-0.5), yG)
    ctx.lineTo(X(0.5), yG)
    ctx.moveTo(X(-0.5), yG)
    ctx.lineTo(X(-0.25), yT)
    ctx.lineTo(X(-0.125), yG)
    ctx.lineTo(X(0), yT)
    ctx.lineTo(X(0.125), yG)
    ctx.lineTo(X(0.25), yT)
    ctx.lineTo(X(0.5), yG)
    ctx.moveTo(X(-0.125), yG)
    ctx.lineTo(cx, yP)
    ctx.lineTo(X(0.125), yG)
    ctx.stroke()
  },
  REAL_ESTATE,
]

const HOLD = 3200
const FREE = 2600
const COLORS = ['127,227,161', '217,178,111', '231,229,223']

type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; c: number; a: number; r: number; s: number }

function sample(draw: Draw, w: number, h: number, cy: number, n: number): [number, number][] {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const ctx = off.getContext('2d', { willReadFrequently: true })!
  ctx.fillStyle = ctx.strokeStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  draw(ctx, w / 2, cy, Math.min(w * 0.5, h * 0.34))
  const data = ctx.getImageData(0, 0, w, h).data
  const gap = Math.max(3, Math.round(Math.sqrt((w * h) / 90000)))
  const pts: [number, number][] = []
  for (let y = 0; y < h; y += gap)
    for (let x = 0; x < w; x += gap) if (data[(y * w + x) * 4 + 3] > 140)
        pts.push([x + (Math.random() - 0.5) * gap * 1.6, y + (Math.random() - 0.5) * gap * 1.6])
  for (let i = pts.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    ;[pts[i], pts[j]] = [pts[j], pts[i]]
  }
  return Array.from({ length: n }, (_, i) => pts[i % Math.max(1, pts.length)] ?? [w / 2, cy])
}

export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, dpr = 1, raf = 0
    let targets: [number, number][][] = []
    let particles: P[] = []
    let shape = SHAPES.length - 1 // advances to 0 on the first settle
    let phaseStart = performance.now()
    let settled = false
    let cancelled = false
    // dev only: ?shape=N pins one shape for review
    const pinned = import.meta.env.DEV ? new URLSearchParams(location.search).get('shape') : null
    if (pinned !== null) shape = (Number(pinned) - 1 + SHAPES.length) % SHAPES.length
    const mouse = { x: -9999, y: -9999 }

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = w < 640 ? 700 : 1400
      const cy = h * 0.4
      targets = SHAPES.map((d) => sample(d, w, h, cy, n))
      if (particles.length !== n)
        particles = Array.from({ length: n }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          tx: 0,
          ty: 0,
          c: Math.random() < 0.46 ? 0 : Math.random() < 0.8 ? 1 : 2,
          a: 0.25 + Math.random() * 0.6,
          r: 0.6 + Math.random() * 1.1,
          s: Math.random() * Math.PI * 2,
        }))
      assign()
    }

    const assign = () => {
      const t = targets[shape]
      particles.forEach((p, i) => {
        p.tx = t[i][0]
        p.ty = t[i][1]
      })
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(${COLORS[p.c]},${p.a})`
        ctx.fillRect(p.tx, p.ty, p.r * 1.4, p.r * 1.4)
      })
    }

    const tick = (now: number) => {
      const elapsed = now - phaseStart
      if (settled && elapsed > HOLD && pinned === null) {
        settled = false
        phaseStart = now
      } else if (!settled && elapsed > FREE) {
        settled = true
        phaseStart = now
        shape = (shape + 1) % SHAPES.length
        assign()
      }

      ctx.clearRect(0, 0, w, h)
      const t = now * 0.0003
      for (const p of particles) {
        if (settled) {
          // pull home, with a faint shimmer so the shape breathes
          p.vx += (p.tx + Math.sin(t * 6 + p.ty * 0.05) * 1.2 - p.x) * 0.012
          p.vy += (p.ty + Math.cos(t * 6 + p.tx * 0.05) * 1.2 - p.y) * 0.012
        } else {
          // gentle shared current plus a personal wander, so they spread like dust instead of streaking
          p.vx += Math.sin(p.y * 0.004 + t) * 0.015 + Math.cos(t * 9 + p.s) * 0.03
          p.vy += Math.cos(p.x * 0.004 - t) * 0.015 + Math.sin(t * 7 + p.s * 1.7) * 0.03
        }
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 9000) {
          const f = (9000 - d2) / 9000
          p.vx += (dx / 30) * f
          p.vy += (dy / 30) * f
        }
        p.vx *= settled ? 0.86 : 0.96
        p.vy *= settled ? 0.86 : 0.96
        p.x += p.vx
        p.y += p.vy
        if (!settled) {
          if (p.x < 0) p.x += w
          else if (p.x > w) p.x -= w
          if (p.y < 0) p.y += h
          else if (p.y > h) p.y -= h
        }
        ctx.fillStyle = `rgba(${COLORS[p.c]},${p.a})`
        ctx.fillRect(p.x, p.y, p.r * 1.4, p.r * 1.4)
      }
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }
    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        build()
        if (reduced) drawStatic()
      }, 150)
    }

    // Wait for fonts so the glyphs sample correctly.
    Promise.all([document.fonts.load(`300 100px ${MONO}`, '{ }</>')]).catch(() => {}).then(() => {
      if (cancelled) return
      build()
      if (reduced) {
        shape = 2 // the diamond, when motion is reduced
        assign()
        drawStatic()
        return
      }
      raf = requestAnimationFrame(tick)
    })
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      clearTimeout(resizeTimer)
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} className="field" aria-hidden="true" />
}
