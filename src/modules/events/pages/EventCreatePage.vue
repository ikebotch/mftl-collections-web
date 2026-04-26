<template>
  <div class="min-h-screen bg-slate-50/50 pb-32">
    <!-- Centered Header Area -->
    <div class="max-w-[1200px] mx-auto pt-16 pb-12 px-8">
      <header class="mb-16">
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900 mb-4">
          Create New Event
        </h1>
        <p class="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
          Set up a new collection campaign, define target funds, and configure payment methods.
        </p>
      </header>

      <AdminWizardLayout 
        :sections="steps" 
        title="Creation Steps"
      >
        <!-- Step 1: Basics -->
        <AppCard 
          id="section-basics"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 01
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Event Basics
            </h2>
          </div>

          <div class="space-y-10">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput 
                v-model="form.title"
                label="Event Title"
                placeholder="e.g. Community Health Drive 2024"
                required
              />
              <AppSelect 
                v-model="form.branchId"
                label="Operational Branch"
                placeholder="Select the hosting hub..."
                :options="branchOptions"
                :loading="isLoadingBranches"
                required
              />
            </div>

            <div class="grid md:grid-cols-2 gap-10 pt-4">
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
                  class="flex-1 py-4 px-6 rounded-none border-2 transition-all font-bold text-sm"
                  :class="form.status === status ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400'"
                  @click="form.status = status"
                >
                  {{ status }}
                </button>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Step 2: Recipient Funds -->
        <AppCard 
          id="section-funds"
          class="!p-10 scroll-mt-10"
        >
          <div class="flex items-center justify-between mb-10">
            <div>
              <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                Step 02
              </h3>
              <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase">
                Recipient Funds
              </h2>
            </div>
            <AppButton
              size="sm"
              variant="outline"
              @click="addFund"
            >
              <Plus class="w-4 h-4 mr-2" /> Add Fund
            </AppButton>
          </div>

          <div class="space-y-6">
            <div 
              v-for="(fund, index) in form.recipientFunds" 
              :key="index"
              class="p-8 rounded-none border border-slate-200 bg-slate-50/20 flex gap-8 items-start relative group transition-all"
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
                    label="Fund Target"
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
          </div>
        </AppCard>

        <!-- Step 3: Modern Images -->
        <AppCard 
          id="section-images"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 03
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Media & Branding
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-12">
            <ModernImageInput 
              v-model="form.displayImageUrl"
              label="System / Display Image"
              :icon="ImageIcon"
            />
            <ModernImageInput 
              v-model="form.receiptLogoUrl"
              label="Receipt / POS Logo"
              :icon="Printer"
            />
          </div>
        </AppCard>

        <!-- Step 4: Payments -->
        <AppCard 
          id="section-payments"
          class="!p-10 scroll-mt-10"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 04
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              Payments & Currency
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-12">
            <div class="space-y-8">
              <AppSelect 
                v-model="form.currency"
                label="Primary Currency"
                :options="[{ label: 'GHS - Ghana Cedi', value: 'GHS' }, { label: 'USD - US Dollar', value: 'USD' }, { label: 'GBP - British Pound', value: 'GBP' }]"
              />
              
              <div class="p-6 border border-slate-200 bg-slate-50 italic text-xs text-slate-500">
                Notice: Extended payment configuration will be available in the campaign settings after creation.
              </div>
            </div>

            <div class="space-y-4">
              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="flex items-center gap-4 p-5 border transition-all cursor-pointer"
                :class="form.acceptedMethods.includes(method.id) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-400'"
              >
                <input
                  v-model="form.acceptedMethods"
                  type="checkbox"
                  :value="method.id"
                  class="w-5 h-5 rounded-none border-slate-300 text-violet-600 focus:ring-violet-500"
                >
                <div class="flex-1 text-left">
                  <p class="text-sm font-bold">{{ method.label }}</p>
                  <p class="text-[10px] font-bold uppercase tracking-widest opacity-60">{{ method.description }}</p>
                </div>
              </label>
            </div>
          </div>
        </AppCard>
      </AdminWizardLayout>
    </div>

    <!-- Sticky Bottom Bar -->
    <StickyFormActions>
      <template #left>
        <div class="flex items-center gap-4">
          <AppButton 
            variant="outline" 
            :disabled="isSubmitting"
            @click="handleCancel"
          >
            Cancel
          </AppButton>
          <div v-if="isSubmitting" class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
            <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Publishing Event...</span>
          </div>
        </div>
      </template>

      <AppButton 
        variant="primary" 
        class="px-12"
        :loading="isSubmitting"
        @click="submit"
      >
        {{ form.status === 'Live' ? 'Create & Publish' : 'Save Event' }}
      </AppButton>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateEvent } from '../composables/useEvents'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'
