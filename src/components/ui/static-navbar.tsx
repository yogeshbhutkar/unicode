"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";
import { Room } from "../code-editor/Room";
import { Avatars } from "../code-editor/Avatars";
import { useAtom } from "jotai";
import { roomId } from "@/store/atoms";

export default function Navbar() {
  const [id] = useAtom(roomId);
  const router = useRouter();
  return (
    <div className="border border-slate-800 ">
      <div className="flex items-center h-14 justify-between mx-40">
        <button
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <span className="font-semibold text-slate-300">Unified Code</span>
        </button>
        <div className="flex">
          <UserButton afterSignOutUrl="/" />
          <Room id={id}>
            <Avatars />
          </Room>
        </div>
      </div>
    </div>
  );
}
