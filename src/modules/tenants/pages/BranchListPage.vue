<template>
  <div class="space-y-12 pb-32">
    <AdminPageHeader
      title="Infrastructure Matrix"
      description="Deploy and manage regional operational hubs. Configure branch-specific parameters and monitor localized resource allocation."
      eyebrow="Network Operations"
    >
      <template #actions>
        <AppButton 
          variant="primary" 
          class="px-10 text-[10px] font-black uppercase tracking-[0.2em]"
          @click="openCreateModal"
        >
          Initialize New Hub
        </AppButton>
      </template>
    </AdminPageHeader>

    <!-- Operational Hubs Inventory -->
    <DataTable
      :columns="columns"
      :rows="branches"
      :loading="isLoading"
      title="Regional Hub Unit Inventory"
    >
      <template #cell:name="{ row }">
        <RouterLink
          :to="`/admin/branches/${row.id}`"
          class="flex items-center gap-5 group/link"
        >
          <div class="w-12 h-12 bg-white border border-slate-100 flex items-center justify-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] group-hover:border-violet-200 transition-colors">
            <Building2 class="w-5 h-5 text-slate-400 group-hover:text-violet-500 transition-colors" />
          </div>
          <div>
            <p class="text-[14px] font-black text-slate-900 tracking-tight leading-none uppercase group-hover/link:text-violet-600 transition-colors">
              {{ row.name }}
            </p>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">
              Regional Hub Unit
            </p>
          </div>
        </RouterLink>
      </template>

      <template #cell:identifier="{ value }">
        <span class="text-[10px] font-mono font-black text-violet-600 bg-violet-50 px-2.5 py-1.5 border border-violet-100 uppercase tracking-tighter shadow-sm">
          {{ value }}
        </span>
      </template>

      <template #cell:location="{ value }">
        <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight leading-relaxed max-w-[200px]">
          {{ value || 'Global Parameters Only' }}
        </p>
      </template>

      <template #cell:isActive="{ value }">
        <AppBadge :tone="value ? 'success' : 'neutral'">
          {{ value ? 'Active' : 'Offline' }}
        </AppBadge>
      </template>

      <template #rowActions="{ row }">
        <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
          <AppButton 
            variant="outline" 
            size="sm"
            class="bg-white border-slate-100 hover:border-violet-200 hover:text-violet-600 shadow-sm"
            @click="router.push(`/admin/branches/${row.id}?edit=true`)"
          >
            <Pencil class="w-3.5 h-3.5" />
          </AppButton>
          <AppButton 
            variant="outline" 
            size="sm"
            class="bg-white border-slate-100 hover:border-rose-200 hover:text-rose-600 shadow-sm"
            @click="confirmDelete(row)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </AppButton>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminPageHeader from '@/shared/components/headers/AdminPageHeader.vue';
import DataTable from '@/shared/components/tables/DataTable.vue';
import AppButton from '@/shared/components/buttons/AppButton.vue';
import AppBadge from '@/shared/components/badges/AppBadge.vue';
import { Building2, Pencil, Trash2 } from 'lucide-vue-next';
import { branchesService } from '@/modules/tenants/services/branchesService';
import { useToastStore } from '@/shared/stores/useToastStore';

const router = useRouter();
const toast = useToastStore();
const branches = ref([]);
const isLoading = ref(true);

const columns = [
  { key: 'name', label: 'Identity & Narrative' },
  { key: 'identifier', label: 'System ID' },
  { key: 'location', label: 'Geographic Parameters' },
  { key: 'isActive', label: 'Status' }
];

async function fetchBranches() {
  isLoading.value = true;
  try {
    branches.value = await branchesService.list();
  } catch (error) {
    toast.error('Failed to synchronize branch registry');
  } finally {
    isLoading.value = false;
  }
}

function openCreateModal() {
  router.push('/admin/branches/new');
}

async function confirmDelete(branch) {
  if (confirm(`Are you sure you want to deactivate/delete ${branch.name}?`)) {
    try {
      await branchesService.delete(branch.id);
      toast.success('Branch state synchronized');
      fetchBranches();
    } catch (error) {
      toast.error('Failed to modify branch state');
    }
  }
}

onMounted(fetchBranches);
</script>
