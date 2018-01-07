<template>
  <q-layout ref="layout" view="hhh lPr fff" class="bg-login">
    <div class="row items-center justify-center login">
      <div class="col-12 text-white">
        <div class="login-logo text-white text-center">
          <div class="main">AudibleX</div>
          <div class="sub">for myfantasyleague.com</div>
        </div>
        <q-input autofocus class="login-username" v-model="username" :error="$v.username.$error" @blur="$v.username.$touch" color="white" type="text" float-label="MFL Username" :attributes="{autocomplete: 'off', autocorrect: 'off'}"/>
        <q-input class="login-password" v-model="password" :error="$v.password.$error" @blur="$v.password.$touch" color="white" type="password" float-label="Password" :attributes="{autocompletetype: 'email', autocorrect: 'off'}"/>
        <q-btn @click="login" big class="bg-secondary button">Login</q-btn>
        <div class="info-text text-white text-center">
          <div>Don't have an account?<strong> Sign Up!</strong></div>
          <div class="forgot"> Forgot Password?</div>
        </div>
      </div>
    </div>
  </q-layout>
</template>
-
<script>
import {
  QLayout,
  QBtn,
  QInput,
  Dialog,
  Toast,
  LocalStorage,
  Loading
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi, getWeek, getLeagueData } from '../data'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'index',
  components: {
    QLayout,
    QBtn,
    QInput
  },
  data () {
    return {
      response: null,
      username: '',
      password: '',
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
      fullNflSchedule: 'fullNflSchedule',
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
  validations: {
    username: {
      required
    },
    password: {
      required
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
    login () {
      if (this.$v.username.$error || this.$v.password.$error) {
        Toast.create('Please enter a valid username and password.')
      }
      else {
        this.mflLogin()
      }
    },
    mflLogin () {
      Loading.show({
        message: 'Signing you in',
        delay: 0
      })
      var userParams = {
        USERNAME: this.username,
        PASSWORD: this.password
      }
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
          var week = Math.min(response, this.lastWeek)
          console.log(week)
          LocalStorage.set('currentWeek', week)
          this.$store.commit('SET_DATA', {type: 'currentWeek', data: week})
          console.log('you made it')
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
.bg-login
  background linear-gradient(321deg, #3f51b5 15%, #03a9f4 100%)
.row.login
  height 100vh
.login .col-12
  padding 20px
.login .q-btn
  width 100%
  margin 80px 0 0 0
.login .login-username
  margin-top 40px
.login .login-password
  margin-top 40px
.login .q-if:before
  color rgba(255,255,255,0.5)
.login .q-if-label
  color rgba(255,255,255,0.5)
.login .q-if-control
  color rgba(255,255,255,0.8)
.login .q-if-focused .q-if-label
  color currentColor
.login .q-input-target
  color currentColor
.login .info-text
  margin-top 30px
  font-weight 300
.login .forgot
  padding-top 10px
.login-logo .main
  font-size 32px
  font-weight 700
.login-logo .sub
  font-style italic
  font-weight 300
</style>

