"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const preloaderBarRef = useRef<HTMLDivElement>(null);
  const bgTealRef = useRef<HTMLDivElement>(null);
  
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const whyFlorianRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const numberedFeaturesRef = useRef<HTMLDivElement>(null);
  const hairDoesNotRef = useRef<HTMLDivElement>(null);
  const atTheStrandRef = useRef<HTMLDivElement>(null);
  const itBeginsRef = useRef<HTMLDivElement>(null);
  const beneathSurfaceRef = useRef<HTMLDivElement>(null);
  const scrollIconRef = useRef<HTMLDivElement>(null);
  const atFolicleRef = useRef<HTMLDivElement>(null);
  const atCirculationRef = useRef<HTMLDivElement>(null);
  const atCellularRecoveryRef = useRef<HTMLDivElement>(null);
  const glassCardsContainerRef = useRef<HTMLDivElement>(null);
  
  // Progress Section Refs
  const progressSectionRef = useRef<HTMLDivElement>(null);
  const progressCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressTitleRef = useRef<HTMLDivElement>(null);
  const week1Ref = useRef<HTMLDivElement>(null);
  const week3Ref = useRef<HTMLDivElement>(null);
  const week6Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- CUSTOM PRELOADER LOGIC ---
    let totalLoadedImages = 0;
    const totalRequiredImages = 450; // 300 (seq 1) + 150 (seq 2)
    let minimumTimeElapsed = false;

    // Lock scrolling immediately on mount
    document.body.style.overflow = 'hidden';

    const checkPreloaderComplete = () => {
      if (totalLoadedImages >= totalRequiredImages && minimumTimeElapsed && preloaderRef.current) {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            if (preloaderRef.current) {
              preloaderRef.current.style.display = 'none';
            }
            // Unlock scrolling
            document.body.style.overflow = 'auto';
          }
        });
      }
    };

    setTimeout(() => {
      minimumTimeElapsed = true;
      checkPreloaderComplete();
    }, 2000);

    const incrementPreloader = () => {
      totalLoadedImages++;
      if (preloaderBarRef.current) {
        preloaderBarRef.current.style.width = `${(totalLoadedImages / totalRequiredImages) * 100}%`;
      }
      checkPreloaderComplete();
    };
    // -----------------------------

    const frameCount = 300;
    const currentFrame = (index: number) => (
      `/assets/img-sequence-png/${(index + 1).toString().padStart(4, '0')}_result.png`
    );

    const images: HTMLImageElement[] = [];

    // To prevent unnecessary redraws
    let currentImageIndex = -1;
    let ticking = false;

    // Load all images
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.src = currentFrame(i);
      images.push(img);
      
      img.onload = () => {
        incrementPreloader();
        
        // Setup initial canvas dimensions and draw the first frame when it loads
        if (i === 0) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          if (currentImageIndex === -1) {
            currentImageIndex = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        }
      };
    }

    // Function to draw frames optimized for 60fps without GPU bottlenecking
    const updateImage = (fractionalIndex: number) => {
      const index = Math.round(fractionalIndex);

      if (index === currentImageIndex || !images[index] || !images[index].complete || images[index].naturalHeight === 0) {
        return;
      }
      
      currentImageIndex = index;
      
      // Clear and draw highly optimized (no alpha blending to prevent memory thrashing)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
    };

    // --- SECOND IMAGE SEQUENCE ---
    const progressCanvas = progressCanvasRef.current;
    let progressCtx: CanvasRenderingContext2D | null = null;
    if (progressCanvas) {
      progressCtx = progressCanvas.getContext('2d', { alpha: false });
    }

    const progressFrameCount = 150;
    const progressFrame = (index: number) => (
      `/assets/folder-2-sequence/${(index + 1).toString().padStart(4, '0')}_result.webp`
    );

    const progressImages: HTMLImageElement[] = [];
    let currentProgressIndex = -1;

    for (let i = 0; i < progressFrameCount; i++) {
      const img = new window.Image();
      img.src = progressFrame(i);
      progressImages.push(img);
      
      img.onload = () => {
        incrementPreloader();
        if (i === 0 && progressCanvas && progressCtx) {
          progressCanvas.width = img.naturalWidth;
          progressCanvas.height = img.naturalHeight;
          if (currentProgressIndex === -1) {
            currentProgressIndex = 0;
            progressCtx.drawImage(img, 0, 0, progressCanvas.width, progressCanvas.height);
          }
        }
      };
    }

    const updateProgressImage = (fractionalIndex: number) => {
      if (!progressCanvas || !progressCtx) return;
      const index = Math.round(fractionalIndex);

      if (index === currentProgressIndex || !progressImages[index] || !progressImages[index].complete || progressImages[index].naturalHeight === 0) {
        return;
      }
      
      currentProgressIndex = index;
      progressCtx.drawImage(progressImages[index], 0, 0, progressCanvas.width, progressCanvas.height);
    };
    // -----------------------------


    // Use GSAP ScrollTrigger for ultra-smooth scrubbing
    const st = ScrollTrigger.create({
      trigger: document.documentElement, // The entire document is the scroll area
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5, // 1.5 seconds of smoothing to make it feel buttery
      onUpdate: (self) => {
        const scrollFraction = self.progress;
        
        // Calculate the exact float index based on an extended virtual timeline
        const virtualFrameCount = 610;
        const rawFrame = scrollFraction * virtualFrameCount;
        
        let continuousFrame = rawFrame;
        // Non-linear mapping: compress the 420-490 continuous timeline segment into just 30 scroll frames (420-450)
        // This makes the cinematic transition play 2.33x faster relative to scroll distance
        if (rawFrame > 420 && rawFrame <= 450) {
          continuousFrame = 420 + (rawFrame - 420) * (70 / 30);
        } else if (rawFrame > 450) {
          continuousFrame = rawFrame + 40; // Maintain the 40-frame offset for the rest of the timeline
        }
        
        // Cap the canvas rendering at the last available image
        const exactFrameIndex = Math.min(continuousFrame, frameCount - 1);
        updateImage(exactFrameIndex);
        
        if (textRef.current) {
          let opacity = 1;
          if (continuousFrame > 17 && continuousFrame < 24) {
            opacity = 1 - ((continuousFrame - 17) / 7);
          } else if (continuousFrame >= 24) {
            opacity = 0;
          }
          textRef.current.style.opacity = opacity.toString();
        }

        if (featuresRef.current) {
          let fOpacity = 0;
          if (continuousFrame >= 49 && continuousFrame <= 54) {
            fOpacity = (continuousFrame - 49) / 5;
          } else if (continuousFrame > 54 && continuousFrame < 71) {
            fOpacity = 1;
          } else if (continuousFrame >= 71 && continuousFrame <= 75) {
            fOpacity = 1 - ((continuousFrame - 71) / 4);
          }
          featuresRef.current.style.opacity = fOpacity.toString();
        }

        if (whyFlorianRef.current) {
          let wfOpacity = 0;
          if (continuousFrame >= 78 && continuousFrame <= 83) {
            wfOpacity = (continuousFrame - 78) / 5;
          } else if (continuousFrame > 83 && continuousFrame < 95) {
            wfOpacity = 1;
          } else if (continuousFrame >= 95 && continuousFrame <= 99) {
            wfOpacity = 1 - ((continuousFrame - 95) / 4);
          }
          whyFlorianRef.current.style.opacity = wfOpacity.toString();
        }

        if (benefitsRef.current) {
          let bOpacity = 0;
          let bTranslateY = 50;
          if (continuousFrame >= 106 && continuousFrame <= 111) {
            bOpacity = (continuousFrame - 106) / 5;
            bTranslateY = 50 * (1 - bOpacity); // Slide up on entry
          } else if (continuousFrame > 111 && continuousFrame < 125) {
            bOpacity = 1;
            bTranslateY = 0;
          } else if (continuousFrame >= 125 && continuousFrame <= 132) {
            bOpacity = 1 - ((continuousFrame - 125) / 7);
            bTranslateY = -50 * (1 - bOpacity); // Slide up on exit (parallax)
          }
          benefitsRef.current.style.opacity = bOpacity.toString();
          benefitsRef.current.style.transform = `translateY(${bTranslateY}px)`;
        }

        if (numberedFeaturesRef.current) {
          let nfOpacity = 0;
          let nfTranslateY = 50;
          if (continuousFrame >= 142 && continuousFrame <= 148) {
            nfOpacity = (continuousFrame - 142) / 6;
            nfTranslateY = 50 * (1 - nfOpacity); // Slide up on entry
          } else if (continuousFrame > 148 && continuousFrame < 198) {
            nfOpacity = 1;
            nfTranslateY = 0;
          } else if (continuousFrame >= 198 && continuousFrame <= 208) {
            nfOpacity = 1 - ((continuousFrame - 198) / 10);
            nfTranslateY = -50 * (1 - nfOpacity); // Slide up on exit
          }
          numberedFeaturesRef.current.style.opacity = nfOpacity.toString();
          numberedFeaturesRef.current.style.transform = `translateY(${nfTranslateY}px)`;
        }

        if (hairDoesNotRef.current) {
          let hOpacity = 0;
          let hDistort = 1;
          if (continuousFrame >= 232 && continuousFrame <= 235) { // Fade in
            hOpacity = (continuousFrame - 232) / 3;
            hDistort = 1 - hOpacity;
          } else if (continuousFrame > 235 && continuousFrame < 245) { // Show
            hOpacity = 1;
            hDistort = 0;
          } else if (continuousFrame >= 245 && continuousFrame <= 247) { // Fade out
            hOpacity = 1 - ((continuousFrame - 245) / 2);
            hDistort = 1 - hOpacity;
          }
          hairDoesNotRef.current.style.opacity = hOpacity.toString();
          hairDoesNotRef.current.style.filter = `blur(${hDistort * 15}px)`;
          hairDoesNotRef.current.style.transform = `scale(${1 + (hDistort * 0.2)})`;
        }

        if (atTheStrandRef.current) {
          let aOpacity = 0;
          let aDistort = 1;
          if (continuousFrame >= 248 && continuousFrame <= 249) {
            aOpacity = (continuousFrame - 248) / 1;
            aDistort = 1 - aOpacity;
          } else if (continuousFrame > 249 && continuousFrame < 267) {
            aOpacity = 1;
            aDistort = 0;
          } else if (continuousFrame >= 267 && continuousFrame <= 269) {
            aOpacity = 1 - ((continuousFrame - 267) / 2);
            aDistort = 1 - aOpacity;
          }
          atTheStrandRef.current.style.opacity = aOpacity.toString();
          atTheStrandRef.current.style.filter = `blur(${aDistort * 15}px)`;
          atTheStrandRef.current.style.transform = `scale(${1 + (aDistort * 0.2)})`;
        }

        if (itBeginsRef.current) {
          let iOpacity = 0;
          let iDistort = 1;
          if (continuousFrame >= 269.5 && continuousFrame <= 270) {
            iOpacity = (continuousFrame - 269.5) / 0.5;
            iDistort = 1 - iOpacity;
          } else if (continuousFrame > 270 && continuousFrame < 290) {
            iOpacity = 1;
            iDistort = 0;
          } else if (continuousFrame >= 290 && continuousFrame <= 295) {
            iOpacity = 1 - ((continuousFrame - 290) / 5);
            iDistort = 1 - iOpacity;
          }
          itBeginsRef.current.style.opacity = iOpacity.toString();
          itBeginsRef.current.style.filter = `blur(${iDistort * 15}px)`;
          itBeginsRef.current.style.transform = `scale(${1 + (iDistort * 0.2)})`;
        }

        if (beneathSurfaceRef.current) {
          let bOpacity = 0;
          let bTranslateY = 20;
          if (continuousFrame >= 300 && continuousFrame <= 310) {
            bOpacity = (continuousFrame - 300) / 10;
            bTranslateY = 20 * (1 - bOpacity);
          } else if (continuousFrame > 310) {
            bOpacity = 1;
            bTranslateY = 0;
          }
          beneathSurfaceRef.current.style.opacity = bOpacity.toString();
          beneathSurfaceRef.current.style.transform = `translateY(${bTranslateY}px)`;
          beneathSurfaceRef.current.style.filter = 'none';
        }

        if (scrollIconRef.current) {
          let sOpacity = 1;
          if (continuousFrame > 15) {
            sOpacity = Math.max(0, 1 - (continuousFrame - 15) / 10);
          }
          scrollIconRef.current.style.opacity = sOpacity.toString();
        }

        if (atFolicleRef.current) {
          let fOpacity = 0;
          let fTranslateY = 20;
          if (continuousFrame >= 320 && continuousFrame <= 330) {
            fOpacity = (continuousFrame - 320) / 10;
            fTranslateY = 20 * (1 - fOpacity);
          } else if (continuousFrame > 330) {
            fOpacity = 1;
            fTranslateY = 0;
          }
          atFolicleRef.current.style.opacity = fOpacity.toString();
          atFolicleRef.current.style.transform = `translateY(${fTranslateY}px)`;
          atFolicleRef.current.style.filter = 'none';
        }

        if (atCirculationRef.current) {
          let cOpacity = 0;
          let cTranslateY = 20;
          if (continuousFrame >= 340 && continuousFrame <= 350) {
            cOpacity = (continuousFrame - 340) / 10;
            cTranslateY = 20 * (1 - cOpacity);
          } else if (continuousFrame > 350) {
            cOpacity = 1;
            cTranslateY = 0;
          }
          atCirculationRef.current.style.opacity = cOpacity.toString();
          atCirculationRef.current.style.transform = `translateY(${cTranslateY}px)`;
          atCirculationRef.current.style.filter = 'none';
        }

        if (atCellularRecoveryRef.current) {
          let rOpacity = 0;
          let rTranslateY = 20;
          if (continuousFrame >= 360 && continuousFrame <= 370) {
            rOpacity = (continuousFrame - 360) / 10;
            rTranslateY = 20 * (1 - rOpacity);
          } else if (continuousFrame > 370) {
            rOpacity = 1;
            rTranslateY = 0;
          }
          atCellularRecoveryRef.current.style.opacity = rOpacity.toString();
          atCellularRecoveryRef.current.style.transform = `translateY(${rTranslateY}px)`;
          atCellularRecoveryRef.current.style.filter = 'none';
        }

        // --- PROGRESS SECTION ANIMATIONS ---
        
        // Fade out previous cards when transition starts (so they don't look weird while scrolling up)
        if (glassCardsContainerRef.current) {
          let gcOpacity = 1;
          if (continuousFrame >= 450 && continuousFrame <= 480) {
            gcOpacity = 1 - ((continuousFrame - 450) / 30);
          } else if (continuousFrame > 480) {
            gcOpacity = 0;
          }
          glassCardsContainerRef.current.style.opacity = gcOpacity.toString();
        }

        // Fade out the teal background during the physical scroll transition to reveal pure black for the golden sequence
        if (bgTealRef.current) {
          let bgOpacity = 1;
          if (continuousFrame >= 450 && continuousFrame <= 500) {
            bgOpacity = 1 - ((continuousFrame - 450) / 50);
          } else if (continuousFrame > 500) {
            bgOpacity = 0;
          }
          bgTealRef.current.style.opacity = bgOpacity.toString();
        }

        // 1. Physical Vertical Scroll Wipe (frames 450 to 500)
        if (firstSectionRef.current && progressSectionRef.current) {
          let yOffset = 0; // 0 to 100
          if (continuousFrame >= 450 && continuousFrame <= 500) {
            yOffset = ((continuousFrame - 450) / 50) * 100;
          } else if (continuousFrame > 500) {
            yOffset = 100;
          }
          
          // First scene translates UP out of the viewport
          firstSectionRef.current.style.transform = `translateY(-${yOffset}vh)`;
          
          // Second scene translates UP into the viewport, attached to the bottom
          progressSectionRef.current.style.transform = `translateY(${100 - yOffset}vh)`;
          
          // Reset opacity/blur that used to exist
          progressSectionRef.current.style.opacity = '1';
          progressSectionRef.current.style.filter = 'none';
        }

        // 1.5 Smoothly invert the navbar colors so it's readable on top of the bright golden bubbles
        if (headerRef.current) {
          let invertValue = 0;
          if (continuousFrame >= 450 && continuousFrame <= 500) {
            invertValue = (continuousFrame - 450) / 50;
          } else if (continuousFrame > 500) {
            invertValue = 1;
          }
          headerRef.current.style.filter = `invert(${invertValue})`;
        }

        // 2. Animate Second 3D Sequence (frames 500 to 650)
        if (continuousFrame >= 500 && continuousFrame <= 650) {
          const pIndex = continuousFrame - 500;
          updateProgressImage(pIndex);
        } else if (continuousFrame > 650) {
          updateProgressImage(149);
        } else if (continuousFrame < 500) {
          updateProgressImage(0);
        }

        // 3. Title Fade In
        if (progressTitleRef.current) {
          let ptOpacity = 0;
          if (continuousFrame >= 500 && continuousFrame <= 520) {
            ptOpacity = (continuousFrame - 500) / 20;
          } else if (continuousFrame > 520) {
            ptOpacity = 1;
          }
          progressTitleRef.current.style.opacity = ptOpacity.toString();
        }

        // 4. Week 1 Card
        if (week1Ref.current) {
          let wOpacity = 0;
          let wTranslateY = 50;
          if (continuousFrame >= 520 && continuousFrame <= 550) {
            wOpacity = (continuousFrame - 520) / 30;
            wTranslateY = 50 * (1 - wOpacity);
          } else if (continuousFrame > 550) {
            wOpacity = 1;
            wTranslateY = 0;
          }
          week1Ref.current.style.opacity = wOpacity.toString();
          week1Ref.current.style.transform = `translateY(${wTranslateY}px)`;
        }

        // 5. Week 3 Card
        if (week3Ref.current) {
          let wOpacity = 0;
          let wTranslateY = 50;
          if (continuousFrame >= 560 && continuousFrame <= 590) {
            wOpacity = (continuousFrame - 560) / 30;
            wTranslateY = 50 * (1 - wOpacity);
          } else if (continuousFrame > 590) {
            wOpacity = 1;
            wTranslateY = 0;
          }
          week3Ref.current.style.opacity = wOpacity.toString();
          week3Ref.current.style.transform = `translateY(${wTranslateY}px)`;
        }

        // 6. Week 6 Card
        if (week6Ref.current) {
          let wOpacity = 0;
          let wTranslateY = 50;
          if (continuousFrame >= 600 && continuousFrame <= 630) {
            wOpacity = (continuousFrame - 600) / 30;
            wTranslateY = 50 * (1 - wOpacity);
          } else if (continuousFrame > 630) {
            wOpacity = 1;
            wTranslateY = 0;
          }
          week6Ref.current.style.opacity = wOpacity.toString();
          week6Ref.current.style.transform = `translateY(${wTranslateY}px)`;
        }
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <>
      {/* Custom Preloader Overlay */}
      <div 
        ref={preloaderRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: '#000000', zIndex: 99999,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}
      >
        <Image src="/assets/SerumLogo1.png" alt="Florian Logo" width={120} height={84} style={{ objectFit: 'contain', marginBottom: '40px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }} />
        <div style={{ width: '150px', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)', overflow: 'hidden' }}>
          <div ref={preloaderBarRef} style={{ width: '0%', height: '100%', backgroundColor: '#ffffff', transition: 'width 0.1s linear' }} />
        </div>
      </div>

      {/* Dynamic Teal Background */}
      <div ref={bgTealRef} className="bg-teal-glow" />

      <div className="scroll-container">
      <header className="header" ref={headerRef}>
        <div className="logo">
          <Image src="/assets/SerumLogo1.png" alt="Florian Logo" width={100} height={70} style={{ objectFit: 'contain' }} />
        </div>
        
        <div className="search-bar-container">
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="" />
          </div>
        </div>

        <div className="header-icons">
          <button className="icon-btn"><Image src="/assets/Icons8bag901.png" alt="Bag" width={26} height={26} /></button>
          <button className="icon-btn"><Image src="/assets/Icons8heart1001.png" alt="Heart" width={26} height={26} /></button>
          <button className="icon-btn"><Image src="/assets/Icons8account961.png" alt="Account" width={26} height={26} /></button>
        </div>
      </header>

      {/* Wrapper for the entire first sequence to allow a physical vertical scroll wipe */}
      <div ref={firstSectionRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
      <main className="hero-content" style={{ zIndex: 1 }}>
        <div className="background-text-container">
          <div className="glass-text-wrapper" ref={textRef}>
            <img src="/assets/Untitled11.png" alt="Few Drops" className="glass-text-img" />
          </div>
        </div>
        
        <div className="sequence-container">
          <canvas ref={canvasRef} id="hero-canvas"></canvas>
        </div>
        
        <div className="features-container" ref={featuresRef} style={{ opacity: 0 }}>
          <div className="feature-item f1">
            <span className="feature-text">LIGHTWEIGHT ABSORPTION</span>
            <span className="feature-dot"></span>
          </div>
          <div className="abs-line" style={{ left: '30vw', top: '36vh', width: '5vw' }}></div>
          <svg className="abs-svg" style={{ left: '35vw', top: '36vh', width: '13vw', height: '26vh' }}>
            <line x1="0" y1="0" x2="100%" y2="100%" />
          </svg>

          <div className="feature-item f2">
            <span className="feature-text">ZERO HEAVY RESIDUE</span>
            <span className="feature-dot"></span>
          </div>
          <div className="abs-line" style={{ left: '30vw', top: '48vh', width: '5vw' }}></div>
          <svg className="abs-svg" style={{ left: '35vw', top: '48vh', width: '7vw', height: '14vh' }}>
            <line x1="0" y1="0" x2="100%" y2="100%" />
          </svg>

          <div className="feature-item f3">
            <span className="feature-text">BOTANICALLY POWERED</span>
            <span className="feature-dot"></span>
          </div>
          <div className="abs-line" style={{ left: '30vw', top: '62vh', width: '28vw' }}></div>

          <div className="feature-item f4">
            <span className="feature-text">CLINICALLY INSPIRED</span>
            <span className="feature-dot"></span>
          </div>
          <div className="abs-line" style={{ left: '30vw', top: '76vh', width: '8vw' }}></div>
          <svg className="abs-svg" style={{ left: '38vw', top: '62vh', width: '7vw', height: '14vh' }}>
            <line x1="0" y1="100%" x2="100%" y2="0" />
          </svg>
        </div>

        <div className="why-florian-container" ref={whyFlorianRef} style={{ opacity: 0 }}>
          <h2 className="why-florian-title">WHY FLORIAN</h2>
          <ul className="why-florian-list">
            <li><span className="wf-dot"></span><span className="wf-text">LIGHTWEIGHT ABSORPTION</span></li>
            <li><span className="wf-dot"></span><span className="wf-text">ZERO HEAVY RESIDUE</span></li>
            <li><span className="wf-dot"></span><span className="wf-text">BOTANICALLY POWERED</span></li>
            <li><span className="wf-dot"></span><span className="wf-text">CLINICALLY INSPIRED</span></li>
          </ul>
        </div>

        {/* Benefits Section (Slides up behind bottle) */}
        <div className="benefits-container" ref={benefitsRef} style={{ opacity: 0, transform: 'translateY(50px)' }}>
          <div className="benefits-content">
            <h2 className="benefits-title">
              BENEFITS TO<br/>EXPECT
            </h2>
            <div className="benefits-actions">
              <button className="benefits-btn">FROM FLORIAN</button>
              <button className="benefits-play-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Numbered Features Section */}
        <div className="numbered-features-container" ref={numberedFeaturesRef} style={{ opacity: 0, transform: 'translateY(50px)' }}>
          <div className="num-row">
            <div className="num-feature-block">
              <div className="num-line"></div>
              <div className="num-text-content">
                <h3>Reduced Breakage</h3>
                <p>Supports visibly denser and<br/>healthier looking hair over<br/>time.</p>
              </div>
            </div>
            <div className="huge-number">01</div>
          </div>
          
          <div className="num-row">
            <div className="num-feature-block">
              <div className="num-line"></div>
              <div className="num-text-content">
                <h3>FULLER LOOKING<br/>HAIR</h3>
                <p>Supports visibly denser and<br/>healthier-looking hair over<br/>time.</p>
              </div>
            </div>
            <div className="huge-number">02</div>
          </div>

          <div className="num-row">
            <div className="num-feature-block">
              <div className="num-line"></div>
              <div className="num-text-content">
                <h3>IMPROVED SCALP<br/>HEALTH</h3>
                <p>Supports visibly denser and<br/>healthier-looking hair over<br/>time.</p>
              </div>
            </div>
            <div className="huge-number">03</div>
          </div>
        </div>

        {/* Hair Does Not Begin Section */}
        <div className="hair-does-container" ref={hairDoesNotRef} style={{ opacity: 0, transform: 'translateY(50px)' }}>
          <h2 className="hair-does-title">
            HAIR DOES<br/>
            <span style={{ display: 'inline-block', paddingLeft: '4rem' }}>NOT BEGIN</span>
          </h2>
        </div>

        {/* At The Strand Section */}
        <div className="at-the-strand-container" ref={atTheStrandRef} style={{ opacity: 0, transform: 'translateY(50px)' }}>
          <h2 className="hair-does-title">
            AT THE STRAND
          </h2>
        </div>

        {/* It Begins Section */}
        <div className="at-the-strand-container" ref={itBeginsRef} style={{ opacity: 0, transform: 'translateY(50px)' }}>
          <h2 className="hair-does-title">
            IT BEGINS
          </h2>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="scroll-indicator" ref={scrollIconRef}>
          <div className="mouse-outline">
            <div className="mouse-wheel"></div>
          </div>
          <span className="scroll-text">SCROLL</span>
        </div>
      </main>

      {/* Glass cards moved OUTSIDE hero-content to mathematically guarantee they break free of any stacking context and render absolutely on top */}
      <div ref={glassCardsContainerRef}>
        {/* Beneath The Surface Section */}
        <div className="glass-card card-pos-1" ref={beneathSurfaceRef} style={{ opacity: 0 }}>
          BENEATH THE SURFACE
        </div>

        {/* At Folicle Section */}
        <div className="glass-card card-pos-2" ref={atFolicleRef} style={{ opacity: 0 }}>
          AT FOLLICLE
        </div>

        {/* At Circulation Section */}
        <div className="glass-card card-pos-3" ref={atCirculationRef} style={{ opacity: 0 }}>
          AT CIRCULATION
        </div>

        {/* At Cellular Recovery Section */}
        <div className="glass-card card-pos-4" ref={atCellularRecoveryRef} style={{ opacity: 0 }}>
          AT CELLULAR RECOVERY
        </div>
      </div>
      </div>

      {/* FEEL THE PROGRESS Section */}
      <div className="progress-section" ref={progressSectionRef} style={{ transform: 'translateY(100vh)' }}>
        <div className="progress-sequence-container">
          <canvas ref={progressCanvasRef} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.4)' }} />
          {/* Whitish milky overlay to soften the golden bubbles and make them less sharp/clear */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', pointerEvents: 'none' }} />
        </div>
        
        <div className="progress-title-container" ref={progressTitleRef} style={{ opacity: 0 }}>
          <h2 className="progress-title">FEEL THE PROGRESS</h2>
        </div>

        <div className="week-cards-wrapper">
          {/* Week 1 */}
          <div className="week-card" ref={week1Ref} style={{ opacity: 0 }}>
            <h3>WEEK 1</h3>
            <div className="week-card-dot"></div>
            <div className="week-card-subtitle">SCALP REBALANCING</div>
            <div className="week-card-desc">Hydration and barrier<br/>support begins.</div>
          </div>

          {/* Week 3 */}
          <div className="week-card" ref={week3Ref} style={{ opacity: 0 }}>
            <h3>WEEK 3</h3>
            <div className="week-card-dot"></div>
            <div className="week-card-subtitle">VISIBLE STRENGTH</div>
            <div className="week-card-desc">Less breakage.<br/>Healthier texture.<br/>Improved resilience.</div>
          </div>

          {/* Week 6 */}
          <div className="week-card" ref={week6Ref} style={{ opacity: 0 }}>
            <h3>WEEK 6</h3>
            <div className="week-card-dot"></div>
            <div className="week-card-subtitle">DENSITY EVOLUTION</div>
            <div className="week-card-desc">Hair appears fuller,<br/>thicker,<br/>visibly revitalized.</div>
          </div>
        </div>
      </div>

    </div>
    </>
  );
}
