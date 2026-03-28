import { Page, expect } from '@playwright/test';

/**
 * Page Object for the Oracle PeopleSoft login page.
 *
 * PeopleSoft login page HTML typically uses:
 *   - #userid  (User ID input)
 *   - #pwd     (Password input)
 *   - #login   (Sign In button) or input[type="submit"]
 *
 * Adjust the selectors below if your instance uses different IDs.
 */
export class PeopleSoftLoginPage {
  private readonly userIdInput;
  private readonly passwordInput;
  private readonly signInButton;
  private readonly errorMessage;

  constructor(private page: Page) {
    this.userIdInput = page.locator('#userid');
    this.passwordInput = page.locator('#pwd');
    this.signInButton = page.locator('#login, [type="submit"]').first();
    this.errorMessage = page.locator('.PSLOGINMSGBOX, .psloginbox_error');
  }

  async navigate(url: string) {
    await this.page.goto(url);
    // Wait for the login form to be visible
    await this.userIdInput.waitFor({ state: 'visible' });
  }

  async login(userId: string, password: string) {
    await this.userIdInput.fill(userId);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectSuccessfulLogin(expectedTitlePattern: RegExp = /PeopleSoft/) {
    // After login PeopleSoft redirects to the portal/homepage
    await expect(this.page).toHaveTitle(expectedTitlePattern);
  }
}
