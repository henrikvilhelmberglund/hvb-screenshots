#!/usr/bin/env node
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
type Viewport = {
    width: number;
    height: number;
};
/**
 * Device with name and viewport size
 */
type Device = {
    name: string;
    viewport: Viewport;
};
export declare const devices: Device[];
/**
 * This function saves screenshots in several sizes.
 */
export declare function takeScreenshots(argv: Arguments): Promise<void>;
export {};
