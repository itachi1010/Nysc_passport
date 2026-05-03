export function cleanName(v:string){return v.trim().replace(/\s+/g,' ').toUpperCase()}
export function validName(v:string){return /^[A-Z][A-Z '\-]{1,80}$/.test(cleanName(v))}
export function validStateCode(v:string){return /^[A-Z]{2}\d{4}[A-Z]$/.test(v.trim().toUpperCase())}
export function validFileNumber(v:string){return /^\d{1,6}$/.test(v.trim())}
export function validPhone(v:string){return /^(0[789][01]\d{8}|\+234[789][01]\d{8})$/.test(v.trim())}
export function safeFilenamePart(v:string){return cleanName(v).replace(/[^A-Z0-9 '\-]/g,'').trim()}
export function finalFilename(name:string,stateCode:string,fileNumber:string,phone:string,ext='.JPG'){return `${safeFilenamePart(name)} ${stateCode.toUpperCase()}=${fileNumber}= ${phone}${ext.toUpperCase()}`}
