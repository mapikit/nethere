import zlib from "zlib";
import { UnpackedFile } from "../types.js";



// eslint-disable-next-line max-lines-per-function
export function extractZip (buffer : Buffer) : Array<UnpackedFile> {
  if (buffer.readUInt32LE(0) !== 0x04034b50) {
    throw new Error("Invalid zip file");
  }

  const result : Array<UnpackedFile> = [];


  let offset = 0;
  const centralDirectoryOffset = findCentralDirectoryOffset(buffer);
  while (offset < centralDirectoryOffset) {
    const headerSignature = buffer.readUInt32LE(offset);

    if (headerSignature === 0x04034b50) {
      // const version = buffer.readUInt16LE(offset + 4);
      // const bitFlag = buffer.readUint16LE(offset + 6);
      const compression = buffer.readUInt16LE(offset + 8);
      // const lastModificationTime = buffer.readUInt16LE(offset + 10);
      // const lastModificationDate = buffer.readUInt16LE(offset + 12);
      const CRC32Checksum = buffer.readUInt32LE(offset + 14);
      const compressedSize = buffer.readUInt32LE(offset + 18);
      // const uncompressedSize = buffer.readUInt32LE(offset + 22);
      const fileNameLength = buffer.readUInt16LE(offset + 26);
      const extraFieldLength = buffer.readUInt16LE(offset + 28);

      const fileName = buffer.toString("utf8", offset + 30, offset + 30 + fileNameLength);
      const fileContentStart = offset + 30 + fileNameLength;
      const fileContent = buffer.subarray(fileContentStart, fileContentStart + extraFieldLength + compressedSize);

      // Extract the file content
      const decompressedContent = decompress(fileContent, compression);
      result.push({
        data: decompressedContent,
        header: {
          name: fileName,
          checksum: CRC32Checksum.toString(),
        },
      });



      offset += 30 + fileNameLength + extraFieldLength + compressedSize;
    } else {
      throw new Error("Invalid signature");
    }
  }

  console.log("Extraction complete!");
  return result;
}

function findCentralDirectoryOffset (buffer : Buffer) : number {
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) return buffer.readUInt32LE(i + 16);
  }

  throw new Error("Central directory record not found");
}

function decompress (data : Buffer, method ?: number) : Buffer {
  switch (method) {
    case 0: return data;
    case 8: return zlib.inflateRawSync(new Uint8Array(data));
    default: throw Error("Unknown Compression Method");
  }
}
