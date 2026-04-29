import { httpClient as api } from '@/core/api/httpClient'

export interface CurrencyTotal {
  currency: string
  amount: number
}

export interface RecentContribution {
  contributorName: string
  amount: number
  currency: string
  date: string
  status: string
  eventTitle?: string
  paymentMethod?: string
}

export interface DashboardSummary {
  totalEvents: number
  totalContributions: number
  totals: CurrencyTotal[]
  activeRecipientFunds: number
  totalCollectors: number
  totalDonors: number
  totalReceipts: number
  recentContributions: RecentContribution[]
  isAuth0Configured: boolean
  isAuth0WebhookConfigured: boolean
}

export async function getDashboardSummary(params?: { 
  tenantId?: string; 
  branchId?: string 
}): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>('/dashboards/admin', { params })
  return response.data
}
