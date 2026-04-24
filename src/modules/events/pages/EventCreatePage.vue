<template>
  <div class="max-w-4xl mx-auto py-12 px-6">
    <!-- Wizard Header -->
    <div class="mb-10 text-center">
      <div class="flex items-center justify-center gap-2 text-violet-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
        <span class="w-8 h-px bg-violet-600/30" />
        New Collection Event
        <span class="w-8 h-px bg-violet-600/30" />
      </div>
      <h1 class="text-4xl font-black font-display tracking-tight text-slate-900">
        {{ steps[currentStep].title }}
      </h1>
      <p class="text-slate-500 mt-2 font-medium">
        Step {{ currentStep + 1 }} of {{ steps.length }}: {{ steps[currentStep].description }}
      </p>
    </div>

    <!-- Step Progress Indicator -->
    <div class="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
      <div class="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="flex flex-col items-center gap-3"
      >
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500"
          :class="[
            index <= currentStep ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-white text-slate-400 border-2 border-slate-100',
            index < currentStep ? 'bg-emerald-500 text-white shadow-emerald-100' : ''
          ]"
        >
          <Check
            v-if="index < currentStep"
            class="w-5 h-5"
          />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span 
          class="text-[10px] font-bold uppercase tracking-widest hidden md:block"
          :class="index <= currentStep ? 'text-slate-900' : 'text-slate-400'"
        >
          {{ step.label }}
        </span>
      </div>
    </div>

    <AppCard class="overflow-hidden border-none shadow-premium !p-0">
      <!-- Step 1: Basic Details -->
      <div
        v-if="currentStep === 0"
        class="p-10 space-y-8"
      >
        <div class="grid gap-8">
          <AppInput
            id="event-title"
            v-model="form.title"
            label="Event title"
            placeholder="Example: Family support concert"
            :error="errors.title"
          />
          <AppTextarea
            id="event-description"
            v-model="form.description"
            label="Description"
            placeholder="Explain what the collection is for."
            :error="errors.description"
            :rows="4"
          />
          <div class="grid md:grid-cols-2 gap-8">
            <AppInput
              id="event-date"
              v-model="form.eventDate"
              label="Start Date"
              type="date"
            />
            <AppInput
              id="event-slug"
              v-model="form.slug"
              label="Public Slug"
              placeholder="concert-2026"
              :error="errors.slug"
            />
          </div>
        </div>
      </div>

      <!-- Step 2: Recipient Funds -->
      <div
        v-if="currentStep === 1"
        class="p-10 space-y-8"
      >
        <div class="flex items-center justify-between">
          <SectionHeader
            title="Funds Allocation"
            description="Define one or more recipient funds for this event."
          />
          <AppButton
            size="sm"
            variant="secondary"
            @click="addFund"
          >
            <Plus class="w-4 h-4 mr-2" />
            Add Fund
          </AppButton>
        </div>

        <div
          v-if="form.funds.length === 0"
          class="py-12 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <div class="text-3xl mb-3">
            💰
          </div>
          <p class="text-sm font-bold text-slate-900">
            No funds added yet
          </p>
          <p class="text-xs text-slate-500 mt-1">
            You must add at least one recipient fund.
          </p>
        </div>

        <div
          v-else
          class="space-y-4"
        >
          <div 
            v-for="(fund, index) in form.funds" 
            :key="index"
            class="bg-slate-50 p-6 rounded-3xl border border-slate-100 relative group"
          >
            <button 
              class="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
              @click="removeFund(index)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid md:grid-cols-2 gap-6">
              <AppInput
                :id="`fund-name-${index}`"
                v-model="fund.name"
                label="Fund Name"
                placeholder="Example: School fees"
              />
              <AppInput
                :id="`fund-target-${index}`"
                v-model="fund.targetAmount"
                label="Target Amount"
                type="number"
                placeholder="5000"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Payments & Currency -->
      <div
        v-if="currentStep === 2"
        class="p-10 space-y-8"
      >
        <div class="grid gap-8">
          <AppSelect
            id="event-currency"
            v-model="form.currency"
            label="Primary Currency"
            :options="[{ label: 'GHS - Ghana Cedi', value: 'GHS' }, { label: 'USD - US Dollar', value: 'USD' }]"
          />
          
          <div class="space-y-4">
            <p class="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
              Accepted Methods
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div 
                v-for="method in ['Cash', 'Mobile Money', 'Card', 'Bank Transfer']" 
                :key="method"
                class="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50"
              >
                <div class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                  <component
                    :is="getMethodIcon(method)"
                    class="w-5 h-5 text-slate-600"
                  />
                </div>
                <span class="text-sm font-bold text-slate-900">{{ method }}</span>
                <div class="ml-auto">
                  <div class="w-5 h-5 rounded-full border-2 border-slate-200 bg-white" />
                </div>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              * Payment method configuration is currently backend-pending
            </p>
          </div>
        </div>
      </div>

      <!-- Step 4: Collectors -->
      <div
        v-if="currentStep === 3"
        class="p-10 space-y-8 text-center py-20"
      >
        <div class="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6 text-violet-600">
          <Users class="w-10 h-10" />
        </div>
        <h3 class="text-xl font-bold text-slate-900">
          Assign Collectors
        </h3>
        <p class="text-slate-500 max-w-sm mx-auto text-sm">
          You will be able to assign collectors once the event is created.
        </p>
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest mt-8">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Backend Feature Pending
        </div>
      </div>

      <!-- Step 5: Review & Publish -->
      <div
        v-if="currentStep === 4"
        class="p-10 space-y-10"
      >
        <div class="grid md:grid-cols-2 gap-10">
          <div class="space-y-6">
            <SectionHeader title="Event Details" />
            <div class="space-y-4">
              <div class="flex justify-between pb-4 border-b border-slate-50">
                <span class="text-xs font-bold text-slate-400 uppercase">Title</span>
                <span class="text-sm font-bold text-slate-900">{{ form.title }}</span>
              </div>
              <div class="flex justify-between pb-4 border-b border-slate-50">
                <span class="text-xs font-bold text-slate-400 uppercase">Start Date</span>
                <span class="text-sm font-bold text-slate-900">{{ form.eventDate || 'TBD' }}</span>
              </div>
              <div class="flex justify-between pb-4 border-b border-slate-50">
                <span class="text-xs font-bold text-slate-400 uppercase">Public URL</span>
                <span class="text-sm font-bold text-violet-600">mftl.app/{{ form.slug }}</span>
              </div>
            </div>
          </div>
          <div class="space-y-6">
            <SectionHeader title="Allocation" />
            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
              <div
                v-for="fund in form.funds"
                :key="fund.name"
                class="flex justify-between items-center"
              >
                <span class="text-sm font-bold text-slate-900">{{ fund.name }}</span>
                <span class="text-xs font-black text-slate-500">{{ formatCurrency(Number(fund.targetAmount), form.currency) }}</span>
              </div>
              <div class="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span class="text-xs font-black text-slate-900 uppercase">Total Target</span>
                <span class="text-lg font-black text-slate-900">{{ formatCurrency(totalTarget, form.currency) }}</span>
              </div>
            </div>
          </div>
        </div>

        <ErrorState
          v-if="mutation.isError.value"
          title="Creation failed"
          :message="mutation.error.value?.message ?? 'Please retry publishing.'"
        />
      </div>

      <!-- Navigation Footer -->
      <div class="px-10 py-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <AppButton
          variant="secondary"
          class="min-w-[120px]"
          @click="prevStep"
        >
          {{ currentStep === 0 ? 'Cancel' : 'Previous' }}
        </AppButton>
        <AppButton
          variant="primary"
          class="min-w-[160px]"
          :loading="mutation.isPending.value"
          @click="nextStep"
        >
          {{ currentStep === steps.length - 1 ? 'Publish Event' : 'Continue' }}
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateEvent } from '../composables/useEvents'
import { createEventSchema } from '../validators/eventValidators'
import { useCreateRecipientFund } from '@/modules/recipient-funds/composables/useRecipientFunds'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'
import { formatCurrency } from '@/shared/utils/formatters'
import { 
  Check, 
  Plus, 
  Trash2, 
  Users, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Building2 
} from 'lucide-vue-next'

