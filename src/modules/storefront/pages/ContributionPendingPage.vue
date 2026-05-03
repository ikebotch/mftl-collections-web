<template>
  <div class="max-w-md mx-auto py-12 px-6 text-center space-y-8">
    <div v-if="status === 'AwaitingPayment' || status === 'Pending'" class="space-y-6">
      <div class="relative w-24 h-24 mx-auto">
        <div class="absolute inset-0 border-4 border-violet-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <Smartphone class="w-10 h-10 text-[#7C3AED]" />
        </div>
      </div>
      
      <div class="space-y-2">
        <h2 class="text-2xl font-black text-[#0F172A] tracking-tight">Payment Initiated</h2>
        <p class="text-slate-500 font-medium">
          Please check your phone for a payment prompt. Approve the transaction to complete your contribution.
        </p>
      </div>

      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
        <p class="text-sm font-bold text-[#0F172A]">Waiting for approval...</p>
      </div>
    </div>

    <div v-else-if="status === 'Completed'" class="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div class="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
        <CheckCircle2 class="w-12 h-12" />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-black text-[#0F172A] tracking-tight">Thank You!</h2>
        <p class="text-slate-500 font-medium">Your payment was successful and your contribution has been recorded.</p>
      </div>
      <AppButton @click="router.push(`/give/${slug}/success`)">View Receipt</AppButton>
    </div>

    <div v-else-if="status === 'Failed' || status === 'Cancelled'" class="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
        <XCircle class="w-12 h-12" />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-black text-[#0F172A] tracking-tight">Payment Failed</h2>
        <p class="text-slate-500 font-medium">{{ failureReason || 'We could not process your payment at this time.' }}</p>
      </div>
      <AppButton variant="secondary" @click="router.push(`/give/${slug}`)">Try Again</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getContributionStatus } from '../services/storefrontService'
import { Smartphone, CheckCircle2, XCircle } from 'lucide-vue-next'
import AppButton from '@/shared/components/buttons/AppButton.vue'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const slug = String(route.params.slug)

const status = ref('Pending')
const failureReason = ref<string | null>(null)
let pollInterval: any = null

async function pollStatus() {
  try {
    const data = await getContributionStatus(id)
    status.value = data.status
    failureReason.value = data.failureReason || null

    if (status.value === 'Completed') {
      clearInterval(pollInterval)
      // Optional: auto redirect after a delay
      // setTimeout(() => router.push(`/give/${slug}/success`), 3000)
    } else if (status.value === 'Failed' || status.value === 'Cancelled') {
      clearInterval(pollInterval)
    }
  } catch (e) {
    console.error('Polling failed', e)
  }
}

onMounted(() => {
  pollStatus()
  pollInterval = setInterval(pollStatus, 3000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
