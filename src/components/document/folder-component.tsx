import React from "react";
import DocumentAdd from "./document-add";

export default function FolderComponent() {
  return (
    <div className="w-full overflow-hidden relative h-[65vh] rounded-2xl p-10 text-xl font-bold text-white bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="flex justify-between items-center">
        <p>Your Folders</p>
        <DocumentAdd />
      </div>
    </div>
  );
}
