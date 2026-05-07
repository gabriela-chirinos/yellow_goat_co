import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import { Shape } from 'three'
import hiremeUrl from '../assets/hireme.png'

const C = {
  cream: '#FAF6F2',
  ink: '#111111',
  coral: '#FF7A59',
  peach: '#FFDCC8',
  sage: '#A6B8A0',
}

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function clamp01(value) {
  return Math.min(1, Math.max(0, value))
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function easeOutExpo(t) {
  t = clamp01(t)
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function settle(t) {
  t = clamp01(t)
  if (t < 0.82) return easeOutExpo(t / 0.82) * 1.035
  return lerp(1.035, 1, easeOutExpo((t - 0.82) / 0.18))
}

function easeInOutQuart(t) {
  t = clamp01(t)
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

function cursorTour(elapsed, home) {
  const start = 4.9
  if (elapsed < start) return home

  const cycle = 7.6
  const move = 0.76
  const hold = 0.52
  const t = (elapsed - start) % cycle
  const stops = [
    home,
    [-0.65, 0.17, 0.64],
    [-0.41, 0.17, 0.64],
    [0.03, 0.17, 0.64],
    home,
  ]

  let cursor = 0
  for (let i = 0; i < stops.length - 1; i += 1) {
    const phase = t - cursor
    if (phase < move) {
      const eased = easeInOutQuart(phase / move)
      return [
        lerp(stops[i][0], stops[i + 1][0], eased),
        lerp(stops[i][1], stops[i + 1][1], eased),
        lerp(stops[i][2], stops[i + 1][2], eased),
      ]
    }
    if (phase < move + hold) return stops[i + 1]
    cursor += move + hold
  }

  return home
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia(MOTION_QUERY).matches : false
  ))

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const query = window.matchMedia(MOTION_QUERY)
    const update = () => setReduced(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

function setOpacity(group, opacity) {
  group.traverse((child) => {
    if (!child.isMesh || !child.material) return
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => {
      if (material.userData.baseOpacity === undefined) {
        material.userData.baseOpacity = material.opacity ?? 1
      }
      material.transparent = true
      material.opacity = material.userData.baseOpacity * opacity
      material.needsUpdate = true
    })
  })
}

function positionPiece(group, piece, elapsed, progress, reducedMotion) {
  const eased = settle(progress)
  const arrived = progress >= 1
  const idle = arrived || reducedMotion
  const idleY = idle && !reducedMotion ? Math.sin(elapsed * 0.7 + piece.phase) * 0.022 : 0
  const idleRot = idle && !reducedMotion ? Math.sin(elapsed * 0.42 + piece.phase) * 0.006 : 0
  const travelArc = reducedMotion ? 0 : Math.sin(progress * Math.PI) * piece.arc
  const cursorPress = !reducedMotion && piece.key === 'cursor'
    ? Math.sin(clamp01((elapsed - 4.05) / 0.42) * Math.PI) * 0.055
    : 0

  group.position.set(
    lerp(piece.from[0], piece.to[0], eased) - cursorPress * 0.35,
    lerp(piece.from[1], piece.to[1], eased) + idleY - cursorPress * 0.25,
    lerp(piece.from[2], piece.to[2], easeOutExpo(progress)) + travelArc,
  )

  if (!reducedMotion && piece.key === 'cursor' && arrived) {
    const [x, y, z] = cursorTour(elapsed, piece.to)
    group.position.set(x, y + idleY * 0.35, z)
  }

  group.rotation.set(
    lerp(piece.fromRot[0], piece.toRot[0], easeOutExpo(progress)) + idleRot * 0.5,
    lerp(piece.fromRot[1], piece.toRot[1], easeOutExpo(progress)) + idleRot,
    lerp(piece.fromRot[2], piece.toRot[2], easeOutExpo(progress)) + idleRot * 0.7,
  )

  group.scale.setScalar(lerp(piece.fromScale, piece.toScale ?? 1, eased))
}

function ClayMaterial({ color, opacity = 1, roughness = 0.86 }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.02}
      transparent
      opacity={opacity}
    />
  )
}

