<template>
  <q-layout ref="layout" view="hhh lPr fff" class="bg-gradient">
    <div>
      <q-btn @click="loginDialog" big class="bg-secondary text-white fixed-center">Login</q-btn>
    </div>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QBtn,
  Dialog,
  Toast,
  LocalStorage,
  Loading
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi, getWeek, getLeagueData } from '../data'

export default {
  name: 'index',
  components: {
    QLayout,
    QBtn
  },
  data () {
    return {
      response: null,
      lastWeek: ''
    }
  },
  computed: {
    ...mapGetters({
      leagueData: 'leagueData',
      activeLeague: 'activeLeague',
      rosters: 'rosters',
      players: 'players',
      league: 'league',
      leagueStandings: 'leagueStandings',
      freeAgents: 'freeAgents',
      projectedScores: 'projectedScores',
      topAdds: 'topAdds',
      topOwns: 'topOwns',
      nflSchedule: 'nflSchedule',
      liveScoring: 'liveScoring',
      pointsAllowed: 'pointsAllowed'
    }),
    dataLoaded () {
      var loaded = false
      if (this.leagueData && this.rosters && this.players && this.league && this.leagueStandings && this.freeAgents && this.projectedScores && this.topAdds && this.topOwns && this.nflSchedule && this.liveScoring && this.pointsAllowed) {
        loaded = true
      }
      return loaded
    }
  },
  methods: {
    loginDialog () {
      Dialog.create({
        title: 'Login',
        message: 'Login using your MFL username and password.',
        form: {
          USERNAME: {
            type: 'text',
            label: 'Username',
            model: ''
          },
          PASSWORD: {
            type: 'password',
            label: 'Password',
            model: ''
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Ok',
            handler: (data) => {
              Loading.show({
                message: 'Signing you in',
                delay: 0
              })
              this.mflLogin(data)
            }
          }
        ]
      })
    },
    mflLogin (userParams) {
      var url = 'https://keepersync.com/auth/mfl'
      this.axios.get(url, {
        params: userParams
      })
        .then((response) => {
          var str = response.data.leagues.league.url
          var host = str.substring(str.lastIndexOf('//') + 2, str.indexOf('.'))
          var leagueId = str.substring(str.lastIndexOf('/') + 1)
          var leagueData = {}
          leagueData[leagueId] = {cookie: response.data.cookie, host: host, teamId: response.data.leagues.league.franchise_id}
          LocalStorage.set('leagueData', leagueData)
          LocalStorage.set('activeLeague', leagueId)
          this.$store.commit('SET_LEAGUE_DATA', leagueData)
          this.$store.commit('CHANGE_ACTIVE_LEAGUE', leagueId)
          return getLeagueData()
        })
        .then((response) => {
          this.lastWeek = response.league.endWeek
          return getWeek()
        })
        .then((response) => {
          var timeLeft = 0
          var week = ''
          response.nflSchedule.matchup.forEach(el => {
            timeLeft += parseFloat(el.gameSecondsRemaining)
          })
          if (timeLeft > 0) {
            week = parseFloat(response.nflSchedule.week)
          }
          else {
            week = parseFloat(response.nflSchedule.week) + 1
          }
          week = Math.min(week, this.lastWeek)
          return callApi(week)
        })
        .then(() => {
          Loading.hide()
          this.$router.push('user/team')
        })
        .catch((error) => {
          if (error) {
            Loading.hide()
            Toast.create('Invalid username or password. Please try again.')
          }
        })
    }
  }
}
</script>

<style lang="stylus">
.bg-gradient
  background linear-gradient(141deg, #3f51b5 15%, #03a9f4 100%)
</style>

