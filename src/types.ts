export type UnpackedFile = {
  header : UnpackedHeader;
  data : Buffer;
}


export interface UnpackedHeader extends Partial<OptionalHeaders> {
  name : string,
  checksum : string,
}

type OptionalHeaders = {
  mode : string,
  uid : string,
  gid : string,
  size : number,
  mtime : string,
  type : string,
  linkname : string,
  ustar : string,
  version : string,
  uname : string,
  gname : string,
  devmajor : string,
  devminor : string,
  prefix : string,
  padding : string,
}
