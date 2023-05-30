<script lang="ts">
import { defineComponent, h, type Component } from 'vue'
import Emulator from './Emulator.vue'
import StartUp from './StartUp.vue'
import Fighting from './Fighting.vue'
import Infrast from './Infrast.vue'
import NoConfiguration from './NoConfiguration.vue'
import Recruit from './Recruit.vue'
import Rogue from './Rogue.vue'
import Mall from './Mall.vue'
import Shutdown from './Shutdown.vue'

const components: Record<string, Component> = {
  Emulator: Emulator,
  StartUp: StartUp,
  Fight: Fighting,
  Recruit: Recruit,
  Infrast: Infrast,
  Roguelike: Rogue,
  Mall: Mall,
  Shutdown: Shutdown,
}

export default defineComponent({
  name: 'ConfigurationIndex',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  render() {
    const component = components[this.name]
    if (component) {
      // @ts-ignore
      return h(component, { ...this.$attrs /* 透传除了name以外的其他参数 */ })
    } else {
      return h(NoConfiguration)
    }
  },
})
</script>

<style lang="less">
.configuration-form {
  padding: 8px 2px;
}
</style>
