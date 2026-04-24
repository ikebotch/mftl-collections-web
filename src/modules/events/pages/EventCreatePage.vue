<template>
  <div class="max-w-5xl mx-auto py-12 px-6">
    <header class="mb-12 text-center">
      <h1 class="text-4xl font-black font-display tracking-tight text-slate-900">
        {{ currentStep === 5 ? 'Review your event' : 'Create Event' }}
      </h1>
      <p class="text-slate-500 mt-3 font-medium text-lg">
        {{ currentStep === 5 ? 'Check campaign details before publishing.' : 'Set up campaign details, recipient funds, and collection settings.' }}
      </p>
    </header>

    <StepIndicator 
      :steps="['Basics', 'Funds', 'Payments', 'Collectors', 'Review']"
      :current-step="currentStep"
    />

    <AppCard class="shadow-premium border-none !p-0 overflow-hidden min-h-[500px] flex flex-col">
      <div class="flex-1 p-10">
        <!-- Step 1: Basics -->
        <div
          v-if="currentStep === 1"
          class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="grid md:grid-cols-2 gap-8">
            <AppInput 
              v-model="form.title"
              label="Event Title"
              placeholder="e.g. Annual Charity Gala"
              required
            />
            <AppInput 
              v-model="form.slug"
              label="Public URL Slug"
              placeholder="charity-gala-2026"
              prefix="mftl.com/events/"
            />
          </div>
          <AppTextarea 
            id="description"
            v-model="form.description"
            label="Description"
            placeholder="Tell your story and why people should contribute..."
            :rows="4"
          />
          <div class="grid md:grid-cols-2 gap-8">
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
        </div>

        <!-- Step 2: Recipient Funds -->
        <div
          v-if="currentStep === 2"
          class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-slate-900">
              Recipient Funds
            </h3>
            <AppButton
              size="sm"
              variant="outline"
              @click="addFund"
            >
              <Plus class="w-4 h-4 mr-2" /> Add Fund
            </AppButton>
          </div>

          <div class="space-y-4">
            <div 
              v-for="(fund, index) in form.recipientFunds" 
              :key="index"
              class="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex gap-6 items-start group"
            >
              <div class="flex-1 grid md:grid-cols-3 gap-4">
                <AppInput
                  v-model="fund.name"
                  label="Fund Name"
                  placeholder="e.g. Medical Supplies"
                />
                <div class="md:col-span-2">
                  <AppInput
                    v-model="fund.description"
                    label="Description"
                    placeholder="What will this specific fund be used for?"
                  />
                </div>
                <AppInput
                  v-model="fund.targetAmount"
                  type="number"
                  label="Target Amount"
                  placeholder="0.00"
                />
              </div>
              <button 
                class="mt-8 p-2 text-slate-400 hover:text-red-500 transition-colors"
                @click="removeFund(index)"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
            
            <div
              v-if="form.recipientFunds.length === 0"
              class="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl"
            >
              <p class="text-slate-400 font-medium">
                No funds added yet. Every event needs at least one recipient fund.
              </p>
              <AppButton
                class="mt-4"
                size="sm"
                variant="secondary"
                @click="addFund"
              >
                Add your first fund
              </AppButton>
            </div>
          </div>
        </div>

        <!-- Step 3: Payments & Currency -->
        <div
          v-if="currentStep === 3"
          class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div class="grid md:grid-cols-2 gap-10">
            <div class="space-y-6">
              <h3 class="text-lg font-bold text-slate-900">
                Currency Settings
              </h3>
              <AppSelect 
                v-model="form.currency"
                label="Primary Currency"
                :options="[{ label: 'GHS - Ghana Cedi', value: 'GHS' }, { label: 'USD - US Dollar', value: 'USD' }]"
              />
            </div>
            <div class="space-y-6">
              <h3 class="text-lg font-bold text-slate-900">
                Payment Methods
              </h3>
              <div class="space-y-3">
                <label
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-violet-200 cursor-pointer transition-all shadow-sm"
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
        </div>

        <!-- Step 4: Collectors -->
        <div
          v-if="currentStep === 4"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <div class="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6">
            <Users class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-900">
            Assign Collectors
          </h3>
          <p class="text-slate-500 mt-2 max-w-sm font-medium">
            Assignment management is coming soon. You can assign collectors from the Collector Management dashboard after creating the event.
          </p>
          <div class="mt-8 px-4 py-2 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] border border-amber-100">
            Backend Pending
          </div>
        </div>

        <!-- Step 5: Review -->
        <div
          v-if="currentStep === 5"
          class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <section class="grid md:grid-cols-2 gap-8">
            <div>
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Event Details
              </h4>
              <p class="text-2xl font-bold text-slate-900">
                {{ form.title }}
              </p>
              <p class="text-slate-600 mt-2 font-medium">
                {{ form.description || 'No description provided.' }}
              </p>
              <p class="text-sm font-bold text-violet-600 mt-4">
                mftl.com/events/{{ form.slug }}
              </p>
            </div>
            <div>
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Schedule
              </h4>
              <p class="text-lg font-bold text-slate-900">
                {{ formatDate(form.startDate) }} — {{ form.endDate ? formatDate(form.endDate) : 'Indefinite' }}
              </p>
            </div>
          </section>

          <section>
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
              Target Funds
            </h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div
                v-for="fund in form.recipientFunds"
                :key="fund.name"
                class="p-4 rounded-xl border border-slate-100 bg-slate-50"
              >
                <p class="font-bold text-slate-900">
                  {{ fund.name }}
                </p>
                <p class="text-sm text-emerald-600 font-bold mt-1">
                  Target: {{ formatCurrency(fund.targetAmount, form.currency) }}
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <ErrorState
          v-if="submissionError"
          class="mt-8"
          title="Creation failed"
          :message="submissionError"
        />
      </div>

      <footer class="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <AppButton 
          variant="secondary" 
          :disabled="currentStep === 1 || isSubmitting"
          @click="prevStep"
        >
          Back
        </AppButton>
        <div class="flex items-center gap-3">
          <AppButton 
            v-if="currentStep < 5"
            variant="primary" 
            @click="nextStep"
          >
            Continue
          </AppButton>
          <AppButton 
            v-else
            variant="primary" 
            :loading="isSubmitting"
            @click="submit"
          >
            Create & Publish Event
          </AppButton>
        </div>
      </footer>
    </AppCard>
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
import StepIndicator from '@/shared/components/steppers/StepIndicator.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import { formatDate, formatCurrency } from '@/shared/utils/formatters'
import { Plus, Trash2, Users } from 'lucide-vue-next'

