"use client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center p-5 gap-3 h-screen text-sm">
      {children}
    </div>
  );
}
