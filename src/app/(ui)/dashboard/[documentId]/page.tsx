import { db } from "@/app/db";
import RoomInstance from "@/components/code-editor/RoomInstance";
import React from "react";

export default async function page({
  params,
}: {
  params: { documentId: string };
}) {
  const document = await db.documents.findFirst({
    where: {
      id: params.documentId,
    },
  });

  return (
    <RoomInstance
      documentId={params.documentId}
      progLang={document?.language ? document.language : "javascript"}
    />
  );
}
