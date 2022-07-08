import request from 'supertest';
import { server } from '..';
import { app } from '../app';
import { initializeDB } from '../db/initialize.db';
import { mongooseConnect } from '../db/mongoose';
import { Artist } from '../models/artist.model';
import { Comic } from '../models/comic.model';
import { iUser, User } from '../models/user.model';
import { createToken } from '../services/authorization';

describe('Given the routes of /user', () => {
    let data: { [key: string]: Array<any> };
    let token: string;
    beforeAll(async () => {
        data = await initializeDB();
        await mongooseConnect();
        token = createToken({
            id: data.users[0].id,
            name: data.users[0].name,
        });
    });
    afterAll(async () => {
        User.collection.drop();
        Comic.collection.drop();
        Artist.collection.drop();
        server.close();
    });
    describe('When method GET is called with an existing id', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get(
                `/user/${data.users[0].id}`
            );
            expect(response.status).toBe(200);
        });
    });
    describe('When method GET is called with a non existing id', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get(`/user/1234567890`);
            expect(response.status).toBe(422);
        });
    });
    describe('When method GET is called with a non existing id', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get(
                `/user/123456789012345678901234`
            );
            expect(response.status).toBe(404);
        });
    });
    describe('When method POST is used without the required params', () => {
        test('Then status should be 406', async () => {
            const response = await request(app).post(`/user/`);
            expect(response.status).toBe(406);
        });
    });
    describe('When method POST is used with the required params', () => {
        const newComic: Partial<iUser> = {
            name: 'test',
            email: 'teste@test.com',
            password: 'test',
            comics: [],
        };
        test('Then status should be 201', async () => {
            const response = await request(app).post(`/user/`).send(newComic);
            expect(response.status).toBe(201);
        });
    });
    describe('When method POST is used to login with valid credentials', () => {
        test('Then status should be 201', async () => {
            const user = {
                name: 'test',
                password: 'test',
            };
            const response = await request(app).post(`/user/login/`).send(user);
            expect(response.statusCode).toBe(201);
        });
    });
    describe('When method POST is used to login with invalid credentials', () => {
        test('Then status should be 401', async () => {
            const user = {
                name: 'test',
                password: 'badpaswword',
            };
            const response = await request(app).post(`/user/login/`).send(user);
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method PATCH is called with an valid token', () => {
        test('Then status should be 200', async () => {
            const newParamUser = {
                password: '0101',
            };
            const response = await request(app)
                .patch(`/user/${data.users[0].id}`)
                .set('Authorization', 'Bearer ' + token)
                .send(newParamUser);
            expect(response.statusCode).toBe(200);
        });
    });
    describe('When method PATCH is called with a incorrect authorization', () => {
        test('Then status should be 401', async () => {
            const newParamUser = {
                name: '0101',
            };
            const response = await request(app)
                .patch(`/user/${data.users[0].id}`)
                .set('Authorization', 'Bea ' + token)
                .send(newParamUser);
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method PATCH is called with a incorrect token', () => {
        test('Then status should be 404', async () => {
            const newParamUser = {
                name: '0101',
            };
            const response = await request(app)
                .patch(`/user/${data.users[0].id}`)
                .set('Authorization', 'Bearer ' + token)
                .send(newParamUser);
            expect(response.statusCode).toBe(404);
        });
    });

    describe('When method DELETE is called with an invalid token', () => {
        test('Then status should be 401', async () => {
            const response = await request(app)
                .delete(`/user/delete/${data.users[1].id}`)
                .set('Authorization', 'Bearer ' + token);
            expect(response.statusCode).toBe(401);
        });
    });
    describe('When method DELETE is called with a valid token', () => {
        test('Then status should be 202', async () => {
            const response = await request(app)
                .delete(`/user/delete/${data.users[0].id}`)
                .set('Authorization', 'Bearer ' + token);
            expect(response.statusCode).toBe(202);
        });
    });
});
