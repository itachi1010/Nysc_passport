export type BatchStatus='active'|'closed'|'archived';
export type PassportStatus='parsed'|'pending_review'|'approved'|'unassigned';
export type Batch={id:string;year:string;batchName:string;stream:string;platoon?:string;description?:string;status:BatchStatus;createdAt:string};
export type Settings={maxEditsPerIp:number;cooldownMinutes:number;allowRawPhotoClaim:boolean;requireAdminApproval:boolean};
export type Passport={id:string;batchId:string;name:string;stateCode:string;fileNumber:string;phone:string;originalFilename:string;imageUrl:string;status:PassportStatus;isRaw:boolean;createdAt:string;updatedAt?:string};
export type Store={batches:Batch[];passports:Passport[];settings:Record<string,Settings>;editLogs:{ip:string;passportId:string;time:number}[]};