function FacePlane({ x = 0, y = 0, z = 0.056, w, h, color = C.ink, opacity = 1, radius = 0.01 }) {
  return (
    <RoundedBox args={[w, h, 0.006]} radius={radius} smoothness={2} position={[x, y, z]}>
      <ClayMaterial color={color} opacity={opacity} roughness={0.9} />
    </RoundedBox>
  )
}

function Dot({ x, y, z = 0.058, r = 0.025, color = C.coral, opacity = 1 }) {
  return (
    <mesh position={[x, y, z]}>
      <circleGeometry args={[r, 16]} />
      <meshStandardMaterial color={color} roughness={0.76} transparent opacity={opacity} />
    </mesh>
  )
}

function LabelText({
  children,
  x = 0,
  y = 0,
  z = 0.062,
  size = 0.12,
  color = C.ink,
  anchorX = 'center',
  anchorY = 'middle',
  maxWidth,
  opacity = 1,
}) {
  return (
    <Text
      position={[x, y, z]}
      fontSize={size}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      maxWidth={maxWidth}
      textAlign="left"
      lineHeight={0.88}
    >
      {children}
      <meshStandardMaterial color={color} roughness={0.9} transparent opacity={opacity} />
    </Text>
  )
}

function WindowDots({ y = 0.53, z = 0.07 }) {
  return (
    <>
      <Dot x={-0.92} y={y} z={z} r={0.025} color={C.coral} />
      <Dot x={-0.82} y={y} z={z} r={0.025} color={C.peach} />
      <Dot x={-0.72} y={y} z={z} r={0.025} color={C.sage} />
    </>
  )
}

function BrowserWindow() {
  return (
    <group>
      <RoundedBox args={[2.25, 1.46, 0.09]} radius={0.075} smoothness={3}>
        <ClayMaterial color={C.cream} />
      </RoundedBox>
      <FacePlane x={0} y={0.48} z={0.058} w={2.04} h={0.012} color={C.ink} opacity={0.16} radius={0.004} />
      <WindowDots />
      <FacePlane x={0.38} y={0.54} z={0.065} w={1.08} h={0.08} color={C.peach} opacity={0.72} radius={0.025} />
      <FacePlane x={0.98} y={0.31} z={0.066} w={0.2} h={0.018} color={C.ink} opacity={0.9} radius={0.004} />
      <FacePlane x={0.98} y={0.23} z={0.066} w={0.2} h={0.018} color={C.ink} opacity={0.9} radius={0.004} />
      <FacePlane x={0.98} y={0.15} z={0.066} w={0.2} h={0.018} color={C.ink} opacity={0.9} radius={0.004} />

      <FacePlane x={-0.66} y={0.02} z={0.07} w={0.44} h={0.026} color={C.ink} opacity={0.32} radius={0.008} />
      <FacePlane x={-0.72} y={-0.08} z={0.07} w={0.34} h={0.022} color={C.ink} opacity={0.22} radius={0.008} />
      <RoundedBox args={[0.44, 0.15, 0.035]} radius={0.03} smoothness={2} position={[-0.67, -0.32, 0.085]}>
        <ClayMaterial color={C.coral} roughness={0.8} />
      </RoundedBox>

      <FacePlane x={0.38} y={0.07} z={0.066} w={0.7} h={0.76} color={C.sage} opacity={0.26} radius={0.035} />
      <FacePlane x={0.38} y={0.18} z={0.074} w={0.54} h={0.28} color={C.cream} opacity={0.68} radius={0.02} />
      <FacePlane x={0.38} y={-0.13} z={0.074} w={0.54} h={0.11} color={C.cream} opacity={0.5} radius={0.014} />
      <FacePlane x={0.38} y={-0.31} z={0.074} w={0.54} h={0.11} color={C.cream} opacity={0.42} radius={0.014} />

      <FacePlane x={-0.48} y={-0.55} z={0.07} w={0.26} h={0.018} color={C.ink} opacity={0.18} radius={0.006} />
      <FacePlane x={0.58} y={-0.55} z={0.07} w={0.28} h={0.018} color={C.ink} opacity={0.18} radius={0.006} />
    </group>
  )
}

