import { Nethere } from "./index.js";

export const configure = (brooker) : void => {
  console.log("Nethere");
  brooker.addonsFunctions.register({
    name: "downloadToMemory",
    input: { url : { type: "string" } },
    output: { fileArray: { type: "array", subtype: "cloudedObject" } },
  }, Nethere.downloadToMemory),
  console.log(brooker);
};


export const boot = (brooker) : void => {
  console.log(brooker);
};
