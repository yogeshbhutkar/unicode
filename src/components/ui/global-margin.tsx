import React from "react";

export default function GlobalMargin({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="my-10 mx-40 h-[calc(100vh-14)]">{children}</div>;
}
