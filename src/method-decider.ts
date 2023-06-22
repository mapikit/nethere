import { unpackTarFile } from "./extraction-types/tar.js";
import { extractZip } from "./extraction-types/zip.js";
import { UnpackedFile } from "./types.js";

export function unpack (data : Buffer) : Array<UnpackedFile> {
  try { return unpackTarFile(data); } catch (err) { console.log("Unable to Unpack tar"); }
  try { return extractZip(data); } catch (err) { console.log("Unable to Unpack zip"); }
}
