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
    <RoundedBox args={[w, h, 0.006]} radius={radius} smoothness={3} position={[x, y, z]}>
      <ClayMaterial color={color} opacity={opacity} roughness={0.9} />
    </RoundedBox>
  )
}

function Dot({ x, y, z = 0.058, r = 0.025, color = C.coral, opacity = 1 }) {
  return (
    <mesh position={[x, y, z]}>
      <circleGeometry args={[r, 24]} />
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
      <RoundedBox args={[2.25, 1.46, 0.09]} radius={0.075} smoothness={6}>
        <ClayMaterial color={C.cream} />
      </RoundedBox>
      <FacePlane x={0} y={0.48} z={0.058} w={2.04} h={0.012} color={C.ink} opacity={0.16} radius={0.004} />
      <WindowDots />
      <FacePlane x={0.38} y={0.54} z={0.065} w={1.08} h={0.08} color={C.peach} opacity={0.72} radius={0.025} />
      <FacePlane x={0.98} y={0.26} z={0.066} w={0.2} h={0.018} color={C.ink} opacity={0.9} radius={0.004} />
      <FacePlane x={0.98} y={0.18} z={0.066} w={0.2} h={0.018} color={C.ink} opacity={0.9} radius={0.004} />
      <FacePlane x={0.98} y={0.1} z={0.066} w={0.2} h={0.018} color={C.ink} opacity={0.9} radius={0.004} />

      <LabelText x={-0.9} y={0.22} z={0.07} size={0.19} anchorX="left" maxWidth={0.72}>
        Design.{"\n"}Build.{"\n"}Elevate.
      </LabelText>
      <LabelText x={-0.9} y={-0.28} z={0.07} size={0.05} anchorX="left" maxWidth={0.72}>
        Websites shaped around trust, clarity, and better decisions.
      </LabelText>
      <RoundedBox args={[0.52, 0.17, 0.035]} radius={0.035} smoothness={4} position={[-0.63, -0.54, 0.085]}>
        <ClayMaterial color={C.coral} roughness={0.8} />
      </RoundedBox>
      <LabelText x={-0.83} y={-0.54} z={0.108} size={0.038} color={C.cream} anchorX="left">
        START
      </LabelText>

      <FacePlane x={0.38} y={0.08} z={0.066} w={0.64} h={0.72} color={C.sage} opacity={0.78} radius={0.04} />
      <FacePlane x={0.41} y={0.04} z={0.082} w={0.38} h={0.36} color={C.cream} opacity={0.9} radius={0.12} />
      <Dot x={0.42} y={0.12} z={0.092} r={0.13} color={C.peach} />
      <FacePlane x={0.38} y={-0.28} z={0.088} w={0.54} h={0.01} color={C.cream} opacity={0.62} radius={0.004} />
      <FacePlane x={0.38} y={-0.36} z={0.088} w={0.44} h={0.01} color={C.cream} opacity={0.5} radius={0.004} />
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
      <RoundedBox args={[1.08, 0.88, 0.07]} radius={0.065} smoothness={5}>
        <ClayMaterial color={C.sage} />
      </RoundedBox>
      {lines}
      <FacePlane x={0.08} y={-0.08} w={0.72} h={0.33} color={C.cream} opacity={0.84} radius={0.16} />
      <Dot x={0.08} y={0.02} r={0.105} color={C.peach} />
    </group>
  )
}

function WireframeCard() {
  return (
    <group>
      <RoundedBox args={[1, 0.68, 0.07]} radius={0.055} smoothness={5}>
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
      <RoundedBox args={[0.72, 0.74, 0.07]} radius={0.055} smoothness={5}>
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
      <RoundedBox args={[0.92, 0.66, 0.08]} radius={0.06} smoothness={5}>
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
      <RoundedBox args={[0.82, 0.44, 0.07]} radius={0.055} smoothness={5}>
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
      <RoundedBox args={[0.96, 0.2, 0.06]} radius={0.045} smoothness={5}>
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

function CodeTile() {
  return (
    <group>
      <RoundedBox args={[0.38, 0.38, 0.08]} radius={0.05} smoothness={5}>
        <ClayMaterial color={C.coral} />
      </RoundedBox>
      <LabelText z={0.07} size={0.12} color={C.cream}>
        &lt;/&gt;
      </LabelText>
    </group>
  )
}

function PenCoin() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.17, 0.17, 0.06, 36]} />
        <ClayMaterial color={C.peach} />
      </mesh>
      <LabelText z={0.038} size={0.1} color={C.ink}>
        ◇
      </LabelText>
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

