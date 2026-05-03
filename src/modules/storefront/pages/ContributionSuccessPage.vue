<template>
  <div class="max-w-[860px] mx-auto pt-20 pb-20 px-6">
    <AppCard class="overflow-hidden !p-0 border-none shadow-[0_40px_100px_rgba(0,0,0,0.04)]">
      <div class="p-10 md:p-20 text-center space-y-10">
        <div class="space-y-6">
          <div class="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 animate-in zoom-in duration-700">
            <Heart class="w-10 h-10 fill-current" />
          </div>
          <div class="space-y-3">
            <h2 class="text-4xl font-black text-[#0F172A] tracking-tighter">Contribution Complete!</h2>
            <p class="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Thank you for your generous support. Your contribution has been recorded and will make a real difference.
            </p>
          </div>
        </div>

        <div class="p-8 bg-slate-50 rounded-[32px] border border-slate-100 max-w-sm mx-auto space-y-4">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Next Steps</p>
          <p class="text-sm text-slate-600 leading-relaxed">
            A digital receipt has been sent to your email. You can also download it below.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <AppButton 
            class="min-w-[200px]"
            @click="router.push(`/give/${eventSlug}`)"
          >
            Done
          </AppButton>
          <AppButton 
            variant="secondary" 
            class="min-w-[200px]"
          >
            <Download class="w-4 h-4 mr-2" />
            Download Receipt
          </AppButton>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Heart, Download } from 'lucide-vue-next'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'

const route = useRoute()
const router = useRouter()
const eventSlug = computed(() => String(route.params.eventSlug ?? ''))
</script>
