"use client";
import React, { useState } from "react";
const languages = ["RU", "KZ", "EN"];
import { useTheme } from "../context/ThemeContext";

export default function LanguageSwitcher() {
  const [active, setActive] = useState("RU");
  const activeIndex = languages.indexOf(active);
  const { theme } = useTheme();

  return (
    <div
      className={`relative w-[106px] h-[30px] rounded-full overflow-hidden text-[14px] font-medium ${
        theme === "light" ? "bg-[#287DC4]" : "bg-[#002238]"
      }`}
    >
      <div
        className={`absolute top-[2px] left-[2px] h-[26px] w-[34px] rounded-full transition-transform duration-300 border-1 ${
          theme === "light"
            ? "bg-white border-[#287DC4]"
            : "bg-[#a2d4fd] border-[#002238]"
        }`}
        style={{ transform: `translateX(${activeIndex * 34}px)` }}
      />

      <div className="relative flex h-full pl-[2px]">
        {languages.map((lang) => (
          <div
            key={lang}
            className="w-[34px] h-[30px] flex items-center justify-center cursor-pointer"
            onClick={() => setActive(lang)}
          >
            <span
              className={`transition-colors duration-300 z-10 ${
                active === lang
                  ? theme === "light"
                    ? "text-[#0070BF]"
                    : "text-[#09283F]"
                  : "text-white"
              }`}
            >
              {lang}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
