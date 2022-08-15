<script lang="ts" setup>
import { ref, onMounted, Ref, h, VNode, computed } from 'vue'
import _ from 'lodash'
import {
  NBadge,
  NModal,
  NCard,
  NSkeleton,
  NScrollbar,
  NTabs,
  NTabPane,
  NAvatar
} from 'naive-ui'
import gamedataApi from '@/api/gamedata'
import { getOperatorAvatar, getProfessionImage } from '@/utils/game_image'
import useThemeStore from '@/store/theme'

const themeStore = useThemeStore()

const props = defineProps<{
  show: boolean;
  selectedOperators: any[];
}>()

const emit = defineEmits(['update:show', 'remove:operator', 'add:operator'])

const operators: Ref<any[]> = ref([])
const loading = ref(false)

const counts = computed(() => _.countBy(props.selectedOperators, 'profession'))

const professions = {
  WARRIOR: '近卫',
  MEDIC: '医疗',
  SPECIAL: '特种',
  SNIPER: '狙击',
  PIONEER: '先锋',
  TANK: '重装',
  CASTER: '术师',
  SUPPORT: '辅助'
}

onMounted(async () => {
  loading.value = true
  operators.value = Object.values((await gamedataApi.getAllOperators()) as Object).filter(
    (operator) => operator.nationId !== null
  )

  operators.value.forEach(async (operator) => {
    operator.image = getOperatorAvatar(operator.name)
  })

  loading.value = false
})

const getProfessionTab = (professionCode: string, professionName: string): VNode => {
  const imgUrl = getProfessionImage(professionName, themeStore.theme === 'maa-light')
  const count = counts.value[professionCode]
  return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
    h(NBadge, { value: count || 0 }, () => h(NAvatar, { src: imgUrl })),
    h('span', { style: { marginLeft: '4px' } }, professionName)
  ])
}

const toggleSelected = (operator: any) => {
  const find = _.find(props.selectedOperators, (op) => op.name === operator.name)
  if (find) {
    emit('remove:operator', operator)
  } else {
    emit('add:operator', operator)
  }
}
</script>

<template>
  <NModal
    :show="props.show"
    title="选择干员"
    display-directive="show"
    role="dialog"
    aria-modal="true"
    @update:show="(value) => $emit('update:show', value)"
  >
    <NCard
      style="width: 600px"
      role="dialog"
      aria-modal="true"
      title="选择干员"
    >
      <NTabs
        :bar-width="28"
        type="line"
      >
        <NTabPane
          v-for="[code, name] of Object.entries(professions)"
          :key="code"
          :name="code"
          :tab="getProfessionTab(code, name)"
        >
          <NScrollbar :style="{ maxHeight: '400px' }">
            <NSkeleton
              v-if="loading"
              height="40px"
              :repeat="4"
              :sharp="false"
            />
            <div class="grid-wrapper">
              <NAvatar
                v-for="operator of operators.filter((op) => op.profession === code)"
                :key="operator.name"
                :src="operator.image"
                :size="90"
                class="operator-avatar"
                :class="
                  selectedOperators.find((op) => op.name === operator.name)
                    ? 'selected'
                    : ''
                "
                @click="() => toggleSelected(operator)"
              />
            </div>
          </NScrollbar>
        </NTabPane>
      </NTabs>
    </NCard>
  </NModal>
</template>

<style lang="less" scoped>
.grid-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-row-gap: 20px;
}

.operator-avatar {
  position: relative;
  &.selected::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    border: 4px solid rgb(234, 173, 61);
    width: 100%;
    height: 100%;
  }
}
</style>
