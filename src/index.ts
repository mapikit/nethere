/* eslint-disable max-lines-per-function */
import { get } from "https";
import { UnpackedFile } from "./types.js";
import { extractZip } from "./extraction-types/zip.js";
import { unpackTarFile } from "./extraction-types/tar.js";

export class Nethere {
  public static async downloadToDisk (url : string, destination : string) : Promise<void> {
    const fs = await import("fs");
    const path = await import("path");

    const data = await this.downloadToMemory(url);
    for(const file of data) {
      const fileDestination = file.header ? path.resolve(destination, file.header.name) : path.resolve(destination);
      fs.mkdirSync(path.dirname(fileDestination), { recursive: true });
      if(fs.statSync(fileDestination).isDirectory()) continue;
      fs.writeFileSync(fileDestination, file.data);
    }
  }

  public static async downloadToMemory (url : string) : Promise<UnpackedFile[]> {
    return new Promise((resolve, reject) => {
      let fileData = Buffer.alloc(0);
      get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          this.downloadToMemory(response.headers.location)
            .then(result => resolve(result))
            .catch(console.error);
          return;
        }

        response.on("data", (chunk) => {
          fileData = Buffer.concat([fileData, chunk]);
        });

        response.on("end", () => {
          switch(response.headers["content-type"]) {
            case "application/zip": resolve(extractZip(fileData)); return;
            case "application/x-tar": resolve(unpackTarFile(fileData)); return;
            default: resolve([{ header: undefined, data: fileData }]); return;
          }
        });

        response.on("error", (error) => {
          reject(error);
        });
      });
    });
  }
}
