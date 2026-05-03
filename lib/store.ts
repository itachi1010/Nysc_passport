type Store = {
  batches: any[];
  passports: any[];
  settings: any;
  logs: any[];
};

let store: Store = {
  batches: [],
  passports: [],
  settings: {},
  logs: [],
};

export async function loadStore() {
  return store;
}

export async function saveStore(data: Store) {
  store = data;
}

export function uid() {
  return Math.random().toString(36).substring(2, 10);
}

export function defaultSettings() {
  return {
    maxEditsPerIp: 3,
    cooldownMinutes: 30,
  };
}