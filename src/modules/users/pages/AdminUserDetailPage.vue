<template>
  <div
    v-if="query.isLoading.value"
    class="py-32"
  >
    <LoadingState text="Retrieving user profile..." />
  </div>
  <ErrorState
    v-else-if="query.isError.value"
    title="Data Retrieval Failed"
    :message="query.error.value?.message || 'Sync failed'"
    show-retry
    @retry="query.refetch"
  />
  <div
    v-else-if="user"
    class="space-y-10 pb-20"
  >
    <!-- Header -->
    <DetailPageHeader
      :title="user.name"
      description="User identity, permissions, and security settings management."
      back-to="/admin/users"
      back-label="Users List"
    >
      <template #status>
        <div class="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] shrink-0 rounded-full">
          <div 
            class="w-1.5 h-1.5 rounded-full"
            :class="user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'"
          />
          <span class="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">
            {{ user.status }}
          </span>
        </div>
      </template>

      <template #actions>
        <div class="flex items-center gap-3">
          <AppButton
            variant="outline"
            size="sm"
            class="!rounded-none"
            @click="handleStatusAction('ResetPassword')"
          >
            <RefreshCcw class="w-3.5 h-3.5 mr-2" /> Reset Access
          </AppButton>
          <AppButton 
            v-if="user.status !== 'Suspended'" 
            variant="danger" 
            size="sm" 
            class="!rounded-none shadow-lg shadow-rose-100"
            @click="handleStatusAction('Suspend')"
          >
            <ShieldAlert class="w-3.5 h-3.5 mr-2" /> Suspend
          </AppButton>
        </div>
      </template>
    </DetailPageHeader>

    <!-- Top Tabs (Level 1 Navigation) -->
    <div class="sticky top-0 z-40 -mx-8 px-8 bg-transparent border-b border-slate-200/60 py-4 mb-12">
      <div class="max-w-[1200px] mx-auto">
        <DetailTabs
          v-model="activeTab"
          :tabs="topTabs"
        />
      </div>
    </div>

    <!-- Tab Content -->
    <div class="min-h-[400px]">
      <div v-if="activeTab === 'overview'">
        <AdminWizardLayout
          :sections="pageSections"
          title="User Details"
        >
          <!-- Identity Section -->
          <AppCard
            id="identity"
            class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm relative overflow-hidden group"
          >
            <EditorialHeader 
              title="Profile" 
            >
              <template #actions>
                <button
                  v-if="!isEditing"
                  type="button"
                  class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                  @click="isEditing = true"
                >
                  <Pencil class="w-3.5 h-3.5" />
                  <span class="text-[10px] font-black uppercase tracking-[0.2em]">Update Profile</span>
                </button>
              </template>
            </EditorialHeader>

            <div
              v-if="!isEditing"
              class="space-y-16 animate-in fade-in duration-700"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
                <!-- Row 1 -->
                <div class="space-y-3">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                    Account Name
                  </p>
                  <p class="text-[16px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                    {{ user.name }}
                  </p>
                </div>
                <div class="space-y-3">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                    Operational Email
                  </p>
                  <p class="text-[16px] font-black text-slate-900 tracking-tighter italic leading-none">
                    {{ user.email }}
                  </p>
                </div>

                <!-- Row 2 -->
                <div class="space-y-3">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                    Identity Provider
                  </p>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-none bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Lock class="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p class="text-[16px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                      Auth0 Cloud
                    </p>
                  </div>
                </div>
                <div class="space-y-3">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                    Last Synchronization
                  </p>
                  <p class="text-[16px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                    {{ user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never' }}
                  </p>
                </div>

                <!-- Row 3 -->
                <div class="space-y-3">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                    Auth0 Cloud ID
                  </p>
                  <p class="text-[12px] font-mono text-slate-600 break-all leading-tight select-all">
                    {{ user.auth0Id }}
                  </p>
                </div>
                <div class="space-y-3">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                    Status
                  </p>
                  <p class="text-[16px] font-black text-slate-900 tracking-tighter uppercase leading-none">
                    Active & Verified
                  </p>
                </div>
              </div>

              <div
                v-if="user.isPlatformAdmin"
                class="space-y-3"
              >
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                  System Authority
                </p>
                <div class="flex items-center gap-2.5 px-3 py-1.5 bg-violet-600 w-fit">
                  <ShieldCheck class="w-3.5 h-3.5 text-white" />
                  <p class="text-[10px] font-black text-white tracking-widest uppercase">
                    Platform Administrator
                  </p>
                </div>
              </div>

              <!-- Row 4 -->
              <div class="space-y-3">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                  MFA Configuration
                </p>
                <div class="flex items-center gap-2.5">
                  <Fingerprint class="w-4 h-4 text-emerald-500" />
                  <p class="text-[14px] font-black text-emerald-600 tracking-tight uppercase">
                    Strict Enforcement Enabled
                  </p>
                </div>
              </div>
            </div>

            <!-- Edit Mode -->
            <div
              v-else
              class="space-y-12"
            >
              <div class="grid md:grid-cols-2 gap-12">
                <AppInput
                  v-model="form.name"
                  label="Full Name"
                  placeholder="Legal name"
                  required
                />
                <AppInput
                  v-model="form.phoneNumber"
                  label="Phone Number"
                  placeholder="+233..."
                />
              </div>
              <div class="grid md:grid-cols-2 gap-12">
                <AppSelect
                  v-model="form.status"
                  label="Account Status"
                  :options="[
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                    { label: 'Suspended', value: 'Suspended' }
                  ]"
                />
                <div class="flex flex-col gap-4">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Privileges</label>
                  <div class="flex items-center gap-3 p-5 bg-slate-50 border border-slate-100">
                    <AppSwitch v-model="form.isPlatformAdmin" />
                    <div>
                      <p class="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">
                        Platform Administrator
                      </p>
                      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Grant unrestricted global access
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </AppCard>

      <!-- Access Scopes Section -->
      <AppCard
        id="scopes"
        class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm relative overflow-hidden group"
      >
        <EditorialHeader 
          title="Access Scopes" 
          subtitle="Step 02"
        >
          <template #actions>
            <div class="flex items-center gap-4">
              <button
                v-if="!isEditingScopes"
                type="button"
                class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
                @click="isEditingScopes = true"
              >
                <Pencil class="w-3.5 h-3.5" />
                <span class="text-[10px] font-black uppercase tracking-[0.2em]">Manage Access</span>
              </button>
              <AppButton 
                v-else 
                variant="ghost" 
                size="xs" 
                class="text-[10px] font-black uppercase tracking-widest text-violet-600"
                @click="showAddForm = !showAddForm"
              >
                <Plus class="w-3.5 h-3.5 mr-2" /> {{ showAddForm ? 'Cancel Add' : 'Add Scope' }}
              </AppButton>
            </div>
          </template>
        </EditorialHeader>

        <!-- Add Scope Form (Screenshot 01 Style) -->
        <div
          v-if="isEditingScopes && showAddForm"
          class="mb-12 p-12 bg-slate-50/50 border border-slate-100 rounded-none space-y-12 animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div class="space-y-6">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none italic">
              Select Access Level
            </p>
            <div class="grid md:grid-cols-3 gap-4">
              <button 
                v-for="s in [{id:'Platform', label:'System', icon: Globe}, {id:'Organisation', label:'Organization', icon: Building2}, {id:'Event', label:'Events', icon: Calendar}]"
                :key="s.id"
                class="p-4 rounded-none border transition-all text-left flex items-center gap-4"
                :class="scopeForm.scopeType === s.id ? 'border-violet-600 bg-white shadow-sm' : 'border-slate-100 bg-white/50 hover:border-slate-200'"
                @click="scopeForm.scopeType = s.id"
              >
                <component
                  :is="s.icon"
                  class="w-4 h-4"
                  :class="scopeForm.scopeType === s.id ? 'text-violet-600' : 'text-slate-300'"
                />
                <span
                  class="text-[10px] font-black uppercase tracking-widest"
                  :class="scopeForm.scopeType === s.id ? 'text-violet-600' : 'text-slate-900'"
                >{{ s.label }}</span>
              </button>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <div
              v-if="scopeForm.scopeType === 'Organisation'"
              class="space-y-8 contents"
            >
              <div class="space-y-4">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                  Organization
                </p>
                <select
                  v-model="scopeForm.tenantId"
                  class="w-full p-4 rounded-none bg-white border border-slate-100 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-violet-600 outline-none shadow-sm"
                >
                  <option value="">
                    Current Tenant
                  </option>
                  <option
                    v-for="t in tenants"
                    :key="t.id"
                    :value="t.id"
                  >
                    {{ t.name }}
                  </option>
                </select>
              </div>
              <div class="space-y-4">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                  Branch (Optional)
                </p>
                <select
                  v-model="scopeForm.branchId"
                  class="w-full p-4 rounded-none bg-white border border-slate-100 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-violet-600 outline-none shadow-sm"
                >
                  <option value="">
                    Full Organization
                  </option>
                  <option
                    v-for="b in branches"
                    :key="b.id"
                    :value="b.id"
                  >
                    {{ b.name }}
                  </option>
                </select>
              </div>
            </div>

            <div
              v-if="scopeForm.scopeType === 'Event'"
              class="space-y-8 contents"
            >
              <div class="space-y-4">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                  Campaign
                </p>
                <select
                  v-model="scopeForm.eventId"
                  class="w-full p-4 rounded-none bg-white border border-slate-100 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-violet-600 outline-none shadow-sm"
                >
                  <option value="">
                    Choose an event...
                  </option>
                  <option
                    v-for="e in events"
                    :key="e.id"
                    :value="e.id"
                  >
                    {{ e.title }}
                  </option>
                </select>
              </div>
              <div class="space-y-4">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">
                  Specific Fund
                </p>
                <select
                  v-model="scopeForm.fundId"
                  :disabled="!scopeForm.eventId"
                  class="w-full p-4 rounded-none bg-white border border-slate-100 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-violet-600 outline-none shadow-sm disabled:opacity-50"
                >
                  <option value="">
                    All Campaign Funds
                  </option>
                  <option
                    v-for="f in filteredFunds"
                    :key="f.id"
                    :value="f.id"
                  >
                    {{ f.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none italic">
              Assign Functional Roles
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="role in roles"
                :key="role"
                class="px-5 py-2.5 rounded-none border text-left transition-all"
                :class="scopeForm.roles.includes(role) ? 'border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-100' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'"
                @click="toggleRole(role)"
              >
                <span class="text-[10px] font-black uppercase tracking-widest">{{ role }}</span>
              </button>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <AppButton 
              variant="primary" 
              size="sm" 
              class="px-12 rounded-none shadow-lg shadow-violet-100"
              :disabled="!isScopeFormValid"
              :loading="isAssigning"
              @click="handleAssignScope"
            >
              Confirm & Add Scope
            </AppButton>
          </div>
        </div>

        <!-- Scope List (Screenshot 02 Style) -->
        <div class="space-y-4">
          <div
            v-if="user.scopeAssignments.length > 0"
            class="border border-slate-100 rounded-none overflow-hidden shadow-sm divide-y divide-slate-50"
          >
            <AssignmentListRow 
              v-for="scope in user.scopeAssignments" 
              :key="scope.id"
              :type="getScopeRowType(scope.scopeType)"
              :title="scope.targetName || 'Global System Access'"
              :subtitle="formatScopeType(scope.scopeType)"
              :badge="scope.role"
              :is-assigned="true"
              :is-editing="isEditingScopes"
              @action="handleRevokeScope(scope.id)"
            />
          </div>
          <div
            v-else
            class="py-32 border border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 bg-slate-50/30 rounded-none"
          >
            <ShieldAlert class="w-8 h-8 text-slate-100" />
            <div class="text-center space-y-1">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                No Active Assignments
              </p>
              <p class="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                Click manage to establish user access
              </p>
            </div>
          </div>
        </div>
      </AppCard>

      <!-- Capabilities Section -->
      <AppCard
        id="capabilities"
        class="!p-20 scroll-mt-10 border-slate-200/50 shadow-sm relative overflow-hidden group"
      >
        <EditorialHeader 
          title="Intelligence & Actions" 
          subtitle="Step 03"
        >
          <template #actions>
            <button
              type="button"
              class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors group"
              @click="scrollToSection('scopes')"
            >
              <Pencil class="w-3.5 h-3.5" />
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">Refine Access</span>
            </button>
          </template>
        </EditorialHeader>
        <div class="grid md:grid-cols-3 gap-16">
          <div
            v-for="group in capabilityGroups"
            :key="group.title"
            class="space-y-8"
          >
            <h4 class="text-[10px] font-black text-violet-600 uppercase tracking-[0.3em] italic">
              {{ group.title }}
            </h4>
            <ul class="space-y-5">
              <li
                v-for="perm in group.permissions"
                :key="perm"
                class="flex items-start gap-4"
              >
                <CheckCircle2
                  v-if="hasPermission(perm)"
                  class="w-4 h-4 text-emerald-500 shrink-0"
                />
                <XCircle
                  v-else
                  class="w-4 h-4 text-slate-100 shrink-0"
                />
                <span
                  class="text-[11px] font-bold uppercase tracking-[0.1em]"
                  :class="hasPermission(perm) ? 'text-slate-800' : 'text-slate-300'"
                >
                  {{ formatPermission(perm) }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </AppCard>

      <template #sidebar-footer>
        <div class="sticky top-[80vh]">
          <AppCard class="!p-10 border-slate-100 shadow-sm bg-slate-50/50 relative overflow-hidden">
            <ShieldCheck class="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03]" />
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 mb-8">
              Security Trace
            </h3>
                
            <div class="space-y-10">
              <div class="space-y-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Auth0 Cloud ID</span>
                <div class="p-3 bg-white border border-slate-100 rounded-none">
                  <span class="text-[10px] font-mono text-slate-600 break-all leading-relaxed">{{ user.auth0Id }}</span>
                </div>
              </div>
              <div class="space-y-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Verified Email</span>
                <p class="text-[11px] font-black text-slate-900 italic lowercase leading-none">
                  {{ user.email }}
                </p>
              </div>
            </div>
          </AppCard>
        </div>
      </template>
      </AdminWizardLayout>
    </div>

    <div
      v-else-if="activeTab === 'assignments'"
      class="space-y-12"
    >
      <AppCard class="!p-0 border-slate-100 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Access Scope
              </th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Target Context
              </th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Assigned Role
              </th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="scope in user.scopeAssignments"
              :key="scope.id"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                  <component
                    :is="getScopeIcon(scope.scopeType)"
                    class="w-4 h-4 text-slate-300"
                  />
                  <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">{{ scope.scopeType }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                  {{ scope.targetName || 'Global Context' }}
                </p>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1 bg-violet-50 text-violet-600 text-[9px] font-black uppercase tracking-widest border border-violet-100">
                  {{ scope.role }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <button 
                  class="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-700 transition-colors"
                  @click="handleRevokeScope(scope.id)"
                >
                  Revoke
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </AppCard>
    </div>

    <div
      v-else-if="activeTab === 'history'"
      class="space-y-12"
    >
      <section
        id="activity"
        class="space-y-8"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black text-slate-900 tracking-tight italic uppercase">
            Full Access History
          </h3>
          <AppButton
            variant="ghost"
            size="xs"
            class="text-[10px] font-black uppercase tracking-widest"
          >
            Download Audit Log
          </AppButton>
        </div>
        <AppCard class="!p-0 border-slate-100 shadow-sm overflow-hidden">
          <div class="divide-y divide-slate-50">
            <div
              v-for="log in auditLogs"
              :key="log.id"
              class="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-center gap-8">
                <div class="w-12 h-12 rounded-none bg-slate-100 flex items-center justify-center text-slate-400">
                  <History class="w-5 h-5" />
                </div>
                <div>
                  <h5 class="text-xs font-black text-slate-900 uppercase tracking-tight">
                    {{ formatAction(log.action) }}
                  </h5>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    by {{ log.performedBy }} • {{ log.details }}
                  </p>
                </div>
              </div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ new Date(log.createdAt).toLocaleString() }}</span>
            </div>
          </div>
        </AppCard>
      </section>
    </div>

    <div
      v-else-if="activeTab === 'settings'"
      class="space-y-12"
    >
      <AppCard class="!p-16 max-w-4xl border-slate-100">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400/80 mb-16">
          Account Control
        </h3>
        <div class="space-y-12">
          <div class="flex items-center justify-between p-12 bg-rose-50/30 border border-rose-100">
            <div class="space-y-3">
              <p class="text-[13px] font-black text-rose-900 tracking-tighter uppercase leading-none">
                Delete Account
              </p>
              <p class="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-none">
                Permanently remove this user and all associated records
              </p>
            </div>
            <AppButton
              variant="danger"
              size="sm"
              class="!rounded-none shadow-lg shadow-rose-100"
            >
              <ShieldAlert class="w-3.5 h-3.5 mr-2" /> Request Deletion
            </AppButton>
          </div>
        </div>
      </AppCard>
    </div>
  </div>

  <StickyFormActions v-if="isEditing">
    <template #left>
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Identity and cloud synchronization pending...</span>
    </template>
    <AppButton
      variant="outline"
      class="bg-transparent border-slate-200 px-10"
      @click="isEditing = false"
    >
      Discard
    </AppButton>
    <AppButton
      variant="primary"
      class="px-12"
      :loading="updateMutation.isPending.value"
      @click="handleSave"
    >
      Save Profile
    </AppButton>
  </StickyFormActions>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUser, useUpdateUser } from '../composables/useUsers'
import { usersService } from '../services/usersService'
import AppCard from '@/shared/components/cards/AppCard.vue'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppInput from '@/shared/components/forms/AppInput.vue'
import AppSelect from '@/shared/components/forms/AppSelect.vue'
import AppSwitch from '@/shared/components/forms/AppSwitch.vue'
import LoadingState from '@/shared/components/loaders/LoadingState.vue'
import ErrorState from '@/shared/components/loaders/ErrorState.vue'
import StickyFormActions from '@/shared/components/forms/StickyFormActions.vue'
import { 
  Pencil, 
  RefreshCcw, 
  ShieldAlert, 
  ShieldCheck, 
  Fingerprint, 
  Lock, 
  Globe, 
  Calendar, 
  Building2,
  MapPin,
  CheckCircle2, 
  XCircle, 
  Plus,
  History,
  Target
} from 'lucide-vue-next'
import { useToastStore } from '@/shared/stores/useToastStore'
import { useQuery } from '@tanstack/vue-query'
import AdminWizardLayout from '@/shared/components/layouts/AdminWizardLayout.vue'
import DetailPageHeader from '@/shared/components/headers/DetailPageHeader.vue'
import DetailTabs from '@/shared/components/tabs/DetailTabs.vue'
import AssignmentListRow from '@/shared/components/rows/AssignmentListRow.vue'
import EditorialHeader from '@/shared/components/headers/EditorialHeader.vue'

import { tenantsService } from '@/modules/tenants/services/tenantsService'
import { branchesService } from '@/modules/tenants/services/branchesService'
import { eventsService } from '@/modules/events/services/eventsService'
import { recipientFundsService } from '@/modules/recipient-funds/services/recipientFundsService'

const route = useRoute()
const toast = useToastStore()
const userId = computed(() => route.params.id as string)
const query = useUser(userId)
const user = computed(() => query.data.value)
const updateMutation = useUpdateUser()

const activeTab = ref('overview')

const topTabs = [
  { key: 'overview', label: 'Overview', icon: 'User' },
  { key: 'assignments', label: 'Assignments', icon: 'Target' },
  { key: 'history', label: 'History', icon: 'Clock' },
  { key: 'settings', label: 'Settings', icon: 'Settings' }
]

const pageSections = [
  { id: 'identity', title: 'Profile' },
  { id: 'roles', title: 'Permissions' },
  { id: 'audit', title: 'Activity' }
]

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const isAssigning = ref(false)

// Inline Scope Assignment Form
const isEditingScopes = ref(false)
const showAddForm = ref(false)
const scopeForm = ref({
  scopeType: 'Organisation' as any,
  roles: [] as string[],
  tenantId: '',
  branchId: '',
  eventId: '',
  fundId: ''
})

const isScopeFormValid = computed(() => {
  if (scopeForm.value.roles.length === 0) return false
  if (scopeForm.value.scopeType === 'Event' && !scopeForm.value.eventId) return false
  return true
})

function getScopeRowType(type: string): 'event' | 'fund' {
  if (type === 'Event' || type === 'Platform' || type === 'Organisation' || type === 'Branch') return 'event'
  return 'fund'
}

const roles = [
  'Platform Admin', 
  'Organisation Admin', 
  'Finance Officer', 
  'Branch Manager', 
  'Event Manager', 
  'Collector', 
  'Recipient Manager', 
  'Reporting Officer', 
  'Audit/Security Officer', 
  'General Staff/Viewer'
]

const { data: tenants } = useQuery({
  queryKey: ['tenants-list'],
  queryFn: () => tenantsService.list(),
  enabled: computed(() => isEditingScopes.value)
})

const { data: branches } = useQuery({
  queryKey: ['branches-list', computed(() => scopeForm.value.tenantId)],
  queryFn: () => branchesService.list(scopeForm.value.tenantId),
  enabled: computed(() => isEditingScopes.value && scopeForm.value.scopeType === 'Organisation')
})

const { data: events } = useQuery({
  queryKey: ['events-minimal'],
  queryFn: () => eventsService.list(),
  enabled: computed(() => isEditingScopes.value && scopeForm.value.scopeType === 'Event')
})

const { data: funds } = useQuery({
  queryKey: ['funds-minimal'],
  queryFn: () => recipientFundsService.list(),
  enabled: computed(() => isEditingScopes.value && scopeForm.value.scopeType === 'Event')
})

const filteredFunds = computed(() => {
  if (!scopeForm.value.eventId) return []
  return funds.value?.filter((f: any) => f.eventId === scopeForm.value.eventId) || []
})

function toggleRole(role: string) {
  const index = scopeForm.value.roles.indexOf(role)
  if (index === -1) scopeForm.value.roles.push(role)
  else scopeForm.value.roles.splice(index, 1)
}

async function handleAssignScope() {
  isAssigning.value = true
  try {
    let finalScopeType = scopeForm.value.scopeType
    let targetId = null

    if (scopeForm.value.scopeType === 'Organisation') {
      if (scopeForm.value.branchId) {
        finalScopeType = 'Branch'
        targetId = scopeForm.value.branchId
      } else {
        targetId = scopeForm.value.tenantId
      }
    } else if (scopeForm.value.scopeType === 'Event') {
      if (scopeForm.value.fundId) {
        finalScopeType = 'RecipientFund'
        targetId = scopeForm.value.fundId
      } else {
        targetId = scopeForm.value.eventId
      }
    }

    await usersService.assignScope(userId.value, {
      roles: scopeForm.value.roles.length > 0 ? scopeForm.value.roles : ['General Staff/Viewer'],
      scopeType: finalScopeType,
      targetId: targetId || null
    })
    
    toast.success('Access scopes updated')
    isEditingScopes.value = false
    query.refetch()
    auditLogsQuery.refetch()
  } catch {
    toast.error('Failed to update scopes')
  } finally {
    isAssigning.value = false
  }
}

async function handleRevokeScope(assignmentId: string) {
  try {
    await usersService.revokeScope(assignmentId)
    toast.success('Scope revoked')
    query.refetch()
    auditLogsQuery.refetch()
  } catch {
    toast.error('Failed to revoke scope')
  }
}


function formatScopeType(type: string) {
  const map: Record<string, string> = {
    'Platform': 'System Wide Access',
    'Organisation': 'Organization Wide',
    'Branch': 'Branch Specific',
    'Event': 'Event Scope',
    'RecipientFund': 'Fund Scope'
  }
  return map[type] || type
}

function getScopeIcon(type: string) {
  const map: any = {
    'Platform': Globe,
    'Organisation': Building2,
    'Branch': MapPin,
    'Event': Calendar,
    'RecipientFund': Target
  }
  return map[type] || ShieldCheck
}

const auditLogsQuery = useQuery({
  queryKey: ['user-audit', userId],
  queryFn: () => usersService.getAuditLogs(userId.value)
})
const auditLogs = computed(() => auditLogsQuery.data.value || [])

const capabilityGroups = [
  {
    title: 'COLLECTIONS',
    permissions: ['record_contribution', 'issue_receipt', 'void_pending_receipt', 'view_own_collections']
  },
  {
    title: 'VISIBILITY',
    permissions: ['view_own_history', 'view_assigned_events', 'view_assigned_funds']
  },
  {
    title: 'RESTRICTIONS',
    permissions: ['refund_payments', 'export_reports', 'manage_users', 'edit_system_settings']
  }
]

function hasPermission(perm: string) {
  if (!user.value?.scopeAssignments) return false
  const userPerms = user.value.scopeAssignments.flatMap(s => getPermissionsByRole(s.role))
  return userPerms.includes(perm) || userPerms.includes('all_access')
}

function formatPermission(perm: string) {
  return perm.split('_').join(' ')
}

function formatAction(action: string) {
  return action.split('_').join(' ')
}

const isEditing = ref(false)
const form = ref({
  name: '',
  phoneNumber: '',
  status: 'Active',
  isPlatformAdmin: false
})

watchEffect(() => {
  if (user.value) {
    form.value = {
      name: user.value.name,
      phoneNumber: user.value.phoneNumber || '',
      status: user.value.status,
      isPlatformAdmin: user.value.isPlatformAdmin || false
    }
  }
})

async function handleSave() {
  if (isEditingScopes.value) {
    await handleAssignScope()
    return
  }

  try {
    await updateMutation.mutateAsync({
      id: userId.value,
      payload: {
        name: form.value.name,
        phoneNumber: form.value.phoneNumber,
        isActive: form.value.status === 'Active',
        isPlatformAdmin: form.value.isPlatformAdmin
      }
    })
    toast.success('User profile updated successfully')
    isEditing.value = false
    query.refetch()
    auditLogsQuery.refetch()
  } catch {
    toast.error('Failed to update user profile')
  }
}

async function handleStatusAction(action: string) {
  try {
    await usersService.updateStatus(userId.value, action)
    toast.success(`User state: ${action} command sent`)
    query.refetch()
    auditLogsQuery.refetch()
  } catch {
    toast.error('Failed to perform security action')
  }
}

function getPermissionsByRole(role: string) {
  const mapping: Record<string, string[]> = {
    'Platform Admin': ['all_access'],
    'Organisation Admin': ['organisations.*', 'branches.*', 'events.*', 'funds.*', 'reports.*', 'users.*'],
    'Finance Officer': ['contributions.*', 'payments.*', 'reports.finance'],
    'Branch Manager': ['branches.manage', 'events.*', 'collectors.*'],
    'Event Manager': ['events.manage', 'funds.manage', 'collectors.manage'],
    'Collector': ['contributions.create', 'receipts.issue'],
    'Recipient Manager': ['funds.manage', 'donors.view'],
    'Reporting Officer': ['reports.view', 'analytics.view'],
    'Audit/Security Officer': ['audit.view', 'security.manage'],
    'General Staff/Viewer': ['events.view', 'funds.view']
  }
  return mapping[role] || ['read_access']
}
</script>
