<template>
  <AppModal
    :open="true"
    :title="branch ? 'Modify Branch' : 'Deploy Branch'"
    :subtitle="branch ? 'Update operational hub parameters' : 'Initialize a new regional office'"
    @close="$emit('close')"
  >
    <form id="branch-form" @submit.prevent="saveBranch" class="space-y-10">
      <div class="grid grid-cols-2 gap-10">
        <AppInput
          v-model="form.name"
          label="Branch Name"
          placeholder="e.g. Accra Central"
          required
        />
        <AppInput
          v-model="form.identifier"
          label="Short Code"
          placeholder="e.g. ACC-CENT"
          required
        />
      </div>

      <AppInput
        v-model="form.location"
        label="Physical Location"
        placeholder="e.g. 123 Independence Ave, Accra"
      />

      <div class="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-none">
        <div class="space-y-1">
          <p class="text-[11px] font-black text-slate-900 uppercase tracking-tight italic">
            Deployment Status
          </p>
          <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Toggle branch operational availability.
          </p>
        </div>
        <AppSwitch v-model="form.isActive" />
      </div>
    </form>

    <template #actions>
      <AppButton 
        variant="outline" 
        class="flex-1 text-[10px] font-black uppercase tracking-widest"
        @click="$emit('close')"
      >
        Discard
      </AppButton>
      <AppButton 
        variant="primary" 
        form="branch-form"
        type="submit"
        class="flex-1 text-[10px] font-black uppercase tracking-[0.2em]"
        :loading="isSaving"
      >
        {{ branch ? 'Sync Matrix' : 'Initialize Hub' }}
      </AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppModal from '@/shared/components/modals/AppModal.vue';
import AppInput from '@/shared/components/forms/AppInput.vue';
import AppButton from '@/shared/components/buttons/AppButton.vue';
import AppSwitch from '@/shared/components/forms/AppSwitch.vue';
import { branchesService } from '@/modules/tenants/services/branchesService';
import { useToastStore } from '@/shared/stores/useToastStore';

const props = defineProps({
  branch: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'refresh']);
const toast = useToastStore();
const isSaving = ref(false);

const form = ref({
  name: '',
  identifier: '',
  location: '',
  isActive: true
});

onMounted(() => {
  if (props.branch) {
    form.value = { 
      name: props.branch.name,
      identifier: props.branch.identifier,
      location: props.branch.location || '',
      isActive: props.branch.isActive
    };
  }
});

async function saveBranch() {
  isSaving.value = true;
  try {
    if (props.branch) {
      await branchesService.update(props.branch.id, form.value);
      toast.success('Branch matrix synchronized successfully');
    } else {
      await branchesService.create(form.value);
      toast.success('New operational hub deployed');
    }
    emit('refresh');
    emit('close');
  } catch (error) {
    toast.error('Failed to commit branch configuration');
  } finally {
    isSaving.value = false;
  }
}
</script>
