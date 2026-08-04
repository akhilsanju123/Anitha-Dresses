import React from 'react';

interface TeluguLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'maroon' | 'white';
}

export default function TeluguLogo({ className = '', size = 'md', variant = 'gold' }: TeluguLogoProps) {
  const sizeMap = {
    sm: { width: 190, height: 50 },
    md: { width: 250, height: 64 },
    lg: { width: 320, height: 82 },
    xl: { width: 400, height: 102 },
  };

  const dimensions = sizeMap[size];

  const primaryFill = variant === 'white' ? '#FFFFFF' : 'url(#gold-vector-grad)';
  const secondaryFill = variant === 'maroon' ? '#4A0E17' : variant === 'white' ? '#FFFFFF' : '#F4ECE0';

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 400 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        className="transition-transform duration-300 hover:scale-[1.02]"
      >
        <defs>
          <linearGradient id="gold-vector-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E6AD" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA771C" />
            <stop offset="100%" stopColor="#FDF7C3" />
          </linearGradient>
        </defs>

        {/* Left Luxury Crest Frame with Interlocked AD Monogram */}
        <g transform="translate(10, 16)">
          <rect
            x="0"
            y="0"
            width="56"
            height="56"
            rx="12"
            fill="none"
            stroke="url(#gold-vector-grad)"
            strokeWidth="2"
          />
          <rect
            x="4"
            y="4"
            width="48"
            height="48"
            rx="9"
            fill="none"
            stroke="url(#gold-vector-grad)"
            strokeWidth="0.8"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          <text
            x="28"
            y="37"
            textAnchor="middle"
            fill="url(#gold-vector-grad)"
            fontSize="26"
            fontWeight="900"
            fontFamily="'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif"
            letterSpacing="-1px"
          >
            AD
          </text>
        </g>

        {/* English Main Title: ANITHA DRESSES */}
        <text
          x="235"
          y="42"
          textAnchor="middle"
          fill={primaryFill}
          fontSize="24"
          fontWeight="900"
          fontFamily="'Cinzel', 'Montserrat', 'Inter', sans-serif"
          letterSpacing="5px"
        >
          ANITHA DRESSES
        </text>

        {/* Crisp Decorative Vector Line */}
        <line x1="88" y1="54" x2="382" y2="54" stroke="url(#gold-vector-grad)" strokeWidth="1" opacity="0.8" />
        <polygon points="235,51 239,54 235,57 231,54" fill="url(#gold-vector-grad)" />

        {/* English Tagline: FAMILY SHOPPING MALL • ONGOLE */}
        <text
          x="235"
          y="78"
          textAnchor="middle"
          fill={secondaryFill}
          fontSize="12"
          fontWeight="700"
          fontFamily="'Inter', 'Montserrat', sans-serif"
          letterSpacing="3px"
        >
          FAMILY SHOPPING MALL • ONGOLE
        </text>
      </svg>
    </div>
  );
}
