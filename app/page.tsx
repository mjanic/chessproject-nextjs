import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-10 pt-20 gap-4 relative h-[100vh]">
      <Image
        className="object-cover z-0"
        src="/chess1.jpeg"
        alt="chess1"
        fill={true}
      />
      <h1 className="text-white text-center text-4xl z-10">
        Improve Chess Openings
      </h1>
      <Button className="z-10 text-2xl rounded-xl bg-gray-300 shadow-lg px-10 py-4 text-green-700">
        <a href="/practice">
          <h2>GO</h2>
        </a>
      </Button>
    </div>
  );
}
