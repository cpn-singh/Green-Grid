import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * GreenGrid Interactive 3D Brand Medallion
 * 
 * Fully responsive WebGL 3D Medallion rendered on all devices (mobile, tablet, desktop):
 * - Open-ended beveled cylinder rim prevents z-fighting depth artifacts.
 * - Anti-aliased high-precision lighting with specular shine sweeps.
 * - Responsive ResizeObserver ensures zero distortion across all viewport widths.
 * - Interactive 3D tilt tracking for both mouse pointer and touch gestures.
 */
export default function Logo3D({ size = 200, className = '', onClick }) {
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
          className="w-full h-full object-contain rounded-full drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Verify WebGL availability
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      // Fallback 2D if WebGL is disabled in browser
      container.innerHTML = `<img src="/logo-hires.png" alt="GreenGrid" class="w-full h-full object-contain rounded-full select-none" />`;
      return;
    }

    const rect = container.getBoundingClientRect();
    const width = rect.width || size;
    const height = rect.height || size;

    // 1. Scene, Camera, High-Precision Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Multi-point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x34d399, 3.2);
    rimLight.position.set(-4, -3, -2);
    scene.add(rimLight);

    const accentPointLight = new THREE.PointLight(0x10b981, 2.5, 12);
    accentPointLight.position.set(0, 0, 3);
    scene.add(accentPointLight);

    // 3. 3D Medallion Group
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // 4. Medallion Body Rim (openEnded=true eliminates solid circular caps to prevent z-fighting)
    const cylinderGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.22, 64, 1, true);
    cylinderGeo.rotateX(Math.PI / 2);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x051b11,
      metalness: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
    const cylinderMesh = new THREE.Mesh(cylinderGeo, bodyMat);
    logoGroup.add(cylinderMesh);

    // 5. Beveled Metallic Outer Edge
    const bevelTorusGeo = new THREE.TorusGeometry(1.85, 0.08, 24, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x052e16,
      emissiveIntensity: 0.25,
    });
    const rimMesh = new THREE.Mesh(bevelTorusGeo, rimMat);
    logoGroup.add(rimMesh);

    // 6. Textured Face Plates (Front and Back)
    let frontMesh = null;
    let backMesh = null;
    let faceGeo = null;
    let faceMat = null;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/logo-hires.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      if (renderer && renderer.capabilities) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }

      faceGeo = new THREE.CircleGeometry(1.82, 64);
      faceMat = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.15,
        roughness: 0.15,
        transparent: true,
        emissive: 0xffffff,
        emissiveMap: texture,
        emissiveIntensity: 0.12,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });

      frontMesh = new THREE.Mesh(faceGeo, faceMat);
      frontMesh.position.z = 0.112;
      logoGroup.add(frontMesh);

      backMesh = new THREE.Mesh(faceGeo, faceMat.clone());
      backMesh.position.z = -0.112;
      backMesh.rotation.y = Math.PI;
      logoGroup.add(backMesh);
    });

    // 7. Mouse & Touch Interactive 3D Tilt
    let targetRotX = 0;
    let targetRotY = 0;
    let isInteracting = false;

    const updateTiltFromCoords = (clientX, clientY) => {
      const bRect = container.getBoundingClientRect();
      const x = clientX - bRect.left;
      const y = clientY - bRect.top;
      const normX = (x / bRect.width - 0.5) * 2;
      const normY = (y / bRect.height - 0.5) * 2;
      targetRotY = normX * 0.75;
      targetRotX = -normY * 0.75;
    };

    const handlePointerMove = (e) => {
      updateTiltFromCoords(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updateTiltFromCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnter = () => {
      isInteracting = true;
    };

    const handleLeave = () => {
      isInteracting = false;
      targetRotX = 0;
      targetRotY = 0;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('mouseenter', handleEnter);
    container.addEventListener('mouseleave', handleLeave);
    container.addEventListener('touchstart', handleEnter, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleLeave, { passive: true });

    // 8. Animation Loop
    let animId;
    let isElementVisible = true;
    const startTime = performance.now();
    const introDuration = 1.2;

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isElementVisible = entry.isIntersecting;
      if (isElementVisible) {
        animId = requestAnimationFrame(animate);
      }
    }, { threshold: 0.05 });
    visibilityObserver.observe(container);

    logoGroup.scale.set(0.3, 0.3, 0.3);
    accentPointLight.intensity = 0.5;

    const animate = () => {
      if (!isElementVisible || document.hidden) return;
      animId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      const introProgress = Math.min(1, elapsedTime / introDuration);
      const easeOut = 1 - Math.pow(1 - introProgress, 3);

      if (introProgress < 1) {
        const s = 0.3 + 0.7 * easeOut;
        logoGroup.scale.set(s, s, s);
        const spinOffset = (1 - easeOut) * (Math.PI * 1.5);
        logoGroup.rotation.y = spinOffset;
        accentPointLight.intensity = 1.2 + Math.sin(introProgress * Math.PI) * 3.0;
      } else {
        logoGroup.scale.set(1, 1, 1);
        accentPointLight.intensity = 2.5;
        const idleSpeed = isInteracting ? 0.003 : 0.007;
        logoGroup.rotation.y += idleSpeed;
        logoGroup.rotation.y += (targetRotY - (logoGroup.rotation.y % (Math.PI * 2))) * 0.05;
      }

      logoGroup.rotation.x += (targetRotX - logoGroup.rotation.x) * 0.08;
      logoGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.12;

      keyLight.position.x = 4 + Math.sin(elapsedTime) * 1.5;
      keyLight.position.y = 5 + Math.cos(elapsedTime) * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    // 9. ResizeObserver for responsive adaptation on all screens
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        const w = cr.width || size;
        const h = cr.height || size;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('mouseenter', handleEnter);
      container.removeEventListener('mouseleave', handleLeave);
      container.removeEventListener('touchstart', handleEnter);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleLeave);

      cylinderGeo.dispose();
      bevelTorusGeo.dispose();
      bodyMat.dispose();
      rimMat.dispose();
      if (faceGeo) faceGeo.dispose();
      if (faceMat) faceMat.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative cursor-pointer select-none flex items-center justify-center ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
      }}
    />
  );
}
