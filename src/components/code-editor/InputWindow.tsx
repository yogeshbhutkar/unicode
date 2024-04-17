"use client";

import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

export default function InputWindow({
  setInputCB,
  input,
}: {
  setInputCB: (input: string) => void;
  input: string;
}) {
  return (
    <ScrollArea className="border border-t-slate-600 w-[25vw] h-full text-green-500 p-4 bg-[#222222]">
      <Textarea
        value={input}
        onChange={(e) => setInputCB(e.target.value)}
        placeholder="Enter input here..."
        className="bg-[#222222] border-none h-[35vh] focus:outline-none focus:border-none text-white placeholder:text-white"
      />
    </ScrollArea>
  );
}
