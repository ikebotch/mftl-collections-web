<template>
  <div class="space-y-8 pb-32">
    <header class="flex items-center justify-between pt-2">
      <div>
        <h2 class="text-3xl font-black text-white tracking-tight">Record Gift</h2>
        <p class="text-slate-400 mt-1 font-medium">Capture a new contribution.</p>
      </div>
      <AppButton 
        variant="ghost" 
        size="sm" 
        class="!rounded-2xl bg-white/5"
        @click="router.push('/collector/history')"
      >
        <History class="w-5 h-5" />
      </AppButton>
    </header>

    <!-- Progress Indicator -->
    <div class="flex gap-2">
       <div v-for="s in 4" :key="s" class="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-all duration-700 ease-out"
            :style="{ width: s <= activeStep ? '100%' : '0%' }"
          />
       </div>
    </div>

    <LoadingState
      v-if="assignmentsQuery.isLoading.value"
      text="Syncing assignments…"
      variant="dark"
    />
    
    <ErrorState
      v-else-if="assignmentsQuery.isError.value"
      title="Sync failed"
      variant="dark"
      :message="assignmentsQuery.error.value?.message ?? 'Please check your connection.'"
      show-retry
      @retry="assignmentsQuery.refetch"
    />

    <template v-else-if="assignmentsQuery.data.value">
      <div
        v-if="!assignmentsQuery.data.value.hasAssignments"
        class="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-8 text-center"
      >
        <div class="w-16 h-16 rounded-3xl bg-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-6">
           <AlertTriangle class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold text-amber-500">Collection Blocked</h3>
        <p class="mt-3 text-slate-300 leading-relaxed">
          {{ assignmentsQuery.data.value.blockedReason || 'You need to be assigned to an event before you can record gifts.' }}
        </p>
        <AppButton variant="secondary" class="mt-8 w-full" @click="assignmentsQuery.refetch">
           Retry Sync
        </AppButton>
      </div>

      <div v-else class="space-y-10">
         <!-- Step 1: Event Selection -->
         <section v-if="activeStep === 1" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 class="text-xl font-black text-white">1. Select Event</h3>
            <div class="space-y-4">
               <button 
                 v-for="event in assignmentsQuery.data.value.events" 
                 :key="event.id"
                 class="w-full p-6 rounded-[2rem] border text-left transition-all duration-300 active:scale-[0.98]"
                 :class="form.eventId === event.id ? 'border-violet-500 bg-violet-600/10 shadow-[0_0_30px_rgba(124,58,237,0.15)]' : 'border-white/5 bg-white/[0.03]'"
                 @click="selectEvent(event.id)"
               >
                  <div class="flex items-center justify-between">
                     <div>
                        <p class="text-lg font-black text-white">{{ event.title }}</p>
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{{ event.location }}</p>
                     </div>
                     <div v-if="form.eventId === event.id" class="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white">
                        <Check class="w-5 h-5" />
                     </div>
                  </div>
               </button>
            </div>
         </section>

         <!-- Step 2: Fund Selection -->
         <section v-if="activeStep === 2" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex items-center justify-between">
               <h3 class="text-xl font-black text-white">2. Recipient Fund</h3>
               <button class="text-xs font-bold text-slate-500 uppercase tracking-widest underline" @click="form.eventId = ''">Change Event</button>
            </div>
            <div class="space-y-4">
               <button 
                 v-for="fund in availableFunds" 
                 :key="fund.id"
                 class="w-full p-6 rounded-[2rem] border text-left transition-all duration-300 active:scale-[0.98]"
                 :class="form.recipientFundId === fund.id ? 'border-cyan-500 bg-cyan-600/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]' : 'border-white/5 bg-white/[0.03]'"
                 @click="form.recipientFundId = fund.id"
               >
                  <div class="flex items-center justify-between">
                     <div class="flex-1">
                        <p class="text-lg font-black text-white">{{ fund.name }}</p>
                        <p class="text-xs font-medium text-slate-400 mt-1 line-clamp-1">{{ fund.description }}</p>
                     </div>
                     <div v-if="form.recipientFundId === fund.id" class="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                        <Check class="w-5 h-5" />
                     </div>
                  </div>
               </button>
            </div>
         </section>

         <!-- Step 3: Contributor Details -->
         <section v-if="activeStep === 3" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex items-center justify-between">
               <h3 class="text-xl font-black text-white">3. Contributor</h3>
               <button class="text-xs font-bold text-slate-500 uppercase tracking-widest underline" @click="form.recipientFundId = ''">Change Fund</button>
            </div>
            
            <div class="space-y-6">
               <div class="rounded-[1.75rem] border border-white/5 bg-white/[0.03] p-1 flex items-center">
                  <button 
                    class="flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    :class="!form.anonymous ? 'bg-white/10 text-white shadow-soft' : 'text-slate-500'"
                    @click="form.anonymous = false"
                  >Known Donor</button>
                  <button 
                    class="flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    :class="form.anonymous ? 'bg-white/10 text-white shadow-soft' : 'text-slate-500'"
                    @click="form.anonymous = true"
                  >Anonymous</button>
               </div>

               <div v-if="!form.anonymous" class="space-y-4">
                  <div class="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                    <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Donor Name</label>
                    <input 
                      v-model="form.contributorName" 
                      class="w-full bg-transparent text-xl font-bold text-white outline-none placeholder:text-slate-700"
                      placeholder="e.g. Ama Serwaa"
                    />
                  </div>
                  <div class="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                    <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Phone Number</label>
                    <input 
                      v-model="form.contributorPhone" 
                      type="tel"
                      class="w-full bg-transparent text-xl font-bold text-white outline-none placeholder:text-slate-700"
                      placeholder="+233..."
                    />
                  </div>
               </div>

               <div v-else class="p-8 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.01] text-center">
                  <p class="text-slate-400 font-medium">Donor details will not be recorded. A receipt will still be generated.</p>
               </div>

               <AppButton 
                 variant="primary" 
                 class="w-full !rounded-3xl !py-5"
                 :disabled="!isStep3Valid"
                 @click="goToPayment"
               >
                  Continue to Payment
               </AppButton>
            </div>
         </section>

         <!-- Step 4: Payment -->
         <section v-if="activeStep === 4" class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex items-center justify-between">
               <h3 class="text-xl font-black text-white">4. Payment</h3>
               <button class="text-xs font-bold text-slate-500 uppercase tracking-widest underline" @click="activeStepOverride = 3">Change Details</button>
            </div>

            <div class="space-y-8">
               <div class="text-center py-6">
                  <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Amount Collected</label>
                  <div class="flex items-center justify-center gap-3">
                     <span class="text-2xl font-black text-slate-600">GHS</span>
                     <input 
                       v-model="form.amount" 
                       type="number"
                       inputmode="decimal"
                       class="bg-transparent text-6xl font-black text-white outline-none w-48 text-center placeholder:text-white/5"
                       placeholder="0"
                     />
                  </div>
               </div>

               <div class="grid grid-cols-2 gap-4">
                  <button 
                    v-for="method in paymentMethods" 
                    :key="method.value"
                    class="p-6 rounded-[2rem] border text-left transition-all duration-300 active:scale-[0.98]"
                    :class="form.paymentMethod === method.value ? 'border-emerald-500 bg-emerald-600/10' : 'border-white/5 bg-white/[0.03]'"
                    @click="form.paymentMethod = method.value"
                  >
                     <p class="text-base font-black text-white">{{ method.label }}</p>
                     <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Ready</p>
                  </button>
               </div>

               <div class="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                  <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Note (Optional)</label>
                  <input 
                    v-model="form.note" 
                    class="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-700"
                    placeholder="Add a brief note..."
                  />
               </div>

               <div class="pt-4">
                  <AppButton 
                    variant="primary" 
                    class="w-full !rounded-[2.5rem] !py-6 text-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_20px_50px_rgba(124,58,237,0.3)]"
                    :loading="isSubmitting"
                    :disabled="!canSubmit"
                    @click="onSubmit"
                  >
                     Issue Receipt
                  </AppButton>
                  <p v-if="submissionError" class="mt-4 text-center text-xs text-rose-400 font-bold uppercase tracking-widest">
                     {{ submissionError.message }}
                  </p>
               </div>
            </div>
         </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollectorAssignments } from '../composables/useCollector'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import type { ApiError } from '@/core/api/apiError'