function SageGridPanel() {
  const lines = []
  for (let i = 0; i < 5; i += 1) {
    lines.push(<FacePlane key={`v-${i}`} x={-0.42 + i * 0.21} y={0} w={0.006} h={0.72} color={C.cream} opacity={0.28} radius={0.002} />)
    lines.push(<FacePlane key={`h-${i}`} x={0} y={-0.3 + i * 0.15} w={0.92} h={0.006} color={C.cream} opacity={0.28} radius={0.002} />)
  }

  return (
    <group>
      <RoundedBox args={[1.08, 0.88, 0.07]} radius={0.065} smoothness={3}>
        <ClayMaterial color={C.sage} />
      </RoundedBox>
      {lines}
      <FacePlane x={0.08} y={-0.08} w={0.72} h={0.33} color={C.cream} opacity={0.84} radius={0.16} />
      <Dot x={0.08} y={0.02} r={0.105} color={C.peach} />
    </group>
  )
}

function HeroWordLine() {
  return (
    <group>
      <RoundedBox args={[1.42, 0.24, 0.045]} radius={0.045} smoothness={3}>
        <ClayMaterial color={C.cream} opacity={0.94} roughness={0.82} />
      </RoundedBox>
      <FacePlane x={-0.31} y={-0.055} w={0.006} h={0.11} color={C.ink} opacity={0.16} radius={0.002} />
      <FacePlane x={0.18} y={-0.055} w={0.006} h={0.11} color={C.ink} opacity={0.16} radius={0.002} />
      <LabelText x={-0.63} y={0.005} z={0.055} size={0.078} anchorX="left">
        Design.
      </LabelText>
      <LabelText x={-0.21} y={0.005} z={0.055} size={0.078} anchorX="left">
        Build.
      </LabelText>
      <LabelText x={0.31} y={0.005} z={0.055} size={0.078} anchorX="left">
        Elevate.
      </LabelText>
    </group>
  )
}

function WireframeCard() {
  return (
    <group>
      <RoundedBox args={[1, 0.68, 0.07]} radius={0.055} smoothness={3}>
        <ClayMaterial color={C.cream} />
      </RoundedBox>
      <WindowDots y={0.25} z={0.064} />
      <FacePlane x={0.08} y={0.04} w={0.52} h={0.32} color={C.peach} opacity={0.46} radius={0.005} />
      <FacePlane x={0.08} y={0.04} w={0.006} h={0.32} color={C.ink} opacity={0.28} radius={0.002} />
      <FacePlane x={0.08} y={0.04} w={0.52} h={0.006} color={C.ink} opacity={0.28} radius={0.002} />
      <FacePlane x={0.08} y={0.16} w={0.52} h={0.006} color={C.ink} opacity={0.18} radius={0.002} />
      <FacePlane x={0.08} y={-0.08} w={0.52} h={0.006} color={C.ink} opacity={0.18} radius={0.002} />
      <FacePlane x={0.02} y={-0.23} w={0.42} h={0.018} color={C.ink} opacity={0.28} radius={0.006} />
      <FacePlane x={-0.16} y={-0.31} w={0.22} h={0.012} color={C.ink} opacity={0.2} radius={0.004} />
      <Dot x={0.39} y={-0.24} r={0.07} color={C.peach} />
    </group>
  )
}

