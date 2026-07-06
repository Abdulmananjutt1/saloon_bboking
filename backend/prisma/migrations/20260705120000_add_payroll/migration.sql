-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateTable: StylistPayRate
CREATE TABLE "stylist_pay_rates" (
    "id"          TEXT NOT NULL,
    "stylistId"   TEXT NOT NULL,
    "rateType"    TEXT NOT NULL DEFAULT 'COMMISSION', -- 'FLAT' | 'COMMISSION'
    "flatAmount"  INTEGER,                             -- used when rateType = FLAT
    "commissionPct" DOUBLE PRECISION,                  -- used when rateType = COMMISSION
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stylist_pay_rates_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "stylist_pay_rates" ADD CONSTRAINT "stylist_pay_rates_stylistId_fkey"
  FOREIGN KEY ("stylistId") REFERENCES "stylists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "stylist_pay_rates_stylistId_key" ON "stylist_pay_rates"("stylistId");

-- CreateTable: PayrollInvoice
CREATE TABLE "payroll_invoices" (
    "id"          TEXT NOT NULL,
    "stylistId"   TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd"   TIMESTAMP(3) NOT NULL,
    "totalAmount" INTEGER NOT NULL DEFAULT 0,
    "status"      "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "notes"       TEXT,
    "paidAt"      TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_invoices_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "payroll_invoices" ADD CONSTRAINT "payroll_invoices_stylistId_fkey"
  FOREIGN KEY ("stylistId") REFERENCES "stylists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: PayrollInvoiceItem
CREATE TABLE "payroll_invoice_items" (
    "id"          TEXT NOT NULL,
    "invoiceId"   TEXT NOT NULL,
    "bookingId"   TEXT,
    "description" TEXT NOT NULL,
    "amount"      INTEGER NOT NULL,
    "date"        TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_invoice_items_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "payroll_invoice_items" ADD CONSTRAINT "payroll_invoice_items_invoiceId_fkey"
  FOREIGN KEY ("invoiceId") REFERENCES "payroll_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
