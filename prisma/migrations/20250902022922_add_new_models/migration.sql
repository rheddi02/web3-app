-- CreateTable
CREATE TABLE "public"."Invite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InviteTags" (
    "inviteeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "InviteTags_pkey" PRIMARY KEY ("inviteeId","tagId")
);

-- CreateTable
CREATE TABLE "public"."Favorites" (
    "userId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("userId","inviteeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "public"."Tags"("name");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "public"."User"("id");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "public"."User"("name");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."InviteTags" ADD CONSTRAINT "InviteTags_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "public"."Invite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InviteTags" ADD CONSTRAINT "InviteTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorites" ADD CONSTRAINT "Favorites_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "public"."Invite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
