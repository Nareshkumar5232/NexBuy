import React from 'react';
import { Link } from 'react-router-dom';
import logoPng from '../../logo.png';

export default function Logo({ light = true, className = '', size = 'default', showSubtitle = true }) {
  const heightClass =
    size === 'large'
      ? 'h-11 sm:h-13'
      : size === 'small'
      ? 'h-7 sm:h-8'
      : 'h-9 sm:h-10';

  return (
    <Link to="/" className={`inline-flex items-center gap-2 group select-none ${className}`}>
      <img
        src={logoPng}
        alt="NEXBUY ENTERPRISES PVT LTD"
        className={`${heightClass} w-auto max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-105`}
      />
    </Link>
  );
}
