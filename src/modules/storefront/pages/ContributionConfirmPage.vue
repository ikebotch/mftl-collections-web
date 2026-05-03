<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Contribution flow"
      title="Confirm contribution"
      description="Review the contribution details before the final payment handoff."
    />

    <div class="max-w-[860px] mx-auto pt-10 pb-20 px-6">
      <AppCard class="overflow-hidden !p-0 border-none shadow-[0_40px_100px_rgba(0,0,0,0.04)]">
        <div v-if="!slug" class="p-20 text-center space-y-6">
          <div class="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
            <LinkIcon class="w-10 h-10" />
          </div>
          <div class="space-y-2">
            <p class="text-2xl font-black text-[#0F172A] tracking-tight">Missing giving link.</p>
            <p class="text-sm text-slate-500 font-medium">Please restart from the giving page.</p>
          </div>
          <AppButton 
            variant="secondary" 
            class="!rounded-2xl"
            @click="router.push('/')"
          >
            Go to Home
          </AppButton>
        </div>

        <template v-else>
          <!-- Top Hero Summary -->
          <div class="p-10 md:p-14 bg-[#0F172A] text-white text-center space-y-4">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-[9px] font-black uppercase tracking-[0.3em]">
              Review contribution
            </span>
            <h2 class="text-6xl font-black tracking-tighter">
              {{ formatCurrency(flowStore.draft.amount, flowStore.draft.currency) }}
            </h2>
            <p class="text-sm font-medium text-white/40 uppercase tracking-widest">
              Towards {{ flowStore.draft.fundName || 'this cause' }}
            </p>
          </div>

          <div class="p-10 md:p-14 space-y-12">
            <div v-if="flowStore.error" class="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <AlertCircle class="w-6 h-6 text-red-500 shrink-0" />
              <p class="text-sm font-bold text-red-600 leading-tight">{{ flowStore.error }}</p>
            </div>

            <!-- Sections Grid -->
            <div class="grid md:grid-cols-2 gap-12">
              <!-- Your Details -->
              <div class="space-y-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <User class="w-4 h-4" />
                  </div>
                  <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Your Details</h4>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Name</p>
                    <p class="text-base font-black text-[#0F172A]">
                      {{ flowStore.draft.anonymous ? 'Anonymous' : flowStore.draft.contributorName || 'Supporter' }}
                    </p>
                  </div>
                  <div v-if="flowStore.draft.contributorEmail">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                    <p class="text-base font-black text-[#0F172A]">{{ flowStore.draft.contributorEmail }}</p>
                  </div>
                  <div v-if="flowStore.draft.contributorPhone">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                    <p class="text-base font-black text-[#0F172A]">{{ flowStore.draft.contributorPhone }}</p>
                  </div>
                </div>
              </div>

              <!-- Payment Information -->
              <div class="space-y-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <CreditCard class="w-4 h-4" />
                  </div>
                  <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Payment</h4>
                </div>

                <div class="space-y-4">
                  <div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Method</p>
                    <p class="text-base font-black text-[#0F172A] capitalize">
                      {{ flowStore.draft.paymentMethod === 'momo' ? 'Mobile Money' : flowStore.draft.paymentMethod === 'bank' ? 'Bank Payment' : 'Card' }}
                      <span v-if="flowStore.draft.momoNetwork" class="text-slate-300 ml-2 font-bold italic">({{ flowStore.draft.momoNetwork.toUpperCase() }})</span>
                    </p>
                  </div>
                  <div>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Currency</p>
                    <p class="text-base font-black text-[#0F172A]">{{ flowStore.draft.currency }}</p>
                  </div>
                  <div v-if="flowStore.draft.paymentMethod === 'bank'" class="flex items-center gap-2 text-[#7C3AED]">
                    <ShieldCheck class="w-4 h-4" />
                    <span class="text-[10px] font-black uppercase tracking-widest">Via GoCardless</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Final Action Footer -->
            <div class="pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8">
              <button
                class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-[#0F172A] transition-colors"
                @click="router.push(`/give/${slug}`)"
              >
                ← Back to edit
              </button>
              
              <button
                class="w-full sm:w-auto min-w-[240px] bg-[#7C3AED] text-white py-6 px-10 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-violet-500/20 hover:bg-[#6D28D9] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                :disabled="flowStore.isSubmitting"
                @click="handleConfirm"
              >
                <template v-if="flowStore.isSubmitting">
                  <Loader2 class="w-5 h-5 animate-spin" />
                  Processing...
                </template>
                <template v-else>
                  Confirm & Pay
                  <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </template>
              </button>
            </div>
          </div>
        </template>
      </AppCard>

      <div class="mt-12 flex items-center justify-center gap-3 opacity-30 grayscale saturate-0">
        <ShieldCheck class="w-5 h-5 text-[#7C3AED]" />
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Encrypted Storefront Protocol</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import { 
  AlertCircle, Loader2, ArrowRight, 
  Link as LinkIcon, User, CreditCard, ShieldCheck 
} from 'lucide-vue-next'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import PageHeader from '@/shared/components/headers/PageHeader.vue'
import { formatCurrency } from '@/core/formatting/formatters'

const route = useRoute()
const router = useRouter()
const slug = computed(() => String(route.params.eventSlug || '').trim())
const flowStore = useContributionFlowStore()

async function handleConfirm() {
  try {
    const res = await flowStore.submit(slug.value)
    if (res && 'success' in res && !res.success) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    console.error("Confirm submission error:", err)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
