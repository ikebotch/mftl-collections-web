<template>
  <div class="space-y-10 pb-20">
    <!-- Header -->
    <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-10">
      <div class="space-y-1">
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Operational Terminal
        </p>
        <h2 class="text-3xl lg:text-5xl font-black tracking-tight uppercase italic text-slate-900">
          Quick Collect
        </h2>
        <div class="flex items-center gap-3 mt-2">
          <span class="px-2 py-0.5 bg-violet-100 text-violet-600 text-[9px] font-black uppercase tracking-widest border border-violet-200">
            Admin Session
          </span>
          <span class="text-[10px] font-bold text-slate-400 italic">
            Direct contribution recording
          </span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-right hidden lg:block">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Status
          </p>
          <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
            System Ready
          </p>
        </div>
        <div class="h-10 w-px bg-slate-200 mx-2" />
        <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1.5 px-4 rounded-none">
          <div class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span class="text-[10px] font-black text-slate-700 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>
    </section>

    <div class="grid lg:grid-cols-12 gap-12 items-start">
      <!-- Left Column: Context Selection -->
      <div class="lg:col-span-7 space-y-10">
        <!-- Event Selection -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-1">
            <h3 class="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              1. Select Event
            </h3>
            <button 
              v-if="form.eventId" 
              class="text-[10px] font-black uppercase tracking-widest text-violet-600 underline underline-offset-4"
              @click="resetContext"
            >
              Change
            </button>
          </div>

          <div
            v-if="!form.eventId"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <LoadingState
              v-if="eventsQuery.isLoading.value"
              text="Loading active events..."
              variant="light"
            />
            <button
              v-for="event in eventsQuery.data.value?.data"
              :key="event.id"
              class="p-6 text-left border bg-white border-slate-100 hover:border-violet-500/50 hover:shadow-lg transition-all group"
              @click="form.eventId = event.id"
            >
              <div class="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-violet-500 transition-colors mb-4">
                <Calendar class="w-6 h-6" />
              </div>
              <h4 class="text-sm font-black uppercase italic text-slate-900 truncate">
                {{ event.title }}
              </h4>
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {{ event.branchName }}
              </p>
            </button>
          </div>

          <div
            v-else
            class="p-6 bg-white border border-violet-500/30 shadow-md flex items-center gap-6 animate-in fade-in zoom-in-95 duration-300"
          >
            <div class="w-14 h-14 bg-violet-600 flex items-center justify-center text-white shadow-lg">
              <Calendar class="w-7 h-7" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-xl font-black uppercase italic text-slate-900">
                {{ selectedEvent?.title }}
              </h4>
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {{ selectedEvent?.branchName }} · {{ selectedEvent?.location }}
              </p>
            </div>
          </div>
        </div>

        <!-- Fund Selection -->
        <div
          v-if="form.eventId"
          class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="flex items-center justify-between px-1">
            <h3 class="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              2. Destination Fund
            </h3>
            <button 
              v-if="form.recipientFundId" 
              class="text-[10px] font-black uppercase tracking-widest text-violet-600 underline underline-offset-4"
              @click="form.recipientFundId = ''"
            >
              Change
            </button>
          </div>

          <div
            v-if="!form.recipientFundId"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              v-for="fund in availableFunds"
              :key="fund.id"
              class="p-6 text-left border bg-white border-slate-100 hover:border-violet-500/50 hover:shadow-lg transition-all group"
              @click="form.recipientFundId = fund.id"
            >
              <div class="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-violet-500 transition-colors mb-4">
                <Target class="w-6 h-6" />
              </div>
              <h4 class="text-sm font-black uppercase italic text-slate-900 truncate">
                {{ fund.name }}
              </h4>
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Goal: {{ formatCurrency(fund.targetAmount, 'GHS') }}
              </p>
            </button>
          </div>

          <div
            v-else
            class="p-6 bg-white border border-violet-500/30 shadow-md flex items-center gap-6 animate-in fade-in zoom-in-95 duration-300"
          >
            <div class="w-14 h-14 bg-violet-600 flex items-center justify-center text-white shadow-lg">
              <Target class="w-7 h-7" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-xl font-black uppercase italic text-slate-900">
                {{ selectedFund?.name }}
              </h4>
              <div class="mt-2 h-1 w-full bg-slate-100 rounded-none overflow-hidden">
                <div
                  class="h-full bg-violet-600"
                  :style="{ width: `${selectedFund?.progress}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Collection Form -->
      <div class="lg:col-span-5">
        <div
          v-if="form.recipientFundId"
          class="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700"
        >
          <div class="p-8 lg:p-10 bg-white border border-slate-200 shadow-2xl shadow-slate-200/50">
            <div class="space-y-8">
              <!-- Amount -->
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Amount Entry</label>
                <div class="relative group">
                  <span class="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-black text-violet-500 group-focus-within:scale-110 transition-transform duration-500">₵</span>
                  <input 
                    v-model="form.amount"
                    type="number"
                    placeholder="0.00"
                    class="w-full bg-transparent border-b-2 border-slate-100 focus:border-violet-500 py-6 pl-10 text-5xl font-black text-slate-900 outline-none transition-all placeholder:text-slate-100"
                  >
                </div>
              </div>

              <!-- Contributor -->
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Donor Information</label>
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input
                      v-model="form.anonymous"
                      type="checkbox"
                      class="w-3 h-3 rounded-none border-slate-300 text-violet-600 focus:ring-violet-500"
                    >
                    <span class="text-[10px] font-black uppercase text-slate-400 group-hover:text-violet-600 transition-colors">Anonymous</span>
                  </label>
                </div>

                <div
                  v-if="!form.anonymous"
                  class="grid gap-4"
                >
                  <div class="relative">
                    <User class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      v-model="form.contributorName"
                      placeholder="FULL NAME"
                      class="w-full bg-slate-50 border border-slate-200 p-4 pl-12 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-violet-500 outline-none transition-all"
                    >
                  </div>
                  <div class="relative">
                    <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      v-model="form.contributorPhone"
                      placeholder="PHONE NUMBER"
                      class="w-full bg-slate-50 border border-slate-200 p-4 pl-12 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-violet-500 outline-none transition-all"
                    >
                  </div>
                  <div class="relative">
                    <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      v-model="form.contributorEmail"
                      placeholder="EMAIL ADDRESS (OPTIONAL)"
                      class="w-full bg-slate-50 border border-slate-200 p-4 pl-12 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-violet-500 outline-none transition-all"
                    >
                  </div>
                </div>

                <div
                  v-else
                  class="p-6 bg-slate-900 border-l-4 border-violet-500 shadow-xl"
                >
                  <p class="text-xs font-black text-white uppercase tracking-widest italic">
                    Confidential Entry
                  </p>
                  <p class="text-[9px] text-slate-500 font-bold uppercase mt-1">
                    Identity suppressed for public reports
                  </p>
                </div>
              </div>

              <!-- Action -->
              <div class="pt-6">
                <AppButton
                  variant="primary"
                  class="w-full !rounded-none !py-6 text-sm font-black uppercase tracking-[0.25em] shadow-2xl shadow-violet-500/20 group"
                  :disabled="!canSubmit || isSubmitting"
                  :loading="isSubmitting"
                  @click="handleSubmit"
                >
                  <span>Record Transaction</span>
                  <ArrowRight class="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
                </AppButton>
                <div class="flex items-center justify-center gap-4 mt-8 opacity-50">
                  <Banknote class="w-4 h-4 text-slate-400" />
                  <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Secure Cash Entry Point</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Recap Card -->
          <article class="p-6 bg-slate-50 border border-slate-200 rounded-none flex items-center justify-between">
            <div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Target Context
              </p>
              <p class="text-xs font-black text-slate-900 uppercase tracking-tight mt-1">
                {{ selectedEvent?.title.slice(0, 20) }}... / {{ selectedFund?.name }}
              </p>
            </div>
            <div class="h-8 w-8 bg-white border border-slate-200 flex items-center justify-center text-violet-600">
              <Check class="w-4 h-4" />
            </div>
          </article>
        </div>
        
        <!-- Placeholder when no context -->
        <div
          v-else
          class="lg:sticky lg:top-24 p-12 border border-dashed border-slate-300 bg-slate-50 text-center animate-pulse"
        >
          <p class="text-xs font-black uppercase tracking-widest text-slate-400">
            Awaiting selection context...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { eventsService } from '@/modules/events/services/eventsService'
