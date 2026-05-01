<template>
  <div class="space-y-16 animate-fade-in">
    <div class="space-y-4 text-center">
      <p class="text-[10px] font-black uppercase tracking-[0.4em] text-violet-600">
        Step 02 / 04
      </p>
      <h2 class="text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight">
        Your Details
      </h2>
      <p class="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
        Please provide your contact information to receive your digital receipt.
      </p>
    </div>

    <div class="pt-8 space-y-12">
      <!-- Anonymous Toggle -->
      <label class="group flex items-center justify-between p-6 border-2 border-slate-100 hover:border-violet-100 transition-all cursor-pointer rounded-none">
        <div class="space-y-1">
          <p class="text-sm font-bold text-slate-900">Make this an anonymous contribution</p>
          <p class="text-xs text-slate-500">Your name will not be displayed on the public ledger.</p>
        </div>
        <div class="relative inline-flex items-center">
          <input
            v-model="anonymous"
            type="checkbox"
            class="peer sr-only"
          >
          <div class="w-11 h-6 bg-slate-100 rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
        </div>
      </label>

      <form
        v-if="!anonymous"
        class="space-y-8"
        @submit.prevent="onSubmit"
      >
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Contributor Name</label>
            <input
              v-model="contributorName"
              type="text"
              class="w-full bg-transparent border-b border-slate-200 py-3 text-xl font-bold text-slate-900 focus:outline-none focus:border-violet-600 transition-all placeholder:text-slate-200"
              placeholder="Jane Doe"
            >
            <p
              v-if="errors.contributorName"
              class="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1"
            >
              {{ errors.contributorName }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
            <input
              v-model="contributorPhone"
              type="tel"
              class="w-full bg-transparent border-b border-slate-200 py-3 text-xl font-bold text-slate-900 focus:outline-none focus:border-violet-600 transition-all placeholder:text-slate-200"
              placeholder="+233..."
            >
            <p
              v-if="errors.contributorPhone"
              class="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1"
            >
              {{ errors.contributorPhone }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
          <input
            v-model="contributorEmail"
            type="email"
            class="w-full bg-transparent border-b border-slate-200 py-3 text-xl font-bold text-slate-900 focus:outline-none focus:border-violet-600 transition-all placeholder:text-slate-200"
            placeholder="jane@example.com"
          >
          <p
            v-if="errors.contributorEmail"
            class="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1"
          >
            {{ errors.contributorEmail }}
          </p>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Dedication (Optional)</label>
          <textarea
            v-model="note"
            rows="3"
            class="w-full bg-transparent border-b border-slate-200 py-3 text-lg font-medium text-slate-700 focus:outline-none focus:border-violet-600 transition-all placeholder:text-slate-200 resize-none"
            placeholder="Write a short message or dedication..."
          />
        </div>
      </form>

      <div
        v-else
        class="py-12 text-center space-y-4"
      >
        <div class="w-16 h-16 rounded-none bg-slate-50 flex items-center justify-center mx-auto text-2xl">
          🕵️
        </div>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">
          You are contributing anonymously
        </p>
        <button 
          class="text-xs font-bold text-violet-600 uppercase tracking-widest hover:underline"
          @click="anonymous = false"
        >
          Disable anonymous mode
        </button>
      </div>

      <div class="flex items-center justify-between gap-6 pt-12 border-t border-slate-100">
        <AppButton
          variant="ghost"
          size="lg"
          class="text-xs font-black uppercase tracking-[0.2em] px-0 hover:bg-transparent hover:text-violet-600"
          @click="router.push(`/give/${eventSlug}/recipient`)"
        >
          ← Back to recipient
        </AppButton>
        <AppButton 
          size="lg"
          class="bg-slate-900 text-white min-w-[200px] shadow-xl hover:bg-violet-600 transition-all duration-500 text-xs font-black uppercase tracking-[0.2em]"
          @click="onSubmit"
        >
          Continue to Payment
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import { contributorDetailsSchema } from '../validators/storefrontValidators'
import AppButton from '@/shared/components/buttons/AppButton.vue'

import { useStorefrontEvent } from '../composables/useStorefront'

const route = useRoute()
const router = useRouter()
const flowStore = useContributionFlowStore()

const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const { data: event } = useStorefrontEvent(eventSlug.value)

watchEffect(() => {
  if (event.value) {
    flowStore.initialise(eventSlug.value, event.value.id)
  } else {
    flowStore.initialise(eventSlug.value)
  }
})
const contributorName = ref(flowStore.draft.contributorName)
const contributorPhone = ref(flowStore.draft.contributorPhone)
const contributorEmail = ref(flowStore.draft.contributorEmail)
const anonymous = ref(flowStore.draft.anonymous)
const note = ref(flowStore.draft.note)
const errors = ref<Record<string, string>>({})

function onSubmit() {
  errors.value = {}
  const result = contributorDetailsSchema.safeParse({
    contributorName: contributorName.value,
    contributorPhone: contributorPhone.value,
    contributorEmail: contributorEmail.value,
    anonymous: anonymous.value,
    note: note.value,
  })

  if (!result.success) {
    applyZodErrors(result.error)
    return
  }

  flowStore.patch(result.data)
  void router.push(`/give/${eventSlug.value}/payment`)
}

function applyZodErrors(error: z.ZodError) {
  for (const issue of error.issues) {
    errors.value[String(issue.path[0] ?? '')] = issue.message
  }
}
</script>
