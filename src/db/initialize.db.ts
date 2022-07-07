import { Artist, iArtist } from '../models/artist.model';
import { Comic, iComic } from '../models/comic.model';
import { iUser, User } from '../models/user.model';
import { encrypt } from '../services/authorization';
import { mongooseConnect } from './mongoose';

let mockArtists: Array<iArtist> = [
    {
        name: 'Alan',
        about: 'about',
        image: 'image.jpg',
        rol: 'writer',
        comics: [],
    },
    {
        name: 'Henry',
        about: 'about',
        image: 'image.jgp',
        rol: 'writer',
        comics: [],
    },
];

let mockComics: Array<iComic> = [
    {
        name: 'Watchmen',
        image: 'image.jpg',
        description: 'description',
        publicationDate: '1988',
        category: 'american',
        artist: [],
        score: [],
    },
    {
        name: 'Mouse',
        image: 'image.jpg',
        description: 'description',
        publicationDate: '1988',
        category: 'european',
        artist: [],
        score: [],
    },
];

let mockUsers: Array<iUser> = [
    {
        name: 'Pepe',
        email: 'pepe@gmail.com',
        password: 'pepexulo',
        comics: [],
    },
    {
        name: 'Luisa',
        email: 'luisa@gmail.com',
        password: 'luisaxula',
        comics: [],
    },
];

export const initializeDB = async () => {
    const connect = await mongooseConnect();
    const artists = await Artist.insertMany(mockArtists);
    mockComics[0].artist.push(artists[0].id);
    mockComics[1].artist.push(artists[1].id);
    const comics = await Comic.insertMany(mockComics);

    let finalArtists = [];
    for (let i = 0; i < artists.length; i++) {
        const artist = artists[i];
        finalArtists[i] = await Artist.findByIdAndUpdate(
            artist.id,
            {
                $set: { comics: [comics[i].id] },
            },
            { new: true }
        );
    }
    mockUsers = await Promise.all(
        mockUsers.map(async (item) => ({
            ...item,
            comics: [comics[0].id],
            passwd: await encrypt(item.password),
        }))
    );
    const users = await User.insertMany(mockUsers);
    let finalComics = [];
    for (let i = 0; i < comics.length; i++) {
        const comic = comics[i];
        finalComics[i] = await Comic.findByIdAndUpdate(
            comic.id,
            {
                $set: { score: [{ user: users[i].id, score: i }] },
            },
            { new: true }
        );
    }
    connect.disconnect();
    return {
        comics: finalComics,
        users,
        artists: finalArtists,
    };
};
