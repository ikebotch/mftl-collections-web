import type { Meta, StoryObj } from '@storybook/vue3'
import ResourceListPage from './ResourceListPage.vue'
import { Calendar, Users, Wallet, Target } from 'lucide-vue-next'
import { h } from 'vue'

const meta: Meta<typeof ResourceListPage> = {
  title: 'Layouts/ResourceListPage',
  component: ResourceListPage,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof ResourceListPage>

const mockColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
]

const mockItems = [
  { id: 1, name: 'Sample Item 1', status: 'Active', amount: 'GHS 1,200.00' },
  { id: 2, name: 'Sample Item 2', status: 'Inactive', amount: 'GHS 850.00' },
  { id: 3, name: 'Sample Item 3', status: 'Pending', amount: 'GHS 0.00' },
]

const mockMetrics = [
  { label: 'Total Items', value: '3', icon: 'Users', color: 'purple' as const },
  { label: 'Total Value', value: 'GHS 2,050.00', icon: 'Wallet', color: 'green' as const },
  { label: 'Active Targets', value: '1', icon: 'Target', color: 'blue' as const },
]

export const Default: Story = {
  args: {
    title: 'Resource List',
    description: 'A standardized layout for managing resources.',
    metrics: mockMetrics,
    columns: mockColumns,
    items: mockItems,
    loading: false,
    searchPlaceholder: 'Search resources...',
    newResourcePath: '/new',
    newResourceLabel: 'New Resource',
  },
}

export const Loading: Story = {
  args: {
    ...Default.args,
    items: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    ...Default.args,
    items: [],
    loading: false,
  },
}
