export type UnpackedFile = {
  header : Header;
  data : Buffer;
}

export type Header = TarHeader | ZipHeader;

export type TarHeader = {
  fileName : string,
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

export type ZipHeader = {
  version : number,
  bitFlag : number,
  compression : number,
  lastModificationTime : number,
  lastModificationDate : number,
  checksum : number,
  compressedSize : number,
  uncompressedSize : number,
  fileNameLength : number,
  extraFieldLength : number,
  fileName : string,
  fileContentStart : number,
}
