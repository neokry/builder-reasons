import Link from "next/link";

export const Header = () => {
  return (
    <div className="py-6 mb-6 border-b">
      <div className="w-max">
        <Link href="/">
          <div className="text-2xl font-light ">Buider Votes</div>
        </Link>
      </div>
    </div>
  );
};
