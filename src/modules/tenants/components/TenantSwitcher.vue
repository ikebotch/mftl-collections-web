<template>
  <div
    ref="containerRef"
    class="relative group"
  >
    <!-- Main Selector Button (Modernized) -->
    <button 
      class="premium-switcher-btn"
      :class="{ 
        'is-open': isOpen,
        'is-disabled': !canOpenSwitcher && !isPlatformAdmin,
        'is-collapsed': isCollapsed
      }"
      @click="handleToggle"
    >
      <div class="icon-container">
        <div class="icon-glow" />
        <template v-if="!isCollapsed">
          <ShieldCheck
            v-if="!branchStore.selectedBranchId"
            class="icon"
          />
          <MapPin
            v-else
            class="icon"
          />
        </template>
        <Building2 v-else class="icon" />
      </div>
      
      <div v-if="!isCollapsed" class="label-area animate-in fade-in slide-in-from-left-2 duration-500">
        <h1 class="hub-title">
          {{ config.appName }}
        </h1>
        <div class="hub-badge">
          <span class="badge-dot" />
          <p class="badge-text">
            {{ displayTitle }} &bull; {{ displaySubtitle }}
          </p>
        </div>
      </div>
      
      <div
        v-if="!isCollapsed && (canOpenSwitcher || isPlatformAdmin)"
        class="chevron-wrapper"
      >
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
        <div
          v-if="!isSingleTenant || isPlatformAdmin"
          class="sliding-tabs"
        >
          <div 
            class="tab-indicator"
            :style="{ transform: `translateX(${activeView === 'tenants' ? '0' : '100%'})` }"
          />
          <div class="tabs-grid">
            <button 
              v-if="!isSingleTenant || isPlatformAdmin"
              class="tab-btn"
              :class="{ active: activeView === 'tenants' }"
              @click="activeView = 'tenants'"
            >
              Organizations
            </button>
            <button 
              class="tab-btn"
              :class="{ 
                active: activeView === 'branches',
                'full-width': isSingleTenant && !isPlatformAdmin
              }"
              @click="activeView = 'branches'"
            >
              Branches
            </button>
          </div>
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
              v-if="!isPendingTenants && !tenants?.length"
              key="empty"
              class="empty-state"
            >
              <div class="empty-icon-box">
                <Search class="w-4 h-4 text-slate-600" />
              </div>
              <p>No organizations found</p>
            </div>

            <!-- Global Discovery (Platform Admin Only) -->
            <button
              v-if="isPlatformAdmin"
              key="global"
              class="list-item"
              :class="{ 'is-selected': !tenantStore.selectedTenantId }"
              @click="selectGlobalView"
            >
              <div class="item-icon-box global-icon">
                <Globe class="w-4 h-4" />
              </div>
              <div class="item-info">
                <p class="item-name">
                  Global System View
                </p>
                <p class="item-meta">
                  All Organizations & Branches
                </p>
              </div>
              <div
                v-if="!tenantStore.selectedTenantId"
                class="active-indicator"
              />
            </button>
            
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
                  {{ tenantStore.selectedTenantName || 'Main Hub' }}
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

            <!-- All Branches (Platform Admin or Reporting Pages) -->
            <button
              v-if="isPlatformAdmin"
              key="all-branches"
              class="list-item"
              :class="{ 'is-selected': branchStore.selectedBranchIds.includes('all') }"
              @click="selectAllBranches"
            >
              <div class="item-icon-box all-icon">
                <Layers class="w-4 h-4" />
              </div>
              <div class="item-info">
                <p class="item-name">
                  All Branches
                </p>
                <p class="item-meta">
                  System Wide Overview
                </p>
              </div>
              <div
                v-if="branchStore.selectedBranchIds.includes('all')"
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
                  {{ branch.isHeadquarters ? 'Headquarters' : getTenantName(branch.tenantId) }}
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
import { Building2, MapPin, ChevronDown, Search, ArrowLeft, Check, Globe, Layers, ShieldCheck } from 'lucide-vue-next'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { tenantsService } from '../services/tenantsService'
import { branchesService } from '../services/branchesService'
import { useTenantStore } from '../store/tenantStore'
import { useBranchStore } from '@/modules/branches/store/branchStore'
import { useMe } from '@/modules/users/composables/useUsers'
import { appConfig } from '@/core/config/appConfig'

const props = defineProps<{
  isCollapsed?: boolean
}>()

// Expose appConfig to the template
const config = appConfig

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const activeView = ref<'tenants' | 'branches'>('tenants')
const queryClient = useQueryClient()

const tenantStore = useTenantStore()
const branchStore = useBranchStore()
const { data: me } = useMe()

const isCollector = computed(() => {
  const roles = me.value?.effectiveRoles || []
  return roles.includes('Collector') || roles.includes('Collector Supervisor')
})

const isPlatformAdmin = computed(() => me.value?.isPlatformAdmin ?? false)

