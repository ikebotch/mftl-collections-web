<template>
  <div class="min-h-screen bg-[#060B16] text-white selection:bg-violet-500/30">
    <!-- Loading / Error -->
    <div v-if="query.isLoading.value" class="py-20 flex flex-col items-center">
      <LoadingState text="Accessing Node Record…" class="!text-slate-400" />
    </div>
    
    <div v-else-if="query.isError.value" class="px-6 py-12">
      <ErrorState
        title="Record Access Failure"
        :message="query.error.value?.message ?? 'The requested receipt could not be retrieved from the node.'"
        show-retry
        class="!bg-white/5 !border-white/10"
        @retry="query.refetch"
      />
    </div>

    <template v-else-if="query.data.value">
      <!-- ══════════════════════════════════════════════════
           TERMINAL HEADER
      ══════════════════════════════════════════════════ -->
      <header class="sticky top-0 z-40 bg-[#060B16]/80 backdrop-blur-md border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            class="w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
            @click="$router.push('/collector/history')"
          >
            <ChevronLeft class="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <p class="text-[9px] font-black text-violet-400 uppercase tracking-[0.3em]">Node Operation</p>
            <h1 class="text-sm font-black text-white uppercase tracking-tight">Receipt Record</h1>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <button
            class="h-10 w-10 flex items-center justify-center border border-white/10 hover:bg-white/5 transition-all"
            @click="handleShare"
          >
            <Share2 class="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </header>

      <main class="max-w-xl mx-auto px-6 py-10 pb-32">
        <!-- Success Hero -->
        <div class="flex flex-col items-center text-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div class="relative">
            <div class="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
            <div class="relative w-20 h-20 bg-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 class="w-10 h-10 text-white" />
            </div>
          </div>
          <div class="space-y-2">
            <h2 class="text-3xl font-black text-white uppercase tracking-tight italic">Collection Verified</h2>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Token: {{ query.data.value.receiptNumber }}</p>
          </div>
        </div>

        <!-- Digital Receipt Card -->
        <div class="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div class="absolute -inset-1 bg-white/5 blur-md"></div>
          <div class="relative bg-white text-[#060B16] p-10 shadow-2xl overflow-hidden">
            <!-- Watermark -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-25deg] pointer-events-none whitespace-nowrap">
              <p class="text-9xl font-black uppercase">MFTL NODE</p>
            </div>

            <!-- Serrated edge effect -->
            <div class="absolute -top-1 left-0 right-0 flex justify-between overflow-hidden">
              <div v-for="i in 24" :key="i" class="w-4 h-4 bg-[#060B16] rotate-45 -translate-y-2 shrink-0" />
            </div>

            <div class="text-center border-b-2 border-dashed border-slate-200 pb-10 mb-10">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Total Value Received</p>
              <h3 class="text-6xl font-black tracking-tighter tabular-nums">{{ query.data.value.amount }}</h3>
              <div class="inline-block mt-6 px-4 py-1.5 bg-[#060B16] text-white text-[10px] font-black uppercase tracking-[0.3em]">
                {{ query.data.value.paymentMethod }} PROTOCOL
              </div>
            </div>

            <div class="space-y-6">
              <div
                v-for="row in detailRows"
                :key="row.label"
                class="flex justify-between items-start gap-6"
                :class="{ 'border-t border-slate-100 pt-6 mt-6': row.label === 'Contributor' }"
              >
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ row.label }}</span>
                <span class="text-xs font-black uppercase text-right leading-tight max-w-[60%]">{{ row.value }}</span>
              </div>
            </div>

            <div class="mt-12 pt-8 border-t-2 border-dashed border-slate-200 text-center">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">System Verified · {{ query.data.value.issuedAt }}</p>
            </div>
          </div>
        </div>

        <!-- Feedback Messages -->
        <div v-if="resendMessage" class="mt-8 animate-in fade-in slide-in-from-top-2">
          <div 
            class="p-4 border text-[10px] font-black uppercase tracking-[0.2em] text-center"
            :class="resendSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'"
          >
            {{ resendMessage }}
          </div>
        </div>
      </main>

      <!-- ══════════════════════════════════════════════════
           FIXED ACTION BAR
      ══════════════════════════════════════════════════ -->
      <footer class="fixed bottom-0 inset-x-0 bg-[#060B16] border-t border-white/5 p-6 safe-area-bottom z-40">
        <div class="max-w-xl mx-auto flex flex-col gap-3">
          <button
            class="
              w-full bg-violet-600 text-white py-5
              text-xs font-black uppercase tracking-[0.2em]
              flex items-center justify-center gap-3
              disabled:opacity-40 transition-all
              active:scale-[0.98] shadow-[0_10px_30px_rgba(124,58,237,0.3)]
            "
            :disabled="isResending"
            @click="handleResend"
          >
            <template v-if="isResending">
              <div class="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
              Processing Resend...
            </template>
            <template v-else>
              <Send class="w-4 h-4" />
              Resend Digital Receipt
            </template>
          </button>

          <button
            class="
              w-full bg-white/5 border border-white/10 text-white py-5
              text-xs font-black uppercase tracking-[0.2em]
              flex items-center justify-center gap-3
              hover:bg-white/10 transition-all
              active:scale-[0.98]
            "
            @click="$router.push('/collector/contributions/new')"
          >
            <Plus class="w-4 h-4" />
            Record Another Amount
          </button>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useReceipt } from '@/modules/receipts/composables/useReceipts'
import { receiptsService } from '@/modules/receipts/services/receiptsService'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { CheckCircle2, Share2, Plus, Send, ChevronLeft } from 'lucide-vue-next'

const route = useRoute()
const receiptId = computed(() => String(route.params.id ?? ''))
const query = useReceipt(receiptId.value)

const isResending = ref(false)
const resendMessage = ref('')
const resendSuccess = ref(false)

/** Flattened detail rows for the terminal card list */
const detailRows = computed(() => {
  const d = query.data.value
  if (!d) return []
  return [
    { label: 'Active Hub', value: d.eventTitle },
    { label: 'Allocation', value: d.recipientFundName || 'General Allocation' },
    { label: 'Contributor', value: d.isAnonymous ? 'Anonymous Node' : d.contributorName },
    { label: 'Contact', value: d.contributorPhone || 'Not Provided' },
  ]
})

async function handleResend() {
  isResending.value = true
  resendMessage.value = ''
  try {
    await receiptsService.resend(receiptId.value)
    resendSuccess.value = true
    resendMessage.value = 'Receipt resent successfully to contributor node.'
  } catch (e: any) {
    resendSuccess.value = false
    resendMessage.value = e?.response?.data?.message ?? 'Protocol error during resend.'
  } finally {
    isResending.value = false
    // Clear message after delay
    setTimeout(() => { resendMessage.value = '' }, 5000)
  }
}

function handleShare() {
  if (navigator.share) {
    navigator.share({ 
      title: 'MFTL Node Receipt', 
      text: `Receipt Record #${query.data.value?.receiptNumber}`, 
      url: window.location.href 
    }).catch(() => {/* user cancelled */})
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      resendSuccess.value = true
      resendMessage.value = 'Record link copied to terminal clipboard.'
      setTimeout(() => { resendMessage.value = '' }, 3000)
    }).catch(() => {/* ignore */})
  }
}
</script>

<style scoped>
/* Mobile Ergonomics */
.safe-area-bottom {
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
}
</style>
