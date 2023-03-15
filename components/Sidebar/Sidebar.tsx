"use client";

import { useState } from "react";
import { useSupabase } from "../supabase-provider";
import Account from "./Account";
import Explorer from "./Explorer/Explorer";
import Upload from "./Upload";

export default function Sidebar() {
  const { user } = useSupabase();
  const [mode, setMode] = useState<number>(-1);

  const handleChange = (m: number) => {
    if (mode != m) setMode(m);
    else setMode(-1);
  };

  return (
    <>
      {/* Menu */}
      <div className="left-0 h-full w-[48px] flex-shrink-0 whitespace-normal bg-bg-dark" >
        <ul>
          {user ?
            <li onClick={() => handleChange(0)} className={`w-12 h-12 flex justify-center items-center cursor-pointer group${mode === 0 ? " border-l-text-light border-l-2" : ""}`}>
              <svg className={`w-5 h-5 ${mode === 0 ? "stroke-text-light" : "stroke-text-medium group-hover:stroke-text-light"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </li>
            :
            <li onClick={() => handleChange(1)} className={`w-12 h-12 flex justify-center items-center cursor-pointer group${mode === 1 ? " border-l-text-light border-l-2" : ""}`}>
              <svg className={`w-5 h-5 ${mode === 1 ? "stroke-text-light" : "stroke-text-medium group-hover:stroke-text-light"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </li>
          }
          <li onClick={() => handleChange(2)} className={`w-12 h-12 flex justify-center items-center cursor-pointer group${mode === 2 ? " border-l-text-light border-l-2" : ""}`}>
            <svg className={`w-5 h-5 ${mode === 2 ? "stroke-text-light" : "stroke-text-medium group-hover:stroke-text-light"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </li>
        </ul>
      </div >
      {/* Sidebar */}
      <div className="left-12 h-full whitespace-nowrap bg-bg-dark overflow-hidden flex-shrink-0" style={{ width: mode > -1 ? 256 : 0 }}>
        {/* Don't conditionally render to keep folder states. Just hide the explorer. */}
        {user && <div className={mode === 0 ? "block h-full" : "hidden"}>
          <Explorer />
        </div>}
        {{
          1: <Upload />,
          2: <Account />
        }[mode]}
      </div >
    </>
  );
}
