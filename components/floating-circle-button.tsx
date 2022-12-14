import Link from "next/link";
import React from "react";

interface FloatingButton {
  children: React.ReactNode;
  href: string;
}

export default function FloatingCirdleButton({
  children,
  href,
}: FloatingButton) {
  return (
    <Link
      href={href}
      className="fixed hover:bg-slate-700 border-0 aspect-square border-transparent transition-colors cursor-pointer  bottom-24 right-5 shadow-xl bg-slate-500 rounded-full w-14 flex items-center justify-center text-white"
    >
      {children}
    </Link>
  );
}
