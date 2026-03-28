import { test, expect } from '@playwright/test';
import { PeopleSoftLoginPage } from '../pages/PeopleSoftLoginPage';

/**
 * PeopleSoft Login Tests
 *
 * Before running: update PEOPLESOFT_URL (and optionally credentials)
 * in your environment or directly below.
 *
 * Run:   npm test
 *        npm run test:headed   (see the browser window)
 */

const PEOPLESOFT_URL = process.env.PEOPLESOFT_URL ?? 'https://your-peoplesoft-instance.example.com/psp/...';
const VALID_USER = process.env.PS_USER ?? 'your_userid';
const VALID_PASS = process.env.PS_PASS ?? 'your_password';

test.describe('PeopleSoft Login', () => {
  let loginPage: PeopleSoftLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new PeopleSoftLoginPage(page);
    await loginPage.navigate(PEOPLESOFT_URL);
  });

  test('login page loads and shows the sign-in form', async ({ page }) => {
    await expect(page.locator('#userid')).toBeVisible();
    await expect(page.locator('#pwd')).toBeVisible();
  });

  test('invalid credentials show an error message', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.expectLoginError();
  });

  test('valid credentials navigate to the portal homepage', async () => {
    await loginPage.login(VALID_USER, VALID_PASS);
    await loginPage.expectSuccessfulLogin();
  });
});
