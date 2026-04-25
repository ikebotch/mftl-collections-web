<template>
  <div class="space-y-8 pb-24">
    <LoadingState
      v-if="query.isLoading.value"
      text="Verifying receipt…"
      variant="dark"
      class="pt-20"
    />
    
    <ErrorState
      v-else-if="query.isError.value"
      title="Receipt Not Found"
      variant="dark"
      :message="query.error.value?.message ?? 'The receipt link may be invalid or expired.'"
      show-retry
      @retry="query.refetch"
    />

    <template v-else-if="query.data.value">
      <header class="text-center pt-6 animate-in fade-in zoom-in duration-700">
        <div class="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-6 border border-emerald-500/30">
          <CheckCircle2 class="w-10 h-10" />
        </div>
        <h2 class="text-3xl font-black text-white tracking-tight">
          Gift Recorded
        </h2>
        <p class="text-slate-400 mt-2 font-medium">
          Digital receipt issued successfully.
        </p>
      </header>

      <div class="relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <!-- Receipt Top Cutout Decoration -->
        <div class="absolute -top-3 left-0 right-0 h-6 bg-[#060B16] rounded-b-[2rem] z-10" />
        
        <article class="bg-white rounded-[2.5rem] p-8 text-slate-900 shadow-2xl relative overflow-hidden">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
            <div class="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>

          <div class="relative z-20">
            <div class="flex justify-between items-start mb-12">
              <div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Receipt No.
                </p>
                <p class="text-xl font-black font-display tracking-tight mt-1">
                  {{ query.data.value.receiptNumber }}
                </p>
              </div>
              <div class="px-3 py-1.5 rounded-xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200/50">
                {{ query.data.value.status }}
              </div>
            </div>

            <div class="space-y-8">
              <div class="flex flex-col items-center border-b border-slate-100 pb-10">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Contribution</span>
                <span class="text-5xl font-black tracking-tighter">{{ query.data.value.amount }}</span>
              </div>

              <div class="grid grid-cols-2 gap-y-10 gap-x-8">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                    Donor
                  </p>
                  <p class="text-sm font-bold text-slate-900 truncate">
                    {{ query.data.value.isAnonymous ? 'Anonymous' : query.data.value.contributorName }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                    Event
                  </p>
                  <p class="text-sm font-bold text-slate-900 truncate">
                    {{ query.data.value.eventTitle }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                    Method
                  </p>
                  <p class="text-sm font-bold text-slate-900">
                    {{ query.data.value.paymentMethod }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                    Date
                  </p>
                  <p class="text-sm font-bold text-slate-900">
                    {{ query.data.value.issuedAt.split(',')[0] }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                    Collector
                  </p>
                  <p class="text-sm font-bold text-slate-900 truncate">
                    {{ query.data.value.collectorName }}
                  </p>
                </div>
              </div>

              <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100/50 text-center mt-10">
                <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                  Verification Hash
                </p>
                <p class="text-[8px] font-mono text-slate-400 break-all leading-relaxed uppercase opacity-60">
                  MFTL-COL-{{ query.data.value.receiptNumber }}-{{ Date.now().toString(16) }}
                </p>
              </div>
            </div>
          </div>
        </article>

        <!-- Receipt Bottom Cutout Decoration -->
        <div class="absolute -bottom-3 left-0 right-0 h-6 bg-[#060B16] rounded-t-[2rem] z-10" />
      </div>

      <div class="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <AppButton 
          variant="primary" 
          class="w-full !rounded-[2rem] !py-6 text-lg bg-white text-slate-950 hover:bg-slate-100 shadow-[0_20px_40px_rgba(255,255,255,0.05)]" 
          @click="router.push('/collector/contributions/new')"
        >
          <Plus class="w-5 h-5 mr-2" /> Record Another Gift
        </AppButton>
        
        <div class="grid grid-cols-2 gap-4">
          <AppButton 
            variant="ghost" 
            class="bg-white/5 !rounded-[1.5rem] !py-4 hover:bg-white/10"
            @click="shareReceipt"
          >
            <Share2 class="w-5 h-5 mr-2 text-cyan-400" /> <span class="text-sm font-bold">Share</span>
          </AppButton>
          <AppButton 
            variant="ghost" 
            class="bg-white/5 !rounded-[1.5rem] !py-4 hover:bg-white/10"
            @click="router.push('/collector')"
          >
            <LayoutGrid class="w-5 h-5 mr-2 text-violet-400" /> <span class="text-sm font-bold">Done</span>
          </AppButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReceipt } from '@/modules/receipts/composables/useReceipts'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { 
  CheckCircle2, 
  Share2, 
  Plus, 
  LayoutGrid 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const receiptId = computed(() => String(route.params.id ?? ''))
const query = useReceipt(receiptId.value)

function shareReceipt() {
  if (navigator.share) {
    navigator.share({
      title: 'MFTL Contribution Receipt',
      text: `Receipt for contribution: ${query.data.value?.receiptNumber}`,
      url: window.location.href,
    }).catch(console.error)
  } else {
    alert('Sharing is not supported on this browser. Copy the URL to share.')
  }
}
</script>
