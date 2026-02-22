"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    category: "Frontend",
    skills: ["React", "TypeScript", "Tailwind CSS", "GSAP", "Next.js"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs"],
  },
  {
    category: "Tools & DevOps",
    skills: ["Git", "Docker", "VS Code", "Webpack", "npm"],
  },
];

const SkillsSection = () => {
  const outerSectionRef = useRef<HTMLDivElement | null>(null);
  const innerSectionRef = useRef<HTMLDivElement | null>(null);
  const skillCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const categoryRefsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });

  useGSAP(
    () => {
      const outer = outerSectionRef.current;
      const inner = innerSectionRef.current;
      if (!outer || !inner) return;

      gsap.set(inner, {
        willChange: "transform",
        transformOrigin: "100% 100%",
      });

      gsap.fromTo(
        inner,
        { y: 120, scale: 0.5, opacity: 0.6, force3D: true },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: outer,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.8,
          },
        },
      );

      // Animate category headers
      categoryRefsRef.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: outer,
              start: "top 75%",
              end: "top 25%",
              scrub: 0.5,
            },
          },
        );
      });

      // Animate skill cards with stagger
      skillCardsRef.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 0.7, opacity: 0, y: 40 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: (index % 5) * 0.08,
            ease: "back.out",
            scrollTrigger: {
              trigger: outer,
              start: "top 70%",
              end: "top 20%",
              scrub: 0.5,
            },
          },
        );
      });
    },
    { scope: outerSectionRef },
  );

  const handleSkillHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipplePos({ x, y });

    gsap.to(target, {
      boxShadow:
        "0 0 20px rgba(255, 255, 255, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.1)",
      scale: 1.05,
      duration: 0.3,
      ease: "back.out",
    });
  };

  const handleSkillHoverEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, {
      boxShadow: "0 0 0px rgba(255, 255, 255, 0)",
      scale: 1,
      duration: 0.3,
      ease: "power2.inOut",
    });
  };

  const handleSkillClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    gsap.to(target, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
    });
  };

  return (
    <section
      ref={outerSectionRef}
      className="min-h-screen bg-black flex-center p-5"
    >
      <div
        ref={innerSectionRef}
        className="bg-accent-foreground w-[90%] min-h-screen rounded-3xl p-8"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <h2 className="text-4xl font-bold text-white mb-12 font-clash">
          Skills & Expertise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((categoryGroup, categoryIndex) => (
            <div key={categoryIndex}>
              <h3
                ref={(el) => {
                  categoryRefsRef.current[categoryIndex] = el;
                }}
                className="text-xl font-semibold text-white mb-6 font-clash"
              >
                {categoryGroup.category}
              </h3>

              <div className="space-y-3">
                {categoryGroup.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    ref={(el) => {
                      skillCardsRef.current[categoryIndex * 10 + skillIndex] =
                        el;
                    }}
                    onMouseEnter={handleSkillHover}
                    onMouseLeave={handleSkillHoverEnd}
                    onClick={handleSkillClick}
                    className="px-4 py-3 rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white font-medium cursor-pointer transition-all duration-300 hover:from-white/20 hover:to-white/10 backdrop-blur-sm"
                    style={{
                      transform: "translate3d(0,0,0)",
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
