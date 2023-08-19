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

export const configure = (broker) : void => {
  broker.addonsFunctions.register(
    (input : MemoryOptions) => Nethere.downloadToMemory(input.url, input.options),
    downloadToMemoryDefinition,
  );
  broker.addonsFunctions.register(
    (input : DiskOptions) => Nethere.downloadToDisk(input.url, input.destination, input.options),
    downloadToDiskDefinition,
  );
  broker.done();
};


export const boot = () : void => undefined;
