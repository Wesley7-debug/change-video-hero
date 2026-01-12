
"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

const Hero = () => {
  const mainVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const miniWrapperRef = useRef(null);
  const miniInnerRef = useRef(null);
  const tlRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalVideos = 4;
  const nextVideoIndex = (currentIndex % totalVideos) + 1;

  const videoSrc = (index) => `/videos/hero-${index}.mp4`;

  const getMiniClipPath = () => {
    const el = miniInnerRef.current;
    if (!el) return "polygon(0 0, 0 0, 0 0, 0 0)";

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const matrix = new DOMMatrixReadOnly(style.transform);

    const scaleX = matrix.a || 1;
    const scaleY = matrix.d || 1;

    const width = rect.width * scaleX;
    const height = rect.height * scaleY;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const left = ((centerX - width / 2) / window.innerWidth) * 100;
    const right = ((centerX + width / 2) / window.innerWidth) * 100;
    const top = ((centerY - height / 2) / window.innerHeight) * 100;
    const bottom = ((centerY + height / 2) / window.innerHeight) * 100;

    return `polygon(
      ${left}% ${top}%,
      ${right}% ${top}%,
      ${right}% ${bottom}%,
      ${left}% ${bottom}%
    )`;
  };

  const handleMiniVideoClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const startClip = getMiniClipPath();

    tlRef.current = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        setCurrentIndex(nextVideoIndex);
        setIsAnimating(false);
      },
    });

    tlRef.current
      .set(nextVideoRef.current, {
        visibility: "visible",
        zIndex: 20,
        clipPath: startClip,
      })
      .to(nextVideoRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.2,
        ease: "power3.inOut",
      });
  };

  useEffect(() => {
    if (!nextVideoRef.current) return;

    gsap.set(nextVideoRef.current, {
      visibility: "hidden",
      zIndex: 5,
      clipPath: "polygon(0 0, 0 0, 0 0, 0 0)",
    });
  }, [currentIndex]);

  return (
    <section className="relative h-screen w-screen overflow-hidden">
      {/* NAV */}
      <nav className="absolute top-4 left-1/2 z-50 w-[92%] -translate-x-1/2 rounded-full border border-white/15 bg-black/30 px-6 py-3 backdrop-blur-md md:w-[88%]">
        <div className="flex items-center justify-between text-white font-heading">
          <span className="text-lg font-black uppercase tracking-wider">
            Velocity
          </span>

          <ul className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <li className="cursor-pointer opacity-80 transition hover:opacity-100">
              Models
            </li>
            <li className="cursor-pointer opacity-80 transition hover:opacity-100">
              Engineering
            </li>
            <li className="cursor-pointer opacity-80 transition hover:opacity-100">
              Performance
            </li>
            <li className="cursor-pointer opacity-80 transition hover:opacity-100">
              Contact
            </li>
          </ul>

          <button className="rounded-full bg-white px-5 py-2 text-sm font-bold uppercase tracking-wide text-black transition hover:scale-105">
            Drive
          </button>
        </div>
      </nav>

      {/* VIDEO STACK */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={mainVideoRef}
          src={videoSrc(currentIndex)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />

        <video
          ref={nextVideoRef}
          src={videoSrc(nextVideoIndex)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* MINI PREVIEW */}
      <div
        ref={miniWrapperRef}
        onClick={handleMiniVideoClick}
        className="absolute top-[55%] left-1/2 z-50 size-64 -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-2xl max-md:size-52"
      >
        <div
          ref={miniInnerRef}
          className="origin-center scale-50 opacity-0 transition-all duration-250 ease-in hover:scale-100 hover:opacity-100"
        >
          <video
            src={videoSrc(nextVideoIndex)}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="size-full object-cover object-center"
          />
        </div>
      </div>

      {/* TOP CONTENT */}
      <div className="absolute left-0 top-18 z-30 px-5 text-white md:px-10">
        <h1 className="mt-2 text-5xl font-black uppercase font-heading md:text-[5vw]">
          Velocity
        </h1>
        <p className="max-w-[25ch] text-xl font-medium md:text-2xl font-body lg:text-3xl">
          Experience the thrill of engineering and speed
        </p>
      </div>

      {/* BOTTOM CONTENT */}
      <div className="absolute bottom-5 right-0 z-30 px-8 text-white font-heading md:px-10">
        <h1 className="text-5xl font-black uppercase md:text-[5vw] max-md:text-4xl">
          Precision
        </h1>
      </div>
    </section>
  );
};

export default Hero;
