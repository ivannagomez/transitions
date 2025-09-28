import React from 'react';

const LandingTitle = ({ title, subtitle }) => {
  return (
    <div className="scene-text fixed top-[41%] right-[5%] text-gold w-[70%] max-w-[70%] text-end flex flex-col items-end flex-wrap z-[3]">
      <h1 className="font-yipes text-[18vw] tracking-[-0.05em] leading-[0.7] font-thin">
        {title}
      </h1>
      <p className="max-w-[535px] w-[95%] self-end font-semibold leading-[1.1] text-[18px]">
        {subtitle}
      </p>
    </div>
  );
};

export default LandingTitle;