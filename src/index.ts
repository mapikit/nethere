/* eslint-disable max-lines-per-function */
import { get } from "https";
import { mkdir, writeFileSync } from "fs";
import { join } from "path";
import { unpack } from "./method-decider.js";
import { inspect } from "util";

export async function downloadAndUnzip (url : string, identifier : string) : Promise<void> {
  return new Promise((resolve, reject) => {
    let fileData = Buffer.alloc(0);
    get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadAndUnzip(response.headers.location, identifier).catch(console.log);
        return;
      }

      response.on("data", (chunk) => {
        fileData = Buffer.concat([fileData, chunk]);
      });

      const basedir = "src/download";
      response.on("end", () => {
        const basePath = join(basedir, identifier);
        if(response.headers["content-type"] === "application/zip") {
          const unpacked = unpack(fileData);
          console.log(inspect(unpacked, false, null, true));
        }
        else {

          const urlArr = url.split("/");
          mkdir(basePath, () => {
            writeFileSync(join(basePath, urlArr[urlArr.length - 1]), fileData);
          });
        }
        resolve();
      });

      response.on("error", (error) => {
        reject(error);
      });
    });
  });
};



downloadAndUnzip("https://www.github.com/mapikit/meta-system/archive/refs/heads/master.zip", "asdq").catch(console.log);

//downloadAndUnzip("https://fiddle.jshell.net/robots.txt","robots").catch(console.log);

