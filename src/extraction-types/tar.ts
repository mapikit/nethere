import { UnpackedFile } from "../types.js";


// eslint-disable-next-line max-lines-per-function
export function unpackTarFile (tarFileBuffer : Buffer) : Array<UnpackedFile> {

  const tarFile = toArrayBuffer(tarFileBuffer);
  const tarFileView = new DataView(tarFile);
  const tarEntries : Array<UnpackedFile>= [];
  let offset = 0;

  while (offset < tarFile.byteLength) {
  // Read the header of the current tar entry
    const header = {
      name: readString(tarFileView, offset, 100),
      mode: readString(tarFileView, offset + 100, 8),
      uid: readString(tarFileView, offset + 108, 8),
      gid: readString(tarFileView, offset + 116, 8),
      size: parseInt(readString(tarFileView, offset + 124, 12), 8),
      mtime: readString(tarFileView, offset + 136, 12),
      checksum: readString(tarFileView, offset + 148, 8),
      type: readString(tarFileView, offset + 156, 1),
      linkname: readString(tarFileView, offset + 157, 100),
      ustar: readString(tarFileView, offset + 257, 6),
      version: readString(tarFileView, offset + 263, 2),
      uname: readString(tarFileView, offset + 265, 32),
      gname: readString(tarFileView, offset + 297, 32),
      devmajor: readString(tarFileView, offset + 329, 8),
      devminor: readString(tarFileView, offset + 337, 8),
      prefix: readString(tarFileView, offset + 345, 155),
      padding: readString(tarFileView, offset + 500, 12),
    };

    // Calculate the size of the current tar entry and move the offset to the next entry
    const entrySize = Math.ceil(header.size / 512) * 512;
    const entryStart = offset + 512;
    const entryEnd = entryStart + entrySize;
    const entryData = tarFile.slice(entryStart, entryEnd);

    tarEntries.push({ header, data: Buffer.from(entryData) });
    offset = entryEnd;
  }
  return tarEntries;
}

function readString (dataView : DataView, offset : number, length : number) : string {
  let str = "";
  for (let i = 0; i < length; i++) {
    const charCode = dataView.getUint8(offset + i);
    if (charCode === 0) {
      break;
    }
    str += String.fromCharCode(charCode);
  }
  return str;
}

function toArrayBuffer (buffer : Buffer) : ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}
