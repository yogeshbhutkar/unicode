import React from "react";
import DocumentAdd from "./document-add";
import DisplayFiles from "./display-files";

export default function FileComponent() {
  return (
    <div className="w-full overflow-hidden relative h-[65vh] rounded-2xl p-10 text-xl font-bold text-white bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="flex justify-between items-center">
        <p>Your Files</p>
        <DocumentAdd />
      </div>
      <div className="mt-5">
        <DisplayFiles />
      </div>
    </div>
  );
}
