<script lang="ts">
import { computed, h, defineComponent } from 'vue'

/**
 * AdminMetricGrid enforces the standard pattern of maximum 4 KPI cards per page.
 * It filters the default slot to only render the first 4 components.
 */
export default defineComponent({
  name: 'AdminMetricGrid',
  setup(_, { slots }) {
    const limitedSlots = computed(() => {
      const children = slots.default?.() || []
      // We want to limit to 4 top-level elements
      return children.slice(0, 4)
    })

    return () => h('div', { 
      class: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8' 
    }, limitedSlots.value)
  }
})
</script>
