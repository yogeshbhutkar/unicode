import React from "react";
import { Button } from "./moving-border";
import { ArrowRight } from "lucide-react";

export default function MovingBorderButton() {
  return (
    <div>
      <Button
        borderRadius="1.0rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        <span>Get Started</span>
        <span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </span>
      </Button>
    </div>
  );
}
