import axios from 'axios';

import { routesApi } from './routesRiotApi';

export const searchByTagline = axios.create({
    baseURL: routesApi.searchByNick,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

export const searchByPuuid = axios.create({
    baseURL: routesApi.searchByPuuid,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

export const searchMatchsIds = axios.create({
    baseURL: routesApi.matchsHistoryIds,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

export const detailsMatchs = axios.create({
    baseURL: routesApi.matchsDetails,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

export const rankProfile = axios.create({
    baseURL: routesApi.rankProfile,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

export const spectateProfile = axios.create({
    baseURL: routesApi.spectateProfile,
    headers: { "X-Riot-Token": process.env.API_KEY }
})

export const championMastery = axios.create({
    baseURL: routesApi.championMastery,
    headers: { "X-Riot-Token": process.env.API_KEY }
})