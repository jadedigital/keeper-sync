<template>
  <q-layout ref="layout" view="hhh lPr fff" class="bg-primary">
    <div>
      <q-btn @click="loginDialog" outline color="white" big rounded class="bg-tertiary fixed-center">Login</q-btn>
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

export default {
  name: 'index',
  components: {
    QLayout,
    QBtn
  },
  data () {
    return {
      response: null
    }
  },
  computed: {
    ...mapGetters({
      leagueData: 'leagueData',
      activeLeague: 'activeLeague'
    })
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
          console.log(response)
          var str = response.data.leagues.league.url
          var host = str.substring(str.lastIndexOf('//') + 2, str.indexOf('.'))
          var leagueId = str.substring(str.lastIndexOf('/') + 1)
          var leagueData = {}
          leagueData[leagueId] = {cookie: response.data.cookie, host: host, teamId: response.data.leagues.league.franchise_id}
          LocalStorage.set('leagueData', leagueData)
          this.$store.commit('SET_LEAGUE_DATA', leagueData)
          this.$store.commit('CHANGE_ACTIVE_LEAGUE', leagueId)
          var rosterParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'rosters',
            L: leagueId,
            JSON: 1
          }
          var playerParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'players',
            DETAILS: 1,
            JSON: 1
          }
          var leagueParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'league',
            L: leagueId,
            JSON: 1
          }
          var standingsParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'leagueStandings',
            L: leagueId,
            JSON: 1
          }
          var freeAgentsParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'freeAgents',
            L: leagueId,
            JSON: 1
          }
          var projectedScoresParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'projectedScores',
            L: leagueId,
            COUNT: 3000,
            JSON: 1
          }
          var topAddsParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'topAdds',
            JSON: 1
          }
          var topOwnsParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'topOwns',
            JSON: 1
          }
          var nflScheduleParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'nflSchedule',
            W: 'ALL',
            JSON: 1
          }
          var liveScoringParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'liveScoring',
            L: leagueId,
            DETAILS: 1,
            JSON: 1
          }
          var pointsAllowedParams = {
            cookie: leagueData[leagueId].cookie,
            host: leagueData[leagueId].host,
            TYPE: 'pointsAllowed',
            L: leagueId,
            JSON: 1
          }
          this.fetchData(rosterParams)
          this.fetchData(playerParams)
          this.fetchData(leagueParams)
          this.fetchData(standingsParams)
          this.fetchData(freeAgentsParams)
          this.fetchData(projectedScoresParams)
          this.fetchData(topAddsParams)
          this.fetchData(topOwnsParams)
          this.fetchData(nflScheduleParams)
          this.fetchData(liveScoringParams)
          this.fetchData(pointsAllowedParams)
          Loading.hide()
          this.$router.push('team')
        })
        .catch((error) => {
          if (error) {
            Loading.hide()
            Toast.create('Invalid username or password. Please try again.')
          }
        })
    },
    fetchData (requestParams) {
      if (LocalStorage.has(requestParams.TYPE)) {
        let localData = LocalStorage.get.item(requestParams.TYPE)
        this.$store.commit('SET_DATA', {type: requestParams.TYPE, data: localData})
      }
      else {
        var url = 'https://keepersync.com/mfl/export'
        this.axios.get(url, {
          params: requestParams
        })
          .then((response) => {
            var responseData = JSON.parse(response.data)
            LocalStorage.set(requestParams.TYPE, responseData[requestParams.TYPE])
            this.$store.commit('SET_DATA', {type: requestParams.TYPE, data: responseData[requestParams.TYPE]})
          })
          .catch((error) => {
            if (error) {
              Loading.hide()
              Toast.create("Can't fetch " + requestParams.TYPE + ' data')
            }
          })
      }
    }
  }
}
</script>
