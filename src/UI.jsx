import React, {useState} from "react";

export function Toggle({on, setOn}) {
  return (
    <div className={`pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out ${on?"bg-indigo-600 ring-black/20":"bg-slate-900/10 ring-slate-900/5"}`} onClick={()=>(setOn(!on))}>
      <div className={`h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out ${on?"translate-x-4":""}`}></div>
    </div>
  );
}
