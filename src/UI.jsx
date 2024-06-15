import React, {useState} from "react";

export function Toggle({on, setOn}) {
  return (
    <div className={`pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out ${on?"bg-indigo-600 ring-black/20":"bg-slate-900/10 ring-slate-900/5"}`} onClick={()=>(setOn(!on))}>
      <div className={`h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out ${on?"translate-x-4":""}`}></div>
    </div>
  );
}

/**
 * 참조 링크
 * @param {String} location 링크
 * @param {String} children 내용
 * @returns 
 */
export function Reference({ location, children}) {
  return (
    <>
      <a href={location} className="text-blue-400 hover:text-blue-500" target="_blank">
        {children}
      </a>
    </>
  );
}

export function Menu() {
  const [on, setOn] = useState(false);
  return (
    <>
      <div
        className="fixed border-2 border-slate-300 top-4 left-4 w-10 h-10 rounded-xl flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
        onClick={() => setOn(true)}
      >
        <div>
        ☰

        </div>
      </div>
      <div
        className={`fixed top-1/3 left-1/3 w-1/3 h-1/3 flex justify-center items-center rainbow z-10 rounded-xl ${
          on ? "block" : "hidden"
        }`}
      >
        <div
          className="absolute border-2 border-slate-300 w-10 h-10 rounded-xl right-4 top-4 z-12 flex justify-center items-center font-bold hover:bg-slate-200 cursor-pointer"
          onClick={() => setOn(false)}
        >
          <div>
          X</div>
        </div>

        <div
          className={`w-full h-[92%] mx-2 bg-slate-50 z-11 rounded-xl ${
            on ? "block" : "hidden"
          }`}
        >
          <div className="mt-6 ml-8 title-font text-lg z-11">
            과제연구 3 - MCTS
            <br />
            <br />
            github:{" "}
            <Reference location="https://github.com/qpalrara/MCTS" blank={true}>
            링크
            </Reference>
            <br />
            <br />
            ㅇㅅㅇ
            <br/>
            <br/>
            ㅇㅁㅇ
          </div>
        </div>
      </div>
    </>
  );
}