import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';

/**
 * Custom Cucumber World that holds the Playwright browser, context, and page.
 * Every scenario gets a fresh instance of this class, so browser state is
 * isolated between scenarios automatically.
 */
export class PlaywrightWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(PlaywrightWorld);
