import React, { useState } from 'react';

/**
 * EnergyVideoMedia renders dedicated renewable energy media (video or high-res imagery)
 * with cinematic overlay gradients, tactical scanlines, telemetry badges, and instant fallback.
 */
export default function EnergyVideoMedia({
  imageSrc,
  videoSrc,
  videoCdn,
  alt = 'Renewable Energy Media',
  className = '',
  overlayOpacity = '0.50',
  showScanlines = true,
  aspectRatio = 'aspect-video',
  showTelemetry = true
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Preferred source: verified local video if available, then CDN stream, else fallback to high-res image
  const activeVideo = !videoFailed && (videoSrc || videoCdn);

  return (
    <div
      className={`relative overflow-hidden rounded-[4px] border border-emerald-500/20 bg-[#020504] ${aspectRatio} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image / High-Res Visual */}
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out ${
          isHovered ? 'scale-105' : 'scale-100'
        }`}
      />

      {/* Video Loop if dedicated video exists */}
      {activeVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoFailed ? 'opacity-0' : 'opacity-90'
          }`}
        >
          <source src={activeVideo} />
        </video>
      )}

      {/* Tactical Gradient Darkening (Sylvra Obsidian Style) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(180deg, rgba(2, 5, 4, 0.15) 0%, rgba(2, 5, 4, ${overlayOpacity}) 50%, rgba(2, 5, 4, 0.92) 100%)`
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
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400 z-10 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400 z-10 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400 z-10 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400 z-10 pointer-events-none" />

      {/* Telemetry pill overlay */}
      {showTelemetry && (
        <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-2 pointer-events-none">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-black/80 backdrop-blur-md border border-emerald-500/30 text-[9px] font-mono uppercase tracking-wider text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{activeVideo ? 'VIDEO LOOP // ACTIVE' : 'OPTICAL FEED // AI GENERATED'}</span>
          </span>
        </div>
      )}
    </div>
  );
}
