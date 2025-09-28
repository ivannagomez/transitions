import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const [visibleScenes, setVisibleScenes] = useState(new Set());
  const [currentScene, setCurrentScene] = useState(1);
  const observerRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    const defaultOptions = {
      threshold: 0.2,
      rootMargin: '0px',
      ...options,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sceneId = entry.target.id;
        const match = sceneId.match(/scene-(\d+)/);

        if (match) {
          const sceneNum = parseInt(match[1], 10);

          setVisibleScenes(prev => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) {
              newSet.add(sceneNum);
              setCurrentScene(sceneNum);
            } else {
              newSet.delete(sceneNum);
            }
            return newSet;
          });
        }
      });
    }, defaultOptions);

    elementsRef.current.forEach((element) => {
      if (element) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options]);

  const observeElement = (element) => {
    if (element && !elementsRef.current.includes(element)) {
      elementsRef.current.push(element);
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    }
  };

  return { visibleScenes, currentScene, observeElement };
};