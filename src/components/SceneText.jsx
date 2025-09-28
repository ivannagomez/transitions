import React from 'react';

const SceneText = ({ title, content, isActive, parallaxDirection }) => {
  if (!title && !content) return null;

  return (
    <div
      className={`
        scene-text fixed top-1/2 -translate-y-1/2 z-[3] max-w-[400px] p-[30px]
        bg-transparent text-white rounded-[10px] pointer-events-none
        transition-all duration-[800ms]
        ${isActive ? 'opacity-100' : 'opacity-0'}
        ${parallaxDirection === 'up' ? 'parallax-up' : ''}
        ${parallaxDirection === 'down' ? 'parallax-down' : ''}
      `}
      style={{
        transitionTimingFunction: parallaxDirection
          ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          : 'ease-in-out',
      }}
    >
      {title && (
        <h2 className="text-[2rem] mb-[15px] font-semibold">{title}</h2>
      )}
      {content && (
        <p className="text-base leading-[1.6] opacity-90">{content}</p>
      )}
    </div>
  );
};

export default SceneText;