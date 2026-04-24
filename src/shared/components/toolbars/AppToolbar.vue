<template>
  <div class="rounded-2xl bg-white p-6 shadow-premium ring-1 ring-slate-900/5">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="grid flex-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <slot />
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
