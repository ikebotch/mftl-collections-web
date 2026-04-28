<template>
  <div class="h-screen bg-slate-50 overflow-hidden flex flex-col lg:flex-row relative selection:bg-violet-100 selection:text-violet-900">
    
    <!-- Left Column: Cinematic Showcase (Fixed) -->
    <div class="hidden lg:flex lg:w-[48%] xl:w-[53%] h-full flex-col p-10 xl:p-14 relative z-10 overflow-hidden">
      
      <!-- Top Branding with Contributors -->
      <div class="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-2xl shadow-violet-600/20">
            <span class="text-white font-black text-xl font-display">M</span>
          </div>
          <div>
            <h1 class="text-lg font-black font-display tracking-tight leading-none text-[#0F172A]">
              MFTL Collections
            </h1>
            <p class="text-[9px] uppercase tracking-[0.4em] text-[#64748B] mt-1 font-black opacity-60">
              Contribution Protocol
            </p>
          </div>
        </div>

        <!-- Contributors moved to top right -->
        <div class="flex flex-col items-end gap-2">
          <div class="flex -space-x-3">
            <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-[3px] border-white bg-slate-100 shadow-sm"></div>
          </div>
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">320 Contributors</span>
        </div>
      </div>

        <!-- Main Showcase -->
        <div class="flex-1 flex flex-col gap-10 min-h-0 pb-10">
          <!-- Hero Section -->
          <div class="space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            
            <div class="relative inline-flex items-start gap-5">
              <h2 class="text-5xl xl:text-6xl font-black text-[#0F172A] leading-[0.85] tracking-tighter">
                {{ eventQuery.data.value?.name || 'Again' }}<span class="text-[#7C3AED]">.</span>
              </h2>
              
              <!-- Badges Top-Aligned with Heading -->
              <div class="flex items-center gap-2 mt-1.5">
                <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-100 text-[#0F172A] text-[6px] font-black uppercase tracking-widest shadow-sm">
                  <div class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                  Live
                </div>
                <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-100 text-[#7C3AED] text-[6px] font-black uppercase tracking-widest shadow-sm">
                  <ShieldCheck class="w-2 h-2 fill-current opacity-30" />
                  Verified
                </div>
              </div>
            </div>
  
            <div class="space-y-2">
              <p class="text-[10px] font-black text-[#7C3AED]/40 uppercase tracking-[0.4em] font-display italic">Community Support</p>
              <p class="text-base text-slate-500 font-medium leading-relaxed max-w-[646px]">
                Many families are struggling to put food on the table. Your support can provide meals.
              </p>
            </div>
          </div>
  
        <!-- Showcase Column: Cinematic Branding -->
      <div class="flex-1 flex flex-col justify-center max-w-[760px]">
        
        <!-- Hero Image with Integrated Metrics -->
        <div class="relative group mb-10 animate-in fade-in zoom-in-95 duration-1000">
          <div class="aspect-[21/9] rounded-[40px] overflow-hidden border-2 border-slate-100 relative">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[3000ms]"
              alt="Campaign Hero"
            >
            


            <!-- Impact Floating Card (Bottom Left) -->
            <div class="absolute bottom-6 left-6 p-4 rounded-2xl border border-white/20 backdrop-blur-xl flex items-center gap-3 animate-in zoom-in-95 duration-1000 delay-700">
              <div class="w-8 h-8 rounded-xl bg-white text-[#7C3AED] flex items-center justify-center">
                <Utensils class="w-4 h-4" />
              </div>
              <div>
                <p class="text-[11px] font-black text-white leading-tight">GHS 50 feeds a family</p>
                <p class="text-[7px] font-black text-white/50 uppercase tracking-widest mt-0.5">Hope for 3 Days</p>
              </div>
            </div>
          </div>
        </div>
  
        <div class="flex items-center gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <div class="flex items-center gap-3">
            <Clock class="w-4 h-4 text-[#7C3AED]" />
            <div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Time Left</p>
              <p class="text-xs font-black text-[#0F172A] mt-1">25 Days</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Users class="w-4 h-4 text-[#7C3AED]" />
            <div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Supporters</p>
              <p class="text-xs font-black text-[#0F172A] mt-1">320 People</p>
            </div>
          </div>

          <div class="flex items-center gap-5 ml-auto bg-white/50 backdrop-blur-sm p-3 rounded-[24px] border border-slate-100/50 shadow-sm">
            <div class="relative w-12 h-12 flex items-center justify-center">
              <svg class="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="4" fill="transparent" class="text-slate-100" />
                <circle 
                  cx="24" cy="24" r="20" 
                  stroke="currentColor" stroke-width="4" 
                  fill="transparent" 
                  stroke-dasharray="125.66" 
                  stroke-dashoffset="64.08" 
                  class="text-[#7C3AED] transition-all duration-[2000ms] ease-out"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-[10px] font-black text-[#7C3AED]">49%</span>
              </div>
            </div>
            <div>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Raised</p>
              <p class="text-sm font-black text-[#0F172A] mt-1.5 flex items-baseline gap-1">
                24,500 <span class="text-[10px] text-slate-300">GHS</span>
              </p>
            </div>
          </div>
        </div>
  
        </div>
      </div>

      <!-- Trust Footer -->
      <div class="mt-auto flex items-center gap-8 text-slate-300 animate-in fade-in duration-1000 delay-1000">
        <div class="flex items-center gap-2.5">
          <div class="w-1 h-1 rounded-full bg-violet-400/40"></div>
          <span class="text-[8px] font-black uppercase tracking-[0.2em]">Encrypted Protocol</span>
        </div>
        <div class="flex items-center gap-2.5">
          <div class="w-1 h-1 rounded-full bg-emerald-400/40"></div>
          <span class="text-[8px] font-black uppercase tracking-[0.2em]">Transparent Ledger</span>
        </div>
      </div>
</div>

    <!-- Right Column: Interaction Zone (Fixed Shell) -->
    <div class="flex-1 h-screen relative z-20 overflow-hidden flex flex-col items-end justify-end">
      
      <!-- Content Wrapper: Constrained to screen but scrolls internally -->
      <div class="w-full max-w-[640px] max-h-[calc(100vh-80px)] flex flex-col animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
        
        <!-- Unified Donation Card Shell: Fixed Shape -->
        <div class="bg-white rounded-tl-[64px] border-t border-l border-slate-100 overflow-hidden flex flex-col shadow-[-40px_0_100px_rgba(0,0,0,0.03)]">
          
          <!-- Internal Scrollable Area -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 xl:p-14 space-y-10">
            
            <div class="space-y-3">
              <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[#7C3AED] text-[9px] font-black uppercase tracking-[0.3em]">
                Secure Contribution flow
              </span>
              <h3 class="text-3xl font-black text-[#0F172A] tracking-tighter">Your Support Matters</h3>
            </div>

            <!-- Fund Selection -->
            <div class="space-y-5">
              <label class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Select Fund</label>
              <div class="grid grid-cols-1 gap-3">
                <CampaignFundCard 
                  v-for="fund in fundsQuery.data.value?.filter(f => f.isActive) ?? []"
                  :key="fund.id"
                  :fund="fund"
                  :is-selected="flowStore.draft.recipientFundId === fund.id"
                  @select="flowStore.patch({ recipientFundId: fund.id })"
                />
              </div>
            </div>
  
            <!-- Donor Details -->
            <div class="space-y-6">
              <label class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Your Details</label>
              <div class="space-y-4">
                <div class="h-14 rounded-2xl bg-white border border-slate-100 px-5 flex items-center gap-4 group focus-within:border-[#7C3AED] transition-all duration-300">
                  <User class="w-4 h-4 text-slate-300 group-focus-within:text-[#7C3AED] transition-colors" />
                  <input 
                    v-model="flowStore.draft.donorName"
                    type="text" 
                    placeholder="Full Name"
                    class="flex-1 bg-transparent border-none outline-none text-sm font-bold text-[#0F172A] placeholder:text-slate-300 placeholder:font-bold"
                  >
                </div>
                <div class="h-14 rounded-2xl bg-white border border-slate-100 px-5 flex items-center gap-4 group focus-within:border-[#7C3AED] transition-all duration-300">
                  <Mail class="w-4 h-4 text-slate-300 group-focus-within:text-[#7C3AED] transition-colors" />
                  <input 
                    v-model="flowStore.draft.donorEmail"
                    type="email" 
                    placeholder="Email Address"
                    class="flex-1 bg-transparent border-none outline-none text-sm font-bold text-[#0F172A] placeholder:text-slate-300 placeholder:font-bold"
                  >
                </div>
                <div class="flex gap-4">
                  <div class="w-28 h-14 rounded-2xl bg-white border border-slate-100 px-5 flex items-center justify-between group focus-within:border-[#7C3AED] transition-all duration-300 cursor-pointer">
                    <span class="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                      <span class="text-lg">🇬🇭</span> +233
                    </span>
                    <ChevronDown class="w-3 h-3 text-slate-400" />
                  </div>
                  <div class="flex-1 h-14 rounded-2xl bg-white border border-slate-100 px-5 flex items-center gap-4 group focus-within:border-[#7C3AED] transition-all duration-300">
                    <input 
                      v-model="flowStore.draft.donorPhone"
                      type="tel" 
                      placeholder="Phone Number"
                      class="flex-1 bg-transparent border-none outline-none text-sm font-bold text-[#0F172A] placeholder:text-slate-300 placeholder:font-bold"
                    />
                </div>
              </div>
            </div>
            </div>
  
            <!-- Amount Selection -->
            <div class="space-y-6">
              <label class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Amount to Give</label>
              
              <div class="relative h-20 rounded-3xl bg-white border border-slate-100 px-6 flex items-center gap-4 group focus-within:border-[#7C3AED] transition-all duration-500">
                <div class="flex items-center gap-3 pr-4 border-r border-slate-100">
                  <span class="text-lg">🇬🇭</span>
                  <span class="text-base font-black text-[#0F172A]">GHS</span>
                </div>
                <input 
                  v-model="amountStr"
                  type="text" 
                  class="flex-1 bg-transparent border-none outline-none text-4xl font-black text-[#0F172A] text-right placeholder:text-slate-100"
                  placeholder="0"
                >
                <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                  <span class="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest">Enter Amount</span>
                </div>
              </div>
            </div>
  
            <!-- Payment Methods -->
            <div class="space-y-6">
              <label class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Payment Method</label>
              <PaymentMethodSelector 
                v-model="paymentMethod"
              />

              <div v-if="paymentMethod === 'momo'" class="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <label class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 pl-1">Select Network</label>
                <NetworkSelector v-model="network" />
              </div>
            </div>

            <!-- CTA & Summary -->
            <div class="pt-10 space-y-8">
              <div class="bg-white/80 backdrop-blur-xl rounded-[32px] p-10 border border-white shadow-sm flex justify-between items-center">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Final Amount</p>
                  <p class="text-5xl font-black text-[#7C3AED] tracking-tighter">{{ amountStr || '0' }}<span class="text-slate-200 ml-2">GHS</span></p>
                </div>
                <div class="text-right space-y-2">
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                    <ShieldCheck class="w-3 h-3" /> Secure
                  </div>
                  <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest block">Instant Receipt</p>
                </div>
              </div>

              <button 
                class="w-full bg-[#0F172A] text-white py-8 rounded-[32px] font-black text-lg uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-[#7C3AED] hover:shadow-violet-600/40 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-5 group active:scale-[0.98]"
                @click="onSubmit"
              >
                <Lock class="w-6 h-6 text-white/30" />
                Complete Payment
                <ArrowRight class="w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
              </button>

              <div class="flex items-center justify-center gap-2.5 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700">
                <ShieldCheck class="w-5 h-5 text-[#7C3AED]" />
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Verified MFTL Contribution Protocol</span>
              </div>
            </div>
          </div>
      </div>
    </div>
    </div>

    <!-- Mobile Button -->
    <div class="lg:hidden fixed bottom-10 right-10 z-50">
      <button class="w-18 h-18 rounded-[24px] bg-[#7C3AED] text-white shadow-2xl flex items-center justify-center">
        <Heart class="w-8 h-8 fill-white" />
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStorefrontEvent, useStorefrontRecipientFunds } from '../composables/useStorefront'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import { 
  ShieldCheck, Heart, MapPin, Calendar, Clock, Eye, Activity, 
  User, Mail, ChevronDown, Lock, ArrowRight, Utensils
} from 'lucide-vue-next'
import CampaignFundCard from '../components/CampaignFundCard.vue'
import PaymentMethodSelector from '../components/PaymentMethodSelector.vue'
import NetworkSelector from '../components/NetworkSelector.vue'

const route = useRoute()
const router = useRouter()
const flowStore = useContributionFlowStore()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
const eventQuery = useStorefrontEvent(eventSlug.value)
const fundsQuery = useStorefrontRecipientFunds(eventSlug.value)

const amountStr = ref(flowStore.draft.amount ? String(flowStore.draft.amount) : '')
const paymentMethod = ref('momo')
const network = ref('mtn')

const selectedFundName = computed(() => {
  const fund = fundsQuery.data.value?.find(f => f.id === flowStore.draft.recipientFundId)
  return fund?.name || 'Feed Families'
})

watch(amountStr, (val) => {
  flowStore.patch({ amount: parseFloat(val) || 0 })
})

function onSubmit() {
  void router.push(`/give/${eventSlug.value}/confirm`)
}
</script>

<style scoped>
.font-black {
  font-weight: 950;
}

.font-display {
  font-family: 'Outfit', sans-serif;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
</style>
