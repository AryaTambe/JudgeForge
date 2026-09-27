"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BeamsBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle: -35 + Math.random() * 10,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({
  className,
  children,
  intensity = "strong",
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);

  const opacityMap = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const totalBeams = 30;

      beamsRef.current = Array.from(
        { length: totalBeams },
        () => createBeam(width, height)
      );
    };

    updateCanvasSize();

    window.addEventListener("resize", updateCanvasSize);

    function resetBeam(
      beam: Beam,
      index: number,
      totalBeams: number
    ) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const column = index % 3;
      const spacing = width / 3;

      beam.y = height + 100;

      beam.x =
        column * spacing +
        spacing / 2 +
        (Math.random() - 0.5) * spacing * 0.5;

      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = 190 + (index * 70) / totalBeams;
      beam.opacity = 0.2 + Math.random() * 0.1;

      return beam;
    }

    function drawBeam(
      context: CanvasRenderingContext2D,
      beam: Beam
    ) {
      context.save();

      context.translate(beam.x, beam.y);
      context.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity =
        beam.opacity *
        (0.8 + Math.sin(beam.pulse) * 0.2) *
        opacityMap[intensity];

      const gradient = context.createLinearGradient(
        0,
        0,
        0,
        beam.length
      );

      gradient.addColorStop(
        0,
        `hsla(${beam.hue}, 85%, 65%, 0)`
      );

      gradient.addColorStop(
        0.1,
        `hsla(${beam.hue}, 85%, 65%, ${
          pulsingOpacity * 0.5
        })`
      );

      gradient.addColorStop(
        0.4,
        `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
      );

      gradient.addColorStop(
        0.6,
        `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
      );

      gradient.addColorStop(
        0.9,
        `hsla(${beam.hue}, 85%, 65%, ${
          pulsingOpacity * 0.5
        })`
      );

      gradient.addColorStop(
        1,
        `hsla(${beam.hue}, 85%, 65%, 0)`
      );

      context.fillStyle = gradient;

      context.fillRect(
        -beam.width / 2,
        0,
        beam.width,
        beam.length
      );

      context.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      ctx.filter = "blur(35px)";

      const totalBeams = beamsRef.current.length;

      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }

        drawBeam(ctx, beam);
      });

      animationFrameRef.current =
        requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener(
        "resize",
        updateCanvasSize
      );

      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [intensity]);

  return (
    <div
      className={cn(
        "relative min-h-[620px] w-full overflow-hidden bg-neutral-950",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      <motion.div
        className="absolute inset-0 bg-neutral-950/10"
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          backdropFilter: "blur(50px)",
        }}
      />

      <div className="relative z-10 flex min-h-[620px] w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}