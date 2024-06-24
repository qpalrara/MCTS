import { useState } from "react";

export function Toggle({ on, setOn }) {
  return (
    <div
      className={`pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out ${
        on ? "bg-indigo-600 ring-black/20" : "bg-slate-900/10 ring-slate-900/5"
      }`}
      onClick={() => setOn(!on)}
    >
      <div
        className={`h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out ${
          on ? "translate-x-4" : ""
        }`}
      ></div>
    </div>
  );
}

export function BoardSetting({ setBoard }) {
  const [on, setOn] = useState(false);
  const [text, setText] = useState("");
  return (
    <>
      <button
        className="bg-violet-400 hover:bg-violet-500 text-white w-36 h-20 text-4xl font-semibold px-4 py-2 mx-20 my-2 rounded-lg"
        onClick={() => setOn(true)}
      >
        설정
      </button>
      <div
        className="absolute top-0 left-0 w-screen h-screen justify-center items-center z-10"
        style={{
          backgroundColor: "rgba(229,231,235,0.5)",
          display: on ? "flex" : "none",
        }}
      >
        <div className="relative min-w-[500px] min-h-[300px] rainbow-border rounded-xl">
          <div
            className="absolute w-10 h-10 border-2 border-slate-300 rounded-xl right-4 top-4 z-20 flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
            onClick={() => setOn(false)}
          >
            <div>X</div>
          </div>
          <div className="absolute w-full h-full px-8 text-font font-medium text-lg">
            <p className="flex justify-center text-2xl font-semibold col-span-2 text-cetner pt-5 title-font">
              <i className="fa fa-gear pt-1"></i>&nbsp;&nbsp;보드 설정
            </p>
            <br />
            <p>
              입력한 보드를 불러옵니다.
              <br />
              <span className="bg-blue-200 text-blue-400 rounded-lg px-2 py-1">
                alt
              </span>{" "}
              +{" "}
              <span className="bg-blue-200 text-blue-400 rounded-lg px-2 py-1">
                c
              </span>{" "}
              로 보드를 클립보드에 저장할 수 있습니다.
            </p>
            <input
              type="text"
              className="w-full h-12 px-4 border-2 border-slate-300 rounded-lg mt-4"
              placeholder="보드를 입력하세요."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="relative top-4 flex flex-row gap-3">
              <button
                className="relative w-10 h-10 border-2 border-slate-300 rounded-xl z-20 flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
                onClick={() =>
                  setText(
                    "000000000000000000000000000000000000000000000000000000000000000000001000000000001020000000000000211100000000002022100000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000"
                  )
                }
              >
                <p>1</p>
              </button>
              <button
                className="relative w-10 h-10 border-2 border-slate-300 rounded-xl z-20 flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
                onClick={() =>
                  setText(
                    "000000000000000000000000000000000000000000000000000000000000000000002000000000002010000000000000122200000000001011200000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000"
                  )
                }
              >
                <p>2</p>
              </button>
              <button className="relative w-10 h-10 border-2 border-slate-300 rounded-xl z-20 flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
                onClick={() =>
                  setText(
                    "000000000000000000000000000000000010000000000000121000000000000121000000000000120011001000000000020020000000000000200000000000012100000000000012100000000000012100000000000001000000000000000000000000000000000000000000000000000"
                  )
                }>
                <p>3</p>
              </button>
              <button
                className="relative w-10 h-10 border-2 border-slate-300 rounded-xl z-20 flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
                onClick={() =>
                  setText(
                    "000000000000000000000000000000000000000000000000000000000000000000000000000000000000210000000000210200000000000122200000000000121100000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000"
                  )
                }
              >
                <p>4</p>
              </button>
              <button className="relative w-10 h-10 border-2 border-slate-300 rounded-xl z-20 flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
                onClick={() =>
                  setText(
                    "000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000022100000000000120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
                  )
                }>
                <p>5</p>
              </button>
            </div>
            <button
              className="absolute top-[216px] left-[348px] bg-blue-400 hover:bg-blue-500 text-white text-xl font-semibold px-4 py-2 rounded-lg"
              onClick={() => {
                setBoard(text.split("").map((i) => parseInt(i)));
                setText("");
                setOn(false);
              }}
            >
              불러오기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
