import { compare, createToken, encrypt, verifyToken } from './authorization';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('When the function encrypt is called with a source', () => {
    test('Then bcrypt.hash should be called', async () => {
        bcrypt.hash = jest.fn();
        await encrypt('password');
        expect(bcrypt.hash).toHaveBeenCalled();
    });
});

describe('When the function encrypt is called without a source', () => {
    test('Then it should return', async () => {
        bcrypt.hash = jest.fn();
        await encrypt('');
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });
});

describe('When the function compare is called', () => {
    test('Then it should call bcrypt.compare', async () => {
        bcrypt.compare = jest.fn();
        await compare('1', '1');
        expect(bcrypt.compare).toHaveBeenCalledWith('1', '1');
    });
});

describe('When the function createToken is called', () => {
    test('Then it should call jwt.sign', async () => {
        jwt.sign = jest.fn();
        await createToken({ id: '', name: '' });
        expect(jwt.sign).toHaveBeenCalled();
    });
});

describe('When the function verifyToken is called', () => {
    test('Then it should call jwt.verify', async () => {
        jwt.verify = jest.fn();
        await verifyToken('');
        expect(jwt.sign).toHaveBeenCalled();
    });
});
