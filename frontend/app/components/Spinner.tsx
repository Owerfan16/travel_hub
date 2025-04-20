"use client";

export const Spinner = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black z-[9999]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
    </div>
  );
};
