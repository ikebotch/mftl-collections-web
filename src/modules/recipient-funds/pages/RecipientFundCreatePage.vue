<template>
  <div class="min-h-screen bg-slate-50/50 pb-32">
    <!-- Centered Header Area -->
    <div class="max-w-[1200px] mx-auto pt-16 pb-12 px-8">
      <header class="mb-16">
        <h1 class="text-4xl font-black font-display tracking-tight text-slate-900 mb-4 uppercase">
          Initialize Fund
        </h1>
        <p class="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
          Define a strategic target for contributions within an operational event stream.
        </p>
      </header>

      <AdminWizardLayout 
        :sections="steps" 
        title="Fund Configuration"
      >
        <!-- Step 1: Identity -->
        <AppCard 
          id="section-identity"
          class="!p-10 scroll-mt-10 border-slate-200"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 01
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Fund Identity
            </h2>
          </div>

          <div class="space-y-10">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                v-model="form.name"
                label="Fund Name"
                placeholder="e.g. Infrastructure Development"
                required
              />
              <AppSelect
                v-model="form.eventId"
                label="Campaign Event"
                :options="eventOptions"
                required
              />
            </div>
            <AppTextarea
              id="fund-description"
              v-model="form.description"
              label="Operational Purpose"
              placeholder="Describe what these contributions will fund..."
              :rows="4"
            />
          </div>
        </AppCard>

        <!-- Step 2: Financial Target -->
        <AppCard 
          id="section-target"
          class="!p-10 scroll-mt-10 border-slate-200"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 02
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Financial Strategy
            </h2>
          </div>

          <div class="space-y-10">
            <div class="grid md:grid-cols-2 gap-10">
              <AppInput
                v-model="form.targetAmount"
                type="number"
                label="Strategic Target"
                placeholder="0.00"
                required
              >
                <template #prefix>
                  <span class="text-slate-400 font-bold tracking-tighter">{{ form.currency }}</span>
                </template>
              </AppInput>
              <AppSelect
                v-model="form.currency"
                label="Base Currency"
                :options="[{ label: 'GHS', value: 'GHS' }, { label: 'USD', value: 'USD' }]"
              />
            </div>
          </div>
        </AppCard>

        <!-- Step 3: Deployment -->
        <AppCard 
          id="section-status"
          class="!p-10 scroll-mt-10 border-slate-200"
        >
          <div class="mb-10">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Step 03
            </h3>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Operational Status
            </h2>
          </div>

          <div class="flex items-center justify-between p-8 bg-slate-50 border border-slate-200 group">
            <div class="space-y-1.5">
              <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
                Immediate Deployment
              </p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Allow contributions to be recorded for this fund immediately upon creation.
              </p>
            </div>
            <AppSwitch v-model="form.isActive" />
          </div>
        </AppCard>
      </AdminWizardLayout>
    </div>

    <StickyFormActions>
      <template #left>
        <AppButton 
          variant="outline" 
          class="bg-transparent border-slate-200"
          @click="router.push({ name: 'admin-funds' })"
        >
          Discard
        </AppButton>
      </template>
      <AppButton 
        variant="primary" 
        type="submit"
        class="px-16"
        :loading="mutation.isPending.value"
        @click="handleCreate"
      >
        Initialize Fund
      </AppButton>
    </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateRecipientFund } from '../composables/useRecipientFunds'
import { useEvents } from '@/modules/events/composables/useEvents'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppTextarea from '@/shared/components/forms/AppTextarea.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'

const router = useRouter()
const mutation = useCreateRecipientFund()
const eventsQuery = useEvents()

const steps = [
  { id: 'section-identity', title: 'Identity', subtitle: 'Fund Detail' },
  { id: 'section-target', title: 'Financial', subtitle: 'Target Metrics' },
  { id: 'section-status', title: 'Deployment', subtitle: 'Operational State' },
]

const eventOptions = computed(() => 
  (eventsQuery.data.value || []).map(e => ({ label: e.title, value: e.id }))
)

const form = reactive({
  name: '',
  eventId: '',
  description: '',
  targetAmount: 0,
  currency: 'GHS',
  isActive: true
})

async function handleCreate() {
  if (!form.name || !form.eventId) return
  
  try {
    await mutation.mutateAsync({
      eventId: form.eventId,
      name: form.name,
      description: form.description,
      targetAmount: form.targetAmount
    })
    router.push({ name: 'admin-funds' })
  } catch (err) {
    console.error('Failed to create fund:', err)
  }
}
</script>
