<template>
  <div class="min-h-screen bg-[#F9F9FB] py-12 lg:py-20 selection:bg-violet-100 selection:text-violet-900">
    <!-- Main Content Container -->
    <div class="max-w-[1340px] mx-auto px-6">
      <section class="grid gap-10 lg:grid-cols-[1fr_390px] items-start">
        <!-- Hero Main Card -->
        <div class="relative group">
          <div class="bg-white rounded-[48px] shadow-[0_40px_100px_rgba(124,58,237,0.06)] overflow-hidden flex flex-col min-h-[720px] border border-white">
            <!-- Content Body -->
            <div class="flex-1 p-10 md:p-20 relative overflow-hidden bg-gradient-to-br from-white via-white to-[#F5F3FF]">
              <!-- Pill Badge -->
              <div class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#F5F3FF] border border-[#EEF2FF] text-[#7C3AED] text-[10px] font-black uppercase tracking-[0.15em] mb-14 shadow-sm">
                <Heart class="w-3.5 h-3.5 fill-current" />
                Support this event
              </div>

              <div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
                <div>
                  <h2 class="text-[64px] md:text-[84px] font-black leading-[1.0] text-[#0F172A] tracking-tighter mb-10">
                    Let's do<br>this <span class="text-[#7C3AED] italic font-serif font-normal">Again</span>
                  </h2>
                  
                  <p class="text-[17px] md:text-[19px] text-[#64748B] font-medium leading-relaxed mb-14 max-w-[420px]">
                    Your contribution makes a real impact. Every cedi goes directly to the cause.
                  </p>
                  
                  <!-- Primary Actions -->
                  <div class="flex flex-col sm:flex-row gap-5 items-center">
                    <button
                      class="w-full sm:w-auto flex items-center justify-center px-12 py-6 rounded-[24px] bg-[#7C3AED] text-white text-[13px] font-black uppercase tracking-[0.1em] shadow-[0_20px_40px_rgba(124,58,237,0.25)] hover:bg-[#6D28D9] transition-all duration-500 hover:translate-y-[-2px] active:scale-95 group"
                      @click="router.push(`/give/${eventSlug}/contribute`)"
                    >
                      <Heart class="w-4.5 h-4.5 mr-3 fill-white" />
                      Start Contributing
                      <ArrowRight class="w-4.5 h-4.5 ml-3 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    
                    <button
                      class="w-full sm:w-auto flex items-center justify-center px-10 py-6 rounded-[24px] bg-[#F8FAFC] border border-[#F1F5F9] text-[#7C3AED] text-[12px] font-black uppercase tracking-[0.1em] hover:bg-[#F1F5F9] transition-all duration-500 active:scale-95"
                      @click="router.push(`/give/${eventSlug}/contribute`)"
                    >
                      <User class="w-4.5 h-4.5 mr-3" />
                      For Myself
                    </button>
                  </div>
                </div>

                <!-- 3D Illustration Area -->
                <div class="relative flex justify-center">
                  <!-- Decorative icons -->
                  <div class="absolute top-0 right-0 text-violet-300/40 text-2xl animate-pulse">
                    ✦
                  </div>
                  <div class="absolute bottom-10 left-[-20px] text-violet-200/60 text-xl rotate-45">
                    ✦
                  </div>
                  
                  <div class="absolute inset-0 bg-gradient-to-tr from-violet-200/20 to-transparent blur-[120px] rounded-full scale-150" />
                  <img 
                    src="/Users/ikebotch/.gemini/antigravity/brain/f197f29b-f906-487e-a90a-cf7860f47c27/donation_box_3d_illustration_1777284712706.png" 
                    alt="Donation Box"
                    class="relative z-10 w-full max-w-[420px] h-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.12)] animate-float"
                  >
                </div>
              </div>

              <!-- Features Horizontal Bar -->
              <div class="mt-24 pt-12 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-3 gap-12">
                <div class="flex items-center gap-5 group">
                  <div class="w-14 h-14 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <ShieldCheck class="w-6 h-6" />
                  </div>
                  <div>
                    <p class="text-[12px] font-black uppercase tracking-[0.1em] text-[#0F172A]">
                      Secure
                    </p>
                    <p class="text-[11px] font-medium text-[#94A3B8] mt-1">
                      Your data is protected
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-5 group">
                  <div class="w-14 h-14 rounded-full bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Activity class="w-6 h-6" />
                  </div>
                  <div>
                    <p class="text-[12px] font-black uppercase tracking-[0.1em] text-[#0F172A]">
                      Real-time
                    </p>
                    <p class="text-[11px] font-medium text-[#94A3B8] mt-1">
                      Track funds live
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-5 group">
                  <div class="w-14 h-14 rounded-full bg-[#F0F9FF] text-[#0EA5E9] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <FileText class="w-6 h-6" />
                  </div>
                  <div>
                    <p class="text-[12px] font-black uppercase tracking-[0.1em] text-[#0F172A]">
                      Transparent
                    </p>
                    <p class="text-[11px] font-medium text-[#94A3B8] mt-1">
                      See where it goes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Information Strip -->
            <div class="bg-[#F8FAFC] px-16 py-7 border-t border-[#F1F5F9] flex items-center gap-4">
              <ShieldCheck class="w-4.5 h-4.5 text-[#94A3B8]" />
              <span class="text-[12px] font-semibold text-[#94A3B8] tracking-tight">Trusted by communities. Powered by MFTL Ecosystem.</span>
            </div>
          </div>
        </div>

        <!-- Secondary Info Sidebar -->
        <aside class="space-y-8">
          <div class="bg-white rounded-[40px] p-10 shadow-[0_20px_80px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
            <div class="w-14 h-14 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] mb-10 flex items-center justify-center shadow-sm">
              <ShieldCheck class="w-7 h-7" />
            </div>
            <h3 class="text-[28px] font-black text-[#0F172A] mb-5 tracking-tight">
              Secure & Transparent
            </h3>
            <p class="text-[15px] font-medium text-[#64748B] leading-relaxed mb-12">
              Our platform ensures every contribution is handled with the highest level of security.
            </p>
            
            <div class="space-y-10">
              <div
                v-for="(item, i) in benefits"
                :key="i"
                class="flex items-start gap-5 group"
              >
                <div class="mt-1 w-7 h-7 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <Check class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-[14px] font-black text-[#0F172A] uppercase tracking-wider">
                    {{ item.title }}
                  </h4>
                  <p class="text-[12px] font-medium text-[#94A3B8] mt-1.5 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Network Logos Area -->
          <div class="px-8 pt-4">
            <h5 class="text-[11px] font-black text-[#94A3B8] uppercase tracking-[0.25em] text-center mb-6">
              Accepted Networks
            </h5>
            <div class="flex justify-center gap-6 opacity-30 grayscale saturate-0 contrast-125">
              <div
                v-for="i in 3"
                :key="i"
                class="w-16 h-8 bg-[#CBD5E1] rounded-lg"
              />
            </div>
          </div>
        </aside>
      </section>

      <!-- Global Security Footer Bar -->
      <div class="mt-20 pt-10 border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-4">
          <div class="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <Lock class="w-4.5 h-4.5 text-[#64748B]" />
          </div>
          <p class="text-[12px] font-semibold text-[#64748B]">
            Your security is our priority. All payments are encrypted and strictly monitored.
          </p>
        </div>
        <div class="flex items-center gap-10">
          <div class="flex items-center gap-3">
            <span class="text-[12px] font-semibold text-[#64748B]">Need help?</span>
            <a
              href="#"
              class="text-[12px] font-black text-[#7C3AED] uppercase tracking-[0.1em] hover:underline underline-offset-4 decoration-2"
            >Contact support</a>
          </div>
          <div class="w-10 h-10 rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED] shadow-sm">
            <Headphones class="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStorefrontEvent } from '@/modules/storefront/composables/useStorefront'
import { useContributionFlowStore } from '../store/contributionFlowStore'
import { 
  Heart, 
  ArrowRight, 
  User, 
  ShieldCheck, 
  Activity, 
  FileText, 
  Check, 
  Lock,
  Headphones
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const flowStore = useContributionFlowStore()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
useStorefrontEvent(eventSlug)

watchEffect(() => {
  flowStore.initialise(eventSlug.value)
})

const benefits = [
  {
    title: 'End-to-end encryption',
    description: 'Your transactions and data are always protected.'
  },
  {
    title: 'Real-time fund tracking',
    description: 'Monitor contributions and balances in real time.'
  },
  {
    title: 'Instant digital receipts',
    description: 'Get digital proof of your contribution instantly.'
  },
  {
    title: 'Zero platform fees',
    description: '100% of your contribution goes directly to the cause.'
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,900&display=swap');

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.font-black {
  font-weight: 950;
}

.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
