// NOTE: 仅做类型标注，切勿做其它用途

import { BuiltinSimulatorHost } from "./host";

export const host: BuiltinSimulatorHost = (window as any).LCSimulatorHost;
