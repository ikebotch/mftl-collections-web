<template>
  <div class="py-32 flex flex-col items-center justify-center space-y-4">
    <div class="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center animate-spin">
      <Loader2 class="w-6 h-6 text-violet-600" />
    </div>
    <p class="text-xs font-black text-slate-400 uppercase tracking-widest">
      Redirecting to operational hub...
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const id = route.params.id
  router.replace({ name: 'admin-events-detail', params: { id }, query: { edit: 'true' } })
})
</script>
