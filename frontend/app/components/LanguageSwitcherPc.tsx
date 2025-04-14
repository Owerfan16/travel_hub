"use client";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const languages = ["RU", "KZ", "EN"];

export default function LanguageSwitcherPC() {
  const [activeLang, setActiveLang] = useState("RU");

  return (
    <div className="flex space-x-6">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setActiveLang(lang)}
          className="relative text-[24px] transition pb-2 pt-[10px] cursor-pointer"
        >
          {lang}
          {activeLang === lang && (
            <span className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[30px] h-[3px] bg-[#3baeff] rounded-full transition-all duration-300" />
          )}
        </button>
      ))}
    </div>
  );
}
