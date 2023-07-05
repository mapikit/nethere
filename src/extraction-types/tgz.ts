import { inflateSync } from "zlib";
import { unpackTarFile } from "./tar.js";
import { UnpackedFile } from "types.js";
import { readFileSync } from "fs";

export function unpackTgzFile (gzFile : Buffer) : Array<UnpackedFile> {
  const tarFile = ungzip(gzFile);
  const tarEntries = unpackTarFile(tarFile);
  return tarEntries;
}

function ungzip (gzFile : Buffer) : Buffer {
  const gzFileView = new Uint8Array(gzFile);
  const tarFile = inflateSync(gzFileView);
  return Buffer.from(tarFile.buffer);
}


const file = readFileSync("./node-core-test-3.3.0.tar.gz");
const res = unpackTgzFile(file);

console.log(res);
