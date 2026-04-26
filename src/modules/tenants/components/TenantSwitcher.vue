<template>
  <div ref="containerRef" class="relative group">
    <!-- Main Selector Button (Modernized) -->
    <button 
      class="premium-switcher-btn"
      :class="{ 'is-open': isOpen }"
      @click="isOpen = !isOpen"
    >
      <div class="icon-container">
        <div class="icon-glow" />
        <Building2
          v-if="!branchStore.selectedBranchId"
          class="icon"
        />
        <MapPin
          v-else
          class="icon"
        />
      </div>
      
      <div class="label-area">
        <h1 class="hub-title">
          {{ displayTitle }}
        </h1>
        <div class="hub-badge">
          <span class="badge-dot" />
          <p class="badge-text">
            {{ displaySubtitle }}
          </p>
        </div>
      </div>
      
      <div class="chevron-wrapper">
        <ChevronDown class="chevron" />
      </div>
    </button>

    <!-- Premium Glassmorphism Dropdown -->
    <div 
      v-if="isOpen"
      class="premium-dropdown"
    >
      <div class="dropdown-inner">
        <!-- Modern Sliding Tab Switcher -->
        <div class="sliding-tabs">
          <div 
            class="tab-indicator"
            :style="{ transform: `translateX(${activeView === 'tenants' ? '0%' : '100%'})` }"
          />
          <button 
            class="tab-btn"
            :class="{ active: activeView === 'tenants' }"
            @click="activeView = 'tenants'"
          >
            Organizations
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeView === 'branches' }"
            @click="activeView = 'branches'"
          >
            Branches
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <div class="content-viewport custom-scrollbar">
          <!-- Organizations List -->
          <TransitionGroup 
            v-if="activeView === 'tenants'"
            name="list-slide"
            tag="div"
            class="list-container"
          >
            <div
              v-if="!tenants?.length"
              key="empty"
              class="empty-state"
            >
              <div class="empty-icon-box">
                <Search class="w-4 h-4 text-slate-600" />
              </div>
              <p>No organizations found</p>
            </div>
            
            <button
              v-for="tenant in tenants"
              :key="tenant.id"
              class="list-item"
              :class="{ 'is-selected': isTenantSelected(tenant.id) }"
              @click="toggleTenant(tenant)"
            >
              <div class="item-icon-box">
                <Building2 class="w-4 h-4" />
              </div>
              <div class="item-info">
                <p class="item-name">
                  {{ tenant.name }}
                </p>
                <p class="item-meta">
                  Primary Identity
                </p>
              </div>
              <div
                v-if="isTenantSelected(tenant.id)"
                class="multi-check"
              >
                <Check class="w-3 h-3" />
              </div>
            </button>
          </TransitionGroup>

          <!-- Branches List -->
          <TransitionGroup 
            v-else-if="activeView === 'branches'"
            name="list-slide"
            tag="div"
            class="list-container"
          >
            <!-- Back to Organization Root -->
            <button
              key="root"
              class="list-item"
              :class="{ 'is-selected': branchStore.selectedBranchIds.length === 0 }"
              @click="selectMainHub"
            >
              <div class="item-icon-box root-icon">
                <ArrowLeft class="w-4 h-4" />
              </div>
              <div class="item-info">
                <p class="item-name">
                  Main Hub
                </p>
                <p class="item-meta">
                  Root Organization View
                </p>
              </div>
              <div
                v-if="branchStore.selectedBranchIds.length === 0"
                class="active-indicator"
              />
            </button>

            <button
              v-for="branch in branches"
              :key="branch.id"
              class="list-item"
              :class="{ 'is-selected': isBranchSelected(branch.id) }"
              @click="toggleBranch(branch)"
            >
              <div class="item-icon-box">
                <MapPin class="w-4 h-4" />
              </div>
              <div class="item-info">
                <p class="item-name">
                  {{ branch.name }}
                </p>
                <p class="item-meta">
                  {{ branch.isHeadquarters ? 'Headquarters' : 'Regional Branch' }}
                </p>
              </div>
              <div
                v-if="isBranchSelected(branch.id)"
                class="multi-check"
              >
                <Check class="w-3 h-3" />
              </div>
            </button>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { Building2, MapPin, ChevronDown, Search, ArrowLeft, Check } from 'lucide-vue-next'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { tenantsService } from '../services/tenantsService'
import { branchesService } from '../services/branchesService'
import { useTenantStore } from '../store/tenantStore'
import { useBranchStore } from '@/modules/branches/store/branchStore'

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const activeView = ref<'tenants' | 'branches'>('tenants')
const queryClient = useQueryClient()

const tenantStore = useTenantStore()
const branchStore = useBranchStore()

const displayTitle = computed(() => {
  if (branchStore.selectedBranchIds.length > 1) return `${branchStore.selectedBranchIds.length} Branches`
  if (branchStore.selectedBranchIds.length === 1) {
    const branch = branches.value?.find(b => b.id === branchStore.selectedBranchIds[0])
    return branch?.name || 'Selected Branch'
  }
  if (tenantStore.selectedTenantIds.length > 1) return `${tenantStore.selectedTenantIds.length} Organizations`
  return tenantStore.selectedTenantName || 'Select Hub'
})

const displaySubtitle = computed(() => {
  if (branchStore.selectedBranchIds.length > 0) return 'Operational Scope'
  return 'Organization Wide'
})

