import Board from "../Board";
import GameOptions from "../GameOptions";

export default function Practice() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center">
      <Board />
      <GameOptions />
    </div>
  );
}
