<template>
  <div class="space-y-5 pb-4">
    <section>
      <h2 class="text-2xl font-semibold text-white">
        Assigned events
      </h2>
      <p class="mt-2 text-sm text-slate-300">
        Open an assigned event to start a new collection with the right recipient funds already filtered.
      </p>
    </section>

    <LoadingState
      v-if="query.isLoading.value"
      text="Loading assignments…"
    />
    <ErrorState
      v-else-if="query.isError.value"
      title="Could not load assignments"
      :message="query.error.value?.message ?? 'Try again later.'"
      :correlation-id="query.error.value?.correlationId"
      show-retry
      @retry="query.refetch"
    />
    <template v-else-if="query.data.value">
      <div class="grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-medium transition"
          :class="activeTab === 'events' ? 'bg-violet-500 text-white' : 'text-slate-300'"
          @click="activeTab = 'events'"
        >
          My Events
        </button>
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-medium transition"
          :class="activeTab === 'funds' ? 'bg-violet-500 text-white' : 'text-slate-300'"
          @click="activeTab = 'funds'"
        >
          My Funds
        </button>
      </div>

      <div
        v-if="!query.data.value.hasAssignments"
        class="rounded-[1.75rem] border border-amber-400/15 bg-amber-400/8 p-5"
      >
        <p class="text-sm text-slate-200">
          {{ query.data.value.blockedReason || 'No assignments are active for this collector.' }}
        </p>
      </div>

      <template v-else-if="activeTab === 'events'">
        <div
          v-if="query.data.value.events.length === 0"
          class="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300"
        >
          No assigned events available.
        </div>

        <template v-else>
          <article
            v-for="event in query.data.value.events"
            :key="event.id"
            class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4"
          >
            <div class="flex gap-4">
              <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,_rgba(124,58,237,0.9),_rgba(34,211,238,0.5))] text-xl font-semibold text-white">
                {{ event.title.slice(0, 1) }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="text-lg font-semibold text-white">
                      {{ event.title }}
                    </h3>
                    <div class="mt-2 flex items-center gap-2">
                      <span
                        class="h-2 w-2 rounded-full"
                        :class="event.status.toLowerCase() === 'live' ? 'bg-emerald-400' : 'bg-amber-400'"
                      />
                      <span class="text-sm text-slate-300">{{ event.status }}</span>
                    </div>
                  </div>
                  <AppButton
                    size="sm"
                    @click="router.push(`/collector/contributions/new?eventId=${event.id}`)"
                  >
                    Open
                  </AppButton>
                </div>
                <p class="mt-3 text-sm text-slate-300">
                  {{ event.dateLabel }} · {{ event.location }}
                </p>
                <p class="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                  {{ event.assignedFundCount }} assigned fund{{ event.assignedFundCount === 1 ? '' : 's' }}
                </p>
              </div>
            </div>
          </article>
        </template>
      </template>

      <template v-else>
        <div
          v-if="query.data.value.funds.length === 0"
          class="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300"
        >
          No assigned funds available.
        </div>

        <template v-else>
          <article
            v-for="fund in query.data.value.funds"
            :key="fund.id"
            class="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold text-white">
                  {{ fund.name }}
                </h3>
                <p class="mt-2 text-sm text-slate-300">
                  {{ fund.description }}
                </p>
                <p class="mt-3 text-sm text-slate-300">
                  Target: {{ formatCurrency(fund.targetAmount, fund.currency) }} · Raised:
                  {{ formatCurrency(fund.collectedAmount, fund.currency) }} ({{ fund.progress }}%)
                </p>
              </div>
              <AppButton
                size="sm"
                @click="router.push(`/collector/contributions/new?eventId=${fund.eventId}`)"
              >
                Open
              </AppButton>
            </div>
            <div class="mt-4 h-2 rounded-full bg-white/10">
              <div
                class="h-2 rounded-full bg-[linear-gradient(90deg,_#7C3AED,_#22D3EE)]"
                :style="{ width: `${fund.progress}%` }"
              />
            </div>
          </article>
        </template>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectorAssignments } from '../composables/useCollector'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { formatCurrency } from '@/shared/utils/formatters'

const router = useRouter()
const query = useCollectorAssignments()
const activeTab = ref<'events' | 'funds'>('events')
</script>
