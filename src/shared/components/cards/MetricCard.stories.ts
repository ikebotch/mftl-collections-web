import type { Meta, StoryObj } from '@storybook/vue3'
import MetricCard from './MetricCard.vue'

const meta: Meta<typeof MetricCard> = {
  title: 'Components/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['purple', 'green', 'amber', 'blue', 'red', 'slate'],
    },
    icon: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof MetricCard>

export const Default: Story = {
  args: {
    label: 'Operational Events',
    value: '12',
    icon: 'Calendar',
    color: 'purple',
  },
}

export const WithTrend: Story = {
  args: {
    label: 'Total Raised',
    value: 'GHS 45,200.00',
    icon: 'TrendingUp',
    color: 'green',
    trend: '12%',
    trendPositive: true,
  },
}

export const WithProgress: Story = {
  args: {
    label: 'Target Achievement',
    value: '85%',
    icon: 'Target',
    color: 'blue',
    progress: 85,
    progressLabel: 'Goal: GHS 100k',
  },
}

export const Warning: Story = {
  args: {
    label: 'Pending Settlements',
    value: '18',
    icon: 'Clock',
    color: 'amber',
    trend: '5',
    trendPositive: false,
  },
}
