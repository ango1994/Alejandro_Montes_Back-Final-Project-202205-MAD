import request from 'supertest';
import { server } from '..';
import { app } from '../app';
import { initializeDB } from '../db/initialize.db';
import { mongooseConnect } from '../db/mongoose';
import { Artist } from '../models/artist.model';
import { Comic } from '../models/comic.model';
import { User } from '../models/user.model';
describe('Given the routes of "/artist', () => {
    let data;
    beforeAll(async () => {
        data = await initializeDB();
        await mongooseConnect();
    });
    afterAll(async () => {
        User.collection.drop();
        Comic.collection.drop();
        Artist.collection.drop();
        server.close();
    });
    describe('When method GETALL is used', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get('/artist');
            expect(response.status).toBe(200);
        });
    });
    describe('When method GET is used', () => {
        test('Then status should be 200', async () => {
            const response = await request(app).get(`/artist/${data.artists[0].id}`);
            expect(response.status).toBe(200);
        });
    });
    describe('When method GET is used with and unexisting ID', () => {
        test('Then status should be 404', async () => {
            const response = await request(app).get(`/artist/123456789012345678901234`);
            expect(response.status).toBe(404);
        });
    });
    describe('When method POST is used', () => {
        test('Then status should be 200', async () => {
            const newArtist = {
                name: 'test',
                about: 'test',
                comics: [data.comics[0].id],
                image: 'test',
                rol: 'writer',
            };
            const response = await request(app).post('/artist').send(newArtist);
            expect(response.status).toBe(201);
        });
    });
    describe('When method POST is used and the required data is not passed', () => {
        test('Then status should be 200', async () => {
            const newArtist = {
                about: 'test',
                comics: [data.comics[0].id],
                image: 'test',
                rol: 'writer',
            };
            const response = await request(app).post('/artist').send(newArtist);
            expect(response.status).toBe(406);
        });
    });
});
