/* eslint-disable max-lines-per-function */
import { get } from "https";
import { UnpackedFile } from "./types.js";
import { extractZip } from "./extraction-types/zip.js";
import { unpackTarFile } from "./extraction-types/tar.js";
import { unpackTgzFile } from "./extraction-types/tgz.js";

type Options = {
  repo ?: "github"|"gitlab"|"bitbucket";
  branch ?: string;
}

export class Nethere {
  public static async downloadToDisk (url : string, destination : string, options : Options = {}) : Promise<void> {
    const fs = await import("fs");
    const path = await import("path");

    const data = await this.downloadToMemory(url, options);
    for(const file of data) {
      const fileDestination = file.header ? path.resolve(destination, file.header.fileName) : path.resolve(destination);
      if(file.data.length === 0) fs.mkdirSync(fileDestination, { recursive: true });
      else {
        fs.mkdirSync(path.dirname(fileDestination), { recursive: true });
        fs.writeFileSync(fileDestination, file.data);
      }
    }
  }

  public static async downloadToMemory (fileUrl : string, options : Options = {}) : Promise<UnpackedFile[]> {
    const url = options.repo ? this.getRepoUrl(fileUrl, options) : fileUrl;
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
          if(response.statusCode === 404) throw Error("File not found. Please check the url or repo branch");

          const typeHeader = response.headers["content-type"];
          const zipTypes = [ "application/zip" ];
          const tarTypes = [ "application/x-tar", "application/tar" ];
          const gzpTypes = [ "application/gzip", "tar+gzip" ];

          if(zipTypes.some(type => typeHeader.includes(type))) return resolve(extractZip(fileData));
          if(tarTypes.some(type => typeHeader.includes(type))) return resolve(unpackTarFile(fileData));
          if(gzpTypes.some(type => typeHeader.includes(type))) return resolve(unpackTgzFile(fileData));

          const urlSections = fileUrl.split("/");
          const urlName = urlSections[urlSections.length - 1];
          const contentDispositionName = this.nameFromDisposition(response.headers["content-disposition"]);
          const inferredType = this.inferTypeFromName(contentDispositionName ?? urlName);
          return resolve(this.extractType(fileData, inferredType));
        });

        response.on("error", (error) => {
          reject(error);
        });
      });
    });
  }

  private static nameFromDisposition (contentDisposition : string) : string {
    if(!contentDisposition) return undefined;

    const fileNameStartIndex = contentDisposition.indexOf("filename=") + "filename=".length;
    const fileNameRight = contentDisposition.slice(fileNameStartIndex);
    const semiIndex = fileNameRight.indexOf(";");
    const fileName = fileNameRight.slice(0, semiIndex === -1 ? undefined : semiIndex);
    return fileName;
  }

  private static inferTypeFromName (fileName : string) : string {
    const fileTypes = fileName.split(".");
    const fileType = fileTypes[fileTypes.length-1];

    return fileType;
  }

  private static extractType (data : Buffer, type : string) : UnpackedFile[] {
    switch(type) {
      case "zip": return extractZip(data);
      case "tar": return unpackTarFile(data);
      case "gz":
      case "tgz": return unpackTgzFile(data);
      default: return [{ header: undefined, data }];
    }
  }

  private static getRepoUrl (url : string, options : Options) : string {
    const purePath = url.replace("https://", "").replace("http://", "");
    const [, owner, repo] = purePath.split("/");

    const branch = options.branch ?? "master";
    switch(options.repo) {
      case "github":
        return `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;
      case "gitlab":
        return `https://gitlab.com/${owner}/${repo}/-/archive/${branch}/${repo}-${branch}.zip`;
      case "bitbucket":
        return `https://bitbucket.org/${owner}/${repo}/get/${branch}.zip`;
    }
  }
}
