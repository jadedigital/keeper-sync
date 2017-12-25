<template>
  <q-pull-to-refresh :handler="refresher">
    <q-tabs inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="Roster" />
      <q-tab count="2" slot="title" name="tab-2" label="Alerts"/>
      <!-- Targets -->
      <div class="contain-main">
        <q-tab-pane class="no-pad no-border" name="tab-1">
          <q-list v-if="dataLoaded" highlight class="no-border bg-grey-3">
            <q-card class="bg-grey-1 compact-card">
              <q-card-title>
                Roster
              </q-card-title>
              <q-card-separator />
              <div class="card-main bg-white">
                <q-item separator v-for="(player, key) in startersSorted" :key="player.id" v-if="player.status === 'starter'">
                  <q-btn @click="showAS(playerLookup[player.id].name)" round small outline color="primary" style="font-size: 14px; font-weight:400" class="q-item-avatar">{{ playerLookup[player.id].position }}</q-btn>
                  <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
                  <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'https://sports.cbsimg.net/images/nfl/logos/100x100/' + playerLookup[player.id].team + '.png'" />
                  <div class="q-item-main q-item-section team-players">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}}<small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                    <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span></div>
                  </div>
                  <div class="q-item-side q-item-side-right q-item-section">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{scoringLookup[player.id].score}}</div>
                    <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>{{ updatedProjection[player.id].projection }}</small></span></div>
                  </div>
                </q-item>
              </div>
            </q-card>
            <q-card class="bg-grey-1 compact-card">
              <q-card-title>
                Bench
              </q-card-title>
              <q-card-separator />
              <div class="card-main bg-white">
                <q-item separator v-for="(player, key) in startersSorted" :key="player.id" v-if="player.status === 'nonstarter'">
                  <q-btn round small outline color="primary" style="font-size: 14px; font-weight:400" class="q-item-avatar">BN</q-btn>
                  <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
                  <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'https://sports.cbsimg.net/images/nfl/logos/100x100/' + playerLookup[player.id].team + '.png'" />
                  <div class="q-item-main q-item-section team-players">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}}<small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                    <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span></div>
                  </div>
                  <div class="q-item-side q-item-side-right q-item-section">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{scoringLookup[player.id].score}}</div>
                    <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>{{ updatedProjection[player.id].projection }}</small></span></div>
                  </div>
                </q-item>
              </div>
            </q-card>
            <q-card class="bg-grey-1 compact-card">
              <q-card-title>
                Injured Reserve
              </q-card-title>
              <q-card-separator />
              <div class="card-main bg-white">
                <q-item separator v-for="(player, key) in rosterLookup[myTeam].player" :key="player.id" v-if="player.status === 'INJURED_RESERVE'">
                  <q-btn round small outline color="primary" style="font-size: 14px; font-weight:400" class="q-item-avatar">IR</q-btn>
                  <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
                  <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'https://sports.cbsimg.net/images/nfl/logos/100x100/' + playerLookup[player.id].team + '.png'" />
                  <div class="q-item-main q-item-section team-players">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}}<small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                    <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span></div>
                  </div>
                  <q-item-side right>-</q-item-side>
                </q-item>
              </div>
            </q-card>
            <q-card class="bg-grey-1 compact-card">
              <q-card-title>
                Taxi Squad
              </q-card-title>
              <q-card-separator />
              <div class="card-main bg-white">
                <q-item separator v-for="(player, key) in rosterLookup[myTeam].player" :key="player.id" v-if="player.status === 'TAXI_SQUAD'">
                  <q-btn round small outline color="primary" style="font-size: 14px; font-weight:400" class="q-item-avatar">TS</q-btn>
                  <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
                  <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'https://sports.cbsimg.net/images/nfl/logos/100x100/' + playerLookup[player.id].team + '.png'" />
                  <div class="q-item-main q-item-section team-players">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}}<small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                    <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span></div>
                  </div>
                  <q-item-side right>-</q-item-side>
                </q-item>
              </div>
            </q-card>
          </q-list>
        </q-tab-pane>
        <q-tab-pane name="tab-2">Roster Alerts</q-tab-pane>
      </div>
    </q-tabs>
  </q-pull-to-refresh>
</template>

