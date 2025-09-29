import React, { forwardRef } from 'react';

const Scene = forwardRef(({ scene }, ref) => {
  const isLastScene = scene.id === 9;

  return (
    <section
      ref={ref}
      id={`scene-${scene.id}`}
      className="bgd-section"
      style={isLastScene ? { height: '50%' } : {}}
    >
      {scene.bgdImage && (
        <img className="bgd-img" src={scene.bgdImage} alt="" />
      )}
      {scene.bgdsImage && (
        <img className="bgds-img transition-all" src={scene.bgdsImage} alt="" />
      )}

      {scene.id === 1 ? (
        <div className="scene-text landing-title-div" data-scene="1">
          <h1>{scene.title}</h1>
          <p>{scene.subtitle}</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            this is still an in progress study project and this is meant to just showcase some of the results of my exploration so far
          </p>
        </div>
      ) : (
        <div className={`scene-text ${scene.id === 6 ? 'scene-text-top' : ''}`} data-scene={scene.id}>
          {scene.title && <h2>{scene.title}</h2>}
          {scene.content && <p>{scene.content}</p>}
        </div>
      )}
    </section>
  );
});

Scene.displayName = 'Scene';

export default Scene;