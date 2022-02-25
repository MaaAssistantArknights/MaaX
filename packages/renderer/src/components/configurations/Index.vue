<script lang="ts">
import { defineComponent, h, Component } from "vue";
import Fighting from "./Fighting.vue";
import Infrast from "./Infrast.vue";
import NoConfiguration from "./NoConfiguration.vue";
import Recruit from "./Recruit.vue";

const components: Record<string, Component> = {
  fight: Fighting,
  recruit: Recruit,
  infrast: Infrast
}

export default defineComponent({
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  render() {
    const component = components[this.taskId];
    if (component) {
      return h(component);
    } else {
      return h(NoConfiguration)
    }
  },
})
</script>

<style lang="less">
.configuration-form {
  padding: 8 2px;
}
</style>