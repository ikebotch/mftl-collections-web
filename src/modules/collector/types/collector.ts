export interface CollectorEventRow {
  id: string
  title: string
  location: string
  shift: string
}

export interface CollectorReceipt {
  id: string
  amount: string
  status: string
  receiptNumber: string
}
