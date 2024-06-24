import { useState, useEffect } from "react";
import { Toggle } from "./UI";
import { isWin } from "./engine";

export default function Header({
  size,
  setSize,
  board,
  n,
  setN,
  simulationCount,
  setSimulationCount,
  loading,
  setLoading,
  near,
  setNear,
  nearSimul,
  setNearSimul,
}) {
  const [on, setOn] = useState(size !== 3);
  useEffect(() => {
    setSize(on ? 15 : 3);
  }, [on]);
  return (
    <header
      className="relative flex justify-end top-0 w-full border-b-0 border-b-gray-300"
      style={{ height: "var(--header-height)" }}
    >
      <Menu />
      <Setting
        n={n}
        setN={setN}
        simulationCount={simulationCount}
        setSimulationCount={setSimulationCount}
        loading={loading}
        setLoading={setLoading}
        near={near}
        setNear={setNear}
        nearSimul={nearSimul}
        setNearSimul={setNearSimul}
      />
      <div
        className={`absolute w-full text-font text-5xl font-semibold text-center top-5 ${
          isWin(board, true) === 2 ? "text-red-400" : "text-blue-400"
        }`}
      >
        {!!isWin(board, true) && "플레이어 " + isWin(board, true) + " 승리"}
      </div>
      <div className="relative flex top-5">
        <p
          className={`title-font mx-4 text-xl ${
            size === 3 ? "text-red-400" : "text-black"
          }`}
        >
          틱택토
        </p>
        <Toggle on={on} setOn={setOn} />
        <p
          className={`title-font mx-4 text-xl ${
            size === 15 ? "text-red-400" : "text-black"
          }`}
        >
          오목
        </p>
      </div>
    </header>
  );
}

function Menu() {
  const [on, setOn] = useState(false);
  return (
    <>
      <div
        className="absolute border-2 border-slate-300 top-4 left-4 w-10 h-10 rounded-xl flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
        onClick={() => setOn(true)}
      >
        <div>☰</div>
      </div>
      <div
        className="absolute w-screen h-screen justify-center items-center z-10"
        style={{
          backgroundColor: "rgba(229,231,235,0.5)",
          display: on ? "flex" : "none",
        }}
      >
        <div className="relative min-w-[400px] min-h-[160px] rainbow-border rounded-xl">
          <div
            className="absolute w-10 h-10 border-2 border-slate-300 rounded-xl right-4 top-4 z-[12] flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
            onClick={() => setOn(false)}
          >
            <div>X</div>
          </div>
          <div className="absolute w-full h-full pt-8 pl-8 border-0 border-transparent bg-transparent title-font text-lg z-11">
            과제연구 3 - MCTS
            <br />
            <br />
            github:{" "}
            <a href="https://github.com/qpalrara/MCTS" target="_blank">
              링크
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function Setting({
  n,
  setN,
  simulationCount,
  setSimulationCount,
  loading,
  setLoading,
  near,
  setNear,
  nearSimul,
  setNearSimul,
}) {
  const [on, setOn] = useState(false);
  return (
    <>
      <div
        className="absolute border-2 border-slate-300 top-4 left-16 w-10 h-10 rounded-xl flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
        onClick={() => setOn(true)}
      >
        <i className="fa fa-gear"></i>
      </div>
      <div
        className="absolute w-screen h-screen justify-center items-center z-10"
        style={{
          backgroundColor: "rgba(229,231,235,0.5)",
          display: on ? "flex" : "none",
        }}
      >
        <div className="relative min-w-[500px] min-h-[380px] text-end rainbow-border rounded-xl">
          <div
            className="absolute w-10 h-10 border-2 border-slate-300 rounded-xl right-4 top-4 z-[12] flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
            onClick={() => setOn(false)}
          >
            <div>X</div>
          </div>
          <div
            className="absolute w-full h-full title-font text-lg"
            id="setting"
          >
            <p className="flex justify-center text-2xl font-semibold col-span-2 text-cetner pt-5">
              <i className="fa fa-gear pt-1"></i>&nbsp;&nbsp;Setting
            </p>
            <p>실행 시간 표시</p>
            <div className="ml-12">
              <Toggle on={loading} setOn={setLoading} />
            </div>
            <p className="text-red-400">근처 칸만 확장</p>
            <div className="ml-12">
              <Toggle on={near} setOn={setNear} />
            </div>
            <p className="text-red-400">플레이아웃에서 근처 칸만 탐색</p>
            <div className="ml-12">
              <Toggle on={nearSimul} setOn={setNearSimul} />
            </div>
            <div className="relative w-full col-span-2 mt-2">
              <span className="text-blue-400">
                n_iteration:{" "}
                <input
                  type="text"
                  className="absolute bg-transparent -top-6 right-28 px-1 border-2 border-slate-300 border-solid h-7"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  style={{ width: `${n.toString().length + 1}ch` }}
                />
              </span>
              <span className="mr-4 ml-8">0</span>
              <input
                className="cursor-pointer"
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={n}
                onChange={(e) => setN(e.target.value)}
              />
              <span className="mx-4">50000</span>
            </div>
            <div className="relative w-full col-span-2">
              <span className="text-green-400">
                simulation_count:{" "}
                <input
                  type="text"
                  className="absolute bg-transparent -top-6 right-32 px-1 border-2 border-slate-300 border-solid h-7 slider"
                  value={simulationCount}
                  onChange={(e) => setSimulationCount(e.target.value)}
                  style={{
                    width: `${simulationCount.toString().length + 1}ch`,
                  }}
                />
              </span>
              <span className="mr-4 ml-8">0</span>
              <input
                className="cursor-pointer"
                type="range"
                min="0"
                max="100"
                step="1"
                value={simulationCount}
                onChange={(e) => setSimulationCount(e.target.value)}
              />
              <span className="mx-4 mr-[42px]">100</span>
            </div>
            <p className="text-red-400 col-span-2 text-center">
              * 해당 옵션 활성화 시 더 많은 시간이 소요됨
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
