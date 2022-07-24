<script lang="ts">
import { defineComponent, h, Component } from 'vue'
import NoProgress from './NoProgress.vue'
import Emulator from './Emulator.vue'
import Game from './Game.vue'
import Fighting from './Fighting.vue'
import Infrast from './Infrast.vue'
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
  name: 'ProgressIndex',
  props: {
    taskId: {
      type: String,
      required: true
    },
    progress: {
      type: Object,
      required: true
    }
  },
  render () {
    const component = components[this.taskId]
    const { progress } = this
    if (component) {
      // @ts-ignore
      return h(component, { Progress })
    } else {
      return h(NoProgress)
    }
  }
})
</script>

<style lang="less">
.Progress-form {
  padding: 8px 2px;
}
</style>