const router = useRouter()
const mutation = useCreateEvent()
const fundMutation = useCreateRecipientFund('')

const currentStep = ref(0)
const steps = [
  { label: 'Details', title: 'Basic Details', description: 'What are we raising funds for?' },
  { label: 'Allocation', title: 'Recipient Funds', description: 'Where will the money go?' },
  { label: 'Payments', title: 'Currency & Methods', description: 'How can people contribute?' },
  { label: 'Collectors', title: 'Field Team', description: 'Who will record contributions?' },
  { label: 'Review', title: 'Final Review', description: 'Ready to launch your event?' },
]

const form = reactive({
  title: '',
  description: '',
  eventDate: '',
  slug: '',
  funds: [] as { name: string, targetAmount: string }[],
  currency: 'GHS',
})

const errors = ref<Record<string, string>>({})

const totalTarget = computed(() => {
  return form.funds.reduce((acc, curr) => acc + Number(curr.targetAmount || 0), 0)
})

function prevStep() {
  if (currentStep.value === 0) {
    router.push('/admin/events')
  } else {
    currentStep.value--
  }
}

async function nextStep() {
  if (currentStep.value < steps.length - 1) {
    if (validateCurrentStep()) {
      currentStep.value++
    }
  } else {
    await onSubmit()
  }
}

function validateCurrentStep() {
  errors.value = {}
  if (currentStep.value === 0) {
    const result = createEventSchema.safeParse({
      title: form.title,
      description: form.description,
      eventDate: form.eventDate || null
    })
    if (!result.success) {
      applyZodErrors(result.error)
      return false
    }
  }
  if (currentStep.value === 1 && form.funds.length === 0) {
    return false
  }
  return true
}

function addFund() {
  form.funds.push({ name: '', targetAmount: '0' })
}

function removeFund(index: number) {
  form.funds.splice(index, 1)
}

async function onSubmit() {
  try {
    const payload = {
      title: form.title,
      description: form.description,
      eventDate: form.eventDate ? new Date(`${form.eventDate}T00:00:00Z`).toISOString() : null,
      slug: form.slug || undefined
    }

    const createdEvent = await mutation.mutateAsync(payload)

    // Create funds inline
    for (const fund of form.funds) {
      await fundMutation.mutateAsync({
        eventId: createdEvent.id,
        name: fund.name,
        description: '',
        targetAmount: Number(fund.targetAmount)
      })
    }

    await router.push(`/admin/events`)
  } catch (err) {
    console.error('Event launch failed:', err)
  }
}

function getMethodIcon(method: string) {
  switch (method) {
    case 'Card': return CreditCard
    case 'Mobile Money': return Smartphone
    case 'Cash': return Wallet
    case 'Bank Transfer': return Building2
    default: return Building2
  }
}

function applyZodErrors(error: any) {
  for (const issue of error.issues) {
    errors.value[String(issue.path[0])] = issue.message
  }
}
</script>
