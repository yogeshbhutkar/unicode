"use client";

import React, { useEffect } from "react";
import { Room } from "./Room";
import { CollaborativeEditor } from "./CollaborativeEditor";
import { useAtom } from "jotai";
import { roomId } from "@/store/atoms";

export default function RoomInstance({
  documentId,
  progLang,
}: {
  documentId: string;
  progLang: string;
}) {
  const [, setRoomId] = useAtom(roomId);

  useEffect(() => {
    setRoomId(documentId);
  }, [documentId, setRoomId]);
  return (
    <Room id={documentId}>
      <div className="h-full flex-col">
        <div className="">
          <CollaborativeEditor progLang={progLang} />
        </div>
      </div>
    </Room>
  );
}
