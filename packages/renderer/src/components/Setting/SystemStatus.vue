<script lang="ts" setup>
import _ from 'lodash'
import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NEllipsis, NTable, NCollapse, NCollapseItem } from 'naive-ui'
import { getSystemStatus } from '@/hooks/caller/os'
import { showBoolean } from '@/i18n'

const ssRef: Ref<any> = ref(null)
const ssLoading = ref(false)
let timer: number | null = null

const { t } = useI18n()

async function refreshSystemStatus() {
  ssLoading.value = true
  const data = await getSystemStatus()
  ssRef.value = data
  ssLoading.value = false
  console.log(data)
}

function ss(key: string): string | Array<any> {
  if (!ssRef.value) {
    return t('Common.N/A')
  }
  const value = _.get(ssRef.value, key)
  if (typeof value === 'object' && value !== null) {
    return value
  }
  return showValue(value)
}

function showValue(value: any): string {
  if (typeof value === 'number' && value === 0) {
    return '0'
  }
  if (typeof value === 'boolean') {
    return showBoolean(value)
  }
  if (!value) {
    return t('Common.N/A')
  }
  if (value === '-') {
    return t('Common.N/A')
  }
  return value
}

function formatBytes(bytes: number): string {
  const units = ['Bytes', 'KiB', 'MiB', 'GiB']
  let index = 0
  while (bytes > 1024 && index < 3) {
    bytes /= 1024
    ++index
  }
  return `${bytes.toFixed(2)} ${units[index]}`
}

onMounted(() => {
  timer = window.setInterval(async () => {
    await refreshSystemStatus()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <h3 class="subtitle">系统状态</h3>
  <NCollapse display-directive="show">
    <NCollapseItem :title="$t('SystemStatus.Battery.Title')" name="battery">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemStatus.Battery.Remain') }}</NEllipsis>
            </td>
            <td>
              <div>
                <NEllipsis>{{ `${ss('battery.precent')}% (${ss('battery.timeRemain')} min)` }}</NEllipsis>
              </div>
              <div>
                <NEllipsis>
                  {{
                      ssRef?.battery.isCharging ? $t('SystemStatus.Battery.Charging') :
                        $t('SystemStatus.Battery.NotCharging')
                  }}
                </NEllipsis>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemStatus.Battery.Healthy') }}</NEllipsis>
            </td>
            <td>
              <div>
                <NEllipsis>
                  {{ `${ss('battery.currentCapacity')} mWh / ${ss('battery.designCapacity')} mWh` }}
                </NEllipsis>
              </div>
              <div>
                <NEllipsis>
                  {{ `${ss('battery.cycleCount')} ${$t('SystemStatus.Battery.CycleUnit')}` }}
                </NEllipsis>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemStatus.Battery.Manufacturer') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ ss('battery.manufacturer') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemStatus.Battery.Model') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ ss('battery.model') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemStatus.Battery.Serial') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ ss('battery.serial') }}</NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemStatus.Cpu.Title')" name="cpu">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis></NEllipsis>
            </td>
            <td>
              <NEllipsis></NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemStatus.Load.Title')" name="load">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis></NEllipsis>
            </td>
            <td>
              <NEllipsis></NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemStatus.Cpu.Title')" name="cpu">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis></NEllipsis>
            </td>
            <td>
              <NEllipsis></NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemStatus.Cpu.Title')" name="cpu">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis></NEllipsis>
            </td>
            <td>
              <NEllipsis></NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemStatus.Cpu.Title')" name="cpu">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis></NEllipsis>
            </td>
            <td>
              <NEllipsis></NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemStatus.Cpu.Title')" name="cpu">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis></NEllipsis>
            </td>
            <td>
              <NEllipsis></NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemStatus.Cpu.Title')" name="cpu">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis></NEllipsis>
            </td>
            <td>
              <NEllipsis></NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
  </NCollapse>
</template>

<style lang="less" scoped>
.system-information {
  :deep(table) {
    table-layout: fixed;
  }
}
</style>