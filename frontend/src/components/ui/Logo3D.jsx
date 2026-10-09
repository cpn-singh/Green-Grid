import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Logo3D - Interactive WebGL 3D Medallion for GreenGrid
 * Features:
 * - 3D coin / medallion with high-metalness emerald-obsidian bevel rim
 * - High-res logo texture with specular shine
 * - Rotating holographic orbital energy ring (Torus)
 * - Dynamic lighting (specular highlights + glowing emerald rim light)
 * - Mouse-tracking 3D tilt & gentle idle floating oscillation
 * - Graceful WebGL error handling & automatic cleanup
 */
export default function Logo3D({ size = 220, className = '', onClick }) {
  if (size <= 48) {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size }}
        onClick={onClick}
      >
        <img
          src="/logo-hires.png"
          alt="GreenGrid"
          className="w-full h-full object-contain rounded-full drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
        />
      </div>
    )
  }

  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Verify WebGL availability
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      return // Will fall back to fallback 2D rendering below
    }

    const width = container.clientWidth || size
    const height = container.clientHeight || size

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'mediump'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8)
    keyLight.position.set(4, 5, 5)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x34d399, 3.2)
    rimLight.position.set(-4, -3, -2)
    scene.add(rimLight)

    const accentPointLight = new THREE.PointLight(0x10b981, 2.5, 12)
    accentPointLight.position.set(0, 0, 3)
    scene.add(accentPointLight)

    // 3. 3D Group
    const logoGroup = new THREE.Group()
    scene.add(logoGroup)

    // 4. Medallion Body: 3D Cylinder with beveled rim
    const cylinderGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.22, 64)
    cylinderGeo.rotateX(Math.PI / 2) // Face camera

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x051b11,
      metalness: 0.9,
      roughness: 0.2,
    })

    const cylinderMesh = new THREE.Mesh(cylinderGeo, bodyMat)
    logoGroup.add(cylinderMesh)

    // 5. Beveled Outer Edge Ring (Torus)
    const bevelTorusGeo = new THREE.TorusGeometry(1.85, 0.08, 24, 64)
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x052e16,
      emissiveIntensity: 0.25,
    })
    const rimMesh = new THREE.Mesh(bevelTorusGeo, rimMat)
    logoGroup.add(rimMesh)

    // 6. Front & Back Face Texture with GreenGrid High-Resolution Logo
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('/logo-hires.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.generateMipmaps = true
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      if (renderer) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      }

      const faceGeo = new THREE.CircleGeometry(1.78, 64)
      const faceMat = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.15,
        roughness: 0.15,
        transparent: true,
        emissive: 0xffffff,
        emissiveMap: texture,
        emissiveIntensity: 0.15,
      })

      // Front face
      const frontMesh = new THREE.Mesh(faceGeo, faceMat)
      frontMesh.position.z = 0.115
      logoGroup.add(frontMesh)

      // Back face
      const backMesh = new THREE.Mesh(faceGeo, faceMat.clone())
      backMesh.position.z = -0.115
      backMesh.rotation.y = Math.PI
      logoGroup.add(backMesh)
    })

    // 7. Concentric Holographic Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.02, 16, 80)
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.40,
    })
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.x = 1.1
    ring1.rotation.y = 0.4
    logoGroup.add(ring1)

    const ring2Geo = new THREE.TorusGeometry(2.65, 0.015, 16, 80)
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x6b7c72,
      transparent: true,
      opacity: 0.25,
    })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = 0.6
    ring2.rotation.y = -0.7
    logoGroup.add(ring2)

    // 8. Mouse & Pointer Interactive Tilt
    let targetRotX = 0
    let targetRotY = 0
    let mouseX = 0
    let mouseY = 0
    let isHovered = false

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      mouseX = (x / rect.width - 0.5) * 2
      mouseY = (y / rect.height - 0.5) * 2

      targetRotY = mouseX * 0.85
      targetRotX = -mouseY * 0.85
    }

    const handleMouseEnter = () => {
      isHovered = true
    }

    const handleMouseLeave = () => {
      isHovered = false
      targetRotX = 0
      targetRotY = 0
    }

    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    // 9. Animation Loop with Smooth Cinematic Intro Transition
    let animId
    const startTime = performance.now()
    const introDuration = 1.3 // seconds

    // Initial intro state
    logoGroup.scale.set(0.3, 0.3, 0.3)
    accentPointLight.intensity = 0.5

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (document.hidden) return
      const elapsedTime = (performance.now() - startTime) * 0.001

      // Intro reveal progression with smooth cubic ease-out
      const introProgress = Math.min(1, elapsedTime / introDuration)
      const easeOut = 1 - Math.pow(1 - introProgress, 3)

      if (introProgress < 1) {
        // Smooth scale expansion with elastic settle
        const s = 0.3 + 0.7 * easeOut
        logoGroup.scale.set(s, s, s)

        // Smooth spin-in from angle to 0
        const spinOffset = (1 - easeOut) * (Math.PI * 1.5)
        logoGroup.rotation.y = spinOffset

        // Specular flare sweeps across medallion surface
        accentPointLight.intensity = 1.2 + Math.sin(introProgress * Math.PI) * 3.0
      } else {
        logoGroup.scale.set(1, 1, 1)
        accentPointLight.intensity = 2.5

        // Idle auto-spin / float physics
        const idleSpinSpeed = isHovered ? 0.003 : 0.008
        logoGroup.rotation.y += idleSpinSpeed

        // Smooth lerp to mouse tilt
        logoGroup.rotation.y += (targetRotY - (logoGroup.rotation.y % (Math.PI * 2))) * 0.05
      }

      logoGroup.rotation.x += (targetRotX - logoGroup.rotation.x) * 0.08

      // Gentle floating bobbing
      logoGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.12

      // Orbital rings differential counter-rotations
      ring1.rotation.z += 0.012
      ring2.rotation.z -= 0.008

      // Light oscillation for moving specular glimmer
      keyLight.position.x = 4 + Math.sin(elapsedTime) * 1.5
      keyLight.position.y = 5 + Math.cos(elapsedTime) * 1.5

      renderer.render(scene, camera)
    }

    animate()

    // 10. Resize Observer
    const handleResize = () => {
      if (!container) return
      const newW = container.clientWidth || size
      const newH = container.clientHeight || size
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
      renderer.setSize(newW, newH)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)

      cylinderGeo.dispose()
      bevelTorusGeo.dispose()
      ring1Geo.dispose()
      ring2Geo.dispose()
      bodyMat.dispose()
      rimMat.dispose()
      ring1Mat.dispose()
      ring2Mat.dispose()
      renderer.dispose()

      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [size])

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative cursor-pointer select-none flex items-center justify-center ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
    />
  )
}
