import request from 'supertest';
import { server } from '..';
import { app } from '../app';
import { initializeDB } from '../db/initialize.db';
import { mongooseConnect } from '../db/mongoose';
import { Artist } from '../models/artist.model';
import { Comic } from '../models/comic.model';
import { User } from '../models/user.model';
import { createToken } from '../services/authorization';
describe('Given the routes of "/comic', () => {
    let data;
    let token;
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
    describe('When method GETALL is used', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get('/comic');
            expect(response.status).toBe(200);
        });
    });
    describe('When method GET is used', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get(`/comic/${data.comics[0].id}`);
            expect(response.status).toBe(200);
        });
    });
    describe('When method GET is used with a non existing ID', () => {
        test('Then status should be 404', async () => {
            const response = await request(app).get(`/comic/123456789012345678901234`);
            expect(response.status).toBe(404);
        });
    });
    describe('When method SEARCH is used', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get(`/comic/search?q=watchmen`);
            expect(response.status).toBe(200);
        });
    });
    describe('When method POST is used without the required params', () => {
        test('Then status should be 406', async () => {
            const response = await request(app).post(`/comic/`);
            expect(response.status).toBe(406);
        });
    });
    describe('When method POST is used withthe required params', () => {
        const newComic = {
            image: 'test',
            artist: [],
            category: 'american',
            description: 'test',
            name: 'test',
            publicationDate: '67',
            score: [],
        };
        test('Then status should be 406', async () => {
            const response = await request(app).post(`/comic/`).send(newComic);
            expect(response.status).toBe(201);
        });
    });
    describe('When method PATCH is used with the required params', () => {
        test('Then status should be 200', async () => {
            const newComic = {
                score: 9,
            };
            const response = await request(app)
                .patch(`/comic/score/${data.comics[0].id}`)
                .set('Authorization', 'Bearer ' + token)
                .send(newComic);
            expect(response.statusCode).toStrictEqual(202);
        });
    });
    describe('When method PATCH is used with the required params', () => {
        test('Then status should be 200', async () => {
            const newComic = {
                score: 4,
            };
            const response = await request(app)
                .patch(`/comic/score/${data.comics[1].id}`)
                .set('Authorization', 'Bearer ' + token)
                .send(newComic);
            expect(response.statusCode).toStrictEqual(202);
        });
    });
});
