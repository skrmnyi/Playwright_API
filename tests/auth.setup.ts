import { test as setup } from '@playwright/test';
import user from '../.auth/user.json' //шлях до json файлу з стейтом браузера
import fs from 'fs'; // JS бібліотека для роботи з файлами

const authFile = './auth/user.json';

setup('authentication', async ({ request }) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      user: {
        email: 'ccheck@gmail.com',
        password: '123456'
      }
    }
  });
  
  const responseBody = await response.json();
  const accessToken = responseBody.user.token; //записуємо після логіна беарер токен в змінну

  user.origins[0].localStorage[0].value = accessToken; //редагуємо файл user.json файл, прокладаючи шлях в обєкті (файл не записаний)
  fs.writeFileSync(authFile, JSON.stringify(user)); // записуємоо файл, зберігаючи зміни в текстовом документі
  process.env['ACCESS_TOKEN'] = accessToken
})


