import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-around h-[60vh]">
      <Image alt="spinner" src="/spinner.svg" width={20} height={20} />
    </div>
  );
}
