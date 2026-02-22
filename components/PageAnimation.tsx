"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function PageAnimation() {
  useGSAP(() => {
    // 🔹 Loader text
    const loaderSplit = new SplitText(".loader-text", {
      type: "chars",
    });

    // 🔹 Hero name
    const heroNameSplit = new SplitText(".hero-name", {
      type: "chars",
    });

    // 🔹 Hero subtitle (THIS IS WHAT YOU WANT)
    const heroSubSplit = new SplitText(".hero-sub", {
      type: "chars",
    });

    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
    });

    // 1️⃣ Loader text reveal
    tl.from(loaderSplit.chars, {
      y: 120,
      opacity: 0,
      duration: 1,
      stagger: 0.05,
    });

    // 2️⃣ Pause
    tl.to({}, { duration: 0.3 });

    // 3️⃣ Loader slide up
    tl.to("#loader", {
      yPercent: -100,
      duration: 1,
    });

    // 4️⃣ Hero name reveal
    tl.from(
      heroNameSplit.chars,
      {
        y: 120,
        opacity: 0,
        duration: 1,
        stagger: 0.04,
      },
      "-=0.6",
    );

    // 5️⃣ Hero subtitle SPLIT reveal ✅
    tl.from(
      heroSubSplit.chars,
      {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: {
          each: 0.01,
          from: "random",
        },
      },
      "-=0.4",
    );

    // 6️⃣ Cleanup
    tl.call(() => {
      loaderSplit.revert();
      heroNameSplit.revert();
      heroSubSplit.revert();

      document.getElementById("loader")?.remove();
      document.body.style.overflow = "auto";
    });
  }, []);

  return null;
}
