'use client'

import { useRef, useMemo, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { MorphTargets } from '@/lib/api'

// ─── 3D Avatar Head Mesh ──────────────────────────────────────────────

interface AvatarHeadProps {
  morphTargets: MorphTargets
  isSpeaking: boolean
  isListening: boolean
}

function AvatarHead({ morphTargets, isSpeaking, isListening }: AvatarHeadProps) {
  const headRef = useRef<THREE.Group>(null)
  const jawRef = useRef<THREE.Group>(null)
  const lipsRef = useRef<THREE.Group>(null)
  const eyeLeftRef = useRef<THREE.Mesh>(null)
  const eyeRightRef = useRef<THREE.Mesh>(null)
  const pupilLeftRef = useRef<THREE.Mesh>(null)
  const pupilRightRef = useRef<THREE.Mesh>(null)

  // Smoothly interpolate morph targets (internal ref to avoid re-renders)
  const smoothMorphs = useRef({
    jawOpen: 0,
    mouthFunnel: 0,
    mouthPucker: 0,
    mouthSmile: 0,
    mouthStretch: 0,
  })

  // Blink state
  const blinkState = useRef({
    timer: 0,
    isBlinking: false,
    value: 1,
    nextBlinkAt: 3 + Math.random() * 4, // pre-compute next blink time
  })

  // Idle timers
  const idleTimer = useRef(0)

  useFrame((_, delta) => {
    // Cap delta to avoid jumps on tab-switch
    const dt = Math.min(delta, 0.05)
    const lerpSpeed = 6 * dt

    // ── Smooth morph interpolation ──
    const sm = smoothMorphs.current
    sm.jawOpen += (morphTargets.jawOpen - sm.jawOpen) * lerpSpeed
    sm.mouthFunnel += (morphTargets.mouthFunnel - sm.mouthFunnel) * lerpSpeed
    sm.mouthPucker += (morphTargets.mouthPucker - sm.mouthPucker) * lerpSpeed
    sm.mouthSmile += (morphTargets.mouthSmile - sm.mouthSmile) * lerpSpeed
    sm.mouthStretch += (morphTargets.mouthStretch - sm.mouthStretch) * lerpSpeed

    // Snap tiny values to zero to prevent micro-jitter
    if (Math.abs(sm.jawOpen) < 0.005) sm.jawOpen = 0
    if (Math.abs(sm.mouthFunnel) < 0.005) sm.mouthFunnel = 0

    // ── Apply jaw movement ──
    if (jawRef.current) {
      jawRef.current.position.y = -sm.jawOpen * 0.12
      jawRef.current.rotation.x = sm.jawOpen * 0.15
    }

    // ── Apply lip shapes ──
    if (lipsRef.current) {
      const puckerScale = 1 - sm.mouthPucker * 0.25
      const stretchScale = 1 + sm.mouthStretch * 0.25
      const smileScale = 1 + sm.mouthSmile * 0.15
      lipsRef.current.scale.x = puckerScale * stretchScale * smileScale
      lipsRef.current.scale.y = 1 + sm.mouthFunnel * 0.2
    }

    // ── Blink animation (pre-computed timing, no random per frame) ──
    const blink = blinkState.current
    blink.timer += dt
    if (!blink.isBlinking && blink.timer > blink.nextBlinkAt) {
      blink.isBlinking = true
      blink.timer = 0
    }
    if (blink.isBlinking) {
      blink.value = Math.max(0.05, blink.value - dt * 10)
      if (blink.value <= 0.05) {
        blink.isBlinking = false
        blink.nextBlinkAt = 2.5 + Math.random() * 4 // schedule NEXT blink only after completing one
      }
    } else {
      blink.value = Math.min(1, blink.value + dt * 6)
    }
    if (eyeLeftRef.current) eyeLeftRef.current.scale.y = blink.value
    if (eyeRightRef.current) eyeRightRef.current.scale.y = blink.value

    // ── Head idle motion (gentle, slow) ──
    idleTimer.current += dt
    const t = idleTimer.current
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.04
      headRef.current.rotation.x = Math.sin(t * 0.25) * 0.015
      headRef.current.position.y = Math.sin(t * 0.6) * 0.015
    }

    // ── Pupil subtle tracking ──
    const pupilX = isSpeaking
      ? Math.sin(t * 1.5) * 0.015
      : Math.sin(t * 0.3) * 0.008
    const pupilY = Math.sin(t * 0.5) * 0.006

    if (pupilLeftRef.current) {
      pupilLeftRef.current.position.x = pupilX
      pupilLeftRef.current.position.y = pupilY
    }
    if (pupilRightRef.current) {
      pupilRightRef.current.position.x = pupilX
      pupilRightRef.current.position.y = pupilY
    }


  })

  // ── Pre-create materials (memoized, never recreated) ──
  const materials = useMemo(() => ({
    skin: new THREE.MeshStandardMaterial({ color: '#e8b89d', roughness: 0.65, metalness: 0.05 }),
    hair: new THREE.MeshStandardMaterial({ color: '#1a1a2e', roughness: 0.85 }),
    eyeWhite: new THREE.MeshStandardMaterial({ color: '#f5f5f5', roughness: 0.2 }),
    pupil: new THREE.MeshStandardMaterial({ color: '#2d1810', roughness: 0.1 }),
    lip: new THREE.MeshStandardMaterial({ color: '#c4746e', roughness: 0.45 }),
    teeth: new THREE.MeshStandardMaterial({ color: '#f0ebe3', roughness: 0.3 }),

    irisGlow: new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.5 }),

  }), [])

  // ── Pre-create geometries (memoized) ──
  const geometries = useMemo(() => ({
    head: new THREE.SphereGeometry(0.7, 32, 32),
    hair: new THREE.SphereGeometry(0.72, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55),
    eye: new THREE.SphereGeometry(0.1, 20, 20),
    pupil: new THREE.SphereGeometry(0.048, 16, 16),
    irisRing: new THREE.RingGeometry(0.042, 0.065, 20),
    eyebrow: new THREE.BoxGeometry(0.16, 0.025, 0.04),
    nose: new THREE.SphereGeometry(0.055, 10, 10),
    jaw: new THREE.SphereGeometry(0.3, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.45),
    teeth: new THREE.BoxGeometry(0.2, 0.035, 0.05),
    upperLip: new THREE.CapsuleGeometry(0.028, 0.14, 8, 16),
    lowerLip: new THREE.CapsuleGeometry(0.032, 0.13, 8, 16),
    ear: new THREE.SphereGeometry(0.09, 10, 10),
    neck: new THREE.CylinderGeometry(0.2, 0.24, 0.28, 16),

    platform: new THREE.CircleGeometry(0.9, 32),
    platformRing: new THREE.RingGeometry(0.75, 0.85, 64),
  }), [])

  return (
    <group ref={headRef}>
      {/* Head */}
      <mesh geometry={geometries.head} material={materials.skin} />

      {/* Hair */}
      <mesh position={[0, 0.35, -0.05]} geometry={geometries.hair} material={materials.hair} />



      {/* Left eye */}
      <group position={[-0.22, 0.1, 0.58]}>
        <mesh ref={eyeLeftRef} geometry={geometries.eye} material={materials.eyeWhite} />
        <mesh ref={pupilLeftRef} position={[0, 0, 0.07]} geometry={geometries.pupil} material={materials.pupil} />
        {isListening && (
          <mesh position={[0, 0, 0.06]} geometry={geometries.irisRing} material={materials.irisGlow} />
        )}
      </group>

      {/* Right eye */}
      <group position={[0.22, 0.1, 0.58]}>
        <mesh ref={eyeRightRef} geometry={geometries.eye} material={materials.eyeWhite} />
        <mesh ref={pupilRightRef} position={[0, 0, 0.07]} geometry={geometries.pupil} material={materials.pupil} />
        {isListening && (
          <mesh position={[0, 0, 0.06]} geometry={geometries.irisRing} material={materials.irisGlow} />
        )}
      </group>

      {/* Eyebrows */}
      <mesh position={[-0.22, 0.24, 0.6]} rotation={[0, 0, 0.12]} geometry={geometries.eyebrow} material={materials.hair} />
      <mesh position={[0.22, 0.24, 0.6]} rotation={[0, 0, -0.12]} geometry={geometries.eyebrow} material={materials.hair} />

      {/* Nose */}
      <mesh position={[0, -0.03, 0.68]} geometry={geometries.nose} material={materials.skin} />

      {/* Upper teeth (fixed to head) */}
      <mesh position={[0, -0.18, 0.55]} geometry={geometries.teeth} material={materials.teeth} />

      {/* Jaw group (animated — moves down when speaking) */}
      <group ref={jawRef} position={[0, 0, 0]}>
        {/* Lower jaw shape */}
        <mesh position={[0, -0.32, 0.38]} geometry={geometries.jaw} material={materials.skin} />
        {/* Lower teeth */}
        <mesh position={[0, -0.22, 0.53]} geometry={geometries.teeth} material={materials.teeth} />
      </group>

      {/* Lips (animated — scale for pucker/stretch) */}
      <group ref={lipsRef} position={[0, -0.2, 0.65]}>
        <mesh position={[0, 0.015, 0]} geometry={geometries.upperLip} material={materials.lip} />
        <mesh position={[0, -0.025, 0]} geometry={geometries.lowerLip} material={materials.lip} />
      </group>

      {/* Ears */}
      <mesh position={[-0.68, 0.05, 0]} geometry={geometries.ear} material={materials.skin} />
      <mesh position={[0.68, 0.05, 0]} geometry={geometries.ear} material={materials.skin} />

      {/* Neck */}
      <mesh position={[0, -0.75, 0]} geometry={geometries.neck} material={materials.skin} />


    </group>
  )
}

