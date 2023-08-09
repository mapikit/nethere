import { Nethere } from "./index.js";


type MemoryOptions = {
  url : string;
  options ?: object;
}

type DiskOptions = MemoryOptions & {
  destination : string;
}

const downloadToMemoryDefinition ={
  functionName: "downloadToMemory",
  input: {
    url: { type: "string" },
    options: { type: "object", required: false, subtype: {
      repo: { type: "string" },
      branch: { type: "string" },
    } },
  },
  output: {
    fileArray: { type: "array", subtype: {
      header: "cloudedObject",
      data: "cloudedObject",
    } },
  },
};

const downloadToDiskDefinition ={
  functionName: "downloadToDisk",
  input: {
    url: { type: "string" },
    destination: { type: "string" },
    options: { type: "object", required: false, subtype: {
      repo: { type: "string" },
      branch: { type: "string" },
    } },
  },
  output: {},
};

export const configure = (brooker) : void => {
  brooker.addonsFunctions.register(
    (input : MemoryOptions) => Nethere.downloadToMemory(input.url, input.options),
    downloadToMemoryDefinition,
  );
  brooker.addonsFunctions.register(
    (input : DiskOptions) => Nethere.downloadToDisk(input.url, input.destination, input.options),
    downloadToDiskDefinition,
  );
};


export const boot = () : void => undefined;
