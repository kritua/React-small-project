import express from 'express';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import render from './render';
import fetch from 'node-fetch';
import intersection from 'lodash.intersection';

const expressApp = express();
const router = express.Router();

expressApp.disable('x-powered-by');

router.get('/:user1/:user2', (req, res) => {
    const requestId = async () => {
        const { user1, user2 } = req.params;
        const steamApiKey = '7D5F2FA02FF09ACA687DE979BE355B30';
        const urls = [
            `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamApiKey}&vanityurl=${user1}`,
            `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamApiKey}&vanityurl=${user2}`
        ];

        try {
            const response = await Promise.all(urls.map((url) => {
                return fetch(url).then((response) => response.json()).then((data) => data.response.steamid)
            }));

            const userGames = await Promise.all(response.map((userId) => {
                const userGamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${userId}&format=json`;

                return fetch(userGamesUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        const games = data.response.games;

                        if(Array.isArray(games)) {
                            return games.map((item) => item.appid);
                        }

                        return data.response.games
                    })
            }));

            const userGamesIntersection = await intersection(userGames[0], userGames[1]).sort((a, b) => a - b);

            const games = [];

            await Promise.all(userGamesIntersection.map((gameId) => {
                return fetch(`http://steamspy.com/api.php?request=appdetails&appid=${gameId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        const multiplayerTag = data.tags.Multiplayer;

                        if(multiplayerTag !== undefined) {
                            const item = {
                                name: data.name,
                                id  : gameId
                            };

                            games.push(item);
                        }
                    });
            }));

            return {
                user1,
                user2,
                games
            };
        } catch(err) {
            console.error(err);
        }
    };

    requestId().then((data) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

expressApp.use('/steam', router);

// Express Middleware
expressApp.use(compression());
expressApp.use(cookieParser());
expressApp.use(json());
expressApp.use(render);

expressApp.listen(process.env.PORT || 8082, () => {
    console.info(`Listening on => ${process.env.PORT || 8082}`);
    if(__DEVELOPMENT__) {
        require('daemon-command-webpack-plugin/marker')()
    }
});
