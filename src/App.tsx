import React, { useEffect, useRef } from 'react';
import { Star, Maximize2, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplashScreen } from './components/SplashScreen';
import { RandomLines } from './components/RandomLines';
import { Mail, Instagram, Linkedin } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface VideoPlayerProps {
  src?: string;
  title: string;
  isShowreel?: boolean;
}

function VideoPlayer({ src, title, isShowreel = false }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showThumbnail, setShowThumbnail] = React.useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowThumbnail(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowThumbnail(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (src) {
    return (
      <div 
        ref={containerRef}
        className={`relative group cursor-pointer aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          src={src}
          autoPlay={false}
          muted={false}
          loop
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-300 ${showThumbnail ? 'opacity-0' : 'opacity-100'}`}
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 1; // Set thumbnail to 1 second
            }
          }}
        />
        
        {/* Thumbnail overlay */}
        {showThumbnail && (
          <div className="absolute inset-0">
            <canvas
              ref={(canvas) => {
                if (canvas && videoRef.current) {
                  const video = videoRef.current;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    canvas.width = video.videoWidth || 1920;
                    canvas.height = video.videoHeight || 1080;
                    
                    const drawThumbnail = () => {
                      if (video.readyState >= 2) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                      }
                    };
                    
                    video.addEventListener('loadeddata', drawThumbnail);
                    video.addEventListener('seeked', drawThumbnail);
                    
                    if (video.readyState >= 2) {
                      drawThumbnail();
                    }
                  }
                }
              }}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-0 h-0 border-l-[20px] border-t-[12px] border-b-[12px] border-l-white border-t-transparent border-b-transparent ml-1 animate-bounce-triangle"></div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
        >
          {isFullscreen ? (
            <X size={16} className="text-white" />
          ) : (
            <Maximize2 size={16} className="text-white" />
          )}
        </button>
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-white font-bosenAlt text-sm bg-black/50 px-3 py-1 rounded-full">
            {title}
          </span>
        </div>
      </div>
    );
  }


  // Placeholder for videos without src
  return (
    <div 
      className="relative group cursor-pointer aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      onClick={handleVideoClick}
    >
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[10px] border-t-[6px] border-b-[6px] border-l-white border-t-transparent border-b-transparent ml-1"></div>
          </div>
          <span className="text-white/60 font-bosenAlt text-sm">{title}</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      <button
        onClick={() => {}}
        className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <Maximize2 size={16} className="text-white" />
      </button>
    </div>
  );
}