// ─── Glow Platform ────────────────────────────────────────────────────

function GlowPlatform() {
  const ringRef = useRef<THREE.Mesh>(null)

  const materials = useMemo(() => ({
    base: new THREE.MeshStandardMaterial({ color: '#0a1628', roughness: 0.3, metalness: 0.8, transparent: true, opacity: 0.8 }),
    ring: new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.25, side: THREE.DoubleSide }),
  }), [])

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += Math.min(delta, 0.05) * 0.3
    }
  })

  return (
    <group position={[0, -1.1, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <primitive object={materials.base} attach="material" />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.75, 0.85, 64]} />
        <primitive object={materials.ring} attach="material" />
      </mesh>
    </group>
  )
}

// ─── Main Avatar Component (memoized to prevent parent re-renders from causing canvas recreation) ──

interface AIAvatar3DProps {
  morphTargets?: MorphTargets
  isSpeaking?: boolean
  isListening?: boolean
}

const AIAvatar3D = memo(function AIAvatar3D({
  morphTargets = { jawOpen: 0, mouthFunnel: 0, mouthPucker: 0, mouthSmile: 0, mouthStretch: 0 },
  isSpeaking = false,
  isListening = false,
}: AIAvatar3DProps) {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        frameloop="always"
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={0.9} castShadow={false} />
        <directionalLight position={[-2, 3, 2]} intensity={0.3} color="#22d3ee" />
        <pointLight position={[0, -1, 3]} intensity={0.2} color="#22d3ee" />

        <AvatarHead
          morphTargets={morphTargets}
          isSpeaking={isSpeaking}
          isListening={isListening}
        />
        <GlowPlatform />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 6}
          maxAzimuthAngle={Math.PI / 6}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  )
})

export default AIAvatar3D
