import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Logo3D - Interactive WebGL 3D Medallion for GreenGrid
 * Features:
 * - Ultra-sharp supersampled 3D medallion with high-metalness emerald-obsidian bevel rim
 * - High-res 958x958 logo texture with anisotropic filtering and true contrast
 * - Rotating holographic orbital energy rings (Torus)
 * - Dynamic lighting (specular highlights + glowing emerald rim light)
 * - Mouse-tracking 3D tilt & gentle idle floating oscillation
 * - Graceful WebGL error handling & automatic cleanup
 */
export default function Logo3D({ size = 220, className = '', onClick }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Verify WebGL availability
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      container.innerHTML = `<img src="/logo-hires.png" alt="GreenGrid" class="w-full h-full object-contain rounded-full select-none" />`
      return
    }

    const rect = container.getBoundingClientRect()
    const width = Math.round(rect.width > 0 ? rect.width : (typeof size === 'number' ? size : 220))
    const height = Math.round(rect.height > 0 ? rect.height : (typeof size === 'number' ? size : 220))

    // 1. Scene, Camera, Renderer with High Precision & Supersampling Anti-Aliasing
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    })
    renderer.setSize(width, height)
    // Force at least 2.0x supersampling so it is razor sharp on all displays (standard 1x and retina)
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3)
    renderer.setPixelRatio(dpr)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6)
    keyLight.position.set(4, 5, 5)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x34d399, 3.0)
    rimLight.position.set(-4, -3, -2)
    scene.add(rimLight)

    const accentPointLight = new THREE.PointLight(0x10b981, 2.4, 12)
    accentPointLight.position.set(0, 0, 3)
    scene.add(accentPointLight)

    // 3. 3D Group
    const logoGroup = new THREE.Group()
    scene.add(logoGroup)

    // 4. Medallion Body: 3D Cylinder with beveled rim (openEnded=true eliminates solid circular caps to prevent z-fighting)
    const cylinderGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.22, 96, 1, true)
    cylinderGeo.rotateX(Math.PI / 2) // Face camera

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x051b11,
      metalness: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide,
    })

    const cylinderMesh = new THREE.Mesh(cylinderGeo, bodyMat)
    logoGroup.add(cylinderMesh)

    // 5. Beveled Outer Edge Ring (Torus)
    const bevelTorusGeo = new THREE.TorusGeometry(1.85, 0.08, 32, 96)
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
    let frontMesh = null
    let backMesh = null
    let faceGeo = null
    let faceMat = null

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('/logo-hires.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.generateMipmaps = true
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      if (renderer && renderer.capabilities) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      }
      texture.needsUpdate = true

      faceGeo = new THREE.CircleGeometry(1.78, 96)
      // High contrast without washing out the logo
      faceMat = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.05,
        roughness: 0.2,
        transparent: true,
      })

      // Front face
      frontMesh = new THREE.Mesh(faceGeo, faceMat)
      frontMesh.position.z = 0.114
      logoGroup.add(frontMesh)

      // Back face
      backMesh = new THREE.Mesh(faceGeo, faceMat.clone())
      backMesh.position.z = -0.114
      backMesh.rotation.y = Math.PI
      logoGroup.add(backMesh)
    })

    // 7. Concentric Holographic Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.02, 16, 96)
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.40,
    })
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.x = 1.1
    ring1.rotation.y = 0.4
    logoGroup.add(ring1)

    const ring2Geo = new THREE.TorusGeometry(2.65, 0.015, 16, 96)
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
      const bRect = container.getBoundingClientRect()
      const x = e.clientX - bRect.left
      const y = e.clientY - bRect.top

      mouseX = (x / bRect.width - 0.5) * 2
      mouseY = (y / bRect.height - 0.5) * 2

      targetRotY = mouseX * 0.85
      targetRotX = -mouseY * 0.85
    }

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const bRect = container.getBoundingClientRect()
        const x = e.touches[0].clientX - bRect.left
        const y = e.touches[0].clientY - bRect.top
        mouseX = (x / bRect.width - 0.5) * 2
        mouseY = (y / bRect.height - 0.5) * 2
        targetRotY = mouseX * 0.85
        targetRotX = -mouseY * 0.85
      }
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
    container.addEventListener('touchstart', handleMouseEnter, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleMouseLeave, { passive: true })

    // 9. Animation Loop with Smooth Cinematic Intro Transition
    let animId
    let isElementVisible = true
    const startTime = performance.now()
    const introDuration = 1.3 // seconds

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isElementVisible = entry.isIntersecting
      if (isElementVisible) {
        animId = requestAnimationFrame(animate)
      }
    }, { threshold: 0.05 })
    visibilityObserver.observe(container)

    // Initial intro state
    logoGroup.scale.set(0.3, 0.3, 0.3)
    accentPointLight.intensity = 0.5

    const animate = () => {
      if (!isElementVisible || document.hidden) return
      animId = requestAnimationFrame(animate)
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
      const bRect = container.getBoundingClientRect()
      const newW = Math.round(bRect.width > 0 ? bRect.width : (typeof size === 'number' ? size : 220))
      const newH = Math.round(bRect.height > 0 ? bRect.height : (typeof size === 'number' ? size : 220))
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
      renderer.setSize(newW, newH)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      visibilityObserver.disconnect()
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('touchstart', handleMouseEnter)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleMouseLeave)

      cylinderGeo.dispose()
      bevelTorusGeo.dispose()
      ring1Geo.dispose()
      ring2Geo.dispose()
      bodyMat.dispose()
      rimMat.dispose()
      ring1Mat.dispose()
      ring2Mat.dispose()
      if (faceGeo) faceGeo.dispose()
      if (faceMat) faceMat.dispose()
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
