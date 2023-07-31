
// Тут нічого не вийшло :(

const mongoose = require('mongoose');

const app = require('../app');

const { DB_HOST, PORT } = process.env;

describe('test login controller', () => {
	beforeAll(async() =>
		await mongoose
			.connect(DB_HOST)
			.then(() => {
				app.listen(PORT);
			})
			.catch((error) => {
        console.log(error.message);
				process.exit(1);
			})
  );
  
  test('test login controller', async () => {
    const responce = await request(app).post('api/users/login');
    expect(responce.status).toBe(200);
  })
});
