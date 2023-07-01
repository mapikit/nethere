![Nethere Logo](https://github.com/mapikit/nethere/blob/main/Nethere_Logo_Horizontal.svg?raw=true)

Bring the entire internet to you with Nethere! Nethere is a tool for downloading and unpacking files from the web, saving them to disk or just reading them in memory. All of this while still being simple to use and having **no dependencies**.

It is fully compatible with typescript and concurs to the ESM format.

There are currently two simple static methods; `downloadToMemory` and `downloadToDisk`. 

---

### Method `downloadToMemory` 
This method simply downloads and unpacks (if necessary) all the URL file data and saves it to memory, so you can do whatever you like with it. This is useful when working in a browser, so you can read the file contents without saving them to disk

### Method `downloadToDisk`
This method downloads and unpacks (if necessary) the file in the url, then saves it to disk in the given path. For zipped files the path should be a directory whereas for loose files it should be a file path.

## Examples:

```typescript
import { Nethere } from "nethere";

Nethere.downloadToMemory("https://link/to/my/file.tar")
  .then(result => console.log(result))
  .catch(console.error);
  /* 
    Should log something like
    [
      {
        header: {
          name: "myFile.txt",
          size: 240,
          ...
        }
        data: <Buffer>
      }
    ]
    Where 'data' is the file data and can be converted to string with 
    TextDecoder or saved to disk for example.
  */

Nethere.downloadToDisk("https://link/to/my/file.tar", "./downloaded")
  .catch(console.error);
  /* 
    Should create a directory 'downloaded' if necessary and save all extracted
    files inside such dir.
  */
```

## Support
### URL Support
Currently Nethere supports all urls that point directly to a file.  
Support to urls that point to repos is planned.


### Compressed File Support
 - .tar (Full Support)
 - .zip (Partial Support - Some deflated files will cause errors)
 - .tgz (Planned Support)