import { unzipSync } from "zlib";
import { unpackTarFile } from "./tar.js";
import { UnpackedFile } from "types.js";

export function unpackTgzFile (gzFile : Buffer) : Array<UnpackedFile> {
  const tarFile = ungzip(new Uint8Array(gzFile));
  const tarEntries = unpackTarFile(tarFile);
  return tarEntries;
}

function ungzip (gzFile : Uint8Array) : Buffer {
  const tarFile = unzipSync(gzFile);
  return Buffer.from(tarFile.buffer);
}
