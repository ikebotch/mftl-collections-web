<template>
  <div class="max-w-4xl mx-auto py-12 px-6">
    <header class="text-center mb-12">
      <h1 class="text-4xl font-black font-display tracking-tight text-slate-900 mb-4">
        New Recipient Fund
      </h1>
      <p class="text-slate-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">
        Define a new target for contributions within an event.
      </p>
    </header>

    <form @submit.prevent="handleCreate">
      <AppCard class="shadow-premium border-none !p-12 bg-white rounded-[2rem] space-y-10">
        <div class="grid md:grid-cols-2 gap-10">
          <AppInput
            v-model="form.name"
            label="Fund Name"
            placeholder="e.g. Medical Supplies"
            required
          />
          <AppSelect
            v-model="form.eventId"
            label="Associated Event"
            :options="eventOptions"
            required
          />
        </div>

        <AppTextarea
          id="fund-description"
          v-model="form.description"
          label="Description"
          placeholder="What will these contributions be used for?"
          :rows="4"
        />

        <div class="grid md:grid-cols-2 gap-10">
          <AppInput
            v-model="form.targetAmount"
            type="number"
            label="Target Amount"
            placeholder="0.00"
            required
          >
            <template #prefix>
              <span class="text-slate-400 font-bold">{{ form.currency }}</span>
            </template>
          </AppInput>
          <AppSelect
            v-model="form.currency"
            label="Currency"
            :options="[{ label: 'GHS', value: 'GHS' }, { label: 'USD', value: 'USD' }]"
          />
        </div>

        <div class="flex items-center justify-between p-6 rounded-2xl bg-slate-50/50">
          <div class="space-y-1">
            <p class="font-bold text-slate-900">
              Active Status
            </p>
            <p class="text-xs text-slate-500 font-medium">
              Allow contributions to be recorded for this fund.
            </p>
          </div>
          <AppSwitch v-model="form.isActive" />
        </div>
      </AppCard>

      <StickyFormActions>
        <template #left>
          <AppButton 
            variant="outline" 
            class="!rounded-xl"
            @click="router.push({ name: 'admin-funds' })"
          >
            Cancel
          </AppButton>
        </template>
        <AppButton 
          variant="primary" 
          type="submit"
          class="!rounded-xl shadow-premium px-12"
          :loading="mutation.isPending.value"
        >
          Create Fund
        </AppButton>
      </StickyFormActions>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateRecipientFund } from '../composables/useRecipientFunds'
import { useEvents } from '@/modules/events/composables/useEvents'
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
