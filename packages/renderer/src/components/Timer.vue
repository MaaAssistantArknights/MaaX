<script lang="ts">
import { computed, defineComponent, getCurrentInstance, h, Ref, ref, watch, PropType } from "vue";

type Time = {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

type Formatter = (time: Time) => string;

const defaultFormatter: Formatter = ({ hours, minutes, seconds }) => {
  const arr = [minutes, seconds];
  if (hours !== 0) arr.unshift(hours);
  return arr.map((x, index) => index === 0 ? String(x) : String(x).padStart(2, '0')).join(':');
}

export default defineComponent({
  name: 'Timer',
  props: {
    startTime: Number,
    endTime: Number,
    formatter: Function as PropType<Formatter>
  },
  setup(props) {
    const instance = getCurrentInstance();
    const interval: Ref<number | undefined> = ref();
    const isActive = computed(() => {
      if (!props.startTime) {
        return false;
      }
      if (props.endTime) {
        return false;
      }
      return true;
    });

    const timeDiff = () => {
      const time = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      };

      if (!props.startTime)
        return time;
      const now = Date.now();
      let diff = now - props.startTime;
      time.milliseconds = diff % 1000;
      diff = Math.floor(diff / 1000);
      time.seconds = diff % 60;
      diff = Math.floor(diff / 60);
      time.minutes = diff % 60;
      diff = Math.floor(diff / 60);
      time.hours = diff;
      return time;
    }

    watch(isActive, (newValue, oldValue) => {
      if (newValue === oldValue) return;
      if (newValue) {
        interval.value = window.setInterval(() => {
          if (isActive.value) {
            instance?.proxy?.$forceUpdate();
          }
        }, 1000);
      } else {
        window.clearInterval(interval.value);
      }
    }, { immediate: true })

    const format = props.formatter || defaultFormatter;

    return () => h('div', format(timeDiff()));
  }
})

</script>