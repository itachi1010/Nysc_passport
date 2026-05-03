export function parsePassportFilename(name: string) {
  try {
    const match = name.match(/(.+)\s([A-Z]{2}\d{4}[A-Z])=(\d+)=\s*(\d+)/);
    if (!match) return null;

    return {
      name: match[1],
      stateCode: match[2],
      fileNumber: match[3],
      phone: match[4],
    };
  } catch {
    return null;
  }
}