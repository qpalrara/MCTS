export default function Tile({
  index,
  board,
  setBoard,
  play,
  autoplayOn,
  size = 3,
}) {
  const value = board[index];
  return (
    <div
      onClick={() => {
        const newBoard = [...board];
        newBoard[index] = 1;
        setBoard(newBoard);
        if (autoplayOn) play(newBoard);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        const newBoard = [...board];
        newBoard[index] = 2;
        setBoard(newBoard);
      }}
      className={`w-full aspect-square hover:bg-gray-200 cursor-pointer
      text-center flex justify-center items-center font-semibold
      ${value === 1 ? "text-blue-500" : value === 2 ? "text-red-500" : ""}`}
      style={{
        fontSize:
          size === 3 ? "var(--tile-width)" : "calc(var(--tile-width)/5.2)",
        border: size === 3 ? "var(--border-width) solid black":"calc(var(--border-width)/2) solid black",
      }}
    >
      {value === 1 ? "O" : value === 2 ? "X" : ""}
    </div>
  );
}
