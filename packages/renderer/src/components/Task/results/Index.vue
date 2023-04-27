<script lang="ts">
import { defineComponent, h, type Component } from 'vue'
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
  Emulator: Emulator,
  game: Game,
  Fight: Fighting,
  Recruit: Recruit,
  Infrast: Infrast,
  Roguelike: Rogue,
  Mall: Mall,
  Shutdown: Shutdown,
}

export default defineComponent({
  name: 'ResultIndex',
  props: {
    name: {
      type: String,
      required: true,
    },
    results: {
      type: Object,
      required: true,
    },
  },
  render() {
    const component = components[this.name]
    const { results } = this
    if (component) {
      // @ts-ignore
      return h(component, { results })
    } else {
      return h(NoProgress)
    }
  },
})
</script>

<style lang="less">
.progress-form {
  padding: 8px 2px;
}
</style>
