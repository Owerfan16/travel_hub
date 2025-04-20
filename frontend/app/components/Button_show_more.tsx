"use client";

import Image from "next/image";

interface ButtonShowMoreProps {
  onClick: () => void;
  isLoading?: boolean;
}

export default function ButtonShowMore({
  onClick,
  isLoading = false,
}: ButtonShowMoreProps) {
  return (
    <div className="pb-[157px] flex justify-center mt-8">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="py-[14px] px-[20px] h-[48px] bg-[var(--color-btn-search-background)] hover:bg-[var(--color-btn-search-background-hover)] disabled:opacity-70 text-white rounded-2xl flex items-center"
      >
        {isLoading ? "Загрузка..." : "Показать ещё"}
      </button>
    </div>
  );
}
