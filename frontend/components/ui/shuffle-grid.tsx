"use client"

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const ShuffleHero = () => {
  return (
    <section className="w-full px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 sm:gap-8 lg:gap-16">
        {/* Left Text - Hidden on mobile, shown on larger screens */}
        <div className="hidden lg:flex flex-1 justify-end">
          <div className="text-right">
            <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Explore
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight -ml-4 lg:-ml-8">
              The Future
            </h2>
          </div>
        </div>
        
        {/* Mobile Title - Shown only on mobile */}
        <div className="block lg:hidden text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Explore The Future
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mt-1">
            ❤️
          </h2>
        </div>
        
        {/* Shuffle Grid - Responsive container */}
        <div className="relative flex-shrink-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl"></div>
          <div className="relative z-10">
            <ShuffleGrid />
          </div>
        </div>
        
        {/* Right Text - Hidden on mobile, shown on larger screens */}
        <div className="hidden lg:flex flex-1 justify-start">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              With Us
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-extrabold leading-tight ml-4 lg:ml-8">
              ❤️
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

const shuffle = (array: (typeof squareData)[0][]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1494790108755-2616c9c0e8d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-md sm:rounded-lg overflow-hidden bg-muted relative group cursor-pointer border hover:border-primary/50 transition-colors duration-300"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        aspectRatio: "1/1"
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white/90 rounded-full flex items-center justify-center">
          <svg className="w-2 h-2 sm:w-3 sm:h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());
    timeoutRef.current = setTimeout(shuffleSquares, 4000);
  };

  return (
    <div className="relative w-full mx-auto">
      {/* Responsive Grid Container */}
      <div className="
        grid grid-cols-4 grid-rows-4 
        w-full aspect-square
        gap-1 sm:gap-2 md:gap-3
        rounded-xl sm:rounded-2xl 
        overflow-hidden 
        shadow-lg sm:shadow-xl md:shadow-2xl 
        bg-background 
        border border-border/50
        max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[500px]
        mx-auto
      ">
        {squares.map((sq) => sq)}
      </div>
      
      {/* Background Glow Effect */}
      <div className="
        absolute -inset-2 sm:-inset-4 
        bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 
        rounded-2xl sm:rounded-3xl 
        -z-10 
        blur-xl sm:blur-2xl
      "></div>
    </div>
  );
};

export { ShuffleGrid };