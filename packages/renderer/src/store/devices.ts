import { defineStore } from "pinia";

export interface DeviceState {
  devices: Device[];
  lastUpdate: number | null;
}

export interface DeviceAction {
  mergeSearchResult(devices: NativeDevice[]): void;
  updateDeviceStatus(uuid: string, status: DeviceStatus): void;
  removeNotInUseDevice(): void;
  updateDeviceUuid(oldUuid: string, newUuid: string): void;
  getDevice(uuid: string): Device | undefined;
}

const useDeviceStore = defineStore<"device", DeviceState, {}, DeviceAction>(
  "device",
  {
    state: () => {
      return {
        devices: [],
        lastUpdate: null,
      };
    },
    actions: {
      mergeSearchResult(devices) {
        this.lastUpdate = Date.now();
        for (const device of devices) {
          const origin = this.devices.find((dev) => dev.uuid === device.uuid);
          if (!origin) {
            this.devices.push({
              status: "available",
              ...device,
            });
          }
        }
      },
      updateDeviceStatus(uuid, status) {
        const origin = this.devices.find((dev) => dev.uuid === uuid);
        if (origin) {
          origin.status = status;
        }
      },
      removeNotInUseDevice() {
        this.devices.forEach((v) => (v.status = "connected"));
      },
      updateDeviceUuid(oldUuid, newUuid) {
        console.log(`old uuid: ${oldUuid}`);
        const origin = this.devices.find((dev) => dev.uuid === oldUuid);
        console.log(`new uuid: ${newUuid}`);
        if (origin) {
          origin.uuid = newUuid;
        }
      },
      getDevice(uuid) {
        return this.devices.find((dev) => dev.uuid === uuid);
      },
    },
  }
);

export default useDeviceStore;
