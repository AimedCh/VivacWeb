import React from 'react';

const VivacLogo = ({ size = 48, showText = true, className = "" }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo SVG */}
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="drop-shadow-lg"
        >
          {/* Background Circle with Gradient */}
          <defs>
            <radialGradient id="skyGradient" cx="50%" cy="25%" r="80%">
              <stop offset="0%" stopColor="#87CEEB" />
              <stop offset="30%" stopColor="#4682B4" />
              <stop offset="60%" stopColor="#4B0082" />
              <stop offset="100%" stopColor="#2F1B69" />
            </radialGradient>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00BFFF" />
              <stop offset="30%" stopColor="#4169E1" />
              <stop offset="70%" stopColor="#8A2BE2" />
              <stop offset="100%" stopColor="#4B0082" />
            </linearGradient>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="70%" stopColor="#FF4500" />
              <stop offset="100%" stopColor="#FF6B35" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="url(#skyGradient)"
            stroke="#fff"
            strokeWidth="2"
          />
          
          {/* Star Glow Background */}
          <circle
            cx="50"
            cy="30"
            r="15"
            fill="url(#starGlow)"
            opacity="0.3"
            filter="url(#glow)"
          />
          
          {/* Mountains - More detailed and faceted */}
          <g fill="url(#mountainGradient)">
            {/* Left Mountain */}
            <polygon points="15,75 25,50 30,55 35,45 40,75" />
            {/* Center Mountain - Main Peak */}
            <polygon points="35,75 45,40 50,35 55,40 65,75" />
            {/* Right Mountain */}
            <polygon points="60,75 70,55 75,60 80,50 85,75" />
            {/* Small Peak */}
            <polygon points="75,75 80,65 85,70 90,75" />
          </g>
          
          {/* Mountain Highlights and Facets */}
          <g fill="#B0E0E6" opacity="0.7">
            <polygon points="20,75 25,55 30,60" />
            <polygon points="40,75 45,45 50,40" />
            <polygon points="65,75 70,60 75,65" />
            <polygon points="78,75 80,70 85,75" />
          </g>
          
          {/* Star - 4-pointed star */}
          <g filter="url(#glow)">
            <polygon
              points="50,25 52,35 62,35 54,42 57,52 50,47 43,52 46,42 38,35 48,35"
              fill="#FF6B35"
              stroke="#FFD700"
              strokeWidth="0.5"
            />
          </g>
          
          {/* Connection Lines - More detailed with 8-10 lines */}
          <g stroke="#00FF00" strokeWidth="1.5" fill="none" opacity="0.9" filter="url(#neonGlow)">
            {/* Lines from central peak to various mountain points */}
            <path d="M50,30 Q45,40 30,55" />
            <circle cx="30" cy="55" r="2" fill="#00FF00" />
            
            <path d="M50,30 Q48,35 45,40" />
            <circle cx="45" cy="40" r="2" fill="#00FF00" />
            
            <path d="M50,30 Q52,35 55,40" />
            <circle cx="55" cy="40" r="2" fill="#00FF00" />
            
            <path d="M50,30 Q55,45 70,55" />
            <circle cx="70" cy="55" r="2" fill="#00FF00" />
            
            <path d="M50,30 Q60,50 80,65" />
            <circle cx="80" cy="65" r="2" fill="#00FF00" />
            
            <path d="M50,30 Q58,55 75,60" />
            <circle cx="75" cy="60" r="2" fill="#00FF00" />
            
            <path d="M50,30 Q42,45 25,50" />
            <circle cx="25" cy="50" r="2" fill="#00FF00" />
            
            <path d="M50,30 Q50,45 50,55" />
            <circle cx="50" cy="55" r="2" fill="#00FF00" />
          </g>
          
          {/* Central connection point */}
          <circle cx="50" cy="30" r="3" fill="#00FF00" filter="url(#neonGlow)" />
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <p className="text-xl font-bold text-slate-800">Vivac</p>
        </div>
      )}
    </div>
  );
};

export default VivacLogo;
