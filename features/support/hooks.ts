import { Before, After } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { PlaywrightWorld } from './world';

/**
 * Launch a fresh browser + context + page before every scenario.
 * headless: false matches the existing project convention so you can
 * watch the browser run during practice. Set to true for CI.
 */
Before(async function (this: PlaywrightWorld) {
  this.browser = await chromium.launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

/**
 * Tear down the browser after every scenario so resources are always freed,
 * even when a step throws.
 */
After(async function (this: PlaywrightWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
