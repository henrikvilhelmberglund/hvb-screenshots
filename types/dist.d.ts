#!/usr/bin/env node
/**
 * This function saves screenshots in several sizes.
 * @param {string} argv - The command line arguments. (yargs)
 */
export function takeScreenshots(argv: string): Promise<void>;
/**
 * @typedef {Object} Viewport
 * @property {number} width - The width of the viewport.
 * @property {number} height - The height of the viewport.
 */
/**
 * @typedef {Object} Device
 * @property {string} name - The name of the device.
 * @property {Viewport} viewport - The viewport dimensions of the device.
 */
/**
 * An array of devices with their viewports.
 * @type {Device[]}
 */
export const devices: Device[];
export type Viewport = {
    /**
     * - The width of the viewport.
     */
    width: number;
    /**
     * - The height of the viewport.
     */
    height: number;
};
export type Device = {
    /**
     * - The name of the device.
     */
    name: string;
    /**
     * - The viewport dimensions of the device.
     */
    viewport: Viewport;
};
