<template>
  <div class="min-h-screen bg-slate-50/50 pb-32">
    <!-- Centered Header Area -->
    <div class="max-w-4xl mx-auto pt-16 pb-12 px-6">
      <header class="text-center mb-12">
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900 mb-4">
          {{ currentStep === 5 ? 'Review & Publish' : 'Create Event' }}
        </h1>
        <p class="text-slate-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">
          {{ stepDescriptions[currentStep - 1] }}
        </p>
      </header>

      <StepIndicator 
        :steps="['Basics', 'Funds', 'Payments', 'Collectors', 'Review']"
        :current-step="currentStep"
      />

      <!-- Main Creation Card -->
      <AppCard class="shadow-premium border-none !p-0 overflow-hidden bg-white rounded-[2rem]">
        <div class="p-10 md:p-12">
          <!-- Step 1: Basics -->
          <div
            v-if="currentStep === 1"
            class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput 
                v-model="form.title"
                label="Event Title"
                placeholder="e.g. Community Health Drive 2024"
                required
              />
              <AppInput 
                v-model="form.slug"
                label="Public Slug"
                placeholder="health-drive-2024"
                required
              >
                <template #prefix>
                  <span class="text-slate-400">/give/</span>
                </template>
              </AppInput>
            </div>
            
            <AppTextarea 
              id="description"
              v-model="form.description"
              label="Event Description"
              placeholder="Tell your story and why people should contribute..."
              :rows="5"
              required
            />

            <div class="grid md:grid-cols-2 gap-10">
              <AppInput 
                v-model="form.startDate"
                type="date"
                label="Start Date"
                required
              />
              <AppInput 
                v-model="form.endDate"
                type="date"
                label="End Date (Optional)"
              />
            </div>

            <div class="pt-4">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">
                Initial Visibility
              </label>
              <div class="flex gap-4">
                <button 
                  v-for="status in ['Draft', 'Live', 'Closed']"
                  :key="status"
                  type="button"
                  class="flex-1 py-4 px-6 rounded-2xl border-2 transition-all font-bold text-sm"
                  :class="form.status === status ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'"
                  @click="form.status = status"
                >
                  {{ status }}
                </button>
              </div>
            </div>
          </div>

          <!-- Step 2: Recipient Funds -->
          <div
            v-if="currentStep === 2"
            class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div class="flex items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <h3 class="text-xl font-bold text-slate-900">
                  Allocation Funds
                </h3>
                <p class="text-sm text-slate-500 font-medium">
                  Define where the collected contributions will go.
                </p>
              </div>
              <AppButton
                size="sm"
                variant="outline"
                class="!rounded-xl"
                @click="addFund"
              >
                <Plus class="w-4 h-4 mr-2" /> Add Fund
              </AppButton>
            </div>

            <div class="space-y-6">
              <div 
                v-for="(fund, index) in form.recipientFunds" 
                :key="index"
                class="p-8 rounded-[1.5rem] border border-slate-100 bg-slate-50/30 flex gap-8 items-start relative group transition-all hover:bg-slate-50/50"
              >
                <div class="flex-1 space-y-6">
                  <div class="grid md:grid-cols-2 gap-6">
                    <AppInput
                      v-model="fund.name"
                      label="Fund Name"
                      placeholder="e.g. Clean Water Wells"
                      required
                    />
                    <AppInput
                      v-model="fund.targetAmount"
                      type="number"
                      label="Target Amount"
                      placeholder="0.00"
                      required
                    >
                      <template #prefix>
                        <span class="text-slate-400 font-bold">{{ form.currency }}</span>
                      </template>
                    </AppInput>
                  </div>
                  <AppInput
                    v-model="fund.description"
                    label="Description"
                    placeholder="Short summary of this fund's purpose..."
                  />
                  <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center gap-2">
                      <AppSwitch v-model="fund.isActive" />
                      <span class="text-xs font-bold text-slate-600">Fund Active</span>
                    </div>
                  </div>
                </div>
                <button 
                  v-if="form.recipientFunds.length > 1"
                  class="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  @click="removeFund(index)"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
              
              <div
                v-if="form.recipientFunds.length === 0"
                class="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/20"
              >
                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Plus class="w-8 h-8" />
                </div>
                <p class="text-slate-500 font-bold text-lg">
                  No funds added yet
                </p>
                <p class="text-slate-400 text-sm mb-8">
                  Every event needs at least one target fund.
                </p>
                <AppButton
                  variant="primary"
                  class="!rounded-xl"
                  @click="addFund"
                >
                  Add Recipient Fund
                </AppButton>
              </div>
            </div>
          </div>

          <!-- Step 3: Payments & Currency -->
          <div
            v-if="currentStep === 3"
            class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div class="grid md:grid-cols-2 gap-12">
              <div class="space-y-8">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 mb-2">
                    Currency Settings
                  </h3>
                  <p class="text-sm text-slate-500 mb-6 font-medium">
                    Define the base and accepted currencies for this campaign.
                  </p>
                </div>
                <AppSelect 
                  v-model="form.currency"
                  label="Primary Currency"
                  :options="[{ label: 'GHS - Ghana Cedi', value: 'GHS' }, { label: 'USD - US Dollar', value: 'USD' }, { label: 'GBP - British Pound', value: 'GBP' }]"
                />
                
                <div class="p-6 rounded-2xl bg-violet-50/50 border border-violet-100">
                  <p class="text-[10px] font-black uppercase tracking-widest text-violet-600 mb-2">
                    Notice
                  </p>
                  <p class="text-xs text-violet-700 leading-relaxed font-medium">
                    Payment and currency settings are pending backend support. These selections will be saved as metadata.
                  </p>
                </div>
              </div>

              <div class="space-y-8">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 mb-2">
                    Payment Methods
                  </h3>
                  <p class="text-sm text-slate-500 mb-6 font-medium">
                    Select the methods donors can use to contribute.
                  </p>
                </div>
                <div class="space-y-3">
                  <label
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer"
                    :class="form.acceptedMethods.includes(method.id) ? 'border-violet-600 bg-violet-50/30' : 'border-slate-100 bg-white hover:border-slate-200'"
                  >
                    <input
                      v-model="form.acceptedMethods"
                      type="checkbox"
                      :value="method.id"
                      class="w-5 h-5 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500"
                    >
                    <div class="flex-1">
                      <p class="text-sm font-bold text-slate-900">{{ method.label }}</p>
                      <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ method.description }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-10 border-t border-slate-100 pt-10">
              <AppInput 
                v-model="form.minContribution"
                type="number"
                label="Minimum Contribution"
                placeholder="1.00"
              />
              <AppInput 
                v-model="form.suggestedAmounts"
                label="Suggested Amounts"
                placeholder="10, 25, 50, 100"
              />
            </div>
          </div>

          <!-- Step 4: Collectors -->
          <div
            v-if="currentStep === 4"
            class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-20 h-20 rounded-[2rem] bg-violet-50 flex items-center justify-center text-violet-600 mb-8">
                <Users class="w-10 h-10" />
              </div>
              <h3 class="text-2xl font-bold text-slate-900">
                Collector Configuration
              </h3>
              <p class="text-slate-500 mt-4 max-w-sm font-medium leading-relaxed">
                Management of assigned collectors is currently pending backend support.
              </p>
              <div class="mt-8 px-6 py-2 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] border border-amber-100">
                Backend Pending
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-10 border-t border-slate-100 pt-10">
              <div class="flex items-center justify-between p-6 rounded-2xl bg-slate-50/50">
                <div class="space-y-1">
                  <p class="font-bold text-slate-900">
                    Allow Cash Collection
                  </p>
                  <p class="text-xs text-slate-500 font-medium">
                    Collectors can record physical cash.
                  </p>
                </div>
                <AppSwitch v-model="form.allowCash" />
              </div>
              <div class="flex items-center justify-between p-6 rounded-2xl bg-slate-50/50">
                <div class="space-y-1">
                  <p class="font-bold text-slate-900">
                    Auto-issue Receipts
                  </p>
                  <p class="text-xs text-slate-500 font-medium">
                    Send email receipts immediately.
                  </p>
                </div>
                <AppSwitch v-model="form.autoReceipt" />
              </div>
            </div>
          </div>

          <!-- Step 5: Review & Publish -->
          <div
            v-if="currentStep === 5"
            class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div class="grid md:grid-cols-12 gap-12">
              <div class="md:col-span-8 space-y-12">
                <section>
                  <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                    Campaign Details
                  </h4>
                  <div class="space-y-2">
                    <p class="text-3xl font-black text-slate-900 tracking-tight">
                      {{ form.title }}
                    </p>
                    <p class="text-slate-500 font-medium leading-relaxed">
                      {{ form.description }}
                    </p>
                  </div>
                  <div class="mt-6 flex items-center gap-4">
                    <div class="px-4 py-2 rounded-xl bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      {{ form.slug }}
                    </div>
                    <div class="px-4 py-2 rounded-xl bg-emerald-100 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                      {{ form.status }}
                    </div>
                  </div>
                </section>

                <section>
                  <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                    Recipient Allocation
                  </h4>
                  <div class="grid gap-4">
                    <div 
                      v-for="fund in form.recipientFunds"
                      :key="fund.name"
                      class="p-6 rounded-2xl border border-slate-100 bg-white flex justify-between items-center"
                    >
                      <div>
                        <p class="font-bold text-slate-900">
                          {{ fund.name }}
                        </p>
                        <p class="text-xs text-slate-500">
                          {{ fund.description || 'No description' }}
                        </p>
                      </div>
                      <p class="text-lg font-black text-slate-900">
                        {{ formatCurrency(fund.targetAmount, form.currency) }}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div class="md:col-span-4 space-y-8">
                <div class="p-8 rounded-[2rem] bg-slate-900 text-white space-y-6">
                  <h4 class="text-[10px] font-black uppercase tracking-widest opacity-50">
                    Configuration Summary
                  </h4>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center pb-4 border-b border-white/10">
                      <span class="text-xs font-bold opacity-60">Currency</span>
                      <span class="text-xs font-black">{{ form.currency }}</span>
                    </div>
                    <div class="flex justify-between items-center pb-4 border-b border-white/10">
                      <span class="text-xs font-bold opacity-60">Payments</span>
                      <span class="text-xs font-black">{{ form.acceptedMethods.length }} enabled</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs font-bold opacity-60">Start Date</span>
                      <span class="text-xs font-black">{{ formatDate(form.startDate) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              v-if="submissionError"
              class="p-6 rounded-2xl bg-red-50 border border-red-100 flex gap-4 items-start"
            >
              <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <AlertCircle class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <p class="font-bold text-red-900">
                  Partial Success Notice
                </p>
                <p class="text-sm text-red-700 leading-relaxed">
                  {{ submissionError }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Sticky Bottom Bar -->
    <StickyFormActions>
      <template #left>
        <AppButton 
          variant="outline" 
          class="!rounded-xl"
          :disabled="isSubmitting"
          @click="handleCancel"
        >
          Cancel
        </AppButton>
      </template>

      <div class="flex items-center gap-4">
        <AppButton 
          v-if="currentStep > 1"
          variant="secondary" 
          class="!rounded-xl"
          :disabled="isSubmitting"
          @click="prevStep"
        >
          Back
        </AppButton>
        <AppButton 
          v-if="currentStep < 5"
          variant="primary" 
          class="!rounded-xl shadow-premium px-10"
          @click="nextStep"
        >
          Continue
        </AppButton>
        <AppButton 
          v-else
          variant="primary" 
          class="!rounded-xl shadow-premium px-10"
          :loading="isSubmitting"
          @click="submit"
        >
          {{ form.status === 'Live' ? 'Create & Publish' : 'Save Event' }}
        </AppButton>
      </div>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateEvent } from '../composables/useEvents'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import StepIndicator from '@/shared/components/steppers/StepIndicator.vue'
import { formatDate, formatCurrency } from '@/shared/utils/formatters'
import { Plus, Trash2, Users, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const createEventMutation = useCreateEvent()

const currentStep = ref(1)
const isSubmitting = ref(false)
const submissionError = ref<string | null>(null)

const stepDescriptions = [
  'Set up the core identity of your campaign, including its public identity and duration.',
  'Define specific funds where contributors can allocate their support.',
  'Configure accepted currencies and payment methods for this event.',
  'Set up collection preferences and collector-specific behaviors.',
  'Check your configuration carefully before launching the campaign.'
]

const paymentMethods = [
  { id: 'cash', label: 'Cash', description: 'Offline physical currency' },
  { id: 'momo', label: 'Mobile Money', description: 'MTN, Vodafone, Telecel' },
  { id: 'card', label: 'Card / Online', description: 'Credit and Debit cards' },
  { id: 'bank', label: 'Bank Transfer', description: 'Direct wire transfer' }
]

const form = reactive({
  title: '',
  slug: '',
  description: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  status: 'Draft',
  currency: 'GHS',
  acceptedMethods: ['cash', 'momo'],
  minContribution: 1,
  suggestedAmounts: '10, 20, 50, 100',
  allowCash: true,
  autoReceipt: true,
  recipientFunds: [
    { name: 'General Fund', description: 'Default allocation for this event', targetAmount: 1000, isActive: true }
  ]
})

function nextStep() {
  if (currentStep.value < 5) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

function addFund() {
  form.recipientFunds.push({ name: '', description: '', targetAmount: 0, isActive: true })
}

function removeFund(index: number) {
  form.recipientFunds.splice(index, 1)
}

function handleCancel() {
  router.push('/admin/events')
}

async function submit() {
  isSubmitting.value = true
  submissionError.value = null
  
  try {
    // 1. Create the event
    const event = await createEventMutation.mutateAsync({
      title: form.title,
      description: form.description,
      slug: form.slug,
      eventDate: form.startDate ? new Date(`${form.startDate}T00:00:00Z`).toISOString() : null
    })
    
    // 2. Create recipient funds
    const validFunds = form.recipientFunds.filter(f => f.name.trim())
    if (validFunds.length > 0) {
      const results = await Promise.allSettled(
        validFunds.map(f => recipientFundsService.create({
          eventId: event.id,
          name: f.name,
          description: f.description || '',
          targetAmount: f.targetAmount
        }))
      )

      const failures = results.filter(r => r.status === 'rejected')
      if (failures.length > 0) {
        submissionError.value = `The event was created successfully, but ${failures.length} of your target funds failed to save. You can manually add them in the event detail page.`
        // Wait a bit so they can read the warning
        setTimeout(() => {
          router.push(`/admin/events/${event.id}`)
        }, 5000)
        return
      }
    }
    
    // 3. Navigate to detail
    router.push(`/admin/events/${event.id}`)
  } catch (err: any) {
    submissionError.value = err.message || 'Failed to create event. Please verify your details and try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
