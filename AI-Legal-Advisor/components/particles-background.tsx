'use client'

import { useEffect, useRef } from 'react'

interface ParticlesBackgroundProps {
  className?: string
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

export function ParticlesBackground({ className }: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frameId = 0
    let width = 0
    let height = 0
    const particles: Particle[] = []
    const pointer = { x: 0, y: 0, active: false }

    const createParticles = () => {
      particles.length = 0
      const count = Math.max(36, Math.floor((width * height) / 24000))
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          size: Math.random() * 2 + 0.9,
        })
      }
    }

    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      createParticles()
    }

    const render = () => {
      context.clearRect(0, 0, width, height)

      for (const particle of particles) {
        if (pointer.active) {
          const dx = pointer.x - particle.x
          const dy = pointer.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance > 0 && distance < 140) {
            const force = (140 - distance) / 140
            particle.vx += (dx / distance) * force * 0.02
            particle.vy += (dy / distance) * force * 0.02
          }
        }

        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.99
        particle.vy *= 0.99

        if (particle.x < 0 || particle.x > width) particle.vx *= -1
        if (particle.y < 0 || particle.y > height) particle.vy *= -1

        context.beginPath()
        context.fillStyle = 'rgba(34, 211, 238, 0.65)'
        context.shadowColor = 'rgba(34, 211, 238, 0.4)'
        context.shadowBlur = 10
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      }

      context.shadowBlur = 0

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 150) {
            const alpha = 1 - distance / 150
            context.beginPath()
            context.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.17})`
            context.lineWidth = 1
            context.moveTo(particles[i].x, particles[i].y)
            context.lineTo(particles[j].x, particles[j].y)
            context.stroke()
          }
        }
      }

      frameId = requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }

    const handlePointerLeave = () => {
      pointer.active = false
    }

    resize()
    render()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden />
}
