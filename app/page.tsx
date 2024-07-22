import Board from "./Board";
import GameOptions from "./GameOptions";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Board />
      <GameOptions />
    </div>
  )
}
