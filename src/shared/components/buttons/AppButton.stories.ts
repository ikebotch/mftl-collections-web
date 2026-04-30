import type { Meta, StoryObj } from '@storybook/vue3'
import AppButton from './AppButton.vue'
import { Plus } from 'lucide-vue-next'

const meta: Meta<typeof AppButton> = {
  title: 'Components/AppButton',
  component: AppButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'white', 'action'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof AppButton>

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    default: 'Primary Action',
  },
  render: (args) => ({
    components: { AppButton },
    setup() { return { args } },
    template: '<AppButton v-bind="args">{{ args.default }}</AppButton>',
  }),
}

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
    default: 'Secondary Action',
  },
}

export const Outline: Story = {
  args: {
    ...Primary.args,
    variant: 'outline',
    default: 'Outline Action',
  },
}

export const WithIcon: Story = {
  args: {
    ...Primary.args,
    variant: 'primary',
    default: 'Invite User',
  },
  render: (args) => ({
    components: { AppButton, Plus },
    setup() { return { args } },
    template: `
      <AppButton v-bind="args">
        <template #icon><Plus class="w-4 h-4 mr-2" /></template>
        {{ args.default }}
      </AppButton>
    `,
  }),
}

export const Loading: Story = {
  args: {
    ...Primary.args,
    loading: true,
    default: 'Processing',
  },
}

export const Small: Story = {
  args: {
    ...Primary.args,
    size: 'xs',
    default: 'View Details',
  },
}
