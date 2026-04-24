export interface PaymentDto {
  id?: string
  contributionId?: string
  receiptId?: string | null
  amount?: number
  currency?: string
  method?: string
  status?: string
  providerReference?: string | null
  createdAt?: string
  processedAt?: string | null
  Id?: string
  ContributionId?: string
  ReceiptId?: string | null
  Amount?: number
  Currency?: string
  Method?: string
  Status?: string
  ProviderReference?: string | null
  CreatedAt?: string
  ProcessedAt?: string | null
}

export interface PaymentRow {
  id: string
  contributionId: string
  receiptId: string | null
  providerReference: string
  method: string
  status: string
  amount: string
  createdAt: string
}
