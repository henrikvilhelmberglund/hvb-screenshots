#!/usr/bin/env node
interface Arguments {
    [x: string]: unknown;
    path: string | undefined;
    url: string;
    show: boolean;
}
type Viewport = {
    width: number;
    height: number;
};
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