function OrbitalRing() {
  return (
    <group rotation={[1.08, 0.12, 0.22]}>
      <mesh>
        <torusGeometry args={[2.06, 0.01, 8, 120]} />
        <meshStandardMaterial color={C.peach} roughness={0.7} transparent opacity={0.52} />
      </mesh>
      <Dot x={-1.34} y={0.08} z={0.02} r={0.045} color={C.sage} />
      <Dot x={1.35} y={-0.08} z={0.02} r={0.045} color={C.peach} />
    </group>
  )
}

function AccentCube({ color = C.peach, size = 0.12 }) {
  return (
    <mesh>
      <boxGeometry args={[size, size, size]} />
      <ClayMaterial color={color} />
    </mesh>
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
  const textLinesRef = useRef()
  const toolbarRef = useRef()
  const codeTileRef = useRef()
  const penRef = useRef()
  const cursorRef = useRef()
  const ringRef = useRef()
  const cubeARef = useRef()
  const cubeBRef = useRef()
  const cubeCRef = useRef()

  const pieces = useMemo(() => ([
    {
      key: 'ring',
      ref: ringRef,
      delay: 0.05,
      duration: 0.9,
      from: [0.1, 0.08, -0.72],
      to: [0.02, -0.02, -0.48],
      fromRot: [1.2, 0.34, -0.55],
      toRot: [1.08, 0.12, 0.22],
      fromScale: 0.68,
      toScale: 0.82,
      phase: 0.2,
      arc: 0.08,
    },
    {
      key: 'browser',
      ref: browserRef,
      delay: 0.28,
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
      key: 'sage',
      ref: sageRef,
      delay: 0.9,
      duration: 0.92,
      from: [2.9, 1.45, -0.7],
      to: [0.42, 0.04, 0.16],
      fromRot: [0.28, -0.6, 0.32],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.7,
      toScale: 0.52,
      phase: 1.4,
      arc: 0.2,
    },
    {
      key: 'code',
      ref: codeRef,
      delay: 1.08,
      duration: 0.92,
      from: [2.85, -1.65, 0.2],
      to: [0.64, -0.37, 0.24],
      fromRot: [-0.24, -0.58, -0.2],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.68,
      toScale: 0.42,
      phase: 2.1,
      arc: 0.28,
    },
    {
      key: 'wire',
      ref: wireRef,
      delay: 1.22,
      duration: 0.9,
      from: [-0.5, -2.65, 0.16],
      to: [0.02, -0.21, 0.28],
      fromRot: [-0.45, 0.16, -0.2],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.68,
      toScale: 0.45,
      phase: 2.8,
      arc: 0.18,
    },
    {
      key: 'typo',
      ref: typoRef,
      delay: 1.36,
      duration: 0.9,
      from: [-3, 0.78, -0.2],
      to: [-0.62, 0.12, 0.22],
      fromRot: [0.2, 0.55, -0.3],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.68,
      toScale: 0.42,
      phase: 3.6,
      arc: 0.22,
    },
    {
      key: 'text-lines',
      ref: textLinesRef,
      delay: 1.5,
      duration: 0.88,
      from: [-2.9, -1.2, 0.18],
      to: [-0.62, -0.35, 0.24],
      fromRot: [-0.14, 0.5, 0.18],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.68,
      toScale: 0.46,
      phase: 4.4,
      arc: 0.14,
    },
    {
      key: 'toolbar',
      ref: toolbarRef,
      delay: 1.7,
      duration: 0.86,
      from: [-0.2, -2.5, 0.55],
      to: [0.02, 0.39, 0.34],
      fromRot: [-0.18, 0.05, -0.18],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.7,
      toScale: 0.5,
      phase: 5,
      arc: 0.18,
    },
    {
      key: 'pen',
      ref: penRef,
      delay: 1.86,
      duration: 0.82,
      from: [0.52, -2.45, 0.54],
      to: [0.38, -0.18, 0.38],
      fromRot: [0.7, 0.2, 0.44],
      toRot: [1.44, -0.09, 0.01],
      fromScale: 0.7,
      toScale: 0.48,
      phase: 5.8,
      arc: 0.2,
    },
    {
      key: 'code-tile',
      ref: codeTileRef,
      delay: 2,
      duration: 0.82,
      from: [2.6, 1.36, 0.54],
      to: [0.78, 0.37, 0.32],
      fromRot: [0.14, -0.6, 0.3],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.68,
      toScale: 0.5,
      phase: 6.4,
      arc: 0.14,
    },
    {
      key: 'cube-a',
      ref: cubeARef,
      delay: 2.16,
      duration: 0.7,
      from: [-2.3, -1.72, 0.3],
      to: [-0.88, -0.47, 0.23],
      fromRot: [0.44, 0.2, 0.16],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.56,
      toScale: 0.66,
      phase: 7,
      arc: 0.12,
    },
    {
      key: 'cube-b',
      ref: cubeBRef,
      delay: 2.24,
      duration: 0.7,
      from: [1.8, -1.9, 0.12],
      to: [0.83, -0.05, 0.24],
      fromRot: [0.2, -0.4, -0.18],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.56,
      toScale: 0.68,
      phase: 7.8,
      arc: 0.1,
    },
    {
      key: 'cube-c',
      ref: cubeCRef,
      delay: 2.32,
      duration: 0.7,
      from: [-2.2, 1.6, 0.08],
      to: [-0.86, 0.35, 0.24],
      fromRot: [0.12, 0.34, -0.2],
      toRot: [0.035, -0.09, 0.005],
      fromScale: 0.56,
      toScale: 0.64,
      phase: 8.2,
      arc: 0.1,
    },
    {
      key: 'cursor',
      ref: cursorRef,
      delay: 2.56,
      duration: 0.95,
      from: [2.2, 0.34, 0.68],
      to: [0.72, -0.38, 0.54],
      fromRot: [0.02, -0.14, -0.42],
      toRot: [0.04, -0.08, -0.34],
      fromScale: 0.62,
      toScale: 0.72,
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

    if (ringRef.current) {
      ringRef.current.rotation.z += reducedMotion ? 0 : 0.0018
    }

  })

  return (
    <group ref={rootRef} scale={1.05}>
      <group ref={ringRef}>
        <OrbitalRing />
      </group>
      <group ref={sageRef}>
        <SageGridPanel />
      </group>
      <group ref={codeRef}>
        <CodeCard />
      </group>
      <group ref={wireRef}>
        <WireframeCard />
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
      <group ref={penRef}>
        <PenCoin />
      </group>
      <group ref={codeTileRef}>
        <CodeTile />
      </group>
      <group ref={cursorRef}>
        <CursorPointer />
      </group>
      <group ref={cubeARef}>
        <AccentCube color={C.peach} size={0.13} />
      </group>
      <group ref={cubeBRef}>
        <AccentCube color={C.sage} size={0.09} />
      </group>
      <group ref={cubeCRef}>
        <AccentCube color={C.coral} size={0.1} />
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
        dpr={[1, 1.75]}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.58} />
        <directionalLight position={[-3.2, 3.4, 4.4]} intensity={1.2} color="#fff6ea" />
        <directionalLight position={[3.4, -1.4, 2.4]} intensity={0.34} color="#d7e8d2" />
        <directionalLight position={[0, 0, 4]} intensity={0.28} color={C.peach} />
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
      <img src={hiremeUrl} alt="" className="hero-badge" />
    </div>
  )
}
