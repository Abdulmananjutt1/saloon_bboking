-- CreateTable
CREATE TABLE "stylist_availability" (
    "id" TEXT NOT NULL,
    "stylistId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "isWorking" BOOLEAN NOT NULL DEFAULT true,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "stylist_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salon_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salon_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stylist_availability_stylistId_dayOfWeek_key" ON "stylist_availability"("stylistId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "salon_settings_key_key" ON "salon_settings"("key");

-- AddForeignKey
ALTER TABLE "stylist_availability" ADD CONSTRAINT "stylist_availability_stylistId_fkey" FOREIGN KEY ("stylistId") REFERENCES "stylists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
