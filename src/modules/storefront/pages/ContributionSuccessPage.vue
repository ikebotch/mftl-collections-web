<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <div
      v-if="isLoading"
      class="text-center py-20"
    >
      <div class="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4" />
      <p class="text-slate-500 font-medium">
        Fetching your receipt...
      </p>
    </div>
    
    <div
      v-else-if="receipt"
      class="space-y-8"
    >
      <AppCard class="overflow-hidden bg-white border-none shadow-2xl rounded-[2rem] p-8 md:p-12 text-center">
        <div class="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-sm">
          ✓
        </div>
        
        <p class="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
          Contribution Successful
        </p>
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 font-display mb-6">
          Thank you, {{ receipt.contributorName || 'Anonymous' }}
        </h1>
        
        <div class="py-8 border-y border-slate-100 my-8 space-y-4 text-left">
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Event</span>
            <span class="text-slate-900 font-bold">{{ receipt.eventTitle }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Fund</span>
            <span class="text-slate-900 font-bold">{{ receipt.recipientFundName }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Amount</span>
            <span class="text-slate-900 font-bold text-lg">{{ receipt.currency }} {{ receipt.amount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Receipt #</span>
            <span class="text-slate-900 font-mono font-bold">{{ receipt.receiptNumber }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <AppButton
            variant="primary"
            class="bg-violet-600 text-white shadow-lg shadow-violet-600/20"
            @click="router.push(`/contribute/${eventSlug}`)"
          >
            Contribute Again
          </AppButton>
          <AppButton
            variant="outline"
            class="border-slate-200 text-slate-600"
            @click="downloadReceipt"
          >
            Download Receipt
          </AppButton>
        </div>
      </AppCard>

      <p class="text-center text-xs text-slate-400 font-medium">
        A confirmation has been sent to your email. Thank you for your support!
      </p>
    </div>

    <div
      v-else
      class="text-center py-20"
    >
      <p class="text-red-500 font-bold mb-4">
        Oops! We couldn't find your receipt.
      </p>
      <AppButton
        variant="secondary"
        @click="router.push(`/contribute/${eventSlug}`)"
      >
        Go Back
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPublicReceipt } from '../services/storefrontService'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'

const route = useRoute()
const router = useRouter()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const receiptId = computed(() => String(route.query.receiptId ?? ''))

const isLoading = ref(true)
const receipt = ref<any>(null)

onMounted(async () => {
  if (!receiptId.value) {
    isLoading.value = false
    return
  }

  try {
    receipt.value = await getPublicReceipt(receiptId.value)
  } catch (error) {
    console.error('Failed to load receipt:', error)
  } finally {
    isLoading.value = false
  }
})

function downloadReceipt() {
  alert('Receipt download will be available soon!')
}
</script>