<script>
import {
  openURL,
  QBtn,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemSeparator,
  QRouteTab,
  QTabs,
  QTab,
  QTabPane,
  QCard,
  ActionSheet,
  Toast,
  LocalStorage,
  QPullToRefresh,
  QCardTitle,
  QCardSeparator,
  Loading
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  components: {
    QBtn,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemSeparator,
    QRouteTab,
    QTabs,
    QTab,
    QTabPane,
    QPullToRefresh,
    QCard,
    QCardTitle,
    QCardSeparator
  },
  data () {
    return {
      response: null,
      dataLoaded: false
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      league: 'league',
      liveScoring: 'liveScoring',
      projectedScores: 'projectedScores',
      nflSchedule: 'nflSchedule',
      pointsAllowed: 'pointsAllowed'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    rosterLookup () {
      var array = this.rosters.franchise
      return this.lookup(array, 'id')
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    projectedLookup () {
      var array = this.projectedScores.playerScore
      return this.lookup(array, 'id')
    },
    updatedProjection () {
      var obj = {}
      this.myScoring[0].players.player.forEach(el => {
        var score = parseFloat(this.scoringLookup[el.id].score)
        var projection = parseFloat(this.projectedLookup[el.id].score)
        var newProjection = ''
        var timeRemaining = parseFloat(this.scoringLookup[el.id].gameSecondsRemaining)
        if (!score) {
          score = 0
        }
        var rate = projection / 3600
        newProjection = ((timeRemaining * rate) + score).toFixed(2)
        obj[el.id] = {projection: newProjection}
      })
      return obj
    },
    matchupLookup () {
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
      var obj = {}
      this.nflSchedule.matchup.forEach((el, i) => {
        var date = new Date(el.kickoff * 1000)
        obj[el.team[0].id] = {
          vs: el.team[1].id,
          day: days[date.getDay()],
          time: ((date.getHours() === 0) ? '00' : date.getHours()) + ':' + ((date.getMinutes() === 0) ? '00' : date.getMinutes()),
          location: ((el.team[0].isHome === '0') ? '@' : 'vs')
        }
        obj[el.team[1].id] = {
          vs: el.team[0].id,
          day: days[date.getDay()],
          time: ((date.getHours() === 0) ? '00' : date.getHours()) + ':' + ((date.getMinutes() === 0) ? '00' : date.getMinutes()),
          location: ((el.team[1].isHome === '0') ? '@' : 'vs')
        }
      })
      return obj
    },
    matchupPoints () {
      var object = {
        QB: this.matchupPointsUtil('QB'),
        RB: this.matchupPointsUtil('RB'),
        WR: this.matchupPointsUtil('WR'),
        TE: this.matchupPointsUtil('TE'),
        Def: this.matchupPointsUtil('Def')
      }
      return object
    },
    myScoring () {
      var array = []
      this.liveScoring.matchup.forEach((el) => {
        el.franchise.forEach((el2) => {
          if (el2.id === this.myTeam) {
            array.push(el2)
          }
        })
      })
      return array
    },
    scoringLookup () {
      var array = this.myScoring[0].players.player
      return this.lookup(array, 'id')
    },
    startersSorted () {
      var array = []
      var positions = this.positionsBasic
      this.myScoring[0].players.player.forEach((el) => {
        var obj = {
          id: el.id,
          pos: this.playerLookup[el.id].position,
          status: el.status,
          score: el.score
        }
        array.push(obj)
      })
      array.sort(function (a, b) {
        return positions.indexOf(a.pos) - positions.indexOf(b.pos)
      })
      return array
    },
    startersOld () {
      var n = 0
      var starters = {}
      var players = this.myScoring[0].players.player
      this.positions.forEach((elarray) => {
        elarray.forEach((el) => {
          players.slice(n, n + 1).forEach((pos) => {
            if (this.playerLookup[pos.id].position === el) {
              starters[pos.id] = el
              n++
            }
          })
        })
      })
      return starters
    },
    positionsBasic () {
      var pos = []
      this.league.starters.position.forEach((el) => {
        pos.push(el.name)
      })
      return pos
    },
    positions () {
      var pos = []
      var flex = []
      var n = 0
      var m = 0
      this.league.starters.position.forEach((el) => {
        var min = ''
        var max = ''
        if (el.limit.indexOf('-')) {
          min = el.limit.split('-')[0]
          max = el.limit.split('-')[1]
        }
        else {
          min = el.limit
          max = el.limit
        }
        for (var i = 0, len = min; i < len; i++) {
          pos[n] = new Array(0)
          pos[n].push(el.name)
          n++
        }
        for (var j = 0, len2 = (max - min); j < len2; j++) {
          if (!flex[m]) {
            flex[m] = new Array(0)
          }
          flex[m].push(el.name)
          m++
        }
        m = 0
      })
      var positions = pos.concat(flex)
      return positions
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    matchupPointsUtil (pos) {
      var array = []
      var object = {}
      this.pointsAllowed.team.forEach(el => {
        var lookup = this.lookup(el.position, 'name')
        var obj = {
          team: el.id,
          points: lookup[pos].points
        }
        array.push(obj)
        object[el.id] = {
          points: lookup[pos].points
        }
      })
      array.sort(function (a, b) {
        if (a.points > b.points) return -1
        if (a.points < b.points) return 1
        return 0
      })
      array.forEach(el => {
        object[el.team].rank = array.findIndex(x => x.team === el.team) + 1
        object[el.team].rankPretty = this.pluralize(array.findIndex(x => x.team === el.team) + 1)
      })
      return object
    },
    pluralize: function (value) {
      value = value.toString()
      if (value.endsWith('1')) {
        value = value.toString() + 'st'
      }
      else if (value.endsWith('2')) {
        value = value.toString() + 'nd'
      }
      else if (value.endsWith('3')) {
        value = value.toString() + 'rd'
      }
      else {
        value = value.toString() + 'th'
      }
      return value
    },
    showAS (name) {
      var actions = []
      this.startersSorted.forEach((el) => {
        var action = {
          label: this.playerLookup[el.id].name,
          avatar: 'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + this.playerLookup[el.id].cbs_id + '.jpg',
          handler () {
            Toast.create('API call to submit lineup')
          }
        }
        actions.push(action)
      })
      ActionSheet.create({
        title: 'Move ' + name.split(', ').reverse().join(' '),
        actions: actions,
        dismiss: {
          label: 'Cancel',
          handler () {
            Toast.create('Cancelled...')
          }
        }
      })
    },
    refresher (done) {
      this.fetchData()
      let data = LocalStorage.get.item('leagueData')
      var leagueId = Object.keys(data)[0]
      var playerParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'players',
        DETAILS: 1,
        JSON: 1
      }
      this.callApi(playerParams, false)
      done()
    },
    fetchData () {
      Loading.show({
        delay: 0
      })
      let data = LocalStorage.get.item('leagueData')
      var leagueId = Object.keys(data)[0]
      this.$store.commit('SET_LEAGUE_DATA', data)
      this.$store.commit('CHANGE_ACTIVE_LEAGUE', leagueId)
      var rosterParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'rosters',
        L: leagueId,
        JSON: 1
      }
      var projectedScoresParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'projectedScores',
        L: leagueId,
        COUNT: 3000,
        JSON: 1
      }
      var nflScheduleParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'nflSchedule',
        W: 16,
        JSON: 1
      }
      var liveScoringParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'liveScoring',
        L: leagueId,
        DETAILS: 1,
        JSON: 1
      }
      var pointsAllowedParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'pointsAllowed',
        L: leagueId,
        JSON: 1
      }
      this.callApi(rosterParams, false)
      this.callApi(projectedScoresParams, false)
      this.callApi(nflScheduleParams, false)
      this.callApi(liveScoringParams, false)
      this.callApi(pointsAllowedParams, true)
    },
    callApi (requestParams, lastCall) {
      var url = 'https://keepersync.com/mfl/export'
      this.axios.get(url, {
        params: requestParams
      })
        .then((response) => {
          var responseData = JSON.parse(response.data)
          LocalStorage.set(requestParams.TYPE, responseData[requestParams.TYPE])
          this.$store.commit('SET_DATA', {type: requestParams.TYPE, data: responseData[requestParams.TYPE]})
          if (lastCall) {
            Loading.hide()
            this.dataLoaded = true
          }
        })
        .catch((error) => {
          if (error) {
            Loading.hide()
            Toast.create("Can't fetch " + requestParams.TYPE + ' data')
          }
        })
    }
  },
  created () {
    if (this.rosters === null) {
      this.fetchData()
    }
    else {
      this.dataLoaded = true
    }
  }
}
</script>

<style lang="stylus">
.team-players
  font-weight 500
.team-players small
  color #555
  font-size 13px
  font-weight 300
.team-players .q-item-sublabel
  color #555
  font-size 13px
  font-weight 300
.secondary-tabs .q-tab
  min-height 50px
  font-size 12px
.no-pad
  padding 0
.no-border
  border none
.q-item.q-item-separator
  border-color #eaeaea
.secondary-tabs .q-chip
  min-height 16px
  font-size 10px
  padding-left 8px
  padding-right 8px
  right 40px
  top 10px
.contain-main
  height 100%
  padding-bottom 62px
.q-tabs-panes
  background #f5f5f5
.q-item-side-right .q-item-label
  color #0c0c0c
  font-weight 500
</style>