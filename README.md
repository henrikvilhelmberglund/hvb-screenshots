Library that uses Puppeteer-core to spit out a bunch of screenshots using different device viewport sizes, eg. mobile, tablet, PC.

Made for use with `npx`/`bunx` etc.

Usage:

```
$ npx hvb-screenshots [options]

Options:
      --version  Show version number                                   [boolean]
  -p, --path     Path to the folder where the screenshots will be saved [string]
  -u, --url      URL to be screenshot[string] [default: "http://localhost:5173"]
  -s, --show     Show the browser window              [boolean] [default: false]
  -h, --help     Show help                                             [boolean]
```