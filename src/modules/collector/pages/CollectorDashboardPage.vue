<template>
  <div class="space-y-8 pb-10 transition-colors duration-500">
    <LoadingState
      v-if="query.isLoading.value"
      text="Loading collector dashboard…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load collector dashboard"
      :message="query.error.value?.message ?? 'Try again later.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <template v-else-if="query.data.value">
      <!-- Welcome Header -->
      <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:border-b lg:border-slate-200 lg:pb-10">
        <div class="space-y-1">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 lg:text-slate-400">
            Collector Overview
          </p>
          <h2
            class="text-3xl lg:text-5xl font-black tracking-tight uppercase italic transition-colors duration-500"
            :class="isDesktop ? 'text-slate-900' : 'text-white'"
          >
            {{ query.data.value.profile.name }}
          </h2>
          <div class="flex items-center gap-3 mt-2">
            <span class="px-2 py-0.5 bg-violet-100 text-violet-600 text-[9px] font-black uppercase tracking-widest border border-violet-200">
              Terminal: {{ query.data.value.profile.id.slice(0, 8) }}
            </span>
            <span class="text-[10px] font-bold text-slate-400 italic">
              Ready for collection
            </span>
          </div>
        </div>

        <div class="flex items-center gap-4 lg:gap-8">
          <div class="text-right hidden lg:block">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Active Shift
            </p>
            <p class="text-sm font-black text-slate-900 uppercase tracking-tight">
              {{ query.data.value.currentShiftLabel }}
            </p>
          </div>
          <AppButton
            variant="primary"
            class="hidden lg:flex !rounded-none !px-8 !py-6 text-xs font-black uppercase tracking-widest shadow-xl shadow-violet-500/20"
            @click="$router.push('/collector/contributions/new')"
          >
            New Collection
          </AppButton>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <article 
          v-for="(stat, index) in stats" 
          :key="index"
          class="p-6 transition-all duration-500 border group cursor-default"
          :class="isDesktop 
            ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-violet-500/30' 
            : 'bg-white/5 border-white/10 hover:border-violet-500/30'"
        >
          <p
            class="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300" 
            :class="isDesktop ? 'text-slate-400 group-hover:text-violet-600' : 'text-slate-500 group-hover:text-violet-400'"
          >
            {{ stat.label }}
          </p>
          <p
            class="mt-4 text-3xl lg:text-4xl font-black transition-colors duration-300"
            :class="isDesktop ? 'text-slate-900' : 'text-white'"
          >
            {{ stat.value }}
          </p>
          <div class="mt-4 h-1 w-8 bg-violet-500/20 group-hover:w-full transition-all duration-500" />
        </article>
      </section>

      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <!-- Main Content Area -->
        <div class="lg:col-span-8 space-y-10">
          <!-- Assignments Section -->
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <h3
                class="text-xs font-black uppercase tracking-[0.25em]"
                :class="isDesktop ? 'text-slate-400' : 'text-slate-500'"
              >
                Current Assignments
              </h3>
              <div class="h-px flex-1 bg-slate-200 mx-6 hidden lg:block" />
            </div>

            <div
              v-if="!query.data.value.profile.hasAssignments"
              class="p-10 border border-dashed border-slate-300 bg-slate-50 text-center"
            >
              <p class="text-xs font-black uppercase tracking-widest text-slate-400">
                No active assignments found
              </p>
            </div>

            <div
              v-else
              class="grid gap-4"
            >
              <article 
                v-for="event in query.data.value.assignments.events" 
                :key="event.id"
                class="p-6 border transition-all duration-300 group flex items-center justify-between"
                :class="isDesktop ? 'bg-white border-slate-200 hover:border-violet-500/50' : 'bg-white/5 border-white/10'"
              >
                <div>
                  <h4
                    class="text-lg font-black uppercase italic"
                    :class="isDesktop ? 'text-slate-900' : 'text-white'"
                  >
                    {{ event.title }}
                  </h4>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    {{ event.branchName }}
                  </p>
                </div>
                <AppButton
                  variant="ghost"
                  size="sm"
                  class="text-[9px] font-black uppercase tracking-widest"
                >
                  Details
                </AppButton>
              </article>
            </div>
          </section>

          <!-- System Status Area (Desktop Only) -->
          <section
            v-if="isDesktop"
            class="grid grid-cols-2 gap-6 p-8 bg-slate-900 text-white border-l-4 border-emerald-500 shadow-2xl"
          >
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Sync Status
              </p>
              <h4 class="text-xl font-black mt-2 uppercase tracking-tight">
                {{ query.data.value.syncStatusLabel }}
              </h4>
              <p class="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                {{ query.data.value.syncStatusDescription }}
              </p>
            </div>
            <div class="flex flex-col justify-end items-end text-right">
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Connection
              </p>
              <p class="text-xs font-black text-white mt-1">
                PRIMARY TERMINAL 01
              </p>
              <div class="flex gap-1 mt-3">
                <div
                  v-for="i in 5"
                  :key="i"
                  class="h-1 w-4 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar Activity Area -->
        <div class="lg:col-span-4 space-y-8">
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <h3
                class="text-xs font-black uppercase tracking-[0.25em]"
                :class="isDesktop ? 'text-slate-400' : 'text-slate-500'"
              >
                Recent Receipts
              </h3>
              <AppButton
                variant="ghost"
                size="sm"
                class="text-[9px] font-black uppercase tracking-widest !text-violet-500 hover:!bg-violet-100"
                @click="$router.push('/collector/history')"
              >
                Full History
              </AppButton>
            </div>

            <div
              v-if="query.data.value.recentReceipts.length === 0"
              class="p-8 text-center border border-dashed border-slate-300"
            >
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
                No activity recorded
              </p>
            </div>

            <div
              v-else
              class="space-y-4"
            >
              <button
                v-for="receipt in query.data.value.recentReceipts"
                :key="receipt.id"
                class="w-full p-5 text-left border transition-all duration-300 group"
                :class="isDesktop ? 'bg-white border-slate-100 hover:border-violet-500 hover:shadow-lg' : 'bg-white/5 border-white/5'"
                @click="$router.push(`/collector/receipts/${receipt.id}`)"
              >
                <div class="flex items-start justify-between">
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-[9px] font-black uppercase tracking-widest"
                      :class="isDesktop ? 'text-slate-400 group-hover:text-violet-600' : 'text-slate-500 group-hover:text-violet-400'"
                    >
                      {{ receipt.receiptNumber }}
                    </p>
                    <p
                      class="text-2xl font-black mt-2 tracking-tight"
                      :class="isDesktop ? 'text-slate-900' : 'text-white'"
                    >
                      {{ receipt.amount }}
                    </p>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 truncate">
                      {{ receipt.eventTitle }}
                    </p>
                  </div>
                  <ReceiptStatusBadge
                    :status="receipt.status"
                    class="scale-75 origin-top-right"
                  />
                </div>
              </button>
            </div>
          </section>

          <!-- Mobile-only Action -->
          <div class="lg:hidden pt-4">
            <AppButton
              class="w-full !rounded-none !py-6 text-sm font-black uppercase tracking-widest shadow-[0_10px_40px_rgba(139,92,246,0.3)]"
              size="lg"
              :disabled="!query.data.value.profile.hasAssignments"
              @click="$router.push('/collector/contributions/new')"
            >
              Start Collection
            </AppButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCollectorDashboard } from '../composables/useCollector'
import ReceiptStatusBadge from '@/modules/receipts/components/ReceiptStatusBadge.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'

const query = useCollectorDashboard()
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

const isDesktop = computed(() => windowWidth.value >= 1024)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const stats = computed(() => {
  if (!query.data.value) return []
  return [
    { label: 'Today collected', value: query.data.value.todayTotal },
    { label: 'Receipts issued', value: query.data.value.receiptsIssued },
    { label: 'Assigned events', value: query.data.value.assignedEvents },
    { label: 'Assigned funds', value: query.data.value.assignedFunds }
  ]
})
</script>

<style scoped>
.italic {
  font-style: italic;
}
</style>
