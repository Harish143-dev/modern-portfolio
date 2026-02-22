import React, { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;

  /** 🧲 Magnetic effect */
  magnetic?: boolean;
  magneticStrength?: number; // default 0.35

  /** 💧 Ripple effect */
  ripple?: boolean;
  rippleDuration?: number; // ms, default 650
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  className = "",

  magnetic = true,
  magneticStrength = 0.35,

  ripple = true,
  rippleDuration = 650,
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  const isDisabled = disabled || loading;

  const baseStyles =
    "relative inline-flex items-center justify-center rounded-full font-medium select-none " +
    "overflow-hidden transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const variants: Record<ButtonVariant, string> = useMemo(
    () => ({
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
      secondary:
        "bg-[#D4F534] text-gray-900 hover:bg-[#c8e82f] focus-visible:ring-[#D4F534]",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
      outline:
        "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-blue-600",
    }),
    [],
  );

  const sizes: Record<ButtonSize, string> = useMemo(
    () => ({
      sm: "px-4 py-2 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-8 py-4 text-lg",
    }),
    [],
  );

  // Setup + defaults
  useGSAP(
    () => {
      if (!btnRef.current || !textRef.current) return;

      gsap.set(btnRef.current, { transformOrigin: "50% 50%" });
      gsap.set(textRef.current, { x: 0, y: 0, willChange: "transform" });
    },
    { scope: btnRef },
  );

  // 🧲 Magnetic (text follow cursor)
  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!magnetic || isDisabled || !btnRef.current || !textRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // from center (-0.5 to 0.5)
    const x = (relX / rect.width - 0.5) * 2;
    const y = (relY / rect.height - 0.5) * 2;

    // translate range depends on button size
    const maxMove = Math.min(rect.width, rect.height) * 0.18; // feels premium
    const tx = x * maxMove * magneticStrength;
    const ty = y * maxMove * magneticStrength;

    gsap.to(textRef.current, {
      x: tx,
      y: ty,
      duration: 0.18,
      ease: "power3.out",
      overwrite: "auto",
    });

    // optional subtle button “lift”
    gsap.to(btnRef.current, {
      scale: 1.03,
      duration: 0.2,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const resetMagnetic = () => {
    if (!btnRef.current || !textRef.current) return;

    gsap.to(textRef.current, {
      x: 0,
      y: 0,
      duration: 0.28,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(btnRef.current, {
      scale: 1,
      duration: 0.28,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  // 💧 Ripple effect
  const spawnRipple = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!ripple || isDisabled || !btnRef.current) return;

    const button = btnRef.current;
    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Make ripple large enough to cover the farthest corner
    const maxX = Math.max(x, rect.width - x);
    const maxY = Math.max(y, rect.height - y);
    const radius = Math.sqrt(maxX * maxX + maxY * maxY);
    const size = radius * 2;

    const rippleEl = document.createElement("span");
    rippleEl.style.position = "absolute";
    rippleEl.style.left = `${x - size / 2}px`;
    rippleEl.style.top = `${y - size / 2}px`;
    rippleEl.style.width = `${size}px`;
    rippleEl.style.height = `${size}px`;
    rippleEl.style.borderRadius = "9999px";
    rippleEl.style.pointerEvents = "none";
    rippleEl.style.opacity = "0";
    rippleEl.style.transform = "scale(0.2)";

    // Color: adapts to variant automatically
    // (white ripple on dark buttons, dark ripple on light buttons)
    const isLight = variant === "secondary";
    rippleEl.style.background = isLight
      ? "rgba(0,0,0,0.18)"
      : "rgba(255,255,255,0.22)";

    // Put ripple under text but above background
    rippleEl.style.zIndex = "0";

    button.appendChild(rippleEl);

    gsap.to(rippleEl, {
      opacity: 1,
      duration: 0.08,
      ease: "power1.out",
    });

    gsap.to(rippleEl, {
      scale: 1,
      duration: rippleDuration / 1000,
      ease: "power3.out",
      onComplete: () => rippleEl.remove(),
    });

    gsap.to(rippleEl, {
      opacity: 0,
      duration: rippleDuration / 1000,
      ease: "power2.out",
      delay: 0.05,
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    spawnRipple(e);

    if (isDisabled || !btnRef.current) return;
    gsap.to(btnRef.current, {
      scale: 0.97,
      duration: 0.12,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handlePointerUp = () => {
    if (isDisabled || !btnRef.current) return;
    gsap.to(btnRef.current, {
      scale: 1.03,
      duration: 0.14,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetMagnetic}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={[
        baseStyles,
        variants[variant],
        sizes[size],
        isDisabled ? "opacity-60 cursor-not-allowed" : "",
        className,
      ].join(" ")}
    >
      {/* Keep text above ripple */}
      {loading ? (
        <span className="relative z-10 inline-flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Loading</span>
        </span>
      ) : (
        <span ref={textRef} className="relative z-10">
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;
