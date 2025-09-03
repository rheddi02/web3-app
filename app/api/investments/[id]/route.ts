import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const investment = await prisma.investment.findUnique({ where: { id } });
    if (!investment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (investment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.investment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting investment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const existing = await prisma.investment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, amount, date, isInvited } = body as Partial<{
      name: string; email: string; amount: number; date: string; isInvited: boolean;
    }>;

    const updated = await prisma.investment.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(amount !== undefined ? { amount } : {}),
        ...(date !== undefined ? { date: new Date(date) } : {}),
        ...(isInvited !== undefined ? { isInvited } : {}),
      },
    });

    return NextResponse.json({ investment: updated });
  } catch (error) {
    console.error("Error updating investment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
