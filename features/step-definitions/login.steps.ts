import { Given, When, Then } from '@cucumber/cucumber';
import { PlaywrightWorld } from '../support/world';
import { SwagLabsLoginPage } from '../../pages/SwagLabsLoginPage';

const SWAGLABS_URL = process.env.SWAGLABS_URL ?? 'https://www.saucedemo.com/';

// A single loginPage reference per scenario — recreated each time because
// Cucumber creates a new World instance per scenario.
let loginPage: SwagLabsLoginPage;

Given('I am on the Swag Labs login page', async function (this: PlaywrightWorld) {
  loginPage = new SwagLabsLoginPage(this.page);
  await loginPage.navigate(SWAGLABS_URL);
});

When('I login with username {string} and password {string}', async function (
  this: PlaywrightWorld,
  username: string,
  password: string
) {
  await loginPage.login(username, password);
});

Then('I should be on the inventory page', async function (this: PlaywrightWorld) {
  await loginPage.expectSuccessfulLogin();
});

Then('I should see a login error message', async function (this: PlaywrightWorld) {
  await loginPage.expectLoginError('');
});

Then('the inventory should display the correct product names', async function (this: PlaywrightWorld) {
  await loginPage.expectCorrectInventoryItemNames();
});
