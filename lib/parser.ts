export function parsePassportFilename(filename:string){
  const base=filename.replace(/\.[^.]+$/,'');
  const ext=(filename.match(/\.[^.]+$/)?.[0]||'.JPG').toUpperCase();
  const normalized=base.replace(/\s*=\s*/g,'=').replace(/\s+/g,' ').trim();
  const raw=/^(DSC_|IMG_|PHOTO_|CAM_|\d+|SUMAILA)/i.test(base) || !/[A-Z]{2}\s*\d{4}\s*[A-Z]/i.test(base);
  if(raw) return {raw:true,ext};
  const m=normalized.match(/^(.+?)\s+([A-Z]{2}\d{4}[A-Z])=(\d+)=\s*(\+?\d{10,14})$/i);
  if(!m) return {raw:true,ext};
  return {raw:false,ext,name:m[1].trim().toUpperCase(),stateCode:m[2].toUpperCase(),fileNumber:m[3],phone:m[4]};
}
