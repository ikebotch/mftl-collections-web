<template>
  <div class="max-w-[860px] mx-auto pt-20 pb-20 px-6">
    <AppCard class="overflow-hidden !p-0 border-none shadow-[0_40px_100px_rgba(0,0,0,0.04)]">
      <div class="p-10 md:p-20 text-center space-y-12">
        <div v-if="status === 'AwaitingPayment' || status === 'Pending'" class="space-y-8">
          <div class="relative w-32 h-32 mx-auto">
            <div class="absolute inset-0 border-[6px] border-violet-50 rounded-full"></div>
            <div class="absolute inset-0 border-[6px] border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <Smartphone class="w-12 h-12 text-[#7C3AED]" />
            </div>
          </div>
          
          <div class="space-y-3">
            <h2 class="text-3xl font-black text-[#0F172A] tracking-tighter">Confirming Payment</h2>
            <p class="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Please check your device for a prompt. Approve the transaction to finalize your contribution.
            </p>
          </div>

          <div class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div class="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></div>
            <p class="text-[10px] font-black text-[#0F172A] uppercase tracking-[0.2em]">Waiting for approval</p>
          </div>
        </div>

        <div v-else-if="status === 'Completed'" class="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div class="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 class="w-16 h-16" />
          </div>
          <div class="space-y-3">
            <h2 class="text-3xl font-black text-[#0F172A] tracking-tighter">Payment Received</h2>
            <p class="text-slate-500 font-medium">Your contribution has been successfully recorded. Thank you for your support!</p>
          </div>
          <AppButton 
            class="min-w-[200px]"
            @click="router.push(`/give/${eventSlug}/success`)"
          >
            Continue
          </AppButton>
        </div>

        <div v-else-if="status === 'Failed' || status === 'Cancelled'" class="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div class="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
            <XCircle class="w-16 h-16" />
          </div>
          <div class="space-y-3">
            <h2 class="text-3xl font-black text-[#0F172A] tracking-tighter">Payment Failed</h2>
            <p class="text-slate-500 font-medium max-w-sm mx-auto">{{ failureReason || 'We encountered an issue processing your payment. Please try again.' }}</p>
          </div>
          <AppButton 
            variant="secondary" 
            class="min-w-[200px]"
            @click="router.push(`/give/${eventSlug}/contribute`)"
          >
            Go Back & Try Again
          </AppButton>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getContributionStatus } from '../services/storefrontService'
import { Smartphone, CheckCircle2, XCircle } from 'lucide-vue-next'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))

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
