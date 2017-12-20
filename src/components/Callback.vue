<template>
  <div></div>
</template>
<script>
import {
  Loading,
  LocalStorage
} from 'quasar'

Loading.show({
  message: 'Signing In'
})

export default {
  name: 'callback',
  data: function () {
    return {
      league: {},
      teamKeys: []
    }
  },
  methods: {
    fetchLeagues (token, rToken) {
      var this_ = this
      var url = 'https://keepersync.com/leagues'
      this.axios.get(url, {
        params: {
          accessToken: token,
          refreshToken: rToken
        }
      })
        .then(function (response) {
          var leagues = response.data.leagues[0].leagues
          LocalStorage.set('leagues', response.data.leagues[0].leagues)
          this_.$store.commit('CHANGE_ACTIVE_LEAGUE', response.data.leagues[0].leagues[0].league_key)
          var leagueNames = {}
          leagues.forEach(function (l) {
            leagueNames[l.league_key] = l.name
          })
          this_.fetchTeams(token, rToken, leagueNames)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    fetchTeams (token, rToken, leagueNames) {
      var this_ = this
      var url = 'https://keepersync.com/teams'
      this.axios.get(url, {
        params: {
          accessToken: token,
          refreshToken: rToken
        }
      })
        .then(function (response) {
          var teams = response.data.teams[0].teams
          teams.forEach(function (t) {
            var teamKey = t.team_key
            var teamId = '.t.' + t.team_id
            var teamLeague = teamKey.replace(teamId, '')
            t.league = leagueNames[teamLeague]
            this_.fetchRosters(token, rToken, t.team_key)
          })
          LocalStorage.set('teams', teams)
          var teamPayload = teams[0].team_key
          this_.$store.commit('CHANGE_ACTIVE_TEAM', teamPayload)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    fetchRosters (token, rToken, key) {
      var url = 'https://keepersync.com/rosters'
      this.axios.get(url, {
        params: {
          accessToken: token,
          refreshToken: rToken,
          team_key: key
        }
      })
        .then(function (response) {
          var rosterData = {}
          if (LocalStorage.has('rosters')) {
            console.log('oh yea')
            rosterData = LocalStorage.get.item('rosters')
          }
          rosterData[key] = response.data.roster
          LocalStorage.set('rosters', rosterData)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  mounted () {
    this.$nextTick(() => {
      var accessToken = this.$route.query.accessToken
      var refreshToken = this.$route.query.refreshToken
      LocalStorage.set('accessToken', this.$route.query.accessToken)
      LocalStorage.set('refreshToken', this.$route.query.refreshToken)
      this.$store.commit('SET_ACCESS_TOKEN', accessToken)
      this.$store.commit('SET_REFRESH_TOKEN', refreshToken)
      LocalStorage.set('id', this.$route.query.guid)
      LocalStorage.set('profileImage', this.$route.query.profileImage)
      LocalStorage.set('firstName', this.$route.query.firstName)
      LocalStorage.set('lastName', this.$route.query.lastName)
      LocalStorage.set('displayName', this.$route.query.displayName)
      this.fetchLeagues(accessToken, refreshToken)
      this.$router.push('/team')
      Loading.hide()
    })
  }
}
</script>