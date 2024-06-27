#!/usr/bin/env node

// @ts-ignore
import PCR from "puppeteer-chromium-resolver";

import { type Page } from "puppeteer-core";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";
import readline from "node:readline/promises";

/**
 * Arguments that can be passed to the script
 */
export interface Arguments {
  [x: string]: unknown;
  /**
   * Optional path to the folder where the screenshots will be saved
   * If not passed, will prompt the user to create a screenshots folder
   */
  path: string | undefined;
  /**
   * URL to be screenshot
   * If not passed, will default to `http://localhost:5173`
   */
  url: string;
  /**
   * Show the browser window while taking screenshots
   * If not passed, will default to `false`, eg. headless
   */
  show: boolean;
}

const argv = yargs(hideBin(process.argv))
  .usage("Usage:\n\n$ npx hvb-screenshots [options]")
  .options({
    path: {
      alias: "p",
      describe: "Path to the folder where the screenshots will be saved",
      type: "string",
    },
    url: {
      alias: "u",
      describe: "URL to be screenshot",
      type: "string",
      default: "http://localhost:5173",
    },
    show: {
      alias: "s",
      describe: "Show the browser window",
      type: "boolean",
      default: false,
    },
  })
  .help("help")
  .alias("help", "h")
  .parseSync();

let screenshotPath = argv.path ?? "screenshots";
let screenshotPathInProject = path.join(process.cwd(), screenshotPath);

type Viewport = { width: number; height: number };
/**
 * Device with name and viewport size
 */
type Device = { name: string; viewport: Viewport };

export const devices: Device[] = [
  { name: "(sm) iPhone SE", viewport: { width: 320, height: 568 } },
  { name: "(sm) iPhone X", viewport: { width: 375, height: 812 } },
  { name: "(sm) iPhone 8 Plus", viewport: { width: 414, height: 736 } },
  { name: "(md) iPad", viewport: { width: 768, height: 1024 } },
  { name: "(md) iPad Pro 10.5", viewport: { width: 834, height: 1112 } },
  { name: "(lg) iPad Pro 12.9", viewport: { width: 1024, height: 1366 } },
  { name: "(xl) Small Laptop", viewport: { width: 1366, height: 768 } },
  { name: "(2xl) Medium Laptop", viewport: { width: 1440, height: 900 } },
  { name: "(2xl) Desktop", viewport: { width: 1920, height: 1080 } },
  { name: "(2xl) Large Desktop", viewport: { width: 2560, height: 1440 } },
  { name: "(2xl) 4K Display", viewport: { width: 3840, height: 2160 } },
];

/**
 * This function saves screenshots in several sizes.
 */
export async function takeScreenshots(argv: Arguments) {
  /**
   * When a path is not passed in and a screenshots folder does not yet exist, ask the user to create it.
   */
  async function askUserToCreateFolder(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await rl.question(
      "The screenshots folder does not exist. Do you want to create it? (y/n)\n"
    );

    if (answer.toLowerCase() === "y") {
      let folderName = await rl.question(
        'Enter the folder name (default is "screenshots")\n'
      );

      folderName = folderName === "" ? "screenshots" : folderName;

      screenshotPath = folderName;
      screenshotPathInProject = path.join(process.cwd(), folderName);

      if (fs.existsSync(screenshotPathInProject)) {
        const saveAnyway = await rl.question(
          `The folder "${screenshotPath}" already exists. Save into that folder anyway? (y/n)\n`
        );
        if (saveAnyway !== "y") {
          process.exit(1);
        }
      } else {
        fs.mkdirSync(screenshotPathInProject, { recursive: true });
        console.log(`The ${screenshotPath} folder has been created.`);
      }
    } else {
      console.log(`The ${screenshotPath} folder was not created.`);
      process.exit(1);
    }
    rl.close();
  }

  /**
   * When a path is passed in and the path does not yet exist, ask the user to create it.
   */
  async function askUserToCreateFolderShort(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await rl.question(
      "The path does not exist. Do you want to create it? (y/n)\n"
    );

    if (answer.toLowerCase() === "y") {
      let folderName = argv.path;

      if (folderName) {
        screenshotPath = folderName;
        screenshotPathInProject = path.join(process.cwd(), folderName);
      }

      fs.mkdirSync(screenshotPathInProject, { recursive: true });
      console.log(`The ${screenshotPath} folder has been created.`);
    } else {
      console.log(`The ${screenshotPath} folder was not created.`);
      process.exit(1);
    }
    rl.close();
  }

  /**
   *
   * Changes the viewport size and takes a screenshot
   * @param {Device} device - Device with name and viewport size
   */
  async function changeSizeAndTakeScreenshot({
    name,
    viewport: { width, height },
  }: Device): Promise<void> {
    console.info("hello");
    console.info(`Taking screenshot ${width}x${height}_${name}.jpg`);
    await page.setViewport({ width, height }); // 3
    try {
      await page.screenshot({
        path: `${screenshotPath}/${width}x${height}_${name}.jpg`,
        quality: 90,
      });
    } catch (error) {
      console.error(
        "Unable to save file. Create a folder named screenshots first or pass a path using --path."
      );
    }
  }

  const options = {};
  const stats = await PCR(options);

  if (!argv.path && !fs.existsSync(screenshotPathInProject)) {
    await askUserToCreateFolder();
  } else if (argv.path && !fs.existsSync(screenshotPathInProject)) {
    await askUserToCreateFolderShort();
  }

  const browser = await stats.puppeteer
    .launch({
      headless: argv.show ? false : true,
      args: ["--no-sandbox", "--hide-scrollbars"],
      executablePath: stats.executablePath,
    })
    .catch(function (error: Error) {
      console.log(error);
    });

  let page: Page;

  if (argv.show) {
    [page] = await browser.pages();
  } else {
    page = await browser.newPage();
  }

  let url = argv.url ?? "http://localhost:5173/";

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  for (const device of devices) {
    await changeSizeAndTakeScreenshot(device);
  }

  if (argv.print) {
    // print
    await page.emulateMediaType("print");
    await page.pdf({
      path: `${screenshotPath}/printed.pdf`,
      printBackground: true,
    });
  }

  await browser.close();
}

takeScreenshots(argv);
