<template>
  <AppButton
    variant="ghost"
    size="sm"
    @click="copyLink"
  >
    <div class="flex items-center gap-2">
      <Link
        v-if="!copied"
        class="w-4 h-4"
      />
      <Check
        v-else
        class="w-4 h-4 text-emerald-500"
      />
      <span
        v-if="showLabel"
        class="text-[10px] font-black uppercase tracking-widest"
      >
        {{ copied ? 'Copied' : 'Copy Link' }}
      </span>
    </div>
  </AppButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check, Link } from 'lucide-vue-next'
import AppButton from './AppButton.vue'

const props = defineProps<{
  link: string
  showLabel?: boolean
}>()

const copied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.link)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}
</script>