function TypographyCard() {
  return (
    <group>
      <RoundedBox args={[0.72, 0.74, 0.07]} radius={0.055} smoothness={3}>
        <ClayMaterial color={C.cream} />
      </RoundedBox>
      <LabelText x={-0.22} y={0.12} z={0.072} size={0.2} anchorX="left">
        Aa
      </LabelText>
      <FacePlane x={0} y={-0.08} w={0.46} h={0.008} color={C.ink} opacity={0.18} radius={0.002} />
      <FacePlane x={-0.18} y={-0.24} w={0.1} h={0.1} color={C.sage} opacity={0.92} radius={0.016} />
      <FacePlane x={-0.06} y={-0.24} w={0.1} h={0.1} color={C.peach} opacity={0.92} radius={0.016} />
      <FacePlane x={0.06} y={-0.24} w={0.1} h={0.1} color={C.coral} opacity={0.92} radius={0.016} />
      <FacePlane x={0.18} y={-0.24} w={0.1} h={0.1} color={C.ink} opacity={0.92} radius={0.016} />
    </group>
  )
}

function CodeCard() {
  return (
    <group>
      <RoundedBox args={[0.92, 0.66, 0.08]} radius={0.06} smoothness={3}>
        <ClayMaterial color={C.ink} roughness={0.82} />
      </RoundedBox>
      <FacePlane x={-0.12} y={0.18} w={0.46} h={0.018} color={C.peach} radius={0.006} />
      <FacePlane x={0.16} y={0.07} w={0.52} h={0.014} color={C.sage} radius={0.006} />
      <FacePlane x={0.06} y={-0.04} w={0.36} h={0.014} color={C.coral} radius={0.006} />
      <FacePlane x={0.16} y={-0.15} w={0.58} h={0.014} color={C.cream} opacity={0.72} radius={0.006} />
      <FacePlane x={-0.18} y={-0.26} w={0.28} h={0.014} color={C.peach} radius={0.006} />
    </group>
  )
}

function TextLinesCard() {
  return (
    <group>
      <RoundedBox args={[0.82, 0.44, 0.07]} radius={0.055} smoothness={3}>
        <ClayMaterial color={C.sage} />
      </RoundedBox>
      <FacePlane x={-0.04} y={0.11} w={0.46} h={0.03} color={C.cream} opacity={0.82} radius={0.012} />
      <FacePlane x={-0.08} y={0} w={0.38} h={0.026} color={C.cream} opacity={0.74} radius={0.012} />
      <FacePlane x={-0.16} y={-0.11} w={0.26} h={0.026} color={C.cream} opacity={0.68} radius={0.012} />
      <Text position={[0.18, -0.13, 0.07]} fontSize={0.13} color={C.peach} anchorX="center" anchorY="middle">
        ~
        <meshStandardMaterial color={C.peach} roughness={0.8} transparent opacity={1} />
      </Text>
    </group>
  )
}

function ToolbarStrip() {
  return (
    <group>
      <RoundedBox args={[0.96, 0.2, 0.06]} radius={0.045} smoothness={3}>
        <ClayMaterial color={C.cream} />
      </RoundedBox>
      <LabelText x={-0.35} y={0} z={0.062} size={0.07}>B</LabelText>
      <FacePlane x={-0.16} y={0} w={0.008} h={0.09} color={C.ink} opacity={0.55} radius={0.002} />
      <LabelText x={0.02} y={0} z={0.062} size={0.06}>/</LabelText>
      <FacePlane x={0.22} y={0} w={0.13} h={0.014} color={C.ink} opacity={0.72} radius={0.004} />
      <FacePlane x={0.4} y={0.025} w={0.09} h={0.01} color={C.ink} opacity={0.62} radius={0.004} />
      <FacePlane x={0.4} y={-0.025} w={0.09} h={0.01} color={C.ink} opacity={0.62} radius={0.004} />
    </group>
  )
}

