import React, { useState } from 'react';

/**
 * EnergyVideoMedia renders real renewable energy media (video or high-res imagery)
 * with cinematic overlay gradients, tactical scanlines, and instant fallback.
 */
export default function EnergyVideoMedia({
  imageSrc,
  videoSrc,
  videoCdn,
  alt = 'Renewable Energy Media',
  className = '',
  overlayOpacity = '0.55',
  showScanlines = true,
  aspectRatio = 'aspect-video'
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Preferred source: local video if available, then CDN stream, else fallback to high-res image
  const activeVideo = !videoFailed ? (videoSrc || videoCdn) : null;

  return (
    <div
      className={`relative overflow-hidden rounded-[4px] border border-emerald-500/15 bg-[#020504] ${aspectRatio} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image / Fallback */}
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
          isHovered ? 'scale-105' : 'scale-100'
        }`}
      />

      {/* Video Loop if available */}
      {activeVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onError={() => setVideoFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoFailed ? 'opacity-0' : 'opacity-85'
          }`}
        >
          <source src={activeVideo} type="video/mp4" />
        </video>
      )}

      {/* Tactical Gradient Darkening (Sylvra Obsidian Style) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(180deg, rgba(2, 5, 4, 0.25) 0%, rgba(2, 5, 4, ${overlayOpacity}) 60%, rgba(2, 5, 4, 0.95) 100%)`
        }}
      />

      {/* Subtle Scanlines effect */}
      {showScanlines && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16, 185, 129, 0.05) 2px, rgba(16, 185, 129, 0.05) 4px)'
          }}
        />
      )}

      {/* Corner HUD targeting brackets */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-emerald-500/50 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-emerald-500/50 pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-emerald-500/50 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-emerald-500/50 pointer-events-none" />
    </div>
  );
}
