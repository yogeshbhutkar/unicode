"use client";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function OutputWindow({
  outputDetails,
}: {
  outputDetails: any;
}) {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="px-2 py-1 font-normal text-sm text-red-500">
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-sm text-green-500">
          {atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 font-normal text-sm text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-sm text-red-500">
          {atob(outputDetails?.stderr)}
        </pre>
      );
    }
  };

  return (
    <ScrollArea className="h-[38vh] w-[25vw] text-green-500 p-4 bg-[#222222]">
      <div className="flex">
        <span className="text-green-500 mr-2">$</span>
        {outputDetails ? <>{getOutput()}</> : null}
      </div>
    </ScrollArea>
  );
}
