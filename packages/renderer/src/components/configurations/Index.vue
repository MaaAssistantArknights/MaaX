<script lang="ts">
import { defineComponent, h, Component } from 'vue'
import Emulator from './Emulator.vue'
import Game from './Game.vue'
import Fighting from './Fighting.vue'
import Infrast from './Infrast.vue'
import NoConfiguration from './NoConfiguration.vue'
import Recruit from './Recruit.vue'
import Rogue from './Rogue.vue'
import Mall from './Mall.vue'
import Shutdown from './Shutdown.vue'

const components: Record<string, Component> = {
  emulator: Emulator,
  game: Game,
  fight: Fighting,
  recruit: Recruit,
  infrast: Infrast,
  rogue: Rogue,
  mall: Mall,
  shutdown: Shutdown
}

export default defineComponent({
  props: {
    taskId: {
      type: String,
      required: true
    },
    configurations: {
      type: Object,
      required: true
    }
  },
  render () {
    const component = components[this.taskId]
    const { configurations } = this
    if (component) {
      // @ts-ignore
      return h(component, { configurations })
    } else {
      return h(NoConfiguration)
    }
  }
})
</script>

<style lang="less">
.configuration-form {
  padding: 8px 2px;
}
</style>
