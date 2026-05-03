export function validName(name: string) {
  return /^[A-Z\s'-]+$/i.test(name);
}

export function validStateCode(code: string) {
  return /^[A-Z]{2}\d{4}[A-Z]$/.test(code);
}

export function validFileNumber(num: string) {
  return /^\d+$/.test(num);
}

export function validPhone(phone: string) {
  return /^(\+234|0)[789][01]\d{8}$/.test(phone);
}

export function cleanName(name: string) {
  return name.trim().toUpperCase();
}

export function finalFilename(data: any) {
  return `${data.name} ${data.stateCode}=${data.fileNumber}= ${data.phone}.JPG`;
}