import { branchesService } from '@/modules/tenants/services/branchesService'
import { useToastStore } from '@/shared/stores/useToastStore'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import ModernImageInput from '@/shared/components/forms/ModernImageInput.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import { Plus, Trash2, Image as ImageIcon, Printer } from 'lucide-vue-next'

const router = useRouter()
const toast = useToastStore()
const createEventMutation = useCreateEvent()

const steps = [
  { id: 'section-basics', title: 'Basics', subtitle: 'Title & Identity' },
  { id: 'section-funds', title: 'Funds', subtitle: 'Target Allocation' },
  { id: 'section-images', title: 'Branding', subtitle: 'Images & Logos' },
  { id: 'section-payments', title: 'Payments', subtitle: 'Financial Config' },
]

const isSubmitting = ref(false)
const isLoadingBranches = ref(true)
const branchOptions = ref([])

const paymentMethods = [
  { id: 'cash', label: 'Cash', description: 'Offline physical currency' },
  { id: 'momo', label: 'Mobile Money', description: 'MTN, Vodafone, Telecel' },
  { id: 'card', label: 'Card / Online', description: 'Credit and Debit cards' },
]

const form = reactive({
  title: '',
  slug: '',
  description: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  status: 'Draft',
  currency: 'GHS',
  displayImageUrl: '',
  receiptLogoUrl: '',
  branchId: null as string | null,
  acceptedMethods: ['cash', 'momo'],
  minContribution: 1,
  suggestedAmounts: '10, 20, 50, 100',
  allowCash: true,
  autoReceipt: true,
  recipientFunds: [
    { name: 'General Fund', description: 'Default allocation for this event', targetAmount: 1000, isActive: true }
  ]
})

async function fetchBranches() {
  try {
    const data = await branchesService.list()
    branchOptions.value = data.map(b => ({ label: b.name, value: b.id }))
  } catch (err) {
    console.error('Failed to load branches:', err)
  } finally {
    isLoadingBranches.value = false
  }
}

onMounted(fetchBranches)

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
  if (!form.title || !form.slug || !form.branchId) {
    toast.error('Please complete all required fields, including the Operational Branch')
    return
  }

  isSubmitting.value = true
  
  try {
    const event = await createEventMutation.mutateAsync({
      title: form.title,
      description: form.description,
      slug: form.slug,
      eventDate: form.startDate ? new Date(`${form.startDate}T00:00:00Z`).toISOString() : null,
      displayImageUrl: form.displayImageUrl,
      receiptLogoUrl: form.receiptLogoUrl,
      branchId: form.branchId
    })
    
    const validFunds = form.recipientFunds.filter(f => f.name.trim())
    if (validFunds.length > 0) {
      await Promise.all(
        validFunds.map(f => recipientFundsService.create({
          eventId: event.id,
          name: f.name,
          description: f.description || '',
          targetAmount: f.targetAmount
        }))
      )
    }
    
    toast.success('Event created successfully')
    router.push(`/admin/events/${event.id}`)
  } catch (err: any) {
    console.error('Submission failed:', err)
    toast.error(err.message || 'Failed to create event')
  } finally {
    isSubmitting.value = false
  }
}
</script>
