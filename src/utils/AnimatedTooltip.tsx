import React, { useState, useRef, useCallback } from 'react';

// --- Directional Class Mapping for Tailwind Animation ---
const directionTransformClasses = {
  top: 'transform -translate-x-1/2 -translate-y-full data-[visible=true]:-translate-y-[calc(100%+8px)] data-[visible=false]:-translate-y-2',
  bottom: 'transform -translate-x-1/2 data-[visible=true]:translate-y-0 data-[visible=false]:translate-y-2',
  left: 'transform -translate-y-1/2 -translate-x-full data-[visible=true]:-translate-x-[calc(100%+8px)] data-[visible=false]:-translate-x-2',
  right: 'transform -translate-y-1/2 data-[visible=true]:translate-x-0 data-[visible=false]:translate-x-2',
};

const AnimatedTooltip = ({ content, children, direction = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({});
  const targetRef = useRef(null);

  const TOOLTIP_OFFSET = 8;

  // --- Positioning Logic ---
  const calculatePosition = useCallback(() => {
    if (!targetRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    let newPosition = {};

    switch (direction) {
      case 'top':
        newPosition = {
          top: targetRect.top - TOOLTIP_OFFSET,
          left: targetRect.left + targetRect.width / 2,
        };
        break;
      case 'bottom':
        newPosition = {
          top: targetRect.bottom + TOOLTIP_OFFSET,
          left: targetRect.left + targetRect.width / 2,
        };
        break;
      case 'left':
        newPosition = {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - TOOLTIP_OFFSET,
        };
        break;
      case 'right':
        newPosition = {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + TOOLTIP_OFFSET,
        };
        break;
      default:
        break;
    }

    setPosition(newPosition);
  }, [direction]);

  // --- Event Handlers ---
  const handleMouseEnter = () => {
    calculatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // --- Tooltip Content (with Arrow Added) ---
  const tooltipContent = (
    <div
      className={`
        fixed z-50 pointer-events-none
        px-3 py-1.5 rounded-lg bg-gray-800 text-white text-sm whitespace-nowrap
        transition-opacity transition-transform duration-200 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${directionTransformClasses[direction] || directionTransformClasses.top}
      `}
      style={position}
      data-visible={isVisible}
    >
      {/* Tooltip Text */}
      {content}

      {/* ▼ Arrow */}
 <span
  className={`
    absolute bg-gray-800
    ${direction === 'top' ? 'left-1/2 bottom-0 -mb-[4px] -translate-x-1/2 rotate-180' : ''}
    ${direction === 'bottom' ? 'left-1/2 top-0 -mt-[4px] -translate-x-1/2' : ''}
    ${direction === 'left' ? 'right-0 top-1/2 -mr-[4px] -translate-y-1/2 -rotate-90' : ''}
    ${direction === 'right' ? 'left-0 top-1/2 -ml-[4px] -translate-y-1/2 rotate-90' : ''}
  `}
  style={{
    width: "14px",
    height: "10px",
    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
  }}
></span>


    </div>
  );

  return (
    <div
      ref={targetRef}
      className="inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {tooltipContent}
    </div>
  );
};

export default AnimatedTooltip;