function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const { data: tenants } = useQuery({
  queryKey: ['tenants-list'],
  queryFn: () => tenantsService.list()
})

const { data: branches, refetch: refetchBranches } = useQuery({
  queryKey: ['branches-list', tenantStore.selectedTenantId],
  queryFn: () => branchesService.list(),
  enabled: !!tenantStore.selectedTenantId
})

watch(() => tenantStore.selectedTenantIds, () => {
  refetchBranches()
  queryClient.invalidateQueries()
}, { deep: true })

watch(() => branchStore.selectedBranchIds, () => {
  queryClient.invalidateQueries()
}, { deep: true })

function isTenantSelected(id: string) {
  return tenantStore.selectedTenantIds.includes(id)
}

function isBranchSelected(id: string) {
  return branchStore.selectedBranchIds.includes(id)
}

function toggleTenant(tenant: any) {
  const ids = [...tenantStore.selectedTenantIds]
  const index = ids.indexOf(tenant.id)
  if (index > -1) {
    if (ids.length > 1) ids.splice(index, 1) // Keep at least one
  } else {
    ids.push(tenant.id)
  }
  tenantStore.setTenants(ids)
  // When switching tenants, we might want to clear branches or keep them if they exist in new tenants? 
  // Usually, clearing is safer.
  branchStore.clearBranch()
}

function toggleBranch(branch: any) {
  branchStore.toggleBranch(branch.id)
}

function selectMainHub() {
  branchStore.clearBranch()
  isOpen.value = false
}
</script>

<style scoped>
/* Premium Design System Tokens */
:root {
  --hub-bg: #0d121f;
  --hub-border: rgba(255, 255, 255, 0.08);
  --hub-accent: #8b5cf6;
  --hub-accent-glow: rgba(139, 92, 246, 0.3);
  --hub-text-main: #ffffff;
  --hub-text-muted: #64748b;
}

.premium-switcher-btn {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 1rem;
  background: transparent;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  text-align: left;
  border: 1px solid transparent;
}

.premium-switcher-btn:hover {
  background: rgba(255, 255, 255, 0.03);
}

.premium-switcher-btn.is-open {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--hub-border);
}

.icon-container {
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.875rem;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 20px -4px var(--hub-accent-glow);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.premium-switcher-btn:hover .icon-container {
  transform: rotate(-3deg) scale(1.05);
}

.icon-glow {
  position: absolute;
  inset: -2px;
  background: inherit;
  filter: blur(8px);
  opacity: 0.4;
  border-radius: inherit;
  z-index: -1;
}

.icon {
  color: white;
  width: 1.25rem;
  height: 1.25rem;
}

.label-area {
  flex: 1;
  min-width: 0;
}

.hub-title {
  font-size: 0.9375rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--hub-text-main);
  text-transform: uppercase;
  margin: 0;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hub-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.375rem;
}

.badge-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--hub-accent);
  box-shadow: 0 0 8px var(--hub-accent);
}

.badge-text {
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--hub-text-muted);
  margin: 0;
}

.chevron-wrapper {
  color: #334155;
  transition: color 0.3s;
}

.premium-switcher-btn:hover .chevron-wrapper {
  color: var(--hub-accent);
}

.chevron {
  width: 0.875rem;
  height: 0.875rem;
  transition: transform 0.4s;
}

.premium-switcher-btn.is-open .chevron {
  transform: rotate(180deg);
}

/* Dropdown Styles */
.premium-dropdown {
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
  width: 20rem;
  z-index: 60;
  animation: dropdown-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.dropdown-inner {
  background: rgba(10, 15, 24, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid var(--hub-border);
  box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.6);
  border-radius: 1.25rem;
  overflow: hidden;
}

.sliding-tabs {
  position: relative;
  display: flex;
  padding: 0.375rem;
  background: rgba(255, 255, 255, 0.03);
  margin: 0.75rem;
  border-radius: 0.875rem;
  gap: 0.25rem;
}

.tab-indicator {
  position: absolute;
  top: 0.375rem;
  left: 0.375rem;
  width: calc(50% - 0.5rem);
  height: calc(100% - 0.75rem);
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.625rem;
  transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  z-index: 0;
}

.tab-btn {
  position: relative;
  flex: 1;
  padding: 0.625rem;
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--hub-text-muted);
  z-index: 1;
  transition: color 0.3s;
}

.tab-btn.active {
  color: white;
}

.content-viewport {
  max-height: 24rem;
  overflow-y: auto;
  padding: 0.5rem;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.list-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  text-align: left;
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.list-item.is-selected {
  background: rgba(139, 92, 246, 0.08);
}

.item-icon-box {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--hub-text-muted);
  transition: all 0.3s;
}

.list-item:hover .item-icon-box {
  color: white;
  background: rgba(255, 255, 255, 0.08);
}

.list-item.is-selected .item-icon-box {
  color: var(--hub-accent);
  background: rgba(139, 92, 246, 0.15);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.75rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--hub-text-muted);
  margin-top: 0.125rem;
}

.active-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--hub-accent);
  box-shadow: 0 0 10px var(--hub-accent);
}

.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--hub-text-muted);
}

.empty-icon-box {
  display: inline-flex;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state p {
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Transitions */
.list-slide-enter-active,
.list-slide-leave-active {
  transition: all 0.3s ease;
}

.list-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.list-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
