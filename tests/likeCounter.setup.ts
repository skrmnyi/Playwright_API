import { test, expect } from '@playwright/test';

test('Like counter increase', async ({ page }) => {
  await page.goto('https://conduit.bondaracademy.com/');
  await page.getByText('Global Feed').click();
  const firstLikeButton = page.locator('app-article-preview').first().locator('button');

  await expect(firstLikeButton).toHaveText('0', { timeout: 5000 });
  await expect(firstLikeButton).toContainText('0');
  
  await firstLikeButton.click();
  await expect(firstLikeButton).toContainText('1');
});