import { contributionsService } from '@/modules/contributions/services/contributionsService'
import { formatCurrency } from '@/core/formatting/formatters'
import { shouldBypassAuth } from '@/core/auth/auth0'
import type { ApiError } from '@/core/api/apiError'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { 
  Calendar, 
  Target, 
  User, 
  Phone, 
  Mail, 
  Check, 
  ArrowRight, 
  Banknote 
} from 'lucide-vue-next'

const router = useRouter()
const isSubmitting = ref(false)
const submissionError = ref<ApiError | null>(null)

// Queries
const eventsQuery = useQuery({
  queryKey: ['admin', 'events', 'active'],
  queryFn: () => eventsService.list({ 
    status: 'Published',
    isActive: true 
  })
})

const form = reactive({
  eventId: '',
  recipientFundId: '',
  contributorName: '',
  contributorPhone: '',
  contributorEmail: '',
  anonymous: false,
  amount: '',
  currency: 'GHS',
  paymentMethod: 'cash',
  note: 'Admin quick collect',
})

const selectedEvent = computed(() => 
  eventsQuery.data.value?.data.find(e => e.id === form.eventId)
)

const availableFunds = computed(() => 
  selectedEvent.value?.recipientFunds ?? []
)

const selectedFund = computed(() => 
  availableFunds.value.find(f => f.id === form.recipientFundId)
)

const canSubmit = computed(() => {
  return Boolean(
    form.eventId &&
    form.recipientFundId &&
    form.amount &&
    Number(form.amount) > 0 &&
    (form.anonymous || (form.contributorName && form.contributorPhone))
  )
})

function resetContext() {
  form.eventId = ''
  form.recipientFundId = ''
}

async function handleSubmit() {
  submissionError.value = null
  isSubmitting.value = true

  try {
    const result = await contributionsService.recordCash({
      eventId: form.eventId,
      recipientFundId: form.recipientFundId,
      amountValue: Number(form.amount),
      currency: form.currency,
      contributorName: form.anonymous ? 'Anonymous' : form.contributorName,
      contributorPhone: form.contributorPhone,
      contributorEmail: form.contributorEmail || undefined,
      anonymous: form.anonymous,
      paymentMethod: form.paymentMethod,
      note: form.note,
    }, shouldBypassAuth()
      ? {
          headers: { 'X-Dev-User-Id': 'admin-quick-collect' },
        }
      : undefined)

    if (result.receiptId) {
      router.push(`/admin/receipts/${result.receiptId}`)
    }
  } catch (error) {
    submissionError.value = error as ApiError
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.italic {
  font-style: italic;
}
</style>
