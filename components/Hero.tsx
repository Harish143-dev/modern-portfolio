"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import RippleGrid from "./RippleGrid";
import Nav from "./Nav";

export default function Hero() {
  useGSAP(() => {
    gsap.from(".hero-section", {
      yPercent: 100,
      scale: 1,
      opacity: 1,
      duration: 0.8,
      delay: 1,
      borderRadius: "28px",
      clipPath: "inset(18% 18% 18% 18% round 28px)",
    });
  }, []);
  return (
    <section className="hero-section relative min-h-screen w-full bg-background overflow-hidden">
      {/* Nav */}

      {/* 🔮 Orb – BACKGROUND CENTER */}
      <div className="absolute inset-0 flex items-center justify-center z-20 w-full">
        <div className="w-[70vw] h-[70vw] max-w-[720px] max-h-[720px] relative">
          <RippleGrid
            enableRainbow={false}
            gridColor="#c4c4c4"
            rippleIntensity={0.05}
            gridSize={10}
            gridThickness={15}
            fadeDistance={1.5}
            vignetteStrength={2}
            glowIntensity={0.2}
            opacity={0.1}
            gridRotation={0}
            mouseInteraction
            mouseInteractionRadius={0.8}
          />
        </div>
      </div>

      {/* 🧾 CONTENT – FOREGROUND CENTER */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="hero-name overflow-hidden text-lg md:text-2xl ">
          <span className="inline-block">Hi I'm Harish</span>
        </h1>

        <p className="hero-sub heading mt-1 md:mt-3 text-4xl md:text-6xl lg:text-7xl">
          Full-Stack Developer
        </p>

        <p className="heading hero-sub text-2xl md:text-4xl lg:text-5xl">
          Automation & Integration
        </p>
      </div>
    </section>
  );
}
