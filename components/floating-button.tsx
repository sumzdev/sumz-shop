import Link from "next/link";
import React from "react";

interface FloatingButton {
  children: React.ReactNode;
  text: string;
  href: string;
}

export default function FloatingButton({
  children,
  href,
  text,
}: FloatingButton) {
  return (
    <Link
      href={href}
      className="fixed hover:bg-slate-700 border-0 border-transparent transition-colors cursor-pointer bottom-24 right-5 shadow-xl bg-slate-500 flex items-center justify-center text-white py-3 px-4 rounded-full"
    >
      {children}
      <p className="text-md ml-2 pr-2">{text}</p>
    </Link>
  );
}
