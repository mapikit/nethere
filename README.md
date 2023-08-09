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
    Will log something like
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
    Creates a directory 'downloaded' if necessary and save all extracted
    files inside such dir.
  */
```

## Repo Download
Nethere is also able to download the files in a repository from Github, Gitlab and Bitbucket. For this you need to add a second parameter specifying the repository. Optionally you can also specify the branch to download. By default, Nethere downloads the branch `master`.

```typescript
Nethere.downloadToMemory("https://github.com/mapikit/nethere", { repo: "github" })
  .then(result => console.log(result))
  .catch(console.error);
  /* 
    Will download and extract to memory the contents of the master branch on github
  */

Nethere.downloadToMemory("https://github.com/mapikit/nethere", { repo: "github", branch: "dev" })
  .then(result => console.log(result))
  .catch(console.error);
  /* 
    Will download and extract to memory the contents of the dev branch on github
  */
```

## Support
### URL Support
Currently Nethere supports all urls that point directly to a file or git repos (Github, Gitlab and Bitbucket).


### Compressed File Support
 - .tar (Full Support)
 - .zip (Full Support)
 - .tgz (Full Support)