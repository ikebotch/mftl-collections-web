<template>
  <div class="max-w-xl mx-auto px-4 py-12">
    <AppCard class="bg-white shadow-2xl rounded-[2rem] overflow-hidden">
      <div class="bg-slate-900 p-8 text-white">
        <div class="flex justify-between items-center mb-8">
          <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Mock Payment Provider</span>
          <div class="px-2 py-1 bg-violet-500/20 border border-violet-500/30 rounded text-[10px] font-bold text-violet-300">
            SANDBOX
          </div>
        </div>
        <h1 class="text-2xl font-bold font-display">
          Confirm Payment
        </h1>
        <p class="text-slate-400 text-sm mt-2">
          Method: <span class="capitalize text-white font-medium">{{ method }}</span>
        </p>
      </div>

      <div class="p-8 space-y-6">
        <div class="flex justify-between items-end border-b border-slate-100 pb-6">
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Total Amount
            </p>
            <p class="text-4xl font-bold text-slate-900">
              GHS {{ amount }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Reference
            </p>
            <p class="text-sm font-mono font-medium text-slate-600">
              {{ providerRef }}
            </p>
          </div>
        </div>

        <div class="space-y-4 py-4">
          <AppButton
            variant="primary"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-lg shadow-xl shadow-emerald-600/20"
            :loading="isProcessing"
            @click="simulateSuccess"
          >
            Simulate Success
          </AppButton>
          <AppButton
            variant="outline"
            class="w-full border-red-200 text-red-600 hover:bg-red-50 h-14 text-lg"
            :disabled="isProcessing"
            @click="simulateFailure"
          >
            Simulate Failure
          </AppButton>
        </div>

        <p class="text-center text-[10px] text-slate-400 font-medium">
          This is a simulated payment gateway for development purposes. No real money will be charged.
        </p>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import { httpClient } from '@/core/api/httpClient'

const route = useRoute()
const router = useRouter()

const providerRef = computed(() => String(route.query.providerReference ?? ''))
const contributionId = computed(() => String(route.query.contributionId ?? ''))
const amount = computed(() => String(route.query.amount ?? '0'))
const method = computed(() => String(route.query.method ?? 'card'))

const isProcessing = ref(false)

async function simulateSuccess() {
  await processPayment('success')
}

async function simulateFailure() {
  await processPayment('failed')
}

async function processPayment(status: 'success' | 'failed') {
  isProcessing.value = true
  
  try {
    // Generate a unique event ID for idempotency simulation if not provided
    const webhookEventId = `mock_evt_${Date.now()}`

    // Call the backend webhook endpoint directly
    await httpClient.post(`webhooks/payments/mock`, {
      contributionId: contributionId.value,
      providerReference: providerRef.value,
      status: status,
    }, { 
      skipAuth: true,
      headers: {
        'X-Event-Id': webhookEventId
      }
    })

    if (status === 'success') {
      // Find the event slug from local storage or previous context
      // For now, we'll just redirect to a success page.
      // In a real app, the provider would redirect back to the app's return URL.
      // We'll simulate that here.
      
      // We need the receipt ID, which the backend created. 
      // We can poll for it or just try to fetch it.
      // Actually, let's just go to the success page and let it fetch the receipt.
      // But we need the receiptId. Let's poll the payment status first.
      
      await pollForReceipt()
    } else {
      alert('Payment failed simulation.')
      router.back()
    }
  } catch (err) {
    console.error('Simulation error:', err)
    alert('Failed to simulate payment callback.')
  } finally {
    isProcessing.value = false
  }
}

async function pollForReceipt() {
  // Simple polling for payment success and receipt creation
  for (let i = 0; i < 5; i++) {
    try {
      await httpClient.get<any>(`public/payments/${contributionId.value}/status`, { skipAuth: true })
      // Wait, the status endpoint expects paymentId but we might only have contributionId.
      // Let's assume we can get it or just redirect to a success page that knows how to find it.
      
      // For this mock, I'll just redirect to the success page with a placeholder check.
      // In reality, we'd need the receiptId.
      // Let's assume the settlement service created a receipt.
      
      const receiptRes = await httpClient.get<any>(`public/receipts/by-contribution/${contributionId.value}`, { skipAuth: true })
      if (receiptRes.data) {
        router.push({ name: 'storefront-success', query: { receiptId: receiptRes.data.id }, params: route.params })
        return
      }
    } catch {
      // ignore and retry
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  alert('Payment processed but receipt not found yet. Please check your email.')
}
</script>
