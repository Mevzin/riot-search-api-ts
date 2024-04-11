import axios from 'axios';

import { routesApi } from './routesRiotApi';

// /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
export const searchByTagline = axios.create({
    baseURL: routesApi.searchByNick,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

// /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}
export const searchByPuuid = axios.create({
    baseURL: routesApi.searchByPuuid,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

// /lol/match/v5/matches/by-puuid/{encryptedPUUID}
export const searchMatchsIds = axios.create({
    baseURL: routesApi.matchsHistoryIds,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

// /lol/match/v5/matches/{matchId}
export const detailsMatchs = axios.create({
    baseURL: routesApi.matchsDetails,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

// /lol/match/v5/matches/{matchId}
export const rankProfile = axios.create({
    baseURL: routesApi.rankProfile,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

// /lol/spectator/v5/active-games/by-summoner/{encryptedPUUID}
export const spectateProfile = axios.create({
    baseURL: routesApi.spectateProfile,
    headers: { "X-Riot-Token": process.env.API_KEY }
})