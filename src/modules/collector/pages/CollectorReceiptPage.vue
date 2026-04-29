<template>
  <div class="space-y-8 pb-20">
    <LoadingState v-if="query.isLoading.value" text="Loading receipt…" />

    <ErrorState
      v-else-if="query.isError.value"
      title="Receipt Not Found"
      :message="query.error.value?.message ?? 'The receipt link may be invalid or expired.'"
      show-retry
      @retry="query.refetch"
    />

    <template v-else-if="query.data.value">
      <!-- Page Header -->
      <AdminPageHeader
        title="Collection Receipt"
        :description="query.data.value.receiptNumber"
      >
        <template #actions>
          <AppButton variant="outline" size="sm" @click="$router.push('/collector/history')">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to History
          </AppButton>
          <AppButton variant="primary" size="sm" @click="$router.push('/collector/contributions/new')">
            <Plus class="w-4 h-4 mr-2" />
            New Collection
          </AppButton>
        </template>
      </AdminPageHeader>

      <!-- Success Banner -->
      <div class="bg-emerald-50 border border-emerald-200 p-5 flex items-center gap-4">
        <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-sm font-black text-emerald-800 uppercase tracking-tight">Collection Recorded Successfully</p>
          <p class="text-xs text-emerald-600 font-medium mt-0.5">A digital receipt has been generated for this contribution.</p>
        </div>
        <div class="ml-auto">
          <span
            class="text-xs font-black uppercase tracking-widest px-3 py-1.5 border"
            :class="statusClass"
          >
            {{ query.data.value.status }}
          </span>
        </div>
      </div>

      <!-- Receipt Card -->
      <div class="bg-white border border-slate-200 shadow-sm">
        <!-- Amount Header -->
        <div class="bg-slate-900 text-white p-8 flex items-end justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Contribution</p>
            <p class="text-5xl font-black tracking-tighter">{{ query.data.value.amount }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Receipt No.</p>
            <p class="text-sm font-black text-white tracking-tight">{{ query.data.value.receiptNumber }}</p>
          </div>
        </div>

        <!-- Receipt Details Grid -->
        <div class="divide-y divide-slate-100">
          <div class="grid grid-cols-2 divide-x divide-slate-100">
            <div class="p-6">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Donor</p>
              <p class="text-sm font-black text-slate-900">
                {{ query.data.value.isAnonymous ? 'Anonymous' : query.data.value.contributorName }}
              </p>
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

        <!-- Verification Hash -->
        <div class="p-5 bg-slate-50 border-t border-slate-100">
          <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Verification Reference</p>
          <p class="text-xs font-mono text-slate-400 break-all">
            MFTL-COL-{{ query.data.value.receiptNumber }}-{{ verificationSuffix }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="grid sm:grid-cols-3 gap-4">
        <AppButton
          variant="outline"
          class="w-full"
          :disabled="isResending"
          :loading="isResending"
          @click="handleResend"
        >
          <Send class="w-4 h-4 mr-2" />
          Resend Receipt
        </AppButton>
        <AppButton variant="outline" class="w-full" @click="handleShare">
          <Share2 class="w-4 h-4 mr-2" />
          Share
        </AppButton>
        <AppButton variant="primary" class="w-full" @click="$router.push('/collector/contributions/new')">
          <Plus class="w-4 h-4 mr-2" />
          Record Another
        </AppButton>
      </div>

      <!-- Resend feedback -->
      <p v-if="resendMessage" class="text-center text-sm font-bold" :class="resendSuccess ? 'text-emerald-600' : 'text-red-600'">
        {{ resendMessage }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReceipt } from '@/modules/receipts/composables/useReceipts'
import { receiptsService } from '@/modules/receipts/services/receiptsService'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import {
  CheckCircle2,
  Share2,
  Plus,
  Send,
  ArrowLeft,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const receiptId = computed(() => String(route.params.id ?? ''))
const query = useReceipt(receiptId.value)

const isResending = ref(false)
const resendMessage = ref('')
const resendSuccess = ref(false)

const verificationSuffix = computed(() => Date.now().toString(16).toUpperCase())

const statusClass = computed(() => {
  const s = (query.data.value?.status ?? '').toLowerCase()
  if (s === 'issued') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (s === 'voided') return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
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
    resendMessage.value = e?.response?.data?.message ?? 'Failed to resend receipt. Please try again.'
  } finally {
    isResending.value = false
  }
}

function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: 'MFTL Contribution Receipt',
      text: `Receipt #${query.data.value?.receiptNumber}`,
      url: window.location.href,
    }).catch(() => {/* user cancelled */})
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        resendSuccess.value = true
        resendMessage.value = 'Receipt link copied to clipboard.'
      })
      .catch(() => {/* ignore */})
  }
}
</script>