function VerticalVideoPlayer({ title }: { title: string }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false); 
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showThumbnail, setShowThumbnail] = React.useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowThumbnail(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowThumbnail(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative group cursor-pointer aspect-[9/16] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      onClick={handleVideoClick}
    >
      {/* Video element (hidden initially) */}
      <video
        ref={videoRef}
        autoPlay={false}
        muted={false}
        loop
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${showThumbnail ? 'opacity-0' : 'opacity-100'}`}
        onLoadedData={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 1; // Set thumbnail to 1 second
          }
        }}
      />
      
      {/* Thumbnail overlay */}
      {showThumbnail && (
        <div className="absolute inset-0">
          <canvas
            ref={(canvas) => {
              if (canvas && videoRef.current) {
                const video = videoRef.current;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  canvas.width = video.videoWidth || 1080;
                  canvas.height = video.videoHeight || 1920;
                  
                  const drawThumbnail = () => {
                    if (video.readyState >= 2) {
                      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    }
                  };
                  
                  video.addEventListener('loadeddata', drawThumbnail);
                  video.addEventListener('seeked', drawThumbnail);
                  
                  if (video.readyState >= 2) {
                    drawThumbnail();
                  }
                }
              }
            }}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Fallback placeholder when no video */}
      {!videoRef.current?.src && (
        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-t-[4px] border-b-[4px] border-l-white border-t-transparent border-b-transparent ml-0.5"></div>
            </div>
            <span className="text-white/60 font-bosenAlt text-xs">{title}</span>
          </div>
        </div>
      )}
      
      {/* Play button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-0 h-0 border-l-[12px] border-t-[8px] border-b-[8px] border-l-white border-t-transparent border-b-transparent ml-0.5 animate-bounce-triangle"></div>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        {isFullscreen ? (
          <X size={12} className="text-white" />
        ) : (
          <Maximize2 size={12} className="text-white" />
        )}
      </button>
      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-white font-bosenAlt text-xs bg-black/50 px-2 py-1 rounded-full">
          {title}
        </span>
      </div>
    </div>
  );
}

function VerticalVideoPlayerWithSrc({ src, title }: { src: string; title: string }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false); 
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showThumbnail, setShowThumbnail] = React.useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowThumbnail(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowThumbnail(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative group cursor-pointer aspect-[9/16] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay={false}
        muted={false}
        loop
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${showThumbnail ? 'opacity-0' : 'opacity-100'}`}
        onLoadedData={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 1; // Set thumbnail to 1 second
          }
        }}
      />
      
      {/* Thumbnail overlay */}
      {showThumbnail && (
        <div className="absolute inset-0">
          <canvas
            ref={(canvas) => {
              if (canvas && videoRef.current) {
                const video = videoRef.current;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  canvas.width = video.videoWidth || 1080;
                  canvas.height = video.videoHeight || 1920;
                  
                  const drawThumbnail = () => {
                    if (video.readyState >= 2) {
                      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    }
                  };
                  
                  video.addEventListener('loadeddata', drawThumbnail);
                  video.addEventListener('seeked', drawThumbnail);
                  
                  if (video.readyState >= 2) {
                    drawThumbnail();
                  }
                }
              }
            }}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Play button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-0 h-0 border-l-[12px] border-t-[8px] border-b-[8px] border-l-white border-t-transparent border-b-transparent ml-0.5 animate-bounce-triangle"></div>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        {isFullscreen ? (
          <X size={12} className="text-white" />
        ) : (
          <Maximize2 size={12} className="text-white" />
        )}
      </button>
      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-white font-bosenAlt text-xs bg-black/50 px-2 py-1 rounded-full">
          {title}
        </span>
      </div>
    </div>
  );
}

function VerticalVideoPlayerPlaceholder({ title }: { title: string }) {
  const [isFullscreen, setIsFullscreen] = React.useState(false); 
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative group cursor-pointer aspect-[9/16] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] border-t-[4px] border-b-[4px] border-l-white border-t-transparent border-b-transparent ml-0.5"></div>
          </div>
          <span className="text-white/60 font-bosenAlt text-xs">{title}</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        {isFullscreen ? (
          <X size={12} className="text-white" />
        ) : (
          <Maximize2 size={12} className="text-white" />
        )}
      </button>
      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-white font-bosenAlt text-xs bg-black/50 px-2 py-1 rounded-full">
          {title}
        </span>
      </div>
    </div>
  );
}



interface TestimonialBadge {
  image: string;
  position: { top: string; left: string };
  delay: number;
  shineDelay: number;
  shineDuration: number;
  scale: number;
}

const testimonialBadges: TestimonialBadge[] = [
  { image: "/badges/1.png", position: { top: "10%", left: "25%" }, delay: 0.5, shineDelay: 2.3, shineDuration: 14, scale: 1.0 },
  { image: "/badges/2.png", position: { top: "15%", left: "70%" }, delay: 0.8, shineDelay: 1.2, shineDuration: 12, scale: 0.8 },
  { image: "/badges/3.png", position: { top: "25%", left: "20%" }, delay: 1.1, shineDelay: 3.7, shineDuration: 15, scale: 0.9 },
  { image: "/badges/4.png", position: { top: "30%", left: "87%" }, delay: 1.4, shineDelay: 2.1, shineDuration: 13, scale: 0.7 },
  { image: "/badges/5.png", position: { top: "30%", left: "20%" }, delay: 1.7, shineDelay: 4.9, shineDuration: 16, scale: 1.1 },
  { image: "/badges/6.png", position: { top: "47%", left: "84%" }, delay: 2.0, shineDelay: 2.8, shineDuration: 12, scale: 0.8 },
  { image: "/badges/7.png", position: { top: "12%", left: "10%" }, delay: 2.3, shineDelay: 0.5, shineDuration: 14, scale: 0.9 },
  { image: "/badges/8.png", position: { top: "40%", left: "2%" }, delay: 2.6, shineDelay: 3.2, shineDuration: 13, scale: 0.6 },
  { image: "/badges/9.png", position: { top: "55%", left: "68%" }, delay: 2.9, shineDelay: 1.7, shineDuration: 15, scale: 0.9 },
  { image: "/badges/10.png", position: { top: "35%", left: "73%" }, delay: 3.2, shineDelay: 5.1, shineDuration: 16, scale: 0.8 },
];

