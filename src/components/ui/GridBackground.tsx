"use client";

import React from "react";
import MovingBorderButton from "./moving-border-button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function GridBackground({
  text,
  subtext,
}: {
  text: string;
  subtext?: string;
}) {
  const router = useRouter();

  const { isSignedIn } = useUser();

  return (
    <>
      <div className="h-screen w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div>
          <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 pt-8 pb-2">
            {text}
          </p>
          <p className="font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 text-center text-2xl">
            {subtext}
          </p>
          <div className="flex items-center justify-center mt-14">
            <div
              className="w-full flex items-center justify-center"
              onClick={() => {
                if (isSignedIn) {
                  router.push("/dashboard");
                } else {
                  router.push("/sign-in");
                }
              }}
            >
              <MovingBorderButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
