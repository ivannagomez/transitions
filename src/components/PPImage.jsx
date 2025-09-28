import React from 'react';

const PPImage = ({ src, isVisible }) => {
  return (
    <img
      className={`
        h-auto w-full object-center fixed bottom-0 left-1/2
        -translate-x-1/2 z-[4] transition-all duration-[800ms]
        ${isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0'
        }
      `}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      src={src}
      alt="Transition effect"
    />
  );
};

export default PPImage;