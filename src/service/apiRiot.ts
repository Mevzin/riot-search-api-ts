import axios from 'axios';

import { routesApi } from './routesRiotApi';

// /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
export const searchByTagline = axios.create({
    baseURL: routesApi.searchByNick,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

///lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}
export const searchByPuuid = axios.create({
    baseURL: routesApi.searchByPuuid,
    headers: { "X-Riot-Token": process.env.API_KEY }
})