const { data: tenants, isPending: isPendingTenants } = useQuery({
  queryKey: ['tenants-list'],
  queryFn: () => tenantsService.list(),
  enabled: true // Always enable for authenticated users to see their assignments
})

const isSingleTenant = computed(() => (tenants.value?.length ?? 0) === 1)

const { data: branches, refetch: refetchBranches } = useQuery({
  queryKey: ['branches-list', tenantStore.selectedTenantIdsCSV],
  queryFn: () => branchesService.list(tenantStore.selectedTenantIdsCSV || undefined),
  enabled: computed(() => (!!tenantStore.selectedTenantIdsCSV || isPlatformAdmin.value))
})



const canOpenSwitcher = computed(() => {
  if (isPlatformAdmin.value) return true
  return (tenants.value?.length ?? 0) > 1 || (branches.value?.length ?? 0) > 1
})

function handleToggle() {
  if (!canOpenSwitcher.value && !isPlatformAdmin.value) return
  isOpen.value = !isOpen.value
}

// Auto-initialize context for single-tenant users
watch(tenants, (newTenants) => {
  if (newTenants?.length === 1 && !isPlatformAdmin.value) {
    activeView.value = 'branches'
    if (!tenantStore.selectedTenantId) {
      tenantStore.setTenants([newTenants[0].id], newTenants[0].name)
    }
  }
}, { immediate: true })

const displayTitle = computed(() => {
  if (branchStore.selectedBranchIds.includes('all')) return 'All Branches'
  if (branchStore.selectedBranchIds.length > 1) return `${branchStore.selectedBranchIds.length} Branches`
  if (branchStore.selectedBranchIds.length === 1) {
    const branch = branches.value?.find(b => b.id === branchStore.selectedBranchIds[0])
    return branch?.name || 'Selected Branch'
  }
  
  if (!tenantStore.selectedTenantId && isPlatformAdmin.value) return 'Global View'
  if (tenantStore.selectedTenantIds.length > 1) return `${tenantStore.selectedTenantIds.length} Organizations`
  return tenantStore.selectedTenantName || 'Select Hub'
})

const displaySubtitle = computed(() => {
  if (branchStore.selectedBranchIds.includes('all')) return 'System Wide Discovery'
  if (branchStore.selectedBranchIds.length > 0) return 'Operational Scope'
  if (!tenantStore.selectedTenantId && isPlatformAdmin.value) return 'System Authority'
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

watch(() => tenantStore.selectedTenantIds, () => {
  refetchBranches()
  queryClient.invalidateQueries()
}, { deep: true })

watch(() => branchStore.selectedBranchIds, () => {
  queryClient.invalidateQueries()
}, { deep: true })

function getTenantName(tenantId: string) {
  if (!tenants.value) return 'Organization'
  const tenant = tenants.value.find(t => t.id === tenantId)
  return tenant ? tenant.name : 'Organization'
}

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
    ids.splice(index, 1)
  } else {
    ids.push(tenant.id)
  }
  
  let name = ''
  if (ids.length === 1) {
    const activeTenant = tenants.value?.find(t => t.id === ids[0])
    name = activeTenant?.name || ''
  }
  
  tenantStore.setTenants(ids, name)
  branchStore.clearBranch()
}

function selectGlobalView() {
  tenantStore.clearTenant()
  branchStore.clearBranch()
  isOpen.value = false
}

function toggleBranch(branch: any) {
  branchStore.toggleBranch(branch.id)
}

function selectAllBranches() {
  branchStore.setBranches(['all'])
  isOpen.value = false
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
  border-radius: 0;
  background: transparent;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  text-align: left;
  border: 1px solid transparent;
}

.premium-switcher-btn:hover {
  background: rgba(255, 255, 255, 0.03);
}

.premium-switcher-btn.is-collapsed {
  padding: 0;
  justify-content: center;
}

.premium-switcher-btn.is-disabled {
  cursor: default;
  opacity: 0.9;
}

.premium-switcher-btn.is-disabled:hover {
  background: transparent;
}

.premium-switcher-btn.is-open {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--hub-border);
}

.icon-container {
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0;
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
  border-radius: 0;
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
  border-radius: 0;
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
  top: calc(100% + 1rem);
  left: 0;
  width: 22rem;
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
  border-radius: 0;
  overflow: hidden;
}

.sliding-tabs {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  margin: 1rem;
  border-radius: 0;
  padding: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
 
.tabs-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  z-index: 1;
}

.tab-indicator {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: calc(50% - 0.25rem);
  height: calc(100% - 0.5rem);
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.tab-btn {
  padding: 0.625rem 0.25rem;
  font-size: 0.625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--hub-text-muted);
  transition: all 0.3s;
  white-space: nowrap;
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
  border-radius: 0;
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
  border-radius: 0;
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
  border-radius: 0;
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
  border-radius: 0;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
.tab-btn.full-width {
  grid-column: span 2;
}
</style>
