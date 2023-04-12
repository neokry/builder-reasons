import Link from "next/link";

export const Header = () => {
  return (
    <div className="py-6 mb-6 border-b">
      <Link href="/">
        <div className="text-2xl font-bold">Vote with reason</div>
      </Link>
    </div>
  );
};