const router = useRouter()
const createEventMutation = useCreateEvent()

const currentStep = ref(1)
const isSubmitting = ref(false)
const submissionError = ref<string | null>(null)


const paymentMethods = [
  { id: 'cash', label: 'Cash', description: 'Offline physical currency' },
  { id: 'momo', label: 'Mobile Money', description: 'MTN, Vodafone, AirtelTigo' },
  { id: 'card', label: 'Card / Online', description: 'Credit and Debit cards' },
  { id: 'bank', label: 'Bank Transfer', description: 'Direct wire transfer' }
]

const form = reactive({
  title: '',
  slug: '',
  description: '',
  startDate: '',
  endDate: '',
  currency: 'GHS',
  acceptedMethods: ['cash', 'momo'],
  recipientFunds: [
    { name: '', description: '', targetAmount: 0 }
  ]
})

function nextStep() {
  if (currentStep.value < 5) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

function addFund() {
  form.recipientFunds.push({ name: '', description: '', targetAmount: 0 })
}

function removeFund(index: number) {
  form.recipientFunds.splice(index, 1)
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
      eventDate: form.startDate ? new Date(`${form.startDate}T00:00:00Z`).toISOString() : null,
    })
    
    // 2. Create recipient funds
    const validFunds = form.recipientFunds.filter(f => f.name.trim())
    if (validFunds.length > 0) {
      const results = await Promise.allSettled(
        validFunds.map(f => recipientFundsService.create({
          eventId: event.id,
          name: f.name,
          description: f.description,
          targetAmount: f.targetAmount,
        }))
      )

      const failures = results.filter(r => r.status === 'rejected')
      if (failures.length > 0) {
        submissionError.value = `Event created, but ${failures.length} fund(s) failed to save. Please check event details.`
        // Still redirect after a short delay so they can see the error
        setTimeout(() => {
          router.push(`/admin/events`)
        }, 3000)
        return
      }
    }
    
    // 3. Navigate to list
    router.push(`/admin/events`)
  } catch (err: any) {
    submissionError.value = err.message || 'Failed to create event. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
