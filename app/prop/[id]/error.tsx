"use client";

export default function ErrorComponent() {
  return (
    <div className="flex items-center justify-around h-[60vh]">
      <p className="text-red-500">
        Error generating vote data please refresh the page to try again
      </p>
    </div>
  );
}
