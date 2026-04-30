<template>
  <div class="space-y-10 pb-32">
    <AdminPageHeader
      title="Organization Network"
      description="Manage global collection nodes, tenant identities, and operational ecosystem."
    >
      <template #actions>
        <AppButton
          v-if="usersStore.hasPermission(Permissions.Organisations.Create)"
          variant="primary"
          class="px-8 shadow-lg shadow-violet-100"
          @click="router.push('/admin/organization/new')"
        >
          <Plus class="w-4 h-4 mr-2" /> Register Organization
        </AppButton>
      </template>
    </AdminPageHeader>

    <AppCard class="!p-0 border-slate-200 overflow-hidden shadow-sm">
      <div
        v-if="isLoading"
        class="py-32"
      >
        <LoadingState text="Syncing global node matrix..." />
      </div>

      <div
        v-else
        class="overflow-x-auto"
      >
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Node Identity
              </th>
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Identifier
              </th>
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Status
              </th>
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="tenant in tenants"
              :key="tenant.id"
              class="hover:bg-slate-50/50 transition-colors group cursor-pointer"
              @click="goToDetail(tenant.id)"
            >
              <td class="px-10 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center text-violet-600 font-black text-xs shadow-sm rounded-full">
                    {{ tenant.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-[13px] font-black text-slate-900 tracking-tight uppercase leading-none">
                      {{ tenant.name }}
                    </p>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                      Active Node
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-10 py-6">
                <code class="text-[10px] font-black text-violet-600 bg-violet-50 px-2.5 py-1.5 border border-violet-100 tracking-tighter italic">{{ tenant.id }}</code>
              </td>
              <td class="px-10 py-6">
                <div class="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 w-fit rounded-full">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Operational</span>
                </div>
              </td>
              <td class="px-10 py-6 text-right">
                <AppButton
                  variant="ghost"
                  size="xs"
                  class="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors"
                >
                  Management Detail
                </AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>

    <!-- Stats Summary -->
    <div class="grid md:grid-cols-3 gap-8">
      <AppCard class="!p-8 border-slate-100 bg-white shadow-sm">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Total Capacity
        </p>
        <div class="flex items-end justify-between">
          <h4 class="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            {{ tenants?.length || 0 }} Nodes
          </h4>
          <span class="text-[10px] font-black text-emerald-500 uppercase">↑ Optimal</span>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTenants } from '../composables/useTenants'
import { useUsersStore } from '@/modules/users/store/usersStore'
import { Permissions } from '@/core/auth/permissions'
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import { Plus } from 'lucide-vue-next'

const router = useRouter()
const usersStore = useUsersStore()
const { data: tenants, isLoading } = useTenants()

function goToDetail(id: string) {
  router.push(`/admin/organization/${id}`)
}
</script>
