export interface ReceiptListItemDto {
  id?: string
  receiptNumber?: string
  status?: string
  issuedAt?: string
  eventTitle?: string
  recipientFundName?: string
  amount?: number
  currency?: string
  contributorName?: string
  contributionStatus?: string
  paymentStatus?: string
  paymentMethod?: string
  Id?: string
  ReceiptNumber?: string
  Status?: string
  IssuedAt?: string
  EventTitle?: string
  RecipientFundName?: string
  Amount?: number
  Currency?: string
  ContributorName?: string
  ContributionStatus?: string
  PaymentStatus?: string
  PaymentMethod?: string
}

export interface ReceiptDto extends ReceiptListItemDto {
  tenantId?: string
  eventId?: string
  recipientFundId?: string
  contributionId?: string
  paymentId?: string | null
  recordedByUserId?: string | null
  note?: string | null
  TenantId?: string
  EventId?: string
  RecipientFundId?: string
  ContributionId?: string
  PaymentId?: string | null
  RecordedByUserId?: string | null
  Note?: string | null
}

export interface ReceiptRow {
  id: string
  receiptNumber: string
  status: string
  issuedAt: string
  eventTitle: string
  recipientFundName: string
  amount: string
  contributorName: string
  contributionStatus: string
  paymentStatus: string
  paymentMethod: string
}

export interface ReceiptDetail extends ReceiptRow {
  tenantId: string
  eventId: string
  recipientFundId: string
  contributionId: string
  paymentId: string | null
  recordedByUserId: string | null
  note: string
}
