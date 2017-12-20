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
    topAdds: '',
    topOwns: ''

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
    }
  },
  actions,
  getters,
  strict: true
})
