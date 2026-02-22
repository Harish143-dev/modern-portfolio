"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FlyingArmoredBuddy() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buddyRef = useRef<HTMLDivElement | null>(null);
  const flameLRef = useRef<HTMLDivElement | null>(null);
  const flameRRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const buddy = buddyRef.current;
    const flameL = flameLRef.current;
    const flameR = flameRRef.current;

    if (!root || !buddy || !flameL || !flameR) return;

    // Start centered
    const { innerWidth, innerHeight } = window;
    gsap.set(buddy, { x: innerWidth * 0.5, y: innerHeight * 0.5 });

    // Idle hover (flight feel)
    gsap.to(buddy, {
      y: "+=10",
      duration: 1.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    let lastX = innerWidth * 0.5;
    let lastY = innerHeight * 0.5;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Velocity (for thruster intensity)
      const vx = x - lastX;
      const vy = y - lastY;
      const speed = Math.min(40, Math.hypot(vx, vy)); // clamp

      lastX = x;
      lastY = y;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Follow cursor (smooth)
        gsap.to(buddy, {
          x,
          y,
          duration: 0.35,
          ease: "power3.out",
        });

        // Tilt based on direction
        gsap.to(buddy, {
          rotate: gsap.utils.clamp(-18, 18, vx * 0.2),
          duration: 0.25,
          ease: "power3.out",
        });

        // Thruster flames react to speed
        const flameScale = 0.5 + speed / 40; // 0.5 -> 1.5
        gsap.to([flameL, flameR], {
          scaleY: flameScale,
          opacity: 0.7 + (speed / 40) * 0.3,
          duration: 0.15,
          ease: "power2.out",
          overwrite: true,
        });
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative w-full h-[70vh] overflow-hidden">
      {/* Your background / section can be anything */}
      <div className="absolute inset-0 " />

      {/* Buddy */}
      <div
        ref={buddyRef}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 140, height: 140 }}
      >
        {/* soft glow */}
        <div className="absolute inset-0 rounded-full blur-2xl opacity-50 bg-cyan-400/30" />

        {/* body */}
        <div className="relative mx-auto w-[120px] h-[120px]">
          {/* helmet */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 w-[74px] h-[62px] rounded-[24px] bg-zinc-800 border border-white/10 shadow-lg">
            {/* visor */}
            <div className="absolute left-1/2 top-6 -translate-x-1/2 w-[44px] h-[14px] rounded-full bg-cyan-300/90 blur-[0.2px]" />
            {/* side lights */}
            <div className="absolute left-3 top-10 w-2 h-2 rounded-full bg-cyan-300/80" />
            <div className="absolute right-3 top-10 w-2 h-2 rounded-full bg-cyan-300/80" />
          </div>

          {/* torso */}
          <div className="absolute left-1/2 top-[58px] -translate-x-1/2 w-[86px] h-[72px] rounded-[26px] bg-zinc-900 border border-white/10 shadow-xl">
            {/* arc core */}
            <div className="absolute left-1/2 top-6 -translate-x-1/2 w-7 h-7 rounded-full bg-cyan-300/90 shadow-[0_0_28px_rgba(34,211,238,0.65)]" />
          </div>

          {/* arms */}
          <div className="absolute left-2 top-[70px] w-[22px] h-[50px] rounded-[16px] bg-zinc-900 border border-white/10" />
          <div className="absolute right-2 top-[70px] w-[22px] h-[50px] rounded-[16px] bg-zinc-900 border border-white/10" />

          {/* legs */}
          <div className="absolute left-[34px] top-[110px] w-[20px] h-[26px] rounded-[14px] bg-zinc-800 border border-white/10" />
          <div className="absolute right-[34px] top-[110px] w-[20px] h-[26px] rounded-[14px] bg-zinc-800 border border-white/10" />

          {/* thrusters (flames) */}
          <div
            ref={flameLRef}
            className="absolute left-[33px] top-[132px] w-[22px] h-[34px] rounded-b-full origin-top opacity-80"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.9), rgba(59,130,246,0.35), rgba(0,0,0,0))",
              filter: "blur(0.2px)",
              transform: "scaleY(0.7)",
            }}
          />
          <div
            ref={flameRRef}
            className="absolute right-[33px] top-[132px] w-[22px] h-[34px] rounded-b-full origin-top opacity-80"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.9), rgba(59,130,246,0.35), rgba(0,0,0,0))",
              filter: "blur(0.2px)",
              transform: "scaleY(0.7)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
