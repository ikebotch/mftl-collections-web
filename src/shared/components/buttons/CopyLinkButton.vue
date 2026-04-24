<template>
  <button
    class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors uppercase tracking-widest"
    type="button"
    @click="copy"
  >
    <Copy
      v-if="!copied"
      class="w-3.5 h-3.5"
    />
    <Check
      v-else
      class="w-3.5 h-3.5 text-emerald-500"
    />
    <span>{{ copied ? 'Copied' : label }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    value: string
    label?: string
  }>(),
  {
    label: 'Copy link',
  },
)

const copied = ref(false)

async function copy() {
  if (copied.value) return

  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
