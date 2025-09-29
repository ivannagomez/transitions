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
  const isAutoScrollingRef = useRef(false);
  const autoScrollTimeoutRef = useRef(null);
  const targetPositionsRef = useRef({});
  const currentSceneIndexRef = useRef(0); // Track current scene index (0-8)
  const isTransitioningRef = useRef(false);
  const scrollDebounceRef = useRef(null);

  useEffect(() => {
    // PP Image Animator
    const ppImages = ppImagesRef.current;
    const sections = sectionsRef.current;
    const container = containerRef.current;

    // Calculate all scene positions for smooth scene-to-scene navigation
    const calculateScenePositions = () => {
      const scenePositions = [];

      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;

          if (index === 0) {
            // First scene starts at top
            scenePositions[0] = 0;
          } else {
            // For other scenes, position to show bgd optimally
            // Adjust for negative margins and optimal viewing
            const targetPosition = sectionTop + (container.clientHeight * 0.05); // 5% offset
            scenePositions[index] = Math.max(0, targetPosition);
          }

          console.log(`Scene ${index} position:`, scenePositions[index], 'sectionTop:', sectionTop);
        }
      });

      targetPositionsRef.current = scenePositions;
      console.log('All scene positions calculated:', scenePositions);
    };

    const goToScene = (sceneIndex) => {
      const targetPosition = targetPositionsRef.current[sceneIndex];
      if (targetPosition !== undefined && container && !isTransitioningRef.current) {
        console.log(`Transitioning to scene ${sceneIndex} at position ${targetPosition}`);

        isTransitioningRef.current = true;
        currentSceneIndexRef.current = sceneIndex;

        container.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Reset transition flag after animation completes
        autoScrollTimeoutRef.current = setTimeout(() => {
          isTransitioningRef.current = false;
          console.log(`Transition to scene ${sceneIndex} completed`);
        }, 1000); // 1 second for smooth scroll to complete
      }
    };

    // Calculate positions after a short delay to ensure layout is complete
    setTimeout(calculateScenePositions, 500);

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

              // Auto-scroll trigger moved to bgds observer

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

    // Create observer for bgds images to trigger auto-scroll
    const bgdsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Find the parent section to get scene number
          const parentSection = entry.target.closest('.bgd-section');
          if (parentSection) {
            const sceneId = parentSection.id;
            const match = sceneId.match(/scene-(\d+)/);

            if (match) {
              const sceneNum = parseInt(match[1], 10);
              console.log(`BGDS image for scene ${sceneNum} entered viewport`);

              // Update current scene index when bgds enters viewport
              currentSceneIndexRef.current = sceneNum - 1; // Convert to 0-based index
              console.log(`Current scene index updated to: ${currentSceneIndexRef.current}`)
            }
          }
        }
      });
    }, {
      threshold: 0.3, // Trigger when 30% of bgds image is visible
      rootMargin: '0px'
    });

    // Observe all bgds images
    sections.forEach(section => {
      if (section) {
        const bgdsImg = section.querySelector('.bgds-img');
        if (bgdsImg) {
          bgdsObserver.observe(bgdsImg);
          console.log('Observing bgds image in section:', section.id);
        }
      }
    });

    // Parallax effect on scroll

    const handleScroll = () => {
      if (!container) return;
      const scrollTop = container.scrollTop;
      const scrollDirection = scrollTop > lastScrollTopRef.current ? 'down' : 'up';

      console.log('Scroll event fired:', scrollDirection, 'scrollTop:', scrollTop);

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

    const handleWheel = (e) => {
      // Prevent default scrolling completely
      e.preventDefault();

      // Don't handle during transitions
      if (isTransitioningRef.current) {
        console.log('Wheel event ignored - transition in progress');
        return;
      }

      // Clear any existing debounce timer
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
      }

      // Debounce scroll events to prevent rapid firing
      scrollDebounceRef.current = setTimeout(() => {
        const currentIndex = currentSceneIndexRef.current;
        const totalScenes = sectionsRef.current.length;

        console.log('Scroll direction:', e.deltaY > 0 ? 'down' : 'up', 'Current scene:', currentIndex);

        if (e.deltaY > 0) {
          // Scroll down - go to next scene
          const nextIndex = Math.min(currentIndex + 1, totalScenes - 1);
          if (nextIndex !== currentIndex) {
            console.log(`Going to next scene: ${nextIndex}`);
            goToScene(nextIndex);
          }
        } else {
          // Scroll up - go to previous scene
          const prevIndex = Math.max(currentIndex - 1, 0);
          if (prevIndex !== currentIndex) {
            console.log(`Going to previous scene: ${prevIndex}`);
            goToScene(prevIndex);
          }
        }
      }, 100); // 100ms debounce
    };

    const handleMouseEnter = () => {
      if (container) {
        container.focus();
        console.log('Container focused');
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      container.addEventListener('wheel', handleWheel, { passive: false }); // Allow preventDefault
      container.addEventListener('mouseenter', handleMouseEnter);
      console.log('Event listeners attached to container');
      console.log('Container dimensions - scrollHeight:', container.scrollHeight, 'clientHeight:', container.clientHeight, 'scrollable:', container.scrollHeight > container.clientHeight);
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
      if (bgdsObserver) bgdsObserver.disconnect();
      if (container) {
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('mouseenter', handleMouseEnter);
        console.log('Event listeners removed from container');
      }
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
      }
    };
  }, []);

  return (
    <div
      className="container"
      id="container"
      ref={containerRef}
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
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
