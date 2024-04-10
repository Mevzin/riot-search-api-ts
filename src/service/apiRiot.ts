import axios from 'axios';

import { routesApi } from './routesRiotApi';

// /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
export const searchByTagline = axios.create({
    baseURL: routesApi.searchByNick,
    headers: { "X-Riot-Token": "RGAPI-715fe5e3-3553-4fdd-98bf-06ebf3df7edf" }
})