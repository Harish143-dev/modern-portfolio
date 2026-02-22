"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import Button from "./ui/Button";
import MarqueeSlider from "./MarqueeSlider";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function About() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const curveRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !curveRef.current) return;

      const para1 = new SplitText(".para1", { type: "lines" });
      const para2 = new SplitText(".para2", { type: "lines" });

      // ✅ Curve should ALWAYS stay curved
      gsap.set(curveRef.current, {
        transformOrigin: "50% 100%",
        scaleY: 1, // base curve always 1
      });

      // ✅ Jelly stretch on scroll up/down (never goes below 1)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity(); // scroll velocity
          const stretch = gsap.utils.clamp(0, 0.25, Math.abs(v) / 5000); // only positive
          const targetScale = 1 + stretch; // never smaller than 1

          gsap.to(curveRef.current, {
            scaleY: targetScale,
            duration: 0.22,
            ease: "elastic.out(1, 0.35)",
            overwrite: true,
          });

          // settle back to 1 smoothly
          gsap.to(curveRef.current, {
            scaleY: 1,
            duration: 0.45,
            delay: 0.05,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });

      // ✅ Line by line text reveal
      gsap.fromTo(
        para1.lines,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".para1",
            start: "top 80%",
            end: "top 40%",
            scrub: true,
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        para2.lines,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".para2",
            start: "top 80%",
            end: "top 40%",
            scrub: true,
            toggleActions: "play none none reverse",
          },
        },
      );

      return () => {
        para1.revert();
        para2.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="about" className="relative bg-black mt-30">
      {/* Curve wrapper */}
      <div className="absolute -top-25 left-0 w-full flex justify-center pointer-events-none">
        <div
          ref={curveRef}
          className="w-[120%] h-32 md:h-44 lg:h-52 bg-black rounded-t-[100%] will-change-transform"
        />
      </div>
      {/* Content */}
      <div className="relative px-5 md:px-10 md:pt-20 pb-50 text-center flex flex-col items-center overflow-hidden gap-10">
        <p className="para1 heading max-w-5xl text-white text-2xl md:text-3xl leading-relaxed">
          I’m a full-stack developer working with the MERN stack, focused on
          building products that are fast, reliable, and easy to use. I enjoy
          solving problems end-to-end — from backend logic to frontend design.
        </p>

        <p className="para2 heading max-w-5xl text-white text-2xl md:text-3xl leading-relaxed">
          My work goes beyond code. I create smooth UI animations and automate
          workflows using n8n, helping teams reduce manual effort and deliver
          better digital experiences with precision and flow.
        </p>

        <Button variant="secondary" size="lg" magnetic ripple>
          About me
        </Button>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[120vw] overflow-hidden -rotate-2">
          <MarqueeSlider />
        </div>
      </div>
    </section>
  );
}
