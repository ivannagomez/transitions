import React, { useEffect, useRef } from 'react';
import Scene from './components/Scene';
import { sceneData } from './data/sceneData';

function App() {
  const containerRef = useRef(null);
  const ppImagesRef = useRef([]);
  const sceneTextsRef = useRef([]);
  const sectionsRef = useRef([]);
  const currentSceneNumRef = useRef(1);
  const currentTextSceneRef = useRef(1);
  const lastScrollTopRef = useRef(0);
  const scrollTimerRef = useRef(null);

  useEffect(() => {
    // PP Image Animator
    const ppImages = ppImagesRef.current;
    const sections = sectionsRef.current;

    // Initialize - first pp-img visible, others hidden
    ppImages.forEach((ppImg, index) => {
      if (ppImg) {
        if (index === 0) {
          ppImg.classList.add('enter');
          ppImg.classList.remove('exit');
        } else {
          ppImg.classList.add('exit');
          ppImg.classList.remove('enter');
        }
      }
    });

    console.log('PP Image Animator initialized with', ppImages.length, 'images and', sections.length, 'sections');

    // Create Intersection Observer for PP images
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sceneId = entry.target.id;
          const match = sceneId.match(/scene-(\d+)/);

          if (match) {
            const sceneNum = parseInt(match[1], 10);
            console.log(`Scene ${sceneNum} is now visible`);

            if (sceneNum !== currentSceneNumRef.current) {
              console.log(`Switching from scene ${currentSceneNumRef.current} to scene ${sceneNum}`);

              // Exit previous pp-img
              if (currentSceneNumRef.current !== null && currentSceneNumRef.current > 0) {
                const prevPpImg = ppImages[currentSceneNumRef.current - 1];
                if (prevPpImg) {
                  prevPpImg.classList.remove('enter');
                  prevPpImg.classList.add('exit');
                }
              }

              // Enter new pp-img
              const newPpImg = ppImages[sceneNum - 1];
              if (newPpImg) {
                newPpImg.classList.remove('exit');
                newPpImg.classList.add('enter');
                console.log(`PP-${sceneNum} is now visible`);
              }

              currentSceneNumRef.current = sceneNum;
            }
          }
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px'
    });

    // Observe all sections
    sections.forEach(section => {
      if (section) {
        observer.observe(section);
        console.log('Observing section:', section.id);
      }
    });

    // Text Animation System
    const sceneTexts = sceneTextsRef.current;

    // Hide all text initially except first
    sceneTexts.forEach((text, index) => {
      if (text) {
        if (index === 0) {
          text.classList.add('active');
        } else {
          text.classList.remove('active');
        }
      }
    });

    // Create observer for text visibility
    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const match = sectionId.match(/scene-(\d+)/);

          if (match) {
            const sceneNum = parseInt(match[1], 10);
            console.log(`Text: Scene ${sceneNum} is now visible`);

            // Hide current text
            if (currentTextSceneRef.current !== null && sceneTexts[currentTextSceneRef.current - 1]) {
              sceneTexts[currentTextSceneRef.current - 1].classList.remove('active');
            }

            // Show new text
            const newText = sceneTexts[sceneNum - 1];
            if (newText) {
              newText.classList.add('active');
              console.log(`Text ${sceneNum} is now active`);
            }

            currentTextSceneRef.current = sceneNum;
          }
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px'
    });

    // Observe all sections for text
    sections.forEach(section => {
      if (section) {
        textObserver.observe(section);
      }
    });

    // Parallax effect on scroll
    const container = containerRef.current;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollDirection = scrollTop > lastScrollTopRef.current ? 'down' : 'up';

      // Clear previous timer
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      // Apply parallax to active text
      sceneTexts.forEach((text, index) => {
        if (text && text.classList.contains('active')) {
          console.log(`Applying parallax ${scrollDirection} to text ${index + 1}`);

          // Remove previous parallax classes
          text.classList.remove('parallax-up', 'parallax-down');

          // Apply opposite parallax effect immediately
          if (scrollDirection === 'down') {
            text.classList.add('parallax-up');
          } else {
            text.classList.add('parallax-down');
          }
        }
      });

      // Reset parallax classes after scroll stops
      scrollTimerRef.current = setTimeout(() => {
        sceneTexts.forEach(text => {
          if (text) {
            text.classList.remove('parallax-up', 'parallax-down');
          }
        });
      }, 200);

      lastScrollTopRef.current = scrollTop;
    };

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Force check initial visibility after a short delay
    setTimeout(() => {
      sections.forEach(section => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight) {
            const match = section.id.match(/scene-(\d+)/);
            if (match) {
              const sceneNum = parseInt(match[1], 10);
              if (sceneNum !== currentSceneNumRef.current) {
                console.log(`Initial scene detected: ${sceneNum}`);

                // Handle PP images
                if (currentSceneNumRef.current > 0) {
                  const prevPpImg = ppImages[currentSceneNumRef.current - 1];
                  if (prevPpImg) {
                    prevPpImg.classList.remove('enter');
                    prevPpImg.classList.add('exit');
                  }
                }

                const newPpImg = ppImages[sceneNum - 1];
                if (newPpImg) {
                  newPpImg.classList.remove('exit');
                  newPpImg.classList.add('enter');
                }

                currentSceneNumRef.current = sceneNum;
              }
            }
          }
        }
      });
    }, 100);

    return () => {
      if (observer) observer.disconnect();
      if (textObserver) textObserver.disconnect();
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="container" id="container" ref={containerRef}>
      <div className="scene" data-scene="1">
        {sceneData.map((scene, index) => (
          <Scene
            key={scene.id}
            scene={scene}
            ref={el => {
              sectionsRef.current[index] = el;
              const textEl = el?.querySelector('.scene-text');
              if (textEl) {
                sceneTextsRef.current[index] = textEl;
              }
            }}
          />
        ))}
      </div>

      {/* PP Images - Fixed at bottom of viewport */}
      {sceneData.map((scene, index) => (
        <img
          key={`pp-${scene.id}`}
          className="pp-img"
          src={scene.ppImage}
          ref={el => ppImagesRef.current[index] = el}
          alt=""
        />
      ))}
    </div>
  );
}

export default App;
