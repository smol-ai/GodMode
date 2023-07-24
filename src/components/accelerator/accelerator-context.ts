export type AcceleratorContext = {
  onChange: (oldKey: string, newKey: string) => void;
};

// TODO: Get process using IPC
let currentPlatform: NodeJS.Platform = "darwin";

const MetaKey = currentPlatform === "darwin" ? "Command" : "Super";
