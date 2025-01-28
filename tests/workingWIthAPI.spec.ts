import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'; 

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/tags', async route => { // паттерн для апі запитів, щоб не вводити всю урлу, а відпрацьовувати по урлі яка містить api/tags
    await route.fulfill({
      body: JSON.stringify(tags)
    });
  });

  await page.goto('https://conduit.bondaracademy.com/');
});


test('has title', async ({ page, request }) => { 
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', { 
    data: { //метод який відправляє боді з токеном
      article: { 
        tagList: [],
        title: "This is a test title",
        description: "This is a test description",
        body: "This is a test body"
      }
    }
  })
  expect(articleResponse.status()).toEqual(201);

  await page.getByText('Global Feed').click();
  await page.getByText('This is a test title').click();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();
  await page.getByText('Global Feed').click();

  await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test title');

});

test('create article & delete through API', async ({page, request}) => {
  await page.getByText('New Article').click()
  await page.getByRole('textbox', {name: 'Article Title'}).fill(`Playwright is awesome ${Date.now()}`)
  await page.getByRole('textbox', {name: "What's this article about?"}).fill('About the Playwright')
  await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwright for automation')
  await page.getByRole('button', {name: 'Publish Article'}).click()
  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/') //метод який чекає допоки виконається ріквест і записує відповідь
  const articleResponseBody = await articleResponse.json() //витягуємо із ріспонса - ріспонс баді
  const slug = articleResponseBody.article.slug // витягуємо конкретне поле (slug те саме що й id - унікальний ключ)
  console.log(slug)

  await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

  const deleteResponce = await page.request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slug}`, { //робимо видалення з айдішкою нотатки
  })
  expect(deleteResponce.status()).toEqual(204); //перевіряємо чи правильний код видалення
})


