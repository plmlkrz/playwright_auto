import { Page, expect } from '@playwright/test';


/**
 * Page Object for the Swag Labs login page.
 *
 * Swag Labs login page HTML typically uses:
 *   - #user-name  (User ID input)
 *   - #password     (Password input)
 *   - #Rename…   (Sign In button) or input[type="submit"]
 *
 * Adjust the selectors below if your instance uses different IDs.
 */


export class SwagLabsLoginPage {
    private readonly usernameInput;
    private readonly passwordInput;
    private readonly loginButton;
    private readonly errorMessage;

    constructor(private page: Page) {
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button, [type="submit"]').first();
        this.errorMessage = page.locator('h3[data-test="error"]');
    }
    async navigate(url: string) {
        await this.page.goto(url);
        await this.usernameInput.waitFor({ state: 'visible' });
    }
    async login(userId: string, password: string) {
        await this.usernameInput.fill(userId);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    async expectLoginError(errorMessage: string){
        await expect(this.errorMessage).toBeVisible();
    }
    async expectSuccessfulLogin(){
        await expect(this.page).toHaveURL(/inventory\.html/);
    }

    /**
     * Verifies that all inventory item images are unique by comparing their src attributes.
     * Useful for testing that the problem_user doesn't see duplicate dog images.
     * @returns {Promise<boolean>} true if all images are unique, false otherwise
     */
    async areInventoryImagesUnique(): Promise<boolean> {
        // Get all inventory item images
        const images = await this.page.locator('.inventory_item_img').all();

        if (images.length === 0) {
            throw new Error('No inventory images found on the page');
        }

        // Extract src attributes from each image
        const imageSrcs: string[] = [];
        for (const img of images) {
            const src = await img.getAttribute('src');
            if (src) {
                imageSrcs.push(src);
            }
        }

        // Check if all src attributes are unique by comparing against a Set
        const uniqueSrcs = new Set(imageSrcs);
        return uniqueSrcs.size === imageSrcs.length;
    }

    /**
     * Asserts that all inventory item images are unique.
     * Throws an error if any duplicates are found.
     */
    async expectUniqueInventoryImages() {
        const areUnique = await this.areInventoryImagesUnique();
        expect(areUnique).toBe(true);
    }

    /**
     * Gets the src attributes of all inventory item images for detailed comparison.
     * @returns {Promise<string[]>} Array of image src attributes
     */
    async getInventoryImageSrcs(): Promise<string[]> {
        const images = await this.page.locator('.inventory_item_img').all();
        const srcs: string[] = [];
        for (const img of images) {
            const src = await img.getAttribute('src');
            if (src) {
                srcs.push(src);
            }
        }
        return srcs;
    }

    async expectSameInventoryImages() {
        const srcs = await this.getInventoryImageSrcs();
        const uniqueSrcs = new Set(srcs);
        expect(uniqueSrcs.size).toBe(1); // Expect all images to have the same src
    }
    async areInventoryImagesSame() {
        const images = await this.page.locator('.inventory_item_img').all();
        const srcs = await this.getInventoryImageSrcs();
        const uniqueSrcs = new Set(srcs);
        return uniqueSrcs.size === 1;
    }
    /**
     * Gets the names of all inventory Descriptions on the page.
     * @returns {Promise<string[]>} Array of inventory item description
     */
    async getInventoryItemDescription(): Promise<string[]> {
        const nameElements = await this.page.locator('.inventory_item_desc').all();
        const description: string[] = [];
        for (const element of nameElements) {
            const name = await element.textContent();
            if (name) {
                description.push(name.trim());
            }
        }
        return description;
    }
    /**
     * Gets the names of all inventory items on the page.
     * @returns {Promise<string[]>} Array of inventory item names
     */
    async getInventoryItemNames(): Promise<string[]> {
        const nameElements = await this.page.locator('.inventory_item_name').all();
        const names: string[] = [];
        for (const element of nameElements) {
            const name = await element.textContent();
            if (name) {
                names.push(name.trim());
            }
        }
        return names;
    }

    /**
     * Gets the names of all inventory items on the page.
     * @returns {Promise<string[]>} Array of inventory item names
     */
    async getInventoryItemPrices(): Promise<string[]> {
        const nameElements = await this.page.locator('.inventory_item_price').all();
        const names: string[] = [];
        for (const element of nameElements) {
            const name = await element.textContent();
            if (name) {
                names.push(name.trim());
            }
        }
        return names;
    }

    /**
     * Verifies that all inventory item descriptions match the expected list.
     * Expected names: with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.
     * A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.
     * Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.
     * It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.
     * Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.
     * This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.
     */
    async expectCorrectInventoryItemDescription() {
        const expectedDescription = [
            'with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
            'A red light isn\'t the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.',
            'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
            'It\'s not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.',
            'Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won\'t unravel.',
            'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.'
        ];

        const actualDescription = await this.getInventoryItemDescription();

        // Check that we have the right number of items
        expect(actualDescription.length).toBe(expectedDescription.length);

        // Check that all expected names are present (order might vary)
        for (const expectedName of expectedDescription) {
            expect(actualDescription).toContain(expectedName);
        }

        // Alternatively, check exact match if order matters
        // expect(actualNames.sort()).toEqual(expectedNames.sort());
    }

    /**
     * Verifies that all inventory item names match the expected list.
     * Expected names: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt,
     * Sauce Labs Fleece Jacket, Sauce Labs Onesie, and T-Shirt (Red).
     */
    async expectCorrectInventoryItemNames() {
        const expectedNames = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Sauce Labs T-Shirt (Red)'
        ];

        const actualNames = await this.getInventoryItemNames();

        // Check that we have the right number of items
        expect(actualNames.length).toBe(expectedNames.length);

        // Check that all expected names are present (order might vary)
        for (const expectedName of expectedNames) {
            expect(actualNames).toContain(expectedName);
        }

        // Alternatively, check exact match if order matters
        // expect(actualNames.sort()).toEqual(expectedNames.sort());
    }

    /**
     * Verifies that all inventory item names match the expected list.
     * Expected names: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt,
     * Sauce Labs Fleece Jacket, Sauce Labs Onesie, and T-Shirt (Red).
     */
    async expectCorrectInventoryItemPrices() {
        const expectedPrices = [
            '$29.99',
            '$9.99',
            '$15.99',
            '$49.99',
            '$7.99',
            '$15.99'
        ];

        const actualPrices = await this.getInventoryItemPrices();

        // Check that we have the right number of items
        expect(actualPrices.length).toBe(expectedPrices.length);

        // Check that all expected names are present (order might vary)
        for (const expectedPrice of expectedPrices) {
            expect(actualPrices).toContain(expectedPrices);
        }

        // Alternatively, check exact match if order matters
        // expect(actualNames.sort()).toEqual(expectedNames.sort());
    }
}
