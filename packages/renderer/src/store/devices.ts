import { defineStore } from "pinia";

export interface DeviceState {
  devices: Device[];
  lastUpdate: number | null;
}

export interface DeviceAction {
  mergeSearchResult(devices: NativeDevice[]): void;
  updateDeviceStatus(uuid: string, status: DeviceStatus): void;
}

// Demo only
const lastUpdateDemo = Date.now();
const devicesDemo: Device[] = [
  {
    uuid: "12345678-90abcdefg",
    connectionString: "127.0.0.1",
    status: "connecting",
  },
];

const useDeviceStore = defineStore<"device", DeviceState, {}, DeviceAction>(
  "device",
  {
    state: () => {
      return {
        devices: devicesDemo,
        lastUpdate: lastUpdateDemo,
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
    },
  }
);

export default useDeviceStore;
