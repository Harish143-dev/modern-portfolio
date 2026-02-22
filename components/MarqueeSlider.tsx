import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const whatIKnow = [
  "FullStack Developer",
  "AI Automation & Integration",
  "React & TypeScript",
  "Node.js & MongoDB",
  "GSAP Animations",
];

const MarqueeSlider = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      // Duplicate content for seamless looping
      const totalWidth = track.scrollWidth;
      const halfWidth = totalWidth / 2;

      // Main Timeline: The slow, elegant crawl
      const tl = gsap.to(track, {
        x: `-=${halfWidth}`,
        duration: 35, // Slower is more premium
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % halfWidth),
        },
      });

      // Subtle vertical "float" for each item to avoid rigidity
    //   gsap.to(".marquee-item", {
    //     y: -4,
    //     duration: 2,
    //     stagger: {
    //       each: 0.2,
    //       from: "random",
    //       repeat: -1,
    //       yoyo: true,
    //     },
    //     ease: "sine.inOut",
        
    //   });

      // Interactivity: Smooth slow-down instead of hard stop
      const onEnter = () => {
        gsap.to(tl, { timeScale: 0.2, duration: 0.8, ease: "power2.out" });
      };
      const onLeave = () => {
        gsap.to(tl, { timeScale: 1, duration: 1.2, ease: "power2.inOut" });
      };

      const wrap = wrapRef.current;
      wrap?.addEventListener("mouseenter", onEnter);
      wrap?.addEventListener("mouseleave", onLeave);

      return () => {
        wrap?.removeEventListener("mouseenter", onEnter);
        wrap?.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden py-6 bg-white selection:bg-black selection:text-white"
    >
      {/* Premium Glass-style Faded Edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-white via-white/80 to-transparent" />

      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
      >
        {/* We map twice to ensure the loop is seamless */}
        {[...whatIKnow, ...whatIKnow].map((text, index) => (
          <div key={index} className="marquee-item flex items-center px-8">
            <span className="text-2xl tracking-wider heading uppercase text-black/90 hover:text-black transition-colors duration-500 cursor-default">
              {text}
            </span>
            {/* The Dot: A premium design staple */}
            <div className="ml-16 h-2 w-2 rounded-full bg-black shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeSlider;
