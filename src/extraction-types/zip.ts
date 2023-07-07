import { inflateRawSync } from "zlib";
import type { UnpackedFile, ZipHeader } from "../types.js";



// eslint-disable-next-line max-lines-per-function
export function extractZip (buffer : Buffer) : Array<UnpackedFile> {
  if (buffer.readUInt32LE(0) !== 0x04034b50) throw new Error("Invalid zip file");

  const result : Array<UnpackedFile> = [];
  let offset = 0;
  const centralDirectoryOffset = findCentralDirectoryOffset(buffer);

  while (offset < centralDirectoryOffset) {
    const headerSignature = buffer.readUInt32LE(offset);

    if (headerSignature === 0x04034b50) {
      const header : ZipHeader = {
        version: buffer.readUInt16LE(offset + 4),
        bitFlag: buffer.readUint16LE(offset + 6),
        compression: buffer.readUInt16LE(offset + 8),
        lastModificationTime: buffer.readUInt16LE(offset + 10),
        lastModificationDate: buffer.readUInt16LE(offset + 12),
        checksum: buffer.readUInt32LE(offset + 14),
        compressedSize: buffer.readUInt32LE(offset + 18),
        uncompressedSize: buffer.readUInt32LE(offset + 22),
        fileNameLength: buffer.readUInt16LE(offset + 26),
        extraFieldLength: buffer.readUInt16LE(offset + 28),
        fileName: undefined,
        fileContentStart: undefined,
      };

      header.fileName = buffer.toString("utf8", offset + 30, offset + 30 + header.fileNameLength);
      header.fileContentStart = offset + 30 + header.fileNameLength;

      let extraFieldOffset = header.fileContentStart;
      let extraInfoOffset = 0;

      while (extraFieldOffset < header.fileContentStart + header.extraFieldLength) {
        const headerId = buffer.readUInt16LE(extraFieldOffset);
        const dataSize = buffer.readUInt16LE(extraFieldOffset + 2);
        if (headerId === 0x5455) extraInfoOffset += 4 + dataSize;
        extraFieldOffset += 4 + dataSize;
      }

      const fileContent = buffer.subarray(
        header.fileContentStart + extraInfoOffset,
        header.fileContentStart + header.extraFieldLength + header.compressedSize,
      );

      result.push({
        data: decompress(fileContent, header.compression),
        header,
      });

      offset += 30 + header.fileNameLength + header.extraFieldLength + header.compressedSize;
    } else {
      throw new Error("Invalid signature");
    }
  }

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
    case 8: return inflateRawSync(data, {  });
    default: throw Error("Unknown Compression Method");
  }
}
