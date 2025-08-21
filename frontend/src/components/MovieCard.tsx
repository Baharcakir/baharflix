"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface MovieCardProps {
  id: number;
  title: string;
  image: string;
}

export default function MovieCard({ id, title, image }: MovieCardProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 640); // sm breakpoint
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  // karakter sınırı: küçük ekranda 5, büyük ekranda 10
  const limit = isSmallScreen ? 7 : 10;
  const isLong = title.length > limit;
  const displayTitle = isLong ? title.slice(0, limit) + "..." : title;

  return (
    <Link href={`/movie-detail/${id}`}>
      <div className="cursor-pointer hover:scale-105 transition-transform w-[120px] sm:w-[160px]">
        <Image
          src={image}
          alt={title}
          className="rounded-lg w-[120px] sm:w-[160px] h-[180px] sm:h-[240px] object-cover"
          width={120}
          height={180}
        />
        {/* Tooltip için title attribute */}
        <p
          className="mt-2 text-center text-white truncate block w-full"
          title={isLong ? title : ""}
        >
          {displayTitle}
        </p>
      </div>
    </Link>
  );
}
