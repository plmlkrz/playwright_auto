import {test, expect, selectors} from '@playwright/test';
import { SwagLabsLoginPage } from '../pages/SwagLabsLoginPage';

const SWAGLABS_URL = process.env.SWAGLABS_URL ?? 'https://www.saucedemo.com/';
const VALID_USER = process.env.PS_USER ?? 'standard_user';
const LOCKED_USER = process.env.PS_LOCKED_USER ?? 'locked_out_user';
const PROBLEM_USER = process.env.PS_PROBLEM_USER ?? 'problem_user';
const PERFORMANCE_GLITCH_USER = process.env.PS_PERFORMANCE_GLITCH_USER ?? 'performance_glitch_user';
const ERROR_USER = process.env.PS_ERROR_USER ?? 'error_user';
const VISUAL_USER = process.env.PS_VISUAL_USER ?? 'visual_user';
const PASSWORD = process.env.PS_PASSWORD ?? 'secret_sauce';

test.describe('Swag Labs Login', () => {
    let loginPage: SwagLabsLoginPage;

    test.beforeEach( async ({ page }) => {
        loginPage = new SwagLabsLoginPage(page);
        await loginPage.navigate(SWAGLABS_URL);
    });

    test('A good login should be logged in', async ( {page} ) => {
        await expect(page.locator('#user-name')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await loginPage.login(VALID_USER, PASSWORD);
        await loginPage.expectSuccessfulLogin();
        // Verify that all inventory item names are correct
        await loginPage.expectCorrectInventoryItemNames();
    });

    test('A locked out login should have an error', async ( {page} ) => {
        await expect(page.locator('#user-name')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await loginPage.login(LOCKED_USER, PASSWORD);
        await loginPage.expectLoginError('Sorry, this user has been locked out.');
    });

    test('A problem user login should be logged in', async ( {page} ) => {
        await expect(page.locator('#user-name')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await loginPage.login(LOCKED_USER, PASSWORD);
        await loginPage.expectLoginError('Sorry, this user has been locked out.');
    });

    test('Problem user should see unique inventory images', async ( {page} ) => {
        await loginPage.login(PROBLEM_USER, PASSWORD);
        await loginPage.expectSuccessfulLogin();
        // Verify that all inventory item images are unique (not all the same dog image)
        await loginPage.expectUniqueInventoryImages();
    });

    test('Problem user should see same inventory images (dog bug)', async ({ page }) => {
        await loginPage.login(PROBLEM_USER, PASSWORD);
        await loginPage.expectSuccessfulLogin();
        // Verify that all inventory item images are the same (all show the dog image)
        await loginPage.expectSameInventoryImages();
        await loginPage.areInventoryImagesSame()          .then(areSame => {
            expect(areSame).toBe(true);
        });
    });

    test('Performance User should see login', async ({ page }) => {
        await loginPage.login(PERFORMANCE_GLITCH_USER, PASSWORD);
        await loginPage.expectSuccessfulLogin();
    });

    test('A Error user login should have an error on the name of the T-shirt', async ( {page} ) => {
        await expect(page.locator('#user-name')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await loginPage.login(ERROR_USER, PASSWORD);
        await loginPage.expectSuccessfulLogin();
        await loginPage.expectCorrectInventoryItemNames();
    });

    test('A Error user login should have the correct descriptions', async ( {page} ) => {
        await expect(page.locator('#user-name')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await loginPage.login(ERROR_USER, PASSWORD);
        await loginPage.expectSuccessfulLogin();
        await loginPage.expectCorrectInventoryItemDescription();
    });

    test('A Visual user login should have the correct Prices', async ( {page} ) => {
        await expect(page.locator('#user-name')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await loginPage.login(VISUAL_USER, PASSWORD);
        await loginPage.expectSuccessfulLogin();
        await loginPage.expectCorrectInventoryItemPrices();
    });


});