import { shouldBypassAuth } from '@/core/auth/auth0'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { 
  History, 
  Check, 
  AlertTriangle 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const assignmentsQuery = useCollectorAssignments()

const activeStepOverride = ref<number | null>(null)

const form = reactive({
  eventId: typeof route.query.eventId === 'string' ? route.query.eventId : '',
  recipientFundId: typeof route.query.fundId === 'string' ? route.query.fundId : '',
  contributorName: '',
  contributorPhone: '',
  contributorEmail: '',
  anonymous: false,
  amount: '',
  currency: 'GHS',
  paymentMethod: 'cash',
  note: '',
})

const submissionError = ref<ApiError | null>(null)
const isSubmitting = ref(false)

const availableFunds = computed(() =>
  (assignmentsQuery.data.value?.funds ?? []).filter(fund => fund.eventId === form.eventId),
)

const activeStep = computed(() => {
  if (activeStepOverride.value) return activeStepOverride.value
  if (!form.eventId) return 1
  if (!form.recipientFundId) return 2
  if (!isStep3Valid.value) return 3
  return 4
})

const isStep3Valid = computed(() => {
  if (form.anonymous) return true
  return form.contributorName.length >= 2 && form.contributorPhone.length >= 9
})

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'momo', label: 'Mobile Money' },
]

const canSubmit = computed(() => {
  return Boolean(
    form.eventId &&
    form.recipientFundId &&
    form.amount &&
    Number(form.amount) > 0 &&
    (form.anonymous || form.contributorName)
  )
})

function selectEvent(id: string) {
  form.eventId = id
  form.recipientFundId = ''
  activeStepOverride.value = null
}

function goToPayment() {
  activeStepOverride.value = 4
}

async function onSubmit() {
  submissionError.value = null
  isSubmitting.value = true

  try {
    const result = await contributionsService.recordCash({
      eventId: form.eventId,
      recipientFundId: form.recipientFundId,
      amount: Number(form.amount),
      currency: form.currency,
      contributorName: form.anonymous ? 'Anonymous' : form.contributorName,
      contributorPhone: form.contributorPhone,
      contributorEmail: form.contributorEmail || undefined,
      anonymous: form.anonymous,
      paymentMethod: form.paymentMethod,
      note: form.note,
    }, shouldBypassAuth()
      ? {
          headers: { 'X-Dev-User-Id': 'dev-collector' },
        }
      : undefined)

    if (result.receiptId) {
      router.push(`/collector/receipts/${result.receiptId}`)
    }
  } catch (error) {
    submissionError.value = error as ApiError
  } finally {
    isSubmitting.value = false
  }
}

watch(() => form.eventId, (newId) => {
  if (!newId) activeStepOverride.value = 1
})
</script>
