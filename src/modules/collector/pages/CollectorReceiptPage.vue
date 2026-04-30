<template>
  <!--
    Breakpoints
    phone  < 768px : full-screen receipt, centered success icon, stacked action buttons
    tablet 768–1199: contained card receipt, 3-col action buttons
    desktop >= 1200: content-width card, split view if needed
  -->
  <div class="pb-28 md:pb-8 space-y-0 md:space-y-8">

    <!-- Loading / Error -->
    <LoadingState v-if="query.isLoading.value" text="Loading receipt…" />
    <ErrorState
      v-else-if="query.isError.value"
      title="Receipt Not Found"
      :message="query.error.value?.message ?? 'The receipt link may be invalid or expired.'"
      show-retry
      @retry="query.refetch"
    />

    <template v-else-if="query.data.value">

      <!-- ══════════════════════════════════════════════════
           PHONE HEADER  (< 768 px)
           Close button + share icon  (mobile-app style)
      ══════════════════════════════════════════════════ -->
      <header class="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button class="w-10 h-10 flex items-center justify-center" @click="$router.push('/collector/history')">
          <X class="w-5 h-5 text-slate-600" />
        </button>
        <p class="text-sm font-black text-slate-900 uppercase tracking-tight">Receipt</p>
        <button class="w-10 h-10 flex items-center justify-center" @click="handleShare">
          <Share2 class="w-4 h-4 text-slate-600" />
        </button>
      </header>

      <!-- ══════════════════════════════════════════════════
           TABLET / DESKTOP HEADER  (>= 768 px)
      ══════════════════════════════════════════════════ -->
      <AdminPageHeader
        class="hidden md:flex"
        title="Collection Receipt"
        :description="query.data.value.receiptNumber"
      >
        <template #actions>
          <AppButton variant="outline" size="sm" @click="$router.push('/collector/history')">
            <ArrowLeft class="w-4 h-4 mr-2" />Back to History
          </AppButton>
          <AppButton variant="primary" size="sm" @click="$router.push('/collector/contributions/new')">
            <Plus class="w-4 h-4 mr-2" />New Collection
          </AppButton>
        </template>
      </AdminPageHeader>

      <!-- ══════════════════════════════════════════════════
           PHONE: Success hero  (< 768 px)
           Matches mobile-app receipt screen pattern
      ══════════════════════════════════════════════════ -->
      <div class="md:hidden flex flex-col items-center px-4 pt-8 pb-4 space-y-3">
        <div class="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
          <CheckCircle2 class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Collection Recorded!</h2>
        <p class="text-sm text-slate-500 text-center max-w-xs font-medium leading-relaxed">
          A receipt has been generated for the contributor.
        </p>
      </div>

      <!-- ══════════════════════════════════════════════════
           TABLET / DESKTOP: Success banner  (>= 768 px)
      ══════════════════════════════════════════════════ -->
      <div class="hidden md:flex bg-emerald-50 border border-emerald-200 p-5 items-center gap-4">
        <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-black text-emerald-800 uppercase tracking-tight">Collection Recorded Successfully</p>
          <p class="text-xs text-emerald-600 font-medium mt-0.5">A digital receipt has been generated for this contribution.</p>
        </div>
        <span
          class="text-xs font-black uppercase tracking-widest px-3 py-1.5 border shrink-0"
          :class="statusClass"
        >
          {{ query.data.value.status }}
        </span>
      </div>

      <!-- ══════════════════════════════════════════════════
           RECEIPT BODY
           phone:  full-width row list (mobile app pattern)
           tablet+: card with amount header + grid
      ══════════════════════════════════════════════════ -->

      <!-- PHONE: Amount display -->
      <div class="md:hidden text-center px-4 pb-4">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
        <p class="text-4xl font-black text-slate-900 tracking-tighter">{{ query.data.value.amount }}</p>
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 mt-2 inline-block">
          {{ query.data.value.paymentMethod }}
        </span>
      </div>

      <!-- PHONE: Detail rows (mobile app pattern — full-width bordered rows) -->
      <div class="md:hidden bg-white border-y border-slate-100 divide-y divide-slate-100">
        <div
          v-for="row in detailRows"
          :key="row.label"
          class="flex items-center justify-between px-4 py-4 min-h-[52px]"
        >
          <span class="text-sm text-slate-400 font-medium">{{ row.label }}</span>
          <span class="text-sm font-black text-slate-900 text-right max-w-[60%] truncate">{{ row.value }}</span>
        </div>
      </div>

      <!-- TABLET / DESKTOP: Card with dark amount header + grid -->
      <div class="hidden md:block bg-white border border-slate-200 shadow-sm">
        <div class="bg-slate-900 text-white px-8 py-8 flex items-end justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Contribution</p>
            <p class="text-5xl font-black tracking-tighter">{{ query.data.value.amount }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Receipt No.</p>
            <p class="text-sm font-black text-white tracking-tight">{{ query.data.value.receiptNumber }}</p>
          </div>
        </div>
        <div class="divide-y divide-slate-100">
          <div class="grid grid-cols-2 divide-x divide-slate-100">
            <div class="p-6">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Donor</p>
              <p class="text-sm font-black text-slate-900">{{ query.data.value.isAnonymous ? 'Anonymous' : query.data.value.contributorName }}</p>
            </div>
            <div class="p-6">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Collector</p>
              <p class="text-sm font-black text-slate-900">{{ query.data.value.collectorName || '—' }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 divide-x divide-slate-100">
            <div class="p-6">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Event</p>
              <p class="text-sm font-black text-slate-900">{{ query.data.value.eventTitle }}</p>
            </div>
            <div class="p-6">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Fund</p>
              <p class="text-sm font-black text-slate-900">{{ query.data.value.recipientFundName || '—' }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 divide-x divide-slate-100">
            <div class="p-6">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Method</p>
              <p class="text-sm font-black text-slate-900">{{ query.data.value.paymentMethod }}</p>
            </div>
            <div class="p-6">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date Issued</p>
              <p class="text-sm font-black text-slate-900">{{ query.data.value.issuedAt.split(',')[0] }}</p>
            </div>
          </div>
        </div>
        <!-- Verification row -->
        <div class="p-5 bg-slate-50 border-t border-slate-100">
          <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Verification Reference</p>
          <p class="text-xs font-mono text-slate-400 break-all">MFTL-COL-{{ query.data.value.receiptNumber }}</p>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           TABLET / DESKTOP: Action buttons inline
      ══════════════════════════════════════════════════ -->
      <div class="hidden md:grid grid-cols-3 gap-4">
        <AppButton variant="outline" class="w-full" :disabled="isResending" :loading="isResending" @click="handleResend">
          <Send class="w-4 h-4 mr-2" />Resend Receipt
        </AppButton>
        <AppButton variant="outline" class="w-full" @click="handleShare">
          <Share2 class="w-4 h-4 mr-2" />Share
        </AppButton>
        <AppButton variant="primary" class="w-full" @click="$router.push('/collector/contributions/new')">
          <Plus class="w-4 h-4 mr-2" />Record Another
        </AppButton>
      </div>

      <!-- Resend feedback -->
      <p v-if="resendMessage" class="text-center text-sm font-bold px-4 md:px-0" :class="resendSuccess ? 'text-emerald-600' : 'text-red-600'">
        {{ resendMessage }}
      </p>

    </template>

    <!-- ══════════════════════════════════════════════════
         PHONE: Sticky bottom action bar (mobile app pattern)
         3 stacked actions like receipt_screen.dart
    ══════════════════════════════════════════════════ -->
    <div
      v-if="query.data.value"
      class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 px-4 py-3 safe-area-bottom z-30 space-y-2"
    >
      <!-- Primary: Resend (matches "Print Receipt" slot in mobile) -->
      <button
        class="w-full bg-violet-600 text-white py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 active:opacity-90 transition-opacity disabled:opacity-40"
        :disabled="isResending"
        @click="handleResend"
      >
        <Send class="w-4 h-4" />
        {{ isResending ? 'Sending…' : 'Resend Receipt' }}
      </button>

      <!-- Secondary: Record Another -->
      <button
        class="w-full border border-slate-200 py-3.5 text-sm font-black uppercase tracking-widest text-slate-700 flex items-center justify-center gap-2 active:bg-slate-50 transition-colors"
        @click="$router.push('/collector/contributions/new')"
      >
        <Plus class="w-4 h-4" />
        Collect Another Amount
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useReceipt } from '@/modules/receipts/composables/useReceipts'
import { receiptsService } from '@/modules/receipts/services/receiptsService'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { CheckCircle2, Share2, Plus, Send, ArrowLeft, X } from 'lucide-vue-next'

const route = useRoute()
// const router = useRouter()
const receiptId = computed(() => String(route.params.id ?? ''))
const query = useReceipt(receiptId.value)

const isResending = ref(false)
const resendMessage = ref('')
const resendSuccess = ref(false)

const statusClass = computed(() => {
  const s = (query.data.value?.status ?? '').toLowerCase()
  if (s === 'issued') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (s === 'voided') return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
})

/** Flattened detail rows for the phone card-list pattern (mirrors receipt_screen.dart _buildDetailRow) */
const detailRows = computed(() => {
  const d = query.data.value
  if (!d) return []
  return [
    { label: 'Event', value: d.eventTitle },
    { label: 'Fund / Cause', value: d.recipientFundName || '—' },
    { label: 'Contributor', value: d.isAnonymous ? 'Anonymous' : d.contributorName },
    { label: 'Phone', value: d.contributorPhone || '—' },
    { label: 'Amount', value: d.amount },
    { label: 'Payment Method', value: d.paymentMethod },
    { label: 'Receipt #', value: d.receiptNumber },
    { label: 'Issued', value: d.issuedAt },
  ]
})

async function handleResend() {
  isResending.value = true
  resendMessage.value = ''
  try {
    await receiptsService.resend(receiptId.value)
    resendSuccess.value = true
    resendMessage.value = 'Receipt resent successfully.'
  } catch (e: any) {
    resendSuccess.value = false
    resendMessage.value = e?.response?.data?.message ?? 'Failed to resend. Please try again.'
  } finally {
    isResending.value = false
  }
}

function handleShare() {
  if (navigator.share) {
    navigator.share({ title: 'MFTL Contribution Receipt', text: `Receipt #${query.data.value?.receiptNumber}`, url: window.location.href })
      .catch(() => {/* user cancelled */})
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      resendSuccess.value = true
      resendMessage.value = 'Receipt link copied to clipboard.'
    }).catch(() => {/* ignore */})
  }
}
</script>
