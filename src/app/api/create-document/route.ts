import { db } from "@/app/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: NextResponse) => {
  const { name, language } = await req.json();
  const user = await currentUser();
  if (!user) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  try {
    const document = await db.documents.create({
      data: {
        name,
        language,
        userId: user.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request, res: NextResponse) => {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  try {
    const documents = await db.documents.findMany({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json(documents);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
