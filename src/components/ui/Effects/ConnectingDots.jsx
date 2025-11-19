"use client";

import { useEffect, useRef } from "react";

// ANIMATED BACKGROUND WITH INTERACTIVE CONNECTING DOTS
export default function ConnectingDots() {
  const canvasRef = useRef(null);
  const visibilityRadius = 800;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    const mouse = { x: null, y: null };
    const dots = [];
    const connectRadius = 100;
    const revealRadius = 300;
    const maxDotDistance = 150;

    // CALCULATES NUMBER OF DOTS BASED ON SCREEN SIZE
    const getDotCount = () => {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 8000);
      return Math.max(200, Math.min(count, 3000));
    };

    // GENERATES RANDOM COLOR FOR DOTS
    const getRandomColor = () => {
      const lightRed = `rgba(255, ${Math.floor(
        Math.random() * 100
      )}, ${Math.floor(Math.random() * 100)}, 1)`;
      const lightBlue = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(
        Math.random() * 100
      )}, 255, 1)`;
      return Math.random() < 0.5 ? lightRed : lightBlue;
    };

    // GENERATES ARRAY OF DOT OBJECTS
    const generateDots = () => {
      dots.length = 0;
      const numDots = getDotCount();
      for (let i = 0; i < numDots; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.8 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: getRandomColor(),
        });
      }
    };

    // SETS CANVAS DIMENSIONS TO MATCH WINDOW SIZE
    const setupCanvasSize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // DRAWS DOTS AND CONNECTIONS ON CANVAS
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        let alpha = 1;

        if (mouse.x !== null && mouse.y !== null) {
          const distToMouse = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
          if (distToMouse > visibilityRadius) {
            return;
          } else {
            alpha = 1 - distToMouse / visibilityRadius;
          }
        }

        ctx.beginPath();
        ctx.globalAlpha = alpha;
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (mouse.x !== null && mouse.y !== null) {
        dots.forEach((dot) => {
          const distToMouse = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
          if (distToMouse < connectRadius) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(120, 180, 255, ${
              1.4 - distToMouse / connectRadius
            })`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });

        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const d1 = dots[i];
            const d2 = dots[j];
            const distBetween = Math.hypot(d1.x - d2.x, d1.y - d2.y);
            const d1ToMouse = Math.hypot(d1.x - mouse.x, d1.y - mouse.y);
            const d2ToMouse = Math.hypot(d2.x - mouse.x, d2.y - mouse.y);

            if (
              distBetween < maxDotDistance &&
              d1ToMouse < revealRadius &&
              d2ToMouse < revealRadius
            ) {
              ctx.beginPath();
              ctx.moveTo(d1.x, d1.y);
              ctx.lineTo(d2.x, d2.y);
              ctx.strokeStyle = `rgba(100, 149, 237, ${
                1 - distBetween / maxDotDistance
              })`;
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        }
      }

      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x <= 0 || dot.x >= width) dot.vx *= -1;
        if (dot.y <= 0 || dot.y >= height) dot.vy *= -1;
      });

      requestAnimationFrame(draw);
    };

    // HANDLES WINDOW RESIZE EVENT
    const handleResize = () => {
      setupCanvasSize();
      generateDots();
    };

    handleResize();

    // UPDATES MOUSE POSITION ON MOVE
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="connecting-dots-canvas" />
      <style jsx>{`
        .connecting-dots-canvas {
          position: fixed;
          top: 0;
          left: 0;
          z-index: -1;
          width: 100vw;
          height: 100vh;
          background: #1a1a1a;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
