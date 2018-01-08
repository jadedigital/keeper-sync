export const activeTeam = state => state.activeTeam
export const activeLeague = state => state.activeLeague
export const accessToken = state => state.accessToken
export const refreshToken = state => state.refreshToken
export const leagueData = state => state.leagueData
export const rosters = state => state.rosters
export const players = state => state.players
export const league = state => state.league
export const leagueStandings = state => state.leagueStandings
export const freeAgents = state => state.freeAgents
export const projectedScores = state => state.projectedScores
export const topOwns = state => state.topOwns
export const topAdds = state => state.topAdds
export const fullNflSchedule = state => state.fullNflSchedule
export const liveScoring = state => state.liveScoring
export const pointsAllowed = state => state.pointsAllowed
export const playerScores = state => state.playerScores
export const dummyToolbar = state => state.dummyToolbar
export const currentWeek = state => state.currentWeek
export const futureDraftPicks = state => state.futureDraftPicks
export const endWeek = state => {
  return state.league.endWeek
}
