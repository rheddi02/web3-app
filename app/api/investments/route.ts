import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request
    console.log("🚀 ~ GET ~ body:", body)

    const investments = await prisma.investment.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        {
          isInvited: "asc",
        },
        { date: "asc" },
      ],
    });

    return NextResponse.json({ investments });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Create new investment
    const investment = await prisma.investment.create({
      data: {
        ...body,
        user: {
          connect: {
            id: session.user.id!,
          },
        },
      },
    });

    return NextResponse.json({ investment }, { status: 201 });
  } catch (error) {
    console.error("Error creating investment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
