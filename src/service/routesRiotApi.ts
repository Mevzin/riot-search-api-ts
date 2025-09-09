const routesApi = {
    searchByNick: "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id",
    searchByPuuid: "https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid",
    matchsHistoryIds: "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid",
    matchsDetails: "https://americas.api.riotgames.com/lol/match/v5/matches",
    rankProfile: "https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner",
    spectateProfile: "https://br1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner",
    championMastery: "https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid"
}

export { routesApi }