function CursorPointer() {
  const shape = useMemo(() => {
    const cursor = new Shape()
    cursor.moveTo(0, 0.25)
    cursor.lineTo(0.16, -0.15)
    cursor.lineTo(0.04, -0.1)
    cursor.lineTo(-0.04, -0.26)
    cursor.lineTo(-0.11, -0.23)
    cursor.lineTo(-0.04, -0.07)
    cursor.lineTo(-0.18, -0.1)
    cursor.closePath()
    return cursor
  }, [])

  return (
    <group>
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={C.ink} roughness={0.78} transparent opacity={1} />
      </mesh>
    </group>
  )
}

function Scene({ reducedMotion }) {
  const rootRef = useRef()
  const mouseRef = useRef([0, 0])
  const smoothRef = useRef([0, 0])
  const opacityCacheRef = useRef(new Map())

  const browserRef = useRef()
  const sageRef = useRef()
  const codeRef = useRef()
  const wireRef = useRef()
  const typoRef = useRef()
  const wordsRef = useRef()
  const textLinesRef = useRef()
  const toolbarRef = useRef()
  const cursorRef = useRef()

  const pieces = useMemo(() => ([
    {
      key: 'browser',
      ref: browserRef,
      delay: 0.18,
      duration: 1.08,
      from: [0.08, 2.95, 0.34],
      to: [0.02, 0.02, 0.02],
      fromRot: [-0.28, -0.04, 0.02],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.9,
      toScale: 1,
      phase: 0.9,
      arc: 0.32,
    },
    {
      key: 'words',
      ref: wordsRef,
      delay: 0.72,
      duration: 0.9,
      from: [-1.55, 1.2, 0.48],
      to: [-0.28, 0.29, 0.34],
      fromRot: [0.08, 0.28, -0.16],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.78,
      toScale: 0.72,
      phase: 1.1,
      arc: 0.18,
    },
    {
      key: 'sage',
      ref: sageRef,
      delay: 0.84,
      duration: 0.92,
      from: [2.9, 1.45, -0.7],
      to: [0.45, 0.08, 0.16],
      fromRot: [0.28, -0.6, 0.32],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.7,
      toScale: 0.44,
      phase: 1.4,
      arc: 0.2,
    },
    {
      key: 'code',
      ref: codeRef,
      delay: 1.18,
      duration: 0.92,
      from: [2.85, -1.65, 0.2],
      to: [0.58, -0.34, 0.24],
      fromRot: [-0.24, -0.58, -0.2],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.68,
      toScale: 0.34,
      phase: 2.1,
      arc: 0.28,
    },
    {
      key: 'wire',
      ref: wireRef,
      delay: 1.22,
      duration: 0.9,
      from: [-0.5, -2.65, 0.16],
      to: [0.02, -0.18, 0.26],
      fromRot: [-0.45, 0.16, -0.2],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.68,
      toScale: 0.38,
      phase: 2.8,
      arc: 0.18,
    },
    {
      key: 'typo',
      ref: typoRef,
      delay: 1.36,
      duration: 0.9,
      from: [-3, 0.78, -0.2],
      to: [0.08, -0.47, 0.24],
      fromRot: [0.2, 0.55, -0.3],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.68,
      toScale: 0.26,
      phase: 3.6,
      arc: 0.22,
    },
    {
      key: 'text-lines',
      ref: textLinesRef,
      delay: 1.5,
      duration: 0.88,
      from: [-2.9, -1.2, 0.18],
      to: [-0.63, -0.38, 0.23],
      fromRot: [-0.14, 0.5, 0.18],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.68,
      toScale: 0.34,
      phase: 4.4,
      arc: 0.14,
    },
    {
      key: 'toolbar',
      ref: toolbarRef,
      delay: 1.7,
      duration: 0.86,
      from: [-0.2, -2.5, 0.55],
      to: [0.02, -0.55, 0.32],
      fromRot: [-0.18, 0.05, -0.18],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.7,
      toScale: 0.42,
      phase: 5,
      arc: 0.18,
    },
    {
      key: 'cursor',
      ref: cursorRef,
      delay: 2.08,
      duration: 0.95,
      from: [2.2, 0.34, 0.68],
      to: [-0.42, -0.31, 0.5],
      fromRot: [0.02, -0.14, -0.42],
      toRot: [0.04, -0.08, -0.34],
      fromScale: 0.62,
      toScale: 0.54,
      phase: 8.8,
      arc: 0.24,
    },
  ]), [])

  useEffect(() => {
    if (reducedMotion) {
      mouseRef.current = [0, 0]
      smoothRef.current = [0, 0]
      return undefined
    }

    const onMove = (event) => {
      mouseRef.current[0] = (event.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current[1] = -(event.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (!reducedMotion) return

    if (rootRef.current) {
      rootRef.current.rotation.set(0.05, -0.12, -0.015)
      rootRef.current.scale.setScalar(1.05)
    }

    pieces.forEach((piece) => {
      const group = piece.ref.current
      if (!group) return
      positionPiece(group, piece, 8, 1, true)
      setOpacity(group, 1)
    })
  }, [pieces, reducedMotion])

  useFrame(({ clock }) => {
    if (reducedMotion) return

    const elapsed = reducedMotion ? 8 : clock.getElapsedTime()

    smoothRef.current[0] = reducedMotion ? 0 : lerp(smoothRef.current[0], mouseRef.current[0] * 0.08, 0.035)
    smoothRef.current[1] = reducedMotion ? 0 : lerp(smoothRef.current[1], mouseRef.current[1] * 0.055, 0.035)

    if (rootRef.current) {
      rootRef.current.rotation.x = 0.05 + smoothRef.current[1]
      rootRef.current.rotation.y = -0.12 + smoothRef.current[0]
      rootRef.current.rotation.z = -0.015
      const lockPulse = Math.sin(clamp01((elapsed - 4.34) / 0.36) * Math.PI) * 0.018
      rootRef.current.scale.setScalar(1.05 + lockPulse)
    }

    pieces.forEach((piece) => {
      const group = piece.ref.current
      if (!group) return

      const rawProgress = (elapsed - piece.delay) / piece.duration
      const progress = clamp01(rawProgress)
      positionPiece(group, piece, elapsed, progress, false)

      const opacity = clamp01((elapsed - piece.delay + 0.12) / 0.34)
      const previousOpacity = opacityCacheRef.current.get(piece.key)
      if (previousOpacity === undefined || Math.abs(previousOpacity - opacity) > 0.004) {
        setOpacity(group, opacity)
        opacityCacheRef.current.set(piece.key, opacity)
      }
    })

  })

  return (
    <group ref={rootRef} scale={1.05}>
      <group ref={sageRef}>
        <SageGridPanel />
      </group>
      <group ref={codeRef}>
        <CodeCard />
      </group>
      <group ref={wireRef}>
        <WireframeCard />
      </group>
      <group ref={wordsRef}>
        <HeroWordLine />
      </group>
      <group ref={typoRef}>
        <TypographyCard />
      </group>
      <group ref={textLinesRef}>
        <TextLinesCard />
      </group>
      <group ref={browserRef}>
        <BrowserWindow />
      </group>
      <group ref={toolbarRef}>
        <ToolbarStrip />
      </group>
      <group ref={cursorRef}>
        <CursorPointer />
      </group>
    </group>
  )
}

export default function SignatureMark() {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className="hero-visual"
      style={{ position: 'relative' }}
      role="img"
      aria-label="Animated website components assembling into a finished page"
    >
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 39 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.58} />
        <directionalLight position={[-3.2, 3.4, 4.4]} intensity={1.2} color="#fff6ea" />
        <directionalLight position={[3.4, -1.4, 2.4]} intensity={0.34} color="#d7e8d2" />
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
      <img src={hiremeUrl} alt="" className="hero-badge" />
    </div>
  )
}
