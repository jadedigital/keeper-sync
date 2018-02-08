import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as types from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeTeam: '',
    activeLeague: '',
    accessToken: '',
    refreshToken: '',
    leagueData: '',
    rosters: '',
    players: '',
    leagueStandings: '',
    league: '',
    freeAgents: '',
    projectedScores: '',
    injuries: '',
    topAdds: '',
    topOwns: '',
    topDrops: '',
    topStarters: '',
    liveScoring: '',
    matchupLiveScoring: '',
    fullNflSchedule: '',
    pointsAllowed: '',
    playerScores: '',
    playerStatus: '',
    dummyToolbar: false,
    currentWeek: '',
    futureDraftPicks: '',
    activePlayer: '',
    transactions: '',
    messageBoard: '',
    currentMsgThread: '',
    messageBoardThread: '',
    leagueTab: '',
    matchupTeams: {teamA: '', teamB: ''},
    displayTeam: '',
    chat: '',
    draftResults: '',
    teamMap: {
      ARI: 'ARI',
      ATL: 'ATL',
      BAL: 'BAL',
      BUF: 'BUF',
      CAR: 'CAR',
      CHI: 'CHI',
      CIN: 'CIN',
      CLE: 'CLE',
      DAL: 'DAL',
      DEN: 'DEN',
      DET: 'DET',
      GBP: 'GB',
      HOU: 'HOU',
      IND: 'IND',
      JAC: 'JAX',
      KCC: 'KC',
      LAR: 'LA',
      LAC: 'LAC',
      MIA: 'MIA',
      MIN: 'MIN',
      NEP: 'NE',
      NOS: 'NO',
      NYG: 'NYG',
      NYJ: 'NYJ',
      OAK: 'OAK',
      PHI: 'PHI',
      PIT: 'PIT',
      SEA: 'SEA',
      SFO: 'SF',
      TBB: 'TB',
      TEN: 'TEN',
      WAS: 'WAS'
    }
  },
  mutations: {
    [types.CHANGE_ACTIVE_TEAM] (state, payload) {
      state.activeTeam = payload
    },
    [types.CHANGE_ACTIVE_LEAGUE] (state, payload) {
      state.activeLeague = payload
    },
    [types.SET_ACCESS_TOKEN] (state, payload) {
      state.accessToken = payload
    },
    [types.SET_REFRESH_TOKEN] (state, payload) {
      state.refreshToken = payload
    },
    [types.REFRESH_TOKEN] (state) {
      state.refreshToken = 'temp'
    },
    [types.SET_LEAGUE_DATA] (state, payload) {
      state.leagueData = payload
    },
    [types.SET_ROSTERS] (state, payload) {
      state.rosters = payload
    },
    [types.SET_PLAYERS] (state, payload) {
      state.players = payload
    },
    [types.SET_DATA] (state, payload) {
      state[payload.type] = payload.data
    },
    [types.TOGGLE_DATA] (state, payload) {
      state[payload] = state[payload] * -1
    }
  },
  actions,
  getters,
  strict: true
})
