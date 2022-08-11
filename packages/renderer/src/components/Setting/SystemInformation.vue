<script lang="ts" setup>
import _ from 'lodash'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { NEllipsis, NTable, NCollapse, NCollapseItem } from 'naive-ui'
import { getSystemInformation } from '@/hooks/caller/os'
import { showBoolean } from '@/i18n'

const siRef = ref(null)
const siLoading = ref(false)

const { t } = useI18n()

function refreshSystemInformation() {
  siLoading.value = true
  getSystemInformation()
    .then(data => {
      siRef.value = data
      siLoading.value = false
      console.log(siRef.value)
    })
}

function si(key: string): string | Array<any> {
  if (!siRef.value) {
    return t('Common.N/A')
  }
  const value = _.get(siRef.value, key)
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
  refreshSystemInformation()
})

</script>

<template>
  <h3 class="subtitle">系统信息</h3>
  <NCollapse display-directive="show" class="system-information">
    <NCollapseItem :title="$t('SystemInformation.System.Title')" name="system">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.System.Manufacturer') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('system.manufacturer') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.System.Model') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('system.model') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.System.Version') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('system.version') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.System.Serial') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('system.serial') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.System.Uuid') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('system.uuid') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.System.Sku') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('system.sku') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.System.Virtual') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('system.virtual') }}</NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.Bios.Title')" name="bios">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Bios.Vendor') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('bios.vendor') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Bios.Version') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('bios.version') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Bios.ReleaseDate') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('bios.releaseDate') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Bios.Serial') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('bios.serial') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Bios.Revision') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('bios.revision') }}</NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.Baseboard.Title')" name="baseboard">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Baseboard.Manufacturer') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('baseboard.manufacturer') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Baseboard.Model') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('baseboard.model') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Baseboard.Serial') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('baseboard.serial') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Baseboard.Version') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('baseboard.version') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Baseboard.MemMax') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('baseboard.memMax') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Baseboard.MemSlots') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('baseboard.memSlots') }}</NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.Chassis.Title')" name="Chassis">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Chassis.Manufacturer') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('chassis.manufacturer') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Chassis.Model') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('chassis.model') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Chassis.Type') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('chassis.type') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Chassis.Serial') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('chassis.serial') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Chassis.Version') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('chassis.version') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Chassis.Sku') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('chassis.sku') }}</NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.Os.Title')" name="os">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Os.Kernal') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('os.kernel') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Os.Platform') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('os.platform') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Os.Arch') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('os.arch') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Os.Codename') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('os.codename') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Os.ReleaseDate') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('os.release') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Os.Serial') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('os.serial') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Os.Uefi') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('os.uefi') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Os.Codepage') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('os.codepage') }}</NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.Uuid.Title')" name="uuid">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Uuid.Os') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('uuid.os') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Uuid.Hardware') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('uuid.hardware') }}</NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.Cpu.Title')" name="cpu">
      <NTable striped>
        <tbody>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Cpu.Brand') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('cpu.brand') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Cpu.Processors') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('cpu.processors') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Cpu.Cores') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('cpu.cores') }}</NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Cpu.PhysicalCores') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>
                {{ `${si('cpu.physicalCores')} (${si('cpu.performanceCores')} P-Cores + ${si('cpu.efficiencyCores')}
                E-Cores)` }}
              </NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Cpu.Speed') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>
                {{ `${si('cpu.speed')}GHz (${si('cpu.speedMin')}GHz ~ ${si('cpu.speedMax')}GHz)` }}
              </NEllipsis>
            </td>
          </tr>
          <tr>
            <td>
              <NEllipsis>{{ $t('SystemInformation.Cpu.Flags') }}</NEllipsis>
            </td>
            <td>
              <NEllipsis>{{ si('cpu.flags') }}
                <template #tooltip>
                  <div :style="{ maxWidth: '70vw' }">{{ si('cpu.flags') }}</div>
                </template>
              </NEllipsis>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.Graphics.Title')" name="graphics">
      <NCollapse display-directive="show">
        <NCollapseItem v-for="(graphic, index) of si('graphics.controllers')" :key="index" :title="graphic.model">
          <NTable striped>
            <tbody>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.Vendor') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ graphic.vendor }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.Bus') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ graphic.bus }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.VRAM') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ `${graphic.vram} MiB` }}</NEllipsis>
                </td>
              </tr>
            </tbody>
          </NTable>
        </NCollapseItem>
      </NCollapse>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.Monitor.Title')" name="monitor">
      <NCollapse display-directive="show">
        <NCollapseItem v-for="(monitor, index) of si('graphics.displays')" :key="index" :title="monitor.model">
          <NTable striped>
            <tbody>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.Size') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ `${monitor.sizeX}mm * ${monitor.sizeY}mm` }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.Resolution') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ `${monitor.resolutionX}x${monitor.resolutionY}` }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.RefreshRate') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ `${monitor.currentRefreshRate}Hz` }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.PixelDepth') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(monitor.pixelDepth) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.Connection') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(monitor.connection) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.IsBuiltin') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(monitor.builtin) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Graphics.Vendor') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(monitor.vendor) }}</NEllipsis>
                </td>
              </tr>
            </tbody>
          </NTable>
        </NCollapseItem>
      </NCollapse>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.Net.Title')" name="net">
      <NCollapse display-directive="show">
        <NCollapseItem v-for="(adapter, index) of si('net')" :key="index" :title="adapter.ifaceName">
          <NTable striped>
            <tbody>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.Ip4') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(adapter.ip4) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.Ip4Subnet') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(adapter.ip4subnet) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.Ip6') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(adapter.ip6) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.Ip6Subnet') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(adapter.ip4subnet) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.MAC') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(adapter.mac) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.Virtual') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(adapter.virtual) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.State') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(adapter.operstate) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.Type') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(adapter.type) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.DHCP') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showBoolean(adapter.dhcp) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Net.Speed') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ adapter.speed ? `${adapter.speed} Mbit / s` : $t('Common.N/A') }}</NEllipsis>
                </td>
              </tr>
            </tbody>
          </NTable>
        </NCollapseItem>
      </NCollapse>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.MemLayout.Title')" name="memLayout">
      <NCollapse display-directive="show">
        <NCollapseItem v-for="(memory, index) of si('memLayout')" :key="index" :title="`Memory #${index + 1}`">
          <NTable striped>
            <tbody>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Memory.Size') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ !!memory.size ? formatBytes(memory.size) : $t('Common.N/A') }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Memory.Type') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(memory.type) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Memory.Ecc') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(!!memory.ecc) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Memory.ClockSpeed') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ !!memory.clockSpeed ? `${memory.clockSpeed}MHz` : $t('Common.N/A') }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Memory.Manufacturer') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(memory.manufacturer) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.Memory.Serial') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(memory.serialNum) }}</NEllipsis>
                </td>
              </tr>
            </tbody>
          </NTable>
        </NCollapseItem>
      </NCollapse>
    </NCollapseItem>
    <NCollapseItem :title="$t('SystemInformation.DiskLayout.Title')" name="diskLayout">
      <NCollapse display-directive="show">
        <NCollapseItem v-for="(disk, index) of si('diskLayout')" :key="index" :title="disk.name">
          <NTable striped>
            <tbody>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.DiskLayout.Vendor') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(disk.vendor) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.DiskLayout.Type') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(disk.type) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.DiskLayout.InterfaceType') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ showValue(disk.interfaceType) }}</NEllipsis>
                </td>
              </tr>
              <tr>
                <td>
                  <NEllipsis>{{ $t('SystemInformation.DiskLayout.Size') }}</NEllipsis>
                </td>
                <td>
                  <NEllipsis>{{ !!disk.size ? formatBytes(disk.size) : $t('Common.N/A') }}</NEllipsis>
                </td>
              </tr>
            </tbody>
          </NTable>
        </NCollapseItem>
      </NCollapse>
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