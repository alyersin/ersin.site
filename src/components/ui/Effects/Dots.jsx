"use client";

import { useEffect, useRef } from "react";

export default function Dots() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const dots = [];

    const getDotCount = () =>
      Math.floor((window.innerWidth * window.innerHeight) / 6000);

    const getRandomColor = () => {
      const lightRed = `rgba(255, ${Math.floor(
        Math.random() * 100
      )}, ${Math.floor(Math.random() * 100)}, 1)`;
      const lightBlue = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
        Math.random() * 100
      )}, 255, 1)`;
      return Math.random() < 0.5 ? lightRed : lightBlue;
    };

    const initDots = () => {
      dots.length = 0;
      for (let i = 0; i < getDotCount(); i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          color: getRandomColor(),
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
      });

      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x <= 0 || dot.x >= width) dot.vx *= -1;
        if (dot.y <= 0 || dot.y >= height) dot.vy *= -1;
      });

      requestAnimationFrame(draw);
    };

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    };

    window.addEventListener("resize", resizeHandler);
    initDots();
    draw();

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="dots-canvas" />
      <style jsx>{`
        .dots-canvas {
          position: absolute;
          inset: 0;
          z-index: 0; /* LOWER than content but HIGHER than the ConnectingDots */
          width: 100%;
          height: 100%;
          background: transparent;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
