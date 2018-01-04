<template>
  <q-pull-to-refresh :handler="refresher">
    <q-tabs inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="Roster" />
      <q-tab count="2" slot="title" name="tab-2" label="Alerts"/>
      <!-- Targets -->
      <div class="contain-main">
        <q-tab-pane class="no-pad no-border" name="tab-1">
          <q-list v-if="dataLoaded" highlight class="no-border no-pad bg-grey-1">
            <q-card class="compact-card bg-white">
              <q-card-title>
                Roster
              </q-card-title>
              <q-card-separator />
              <div class="card-main bg-white">
                <q-item separator v-for="player in startersOld" :key="player.id" @click="goPlayerModal(player.id)">
                  <q-btn @click.stop="showAS(playerLookup[player.id].name)" round small style="font-size: 12px; font-weight:400" :class="[ parseFloat(scoringLookup[player.id].gameSecondsRemaining) < 3600 ? 'q-btn-flat text-primary' : 'q-btn-outline bg-white text-primary', 'q-item-avatar']">{{ player.position }}</q-btn>
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
            <q-card class="compact-card bg-white">
              <q-card-title>
                Bench
              </q-card-title>
              <q-card-separator />
              <div class="card-main bg-white">
                <q-item separator v-for="player in bench" :key="player.id">
                  <q-btn @click.stop="showAS(playerLookup[player.id].name)" round small style="font-size: 12px; font-weight:400" :class="[ parseFloat(scoringLookup[player.id].gameSecondsRemaining) < 3600 ? 'q-btn-flat text-primary' : 'q-btn-outline bg-white text-primary', 'q-item-avatar']">BN</q-btn>
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
            <q-card class="compact-card bg-white">
              <q-card-title>
                Injured Reserve
              </q-card-title>
              <q-card-separator />
              <div class="card-main bg-white">
                <q-item separator v-for="player in injuredReserve" :key="player.id">
                  <q-btn round small outline color="primary" style="font-size: 14px; font-weight:400" class="q-item-avatar">IR</q-btn>
                  <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
                  <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'https://sports.cbsimg.net/images/nfl/logos/100x100/' + playerLookup[player.id].team + '.png'" />
                  <div @click="goPlayer(player.id)" class="q-item-main q-item-section team-players">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}}<small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                    <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span></div>
                  </div>
                  <q-item-side right>-</q-item-side>
                </q-item>
              </div>
            </q-card>
            <q-card class="compact-card bg-white">
              <q-card-title>
                Taxi Squad
              </q-card-title>
              <q-card-separator />
              <div class="card-main bg-white">
                <q-item separator v-for="player in taxiSquad" :key="player.id">
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
    <q-modal class="player-modal" ref="layoutModal" transition="slide-fade" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-modal-layout v-if="modalPlayer" class="player-header">
        <q-toolbar class= "bg-blue-grey-9 text-white" slot="header">
          <q-btn flat @click="$refs.layoutModal.close()">
            <q-icon name="arrow_back" />
          </q-btn>
        </q-toolbar>
        <div class="player-info bg-blue-grey-9 text-white row reverse items-center">
          <ul class="col-6 player-info-list">
            <li>Team: <span>{{playerLookup[modalPlayer].team}} #{{playerLookup[modalPlayer].jersey}}</span></li>
            <li>HT/WT: <span>{{parseInt(playerLookup[modalPlayer].height / 12)}}'{{playerLookup[modalPlayer].height % 12}}"/{{playerLookup[modalPlayer].weight}}lbs</span></li>
            <li>Age: <span>{{(new Date(Date.now()).getFullYear() - new Date(playerLookup[modalPlayer].birthdate * 1000).getFullYear())}}</span></li>
            <li>Exp: <span>{{new Date(Date.now()).getFullYear() - playerLookup[modalPlayer].draft_year}}</span><span v-if="playerLookup[modalPlayer].status === 'R'">({{playerLookup[modalPlayer].status}})</span></li>
            <li>College: <span>{{playerLookup[modalPlayer].college}}</span></li>
          </ul>
          <div class="col-6">
            <div class="row justify-center">
              <img class="player-img" :src="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[modalPlayer].cbs_id + '.jpg'" alt="">
            </div>
          </div>
        </div>
        <div class="player-actions pull-right">
          <q-fab
            color="primary"
            icon="compare_arrows"
            direction="down"
          >
            <q-fab-action
              color="red"
              icon="remove"
            />
            <q-fab-action
              color="blue"
              icon="local_hospital"
            />
          </q-fab>
        </div>
        <div class="player-name-main q-toolbar-title">
          {{playerLookup[modalPlayer].name.split(', ').reverse().join(' ')}}
          <div class="q-toolbar-subtitle">{{playerLookup[modalPlayer].position}}</div>
        </div>
        <q-tabs inverted class="secondary-tabs">
          <q-tab default slot="title" name="tab-1" label="News" />
          <q-tab slot="title" name="tab-2" label="Game Log"/>
        </q-tabs>
      </q-modal-layout>
    </q-modal>
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
  QPullToRefresh,
  QCardTitle,
  QCardSeparator,
  QToolbar,
  QSearch,
  QIcon,
  QModal,
  QModalLayout,
  QFab,
  QFabAction
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi } from '../data'

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
    QCardSeparator,
    QToolbar,
    QSearch,
    QIcon,
    QModal,
    QModalLayout,
    QFab,
    QFabAction
  },
  data () {
    return {
      response: null,
      dataLoaded: true,
      newWeek: '',
      modalPlayer: '',
      search: ''
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
      fullNflSchedule: 'fullNflSchedule',
      pointsAllowed: 'pointsAllowed',
      currentWeek: 'currentWeek'
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
      var weekNumb = this.currentWeek - 1
      this.fullNflSchedule.nflSchedule[weekNumb].matchup.forEach((el, i) => {
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
      var starters = []
      var players = []
      this.myScoring[0].players.player.forEach(el => {
        if (el.status === 'starter') {
          players.push(el.id)
        }
      })
      this.positions.forEach((elarray) => {
        elarray.forEach((elPos) => {
          players.some((elId) => {
            if (this.playerLookup[elId].position === elPos) {
              var index = players.indexOf(elId)
              players.splice(index, 1)
              var position = elarray.length > 1 ? elarray.map((pos) => pos[0]).join('/') : elPos
              var obj = {
                id: this.playerLookup[elId].id,
                position: position
              }
              starters.push(obj)
            }
            return this.playerLookup[elId].position === elPos
          })
        })
      })
      return starters
    },
    bench () {
      var bench = []
      this.myScoring[0].players.player.forEach(el => {
        if (el.status === 'nonstarter') {
          var obj = {
            id: el.id
          }
          bench.push(obj)
        }
      })
      return bench
    },
    taxiSquad () {
      var taxiSquad = []
      this.rosterLookup[this.myTeam].player.forEach(el => {
        if (el.status === 'TAXI_SQUAD') {
          var obj = {
            id: el.id
          }
          taxiSquad.push(obj)
        }
      })
      return taxiSquad
    },
    injuredReserve () {
      var injuredReserve = []
      this.rosterLookup[this.myTeam].player.forEach(el => {
        if (el.status === 'INJURED_RESERVE') {
          var obj = {
            id: el.id
          }
          injuredReserve.push(obj)
        }
      })
      return injuredReserve
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
      var kick = []
      var def = []
      var n = 0
      var m = 0
      this.league.starters.position.forEach((el) => {
        var min = 0
        var max = 0
        if (el.limit === '1' && el.name === 'Def') {
          def[0] = new Array(0)
          def[0].push(el.name)
        }
        else if (el.limit === '1' && el.name === 'K') {
          kick[0] = new Array(0)
          kick[0].push(el.name)
        }
        else if (el.limit.indexOf('-')) {
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
      var positions = pos.concat(flex, kick, def)
      return positions
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    goPlayer (id) {
      this.$router.push('/player/' + id)
    },
    goPlayerModal (id) {
      this.modalPlayer = id
      this.$refs.layoutModal.open()
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
      callApi()
      done()
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
.q-item.q-item-separator
  border-color #eaeaea
.secondary-tabs .q-chip
  min-height 16px
  font-size 10px
  padding-left 8px
  padding-right 8px
  right 40px
  top 10px
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s ease;
}
.slide-fade-enter, .slide-fade-leave-to
{
  transform: translateX(100%);
}
.player-header .layout-header
  box-shadow none
.player-info
  padding-bottom 30px
.player-info-list
  list-style none
  padding-left 0
  font-weight 500
.player-info-list span
  font-weight 300
.player-info .player-img
  border-radius 50%
  border 2px solid
  background #fff
.player-actions
  margin-top -28px
  margin-right 50px
  position fixed
  right 0
.player-name-main
  padding 12px
  font-size 24px
  font-weight 300
.player-name-main .q-toolbar-subtitle
  font-size 18px
  font-weight 500
.player-modal .secondary-tabs .active
  background #3f51b5
  color white
.player-modal .secondary-tabs .q-tabs-bar
  display none
.player-modal .secondary-tabs
 border 2px solid #3f51b5
 border-radius 8px
 margin 8px
.player-modal .secondary-tabs .q-tab
  min-height 30px
.player-modal .q-tabs-head
  min-height 38px
</style>