export function TestimonialBadgesGroup() {
  return (
    <>
      {testimonialBadges.map((badge, index) => (
        <TestimonialBadge key={index} badge={badge} />
      ))}
    </>
  );
}

function TestimonialBadge({ badge }: { badge: TestimonialBadge }) {
  return (
    <div
      className="absolute opacity-0 animate-fade-up"
      style={{
        top: badge.position.top,
        left: badge.position.left,
        animationDelay: `${badge.delay}s`,
        animationFillMode: "forwards",
        transform: `scale(${badge.scale})`,
      }}
    >
      <div className="relative w-auto h-auto max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[200px]">
        {/* Base Badge PNG */}
        <img
          src={badge.image}
          alt="testimonial badge"
          className="w-full h-auto block relative z-10 opacity-30 hover:opacity-50 transition-opacity duration-300"
        />

        {/* Shine Overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none animate-shine-diagonal"
          style={{
            WebkitMaskImage: `url(${badge.image})`,
            maskImage: `url(${badge.image})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            animationDelay: `${badge.shineDelay}s`,
            animationDuration: `${badge.shineDuration}s`,
            '--shine-delay': `${badge.shineDelay}s`,
            '--shine-duration': `${badge.shineDuration}s`,
          } as React.CSSProperties}
        />

      </div>
    </div>
  );
}



function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [showTestimonials, setShowTestimonials] = React.useState(true);
  const [showContact, setShowContact] = React.useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const backgroundTextRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const mainTextRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);
  const fixedBackgroundRef = useRef<HTMLDivElement>(null); 
  const portfolioRef = useRef<HTMLDivElement>(null);
// Mouse tracking state
const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
const [isCursorInsideHero, setIsCursorInsideHero] = React.useState(false);
const [isMouseTrackingEnabled, setIsMouseTrackingEnabled] = React.useState(true);

  // Handle splash screen completion
  const handleLoadComplete = () => {
    setIsLoading(false);
  };

// Track if cursor enters/leaves hero section
useEffect(() => {
  const heroElement = heroRef.current;
  if (!heroElement) return;

  const handleMouseEnter = () => setIsCursorInsideHero(true);
  const handleMouseLeave = () => {
    setIsCursorInsideHero(false);
    setMousePosition({ x: 0, y: 0 }); // Optional reset
  };

  heroElement.addEventListener("mouseenter", handleMouseEnter);
  heroElement.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    heroElement.removeEventListener("mouseenter", handleMouseEnter);
    heroElement.removeEventListener("mouseleave", handleMouseLeave);
  };
}, [heroRef]);

// Mouse tracking effect
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!isCursorInsideHero || !isMouseTrackingEnabled) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 1.5;
    const y = (e.clientY / window.innerHeight - 0.5) * 0.7;
    setMousePosition({ x, y });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, [isCursorInsideHero, isMouseTrackingEnabled]);

 useEffect(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(portraitRef.current, {
  y: 900, // ya 200 if you want smaller slide
  scrollTrigger: {
    trigger: heroRef.current,
    start: "top top",
    end: "top+=1500", // 🔁 reduce to make it slower & smoother
    scrub: 3        // 🔁 increase for smoother animation
  }
});

   gsap.to(baseRef.current, {
  y: 900, // ya 200 if you want smaller slide
  scrollTrigger: {
    trigger: heroRef.current,
    start: "top top",
    end: "top+=1500", // 🔁 reduce to make it slower & smoother
    scrub: 3        // 🔁 increase for smoother animation
  }
});

   gsap.to(eyesRef.current, {
  y: 900, // ya 200 if you want smaller slide
  scrollTrigger: {
    trigger: heroRef.current,
    start: "top top",
    end: "top+=1500", // 🔁 reduce to make it slower & smoother
    scrub: 3   // 🔁 increase for smoother animation
  }
});
   
    gsap.to(mainTextRef.current, {
  y: 700, // ya 200 if you want smaller slide
  scrollTrigger: {
    trigger: heroRef.current,
    start: "top top",
    end: "top+=1500", // 🔁 reduce to make it slower & smoother
    scrub: 3        // 🔁 increase for smoother animation
  }
});

  // Triangle parallax
  gsap.to(triangleRef.current, {
    y: 100,
    scrollTrigger: {
      trigger: heroRef.current,
      start: "top top",
      end: "bottom+=1000 center",
      scrub: 1
    }
  });


    // bg text animate
  gsap.to(backgroundTextRef.current, {
    y: -300,
    opacity: 1,
    scaleY: 2.5, // Height scale increase for stretch effect
    scrollTrigger: {
      trigger: heroRef.current,
      start: "bottom bottom",
      end: "bottom+=-50 top",
      scrub: 1,
      ease: "power2.out"
    }
  });

  // Portfolio up animation
  gsap.to(portfolioSectionRef.current, {
  y: -900,
  scrollTrigger: {
    trigger: portfolioSectionRef.current,
    start: "top bottom", // trigger when bottom of element hits 80% of viewport
    end: "bottom top", // optional: end when top of element hits 20% of viewport
   scrub: 3
  }
});

   
    ScrollTrigger.create({
      trigger: portfolioSectionRef.current,
      start: "top 20%",
      onEnter: () => setShowTestimonials(false),
      onLeaveBack: () => setShowTestimonials(true),
    });

    // Show contact section when portfolio section is visible
    ScrollTrigger.create({
      trigger: portfolioSectionRef.current, 
      start: "top 30%",
      onEnter: () => setShowContact(true),
      onLeaveBack: () => setShowContact(false),
    });

   

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []); 
useEffect(() => {
  const handleFullscreenChange = () => {
    // Wait a tiny bit to let layout settle, then refresh
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);

  return () => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  };
}, []);

  return ( 
    <div className="relative">
    
       
      {/* Splash Screen */}
      {isLoading && <SplashScreen onLoadComplete={handleLoadComplete} />}

<div
  ref={fixedBackgroundRef}
  className="fixed inset-0 bg-center bg-no-repeat z-[-1] 
             bg-cover sm:bg-[length:100%_100%] 
             max-sm:bg-[length:120%_100%]"
  style={{
    backgroundImage: `url('/bg.png')`,
    backgroundAttachment: 'fixed'
  }}
>

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/0" />
</div>

      {/* Main Hero Section */} 
      <div 
        ref={heroRef}
        className="relative min-h-screen w-full overflow-hidden bg-transparent"
      >

         {/* base */}
<div 
  ref={baseRef}
  className="absolute inset-0 flex items-center justify-center z-10" 
  style={{ top: '24%', left: '1%' }}
>
  <div className="relative"> 
    <div 
      className="
        w-[35rem] h-[35rem]
        sm:w-600px sm:h-600px 
        md:w-[50rem] md:h-[50rem] 
        lg:w-[62.5rem] lg:h-[62.5rem] 
        overflow-hidden 
        opacity-0 
        animate-fade-in-delayed
      "
      style={{ 
        animationDelay: '0.1s', 
        animationFillMode: 'forwards'
      }}
    > 
      <img 
        src="/base.png"
        alt="Portrait"
        className="w-full h-full object-cover"
        style={{ transform: 'scale(1.05)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent" />
    </div> 
  </div>
</div>
        
      {/* Portrait */}
<div 
  ref={portraitRef}
  className="absolute inset-0 flex items-center justify-center z-30" 
  style={{ top: '24%', left: '1%' }}
>
  <div className="relative"> 
    <div 
      className="
        w-[35rem] h-[35rem]
        sm:w-600px sm:h-600px 
        md:w-[50rem] md:h-[50rem] 
        lg:w-[62.5rem] lg:h-[62.5rem] 
        overflow-hidden 
        opacity-0 
        animate-fade-in-delayed
      "
      style={{ 
        animationDelay: '0.1s', 
        animationFillMode: 'forwards'
      }}
    > 
      <img 
        src="/me.png"
        alt="Portrait"
        className="w-full h-full object-cover"
        style={{ transform: 'scale(1.05)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent" />
    </div> 
  </div>
</div>

         {/* eyes */}
<div
  ref={eyesRef}
  className="absolute inset-0 flex items-center justify-center z-20"
  style={{
    top: '24%',
    left: '1%',
      transform: `translate(${mousePosition.x * 8}px, ${mousePosition.y * 8}px)`,
  }}
>


  <div className="relative"> 
    <div 
      className="
        w-[35rem] h-[35rem]
        sm:w-600px sm:h-600px 
        md:w-[50rem] md:h-[50rem]  
        lg:w-[62.5rem] lg:h-[62.5rem] 
        overflow-hidden 
        opacity-0 
        animate-fade-in-delayed
      "
      style={{ 
        animationDelay: '0.5s', 
        animationFillMode: 'forwards'
      }}
    > 
      <img 
        src="/eyes.png"
        alt="Portrait"
        className="w-full h-full object-cover grayscale contrast-110 brightness-90"
        style={{ transform: 'scale(1.05)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent" />
    </div> 
  </div>
</div>

        {/* Background Text - Aamir Naqvi at Bottom */}
        <div 
          ref={backgroundTextRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-5"
          style={{ 
            top: '65%',
            transition: 'transform 0.4s ease-out'
          }}
        >
          <div  
            className="text-[4rem] md:text-[10rem] lg:text-[20rem] font-bosenAlt text-white select-none leading-none opacity-0 animate-fade-in-delayed"
            style={{
              animationDelay: '0.1s',  
              animationFillMode: 'forwards', 
              textShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
          >
            AAMIR NAQVI
          </div>
        </div>
        
        {/* Main Typography */}
        <div 
          ref={mainTextRef}
          className="absolute inset-0 flex items-center justify-center z-40"
          style={{ top: '60%', left: '-1%' }}
        >
          <div className="text-center z-10 px-6">
            <div 
              className="text-2xl md:text-4xl lg:text-5xl font-bosenAlt tracking-tight text-white/70 leading-tight opacity-0 animate-fade-in-delayed"
              style={{ 
                animationDelay: '0.8s', 
                animationFillMode: 'forwards',
                textShadow: '0 15px 30px rgba(0,0,0,0.5)'
              }}
            >
              I EDIT
            </div>
            <div 
              className="text-2xl md:text-3xl lg:text-4xl font-bosenAlt tracking-tight text-white/60 leading-tight mt-2 opacity-0 animate-fade-in-delayed"
              style={{ 
                animationDelay: '1.1s', 
                animationFillMode: 'forwards',
                textShadow: '0 15px 30px rgba(0,0,0,0.5)'
              }}
            >
              VISUALS THAT
            </div>
            <div 
              className="text-2xl md:text-4xl lg:text-5xl font-bosenAlt tracking-tight text-white/90 leading-tight mt-2 opacity-0 animate-fade-in-delayed"
              style={{ 
                animationDelay: '1.4s', 
                animationFillMode: 'forwards',
                textShadow: '0 15px 30px rgba(0,0,0,0.5)'
              }}
            >
              BUILD BRANDS
            </div>
          </div>
        </div>

        {/* Floating Testimonial Badges */}
                {showTestimonials && (
  <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
    {testimonialBadges.map((badge, index) => (
      <TestimonialBadge key={index} badge={badge} />
    ))}
  </div>
)}
      

        {/* Bottom Triangle Shape */}
        <div 
          ref={triangleRef}
          className="absolute bottom-4 
             left-[48%] max-sm:left-[40%] 
             transform -translate-x-1/2 
             opacity-0 animate-fade-in-delayed 
             z-50 cursor-pointer"
          onClick={() => {
            document.getElementById('contact-section')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
          style={{ 
            animationDelay: '3.5s', 
            animationFillMode: 'forwards',
            filter: 'drop-shadow(0 10px 20px rgba(34, 211, 238, 0.3))'
          }}
        >
          <div className="flex flex-col items-center">
            <div 
              className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-cyan-400 animate-bounce-triangle"
            />
            <p className="text-white/60 text-xs font-bosenAlt mt-2 uppercase tracking-wide">
              Scroll Down
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div 
  ref={portfolioSectionRef} 
  className="relative min-h-screen w-full bg-white z-50 rounded-t-[3rem] rounded-b-[3rem] texture-overlay opacity-100 translate-y- 10"
>

        
        {/* Random Lines Overlay */}
        <RandomLines count={25} className="z-10" />
        
        {/* Additional texture layer */}
        <div className="absolute inset-0 texture-overlay-light opacity-30 z-10" />
        
        <div className="container mx-auto px-6 py-20">
          <div className="relative text-center mb-16 z-20">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bosenAlt text-black/90 mb-6 tracking-tight">
              PORTFOLIO
            </h2>
            <p className="text-xl md:text-2xl text-black/60 max-w-3xl mx-auto leading-relaxed">
              Visual stories that shape brands and captivate audiences worldwide
            </p>
          </div>
          
         {/* Show Reel Section */}
<div className="relative mb-20 z-20">
  <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
    SHOW REEL
  </h3>
  <div className="max-w-4xl mx-auto">
    <VideoPlayer 
      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      title="SHOW REEL 2024"
      isShowreel={true}
      autoPlay={false}
    />
  </div>
</div>

{/* 3x3 Grid of 16:9 Videos */}
<div className="relative mb-20 z-20">
  <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
    FEATURED WORK
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
    {[
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    ].map((url, i) => (
      <VideoPlayer
        key={i}
        src={url}
        title={`PROJECT ${String(i + 1).padStart(2, "0")}`}
        isShowreel={false}
        autoPlay={false}
      />
    ))}
  </div>
</div>

{/* 6x4 Grid of 9:16 Videos */}
<div className="relative mb-20 z-20">
  <h3 className="text-3xl md:text-4xl font-bosenAlt text-black/80 mb-8 text-center tracking-tight">
    SOCIAL CONTENT
  </h3>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
    {[
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    ].map((url, i) => (
      <VerticalVideoPlayerWithSrc
        key={i}
        src={url}
        title={`SOCIAL ${String(i + 1).padStart(2, "0")}`}
        autoPlay={false}
      />
    ))}
  </div> 
</div>


        </div>
      </div>


     {/* Contact Section */}
      {showContact && (
        <div
          id="contact-section"
          className="fixed bottom-0 left-0 right-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center z-30 bg-transparent opacity-0 animate-fade-in-delayed"
          style={{
            animationDelay: '0.2s', 
            animationFillMode: 'forwards'
          }}
        > 
         {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-bosenAlt text-white/80 text-center mb-0 tracking-wide">
            LET'S START A CONVERSATION
          </h2>

         {/* Subheading */}
<p className="text-white/30 text-1xl md:text-4xl lg:text-4xl ibm-font mb-8 text-center">
  Drop me a message, let's make something users will love.
</p>

<div className="space-y-10 text-center">
            {/* Email */}
            <div className="flex flex-col items-center gap-2">
              <Mail className="text-white/70 w-8 h-8" />
              <a
                href="https://mail.google.com/mail/?view=cm&to=broskiagency@gmail.com" target="_blank"
                className="text-white/80 font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                BROSKIAGENCY@GMAIL.COM
              </a>
              <p className="text-white/30 text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
  Let's create something that actually works.
</p>
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col items-center gap-0">
              <Linkedin className="text-white/70 w-8 h-8" />
              <a
                href="https://www.linkedin.com/in/aamir-naqvi/"
                target="_blank"
                rel="noopener noreferrer"
  className="text-white/80 font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                LINKEDIN
              </a>
              <p className="text-white/30 text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
                See how UX meets business - connect with me.
              </p>
            </div>

            {/* Instagram */}
            <div className="flex flex-col items-center gap-2">
              <Instagram className="text-white/70 w-8 h-8" />
              <a
                href="https://www.instagram.com/aamir.naqvii/"
                target="_blank"
                rel="noopener noreferrer"
                  className="text-white/80 font-bosenAlt text-xl md:text-xl lg:text-2xl tracking-wide hover:text-blue-500 transition-colors duration-200"
              >
                INSTAGRAM
              </a>
           <p className="text-white/30 text-xl md:text-1xl lg:text-2xl ibm-font mb-0 text-center">
                Tap in for visuals with purpose. - follow the flow.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;