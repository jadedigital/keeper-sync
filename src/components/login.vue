<template>
  <div class="pic" style="background: url(./statics/login.jpg) no-repeat center;">
    <q-layout ref="layout" view="hhh lPr fff" class="bg-login">
      <div class="row items-center justify-center login">
        <div class="col-12 text-white">
          <div class="login-logo text-white text-center">
            <div class="main">Blitz</div>
            <div class="sub">MFL fantasy manager</div>
          </div>
          <div class="login-wrapper">
            <transition name="fade">
              <q-spinner-dots v-if="loadingData" color="white" size="100px" class="login-spinner absolute-center"/>
            </transition>
            <transition name="sling">
              <div v-if="!loadingData">
                <q-input class="login-username" v-model="username" :error="$v.username.$error" @blur="$v.username.$touch" color="white" type="text" float-label="MFL Username" :attributes="{autocomplete: 'off', autocorrect: 'off'}"/>
                <q-input class="login-password" v-model="password" :error="$v.password.$error" @blur="$v.password.$touch" color="white" type="password" float-label="Password" :attributes="{autocompletetype: 'email', autocorrect: 'off'}"/>
                <q-btn @click="login" big class="bg-secondary button">Login</q-btn>
                <div class="info-text text-white text-center">
                  <div>Don't have an account?<strong> Sign Up!</strong></div>
                  <div class="forgot"> Forgot Password?</div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </q-layout>
  </div>
</template>
-
<script>
import {
  QLayout,
  QBtn,
  QInput,
  QSpinnerDots,
  Toast,
  LocalStorage
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi, getWeek, getLeagueData } from '../data'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'login',
  components: {
    QLayout,
    QBtn,
    QInput,
    QSpinnerDots
  },
  data () {
    return {
      response: null,
      username: '',
      password: '',
      lastWeek: '',
      loadingData: false
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
    })
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
    login () {
      if (this.$v.username.$error || this.$v.password.$error) {
        Toast.create('Please enter a valid username and password.')
      }
      else {
        this.mflLogin()
      }
    },
    mflLogin () {
      this.loadingData = true
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
          var time = Date.now()
          LocalStorage.set('leagueData_time', time)
          LocalStorage.set('activeLeague_time', time)
          this.$store.commit('SET_LEAGUE_DATA', leagueData)
          this.$store.commit('CHANGE_ACTIVE_LEAGUE', leagueId)
          return getLeagueData()
        })
        .then((response) => {
          this.lastWeek = parseFloat(response.league.endWeek)
          return getWeek()
        })
        .then((response) => {
          console.log('week = ' + response)
          var week = Math.min(response, this.lastWeek)
          console.log('last week = ' + week)
          LocalStorage.set('currentWeek', week)
          var time = Date.now()
          LocalStorage.set('currentWeek_time', time)
          this.$store.commit('SET_DATA', {type: 'currentWeek', data: week})
          return callApi(week)
        })
        .then(() => {
          this.$router.push('user/team')
          this.loadingData = false
        })
        .catch((error) => {
          if (error) {
            this.loadingData = false
            Toast.create('Invalid username or password. Please try again.')
          }
        })
    }
  }
}
</script>

<style lang="stylus">
.pic
  background-size: cover;
  height: 100vh;
  overflow: hidden;
.bg-login
  background linear-gradient(321deg, rgba(61, 90, 254, 0.8) 15%, rgba(3, 169, 244, 0.8) 100%);
  z-index 3
.row.login
  height 100vh
.login .col-12
  padding 20px
.login .q-btn
  width 100%
  margin 80px 0 0 0
  border-radius 30px
  box-shadow none
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.sling-enter-active, .sling-leave-active {
  transition: all .6s cubic-bezier(.55,0,.1,1);
}
.sling-enter, .sling-leave-to {
  transform: translate(-1000px, 0);
}
.login-wrapper
  height 335px
  margin-top 40px
</style>

