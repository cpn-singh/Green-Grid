import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * BackgroundScene - Continuous Ambient Background Video + 3D WebGL Scroll Canvas
 * 
 * Inspired by SYLVRA / enterprise sustainable tech design:
 * - Ambient cinematic background video playing smoothly across all sections
 * - Fixed 3D WebGL Three.js canvas that reacts in real-time to scroll progress:
 *   1) 3D Planetary Clean Energy Wireframe Globe with glowing latitude/longitude rings
 *   2) Monitored Indian clean energy nodes (Khavda, Bhadla, Ladakh, Mumbai, Chennai, Bengaluru)
 *   3) 3D curved transmission corridors with animated electrical energy pulses
 *   4) Drifting 3D grid particle dust field with scroll-velocity acceleration
 *   5) Fluid mouse parallax and 60fps lerped scroll physics
 */
export default function BackgroundScene() {
  const canvasContainerRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const container = canvasContainerRef.current
    if (!container) return

    // Check WebGL availability
    const testCanvas = document.createElement('canvas')
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
    if (!gl) return

    let width = window.innerWidth
    let height = window.innerHeight

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 7.5)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      precision: 'mediump'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    container.appendChild(renderer.domElement)

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0x34d399, 2.5)
    keyLight.position.set(5, 5, 4)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0)
    rimLight.position.set(-5, -4, -2)
    scene.add(rimLight)

    // 3. Main World Group (positioned to the right on desktop, centered on mobile)
    const worldGroup = new THREE.Group()
    const isDesktop = width >= 1024
    worldGroup.position.set(isDesktop ? 2.4 : 0, isDesktop ? -0.2 : -0.6, 0)
    scene.add(worldGroup)

    // 4. 3D Planetary Energy Globe (Wireframe + Coordinate Grid Rings)
    const globeRadius = 2.4
    const globeSegments = 32

    // Outer wireframe sphere
    const sphereGeo = new THREE.SphereGeometry(globeRadius, globeSegments, globeSegments)
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    })
    const wireframeGlobe = new THREE.Mesh(sphereGeo, wireframeMat)
    worldGroup.add(wireframeGlobe)

    // Inner dark core sphere for atmospheric depth occlusion
    const coreGeo = new THREE.SphereGeometry(globeRadius * 0.985, 32, 32)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x080b09,
      transparent: true,
      opacity: 0.92,
    })
    const coreGlobe = new THREE.Mesh(coreGeo, coreMat)
    worldGroup.add(coreGlobe)

    // Concentric glowing orbital latitude/equator rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.40,
    })
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x6b7c72,
      transparent: true,
      opacity: 0.30,
    })

    const equatorRingGeo = new THREE.TorusGeometry(globeRadius * 1.05, 0.015, 16, 80)
    const equatorRing = new THREE.Mesh(equatorRingGeo, ringMat1)
    equatorRing.rotation.x = Math.PI / 2
    worldGroup.add(equatorRing)

    const orbitRingGeo = new THREE.TorusGeometry(globeRadius * 1.25, 0.012, 16, 80)
    const orbitRing = new THREE.Mesh(orbitRingGeo, ringMat2)
    orbitRing.rotation.x = 1.15
    orbitRing.rotation.y = 0.45
    worldGroup.add(orbitRing)

    const orbitRingGeo2 = new THREE.TorusGeometry(globeRadius * 1.45, 0.008, 16, 80)
    const orbitRing2 = new THREE.Mesh(orbitRingGeo2, ringMat1)
    orbitRing2.rotation.x = 0.55
    orbitRing2.rotation.y = -0.65
    worldGroup.add(orbitRing2)

    // 5. 3D Regional Energy Hub Nodes on the Globe (Spherical coordinates)
    // Convert lat/lng on globe to 3D Cartesian coordinates
    const latLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      const x = -(radius * Math.sin(phi) * Math.cos(theta))
      const z = radius * Math.sin(phi) * Math.sin(theta)
      const y = radius * Math.cos(phi)
      return new THREE.Vector3(x, y, z)
    }

    // Key Indian Energy Hubs & Data Center Clusters
    const NODES = [
      { name: 'Khavda', lat: 23.85, lng: 69.75, type: 'source', color: 0x10b981 },
      { name: 'Bhadla', lat: 27.54, lng: 71.91, type: 'source', color: 0x34d399 },
      { name: 'Ladakh', lat: 34.15, lng: 77.58, type: 'source', color: 0x38bdf8 },
      { name: 'Mumbai', lat: 19.07, lng: 72.87, type: 'dc', color: 0x38bdf8 },
      { name: 'Chennai', lat: 13.08, lng: 80.27, type: 'dc', color: 0x10b981 },
      { name: 'Bengaluru', lat: 12.97, lng: 77.59, type: 'dc', color: 0x34d399 },
      { name: 'Noida', lat: 28.53, lng: 77.39, type: 'dc', color: 0x38bdf8 },
    ]

    const nodeMeshes = []
    const nodeVectors = {}

    NODES.forEach(n => {
      const pos = latLngToVector3(n.lat, n.lng, globeRadius * 1.01)
      nodeVectors[n.name] = pos

      // Small glowing node beacon sphere
      const beaconGeo = new THREE.SphereGeometry(0.045, 12, 12)
      const beaconMat = new THREE.MeshBasicMaterial({
        color: n.color,
      })
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat)
      beaconMesh.position.copy(pos)
      worldGroup.add(beaconMesh)
      nodeMeshes.push(beaconMesh)

      // Outer beacon pulse halo
      const haloGeo = new THREE.RingGeometry(0.05, 0.08, 16)
      const haloMat = new THREE.MeshBasicMaterial({
        color: n.color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      })
      const haloMesh = new THREE.Mesh(haloGeo, haloMat)
      haloMesh.position.copy(pos.clone().multiplyScalar(1.005))
      haloMesh.lookAt(pos.clone().multiplyScalar(2))
      worldGroup.add(haloMesh)
    })

    // 6. 3D Transmission Corridors (Curved Quadratic Arcs between Nodes)
    const CORRIDORS = [
      { from: 'Khavda', to: 'Mumbai' },
      { from: 'Bhadla', to: 'Noida' },
      { from: 'Ladakh', to: 'Noida' },
      { from: 'Khavda', to: 'Bengaluru' },
      { from: 'Chennai', to: 'Bengaluru' },
      { from: 'Mumbai', to: 'Chennai' }
    ]

    const pulses = []

    CORRIDORS.forEach(c => {
      const v1 = nodeVectors[c.from]
      const v2 = nodeVectors[c.to]
      if (!v1 || !v2) return

      // Compute midpoint arched outwards from center of globe
      const mid = v1.clone().add(v2).multiplyScalar(0.5)
      const midDist = globeRadius * 1.22
      mid.normalize().multiplyScalar(midDist)

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2)
      const curvePoints = curve.getPoints(36)
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints)

      const curveMat = new THREE.LineBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.45,
      })
      const curveLine = new THREE.Line(curveGeo, curveMat)
      worldGroup.add(curveLine)

      // Electrical pulse particle traveling along the transmission corridor
      const pulseGeo = new THREE.SphereGeometry(0.035, 8, 8)
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
      })
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat)
      worldGroup.add(pulseMesh)

      pulses.push({
        mesh: pulseMesh,
        curve: curve,
        speed: 0.003 + Math.random() * 0.003,
        progress: Math.random()
      })
    })

    // 7. 3D Sparkling Particle Dust Field (500 energy particles)
    const particleCount = 500
    const particlePositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16
      particlePositions[i + 1] = (Math.random() - 0.5) * 16
      particlePositions[i + 2] = (Math.random() - 0.5) * 12
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    })

    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // 8. Scroll & Mouse Tracking
    let targetScrollProgress = 0
    let currentScrollProgress = 0
    let scrollVelocity = 0
    let lastScrollY = window.scrollY
    let targetMouseX = 0
    let targetMouseY = 0

    const updateScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      targetScrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll))

      scrollVelocity = (scrollY - lastScrollY) * 0.001
      lastScrollY = scrollY

      // Ambient background video only needs to play when scrolled into the lower sections
      const vid = videoRef.current
      if (vid) {
        if (scrollY > 50 && vid.paused) {
          vid.play().catch(() => {})
        } else if (scrollY <= 50 && !vid.paused) {
          vid.pause()
        }
      }
    }

    const handlePointerMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.4
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.4
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    updateScroll()

    // 9. Animation Loop
    let animId
    const startTime = performance.now()

    // Render one initial frame so WebGL pipeline compiles without user seeing pop-in
    renderer.render(scene, camera)

    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Skip rendering if document is hidden or if resting at top behind full-screen Hero video
      if (document.hidden) return
      if (window.scrollY < 15 && currentScrollProgress < 0.005) {
        return
      }

      const elapsedTime = (performance.now() - startTime) * 0.001

      // Smooth lerp to scroll position
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06

      // Damp scroll velocity
      scrollVelocity *= 0.92

      // 3D Globe Rotation based on scroll progress + idle rotation
      const scrollRotationY = currentScrollProgress * Math.PI * 3.5
      worldGroup.rotation.y = scrollRotationY + elapsedTime * 0.06 + targetMouseX * 0.5

      // Pitch angle varies subtly with scroll depth
      const scrollPitchX = -0.35 + currentScrollProgress * 0.6
      worldGroup.rotation.x = scrollPitchX - targetMouseY * 0.4

      // Gentle floating bob
      worldGroup.position.y = (isDesktop ? -0.2 : -0.6) + Math.sin(elapsedTime * 1.2) * 0.08

      // Orbital rings counter-rotations
      orbitRing.rotation.z += 0.006 + Math.abs(scrollVelocity) * 0.05
      orbitRing2.rotation.z -= 0.004 + Math.abs(scrollVelocity) * 0.05

      // Transmission Pulses animation
      pulses.forEach(p => {
        p.progress = (p.progress + p.speed + Math.abs(scrollVelocity) * 0.02) % 1
        const pt = p.curve.getPoint(p.progress)
        p.mesh.position.copy(pt)
      })

      // Particle Dust gentle drift
      particleSystem.rotation.y = elapsedTime * 0.02 + currentScrollProgress * 0.5
      particleSystem.rotation.x = elapsedTime * 0.01

      // Camera slight depth zoom based on scroll progress
      camera.position.z = 7.5 - currentScrollProgress * 1.2

      renderer.render(scene, camera)
    }

    animate()

    // 10. Responsive Resize
    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)

      const desktopNow = width >= 1024
      worldGroup.position.set(desktopNow ? 2.4 : 0, desktopNow ? -0.2 : -0.6, 0)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)

      sphereGeo.dispose()
      coreGeo.dispose()
      wireframeMat.dispose()
      coreMat.dispose()
      equatorRingGeo.dispose()
      orbitRingGeo.dispose()
      orbitRingGeo2.dispose()
      ringMat1.dispose()
      ringMat2.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()

      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Cinematic Ambient Background Video (Plays on scroll) */}
      <video
        ref={videoRef}
        src="/hero.mp4"
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover opacity-60 md:opacity-70 transition-opacity duration-1000 transform-gpu"
      />

      {/* 2. Atmospheric Obsidian Gradient Mesh Overlay - Translucent to reveal video */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080b09]/40 via-[#080b09]/60 to-[#080b09]/80 pointer-events-none" />

      {/* 3. Subtle Radial Vignette for Content Readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,11,9,0.55)_90%)] pointer-events-none" />

      {/* 4. Real-Time 3D WebGL Three.js Canvas Container (Reacts to Scroll) */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  )
}
