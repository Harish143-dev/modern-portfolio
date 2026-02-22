"use client";

export default function Loader() {
  return (
    <div
      id="loader"
      className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center"
    >
      <h1 className="loader-text heading tracking-wider text-2xl md:text-3xl overflow-hidden">
        <span className="inline-block">Hello</span>
      </h1>
    </div>
  );
}
