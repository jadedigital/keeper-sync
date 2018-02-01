<template>
  <div class="team-child">
    <q-list link class="no-border no-pad bg-grey-1">
      <q-card class="compact-card bg-white">
        <q-card-title>
          Roster
        </q-card-title>
        <q-card-separator />
        <div class="card-main bg-white">
          <q-item link separator v-for="player in startersOld" :key="player.id" @click="goToPlayer(player.id)">
            <q-btn @click.stop="showAS(playerLookup[player.id].name)" round small style="font-size: 12px; font-weight:400" :class="[ parseFloat(scoringLookup[player.id].gameSecondsRemaining) < 3600 ? 'q-btn-flat text-primary' : 'q-btn-outline bg-white text-primary', 'q-item-avatar']">{{ player.position }}</q-btn>
            <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/60x80/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
            <div class="q-item-main q-item-section team-players">
              <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <b-injury class="injury" :player="player.id"></b-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
              <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span></div>
            </div>
            <div class="q-item-side q-item-side-right q-item-section">
              <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{scoringLookup[player.id].score}}</div>
              <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>{{ updatedProjection[player.id].projection }}</small></div>
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
          <q-item separator v-for="player in bench" :key="player.id" @click="goToPlayer(player.id)">
            <q-btn @click.stop="showAS(playerLookup[player.id].name)" round small style="font-size: 12px; font-weight:400" :class="[ parseFloat(scoringLookup[player.id].gameSecondsRemaining) < 3600 ? 'q-btn-flat text-primary' : 'q-btn-outline bg-white text-primary', 'q-item-avatar']">BN</q-btn>
            <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/60x80/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
            <div class="q-item-main q-item-section team-players">
              <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <b-injury class="injury" :player="player.id"></b-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
              <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span></div>
            </div>
            <div class="q-item-side q-item-side-right q-item-section">
              <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{scoringLookup[player.id].score}}</div>
              <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;"><small>{{ updatedProjection[player.id].projection }}</small></div>
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
          <q-item separator v-for="player in injuredReserve" :key="player.id" @click="goToPlayer(player.id)">
            <q-btn round small outline color="primary" style="font-size: 14px; font-weight:400" class="q-item-avatar">IR</q-btn>
            <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/60x80/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
            <div class="q-item-main q-item-section team-players">
              <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <b-injury class="injury" :player="player.id"></b-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
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
          <q-item separator v-for="player in taxiSquad" :key="player.id" @click="goToPlayer(player.id)">
            <q-btn round small outline color="primary" style="font-size: 14px; font-weight:400" class="q-item-avatar">TS</q-btn>
            <q-item-side class="player-avatar" :avatar="playerLookup[player.id].position === 'Def' ? './statics/' + teamMap[playerLookup[player.id].team] + '.svg' : playerLookup[player.id].cbs_id ? 'https://sports.cbsimg.net/images/football/nfl/players/60x80/' + playerLookup[player.id].cbs_id + '.jpg' : './statics/avatar.jpg'" />
            <div class="q-item-main q-item-section team-players">
              <div class="q-item-label team-player-name">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <b-injury class="injury" :player="player.id"></b-injury><small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
              <div class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span></div>
            </div>
            <q-item-side right>-</q-item-side>
          </q-item>
        </div>
      </q-card>
    </q-list>
  </div>
</template>

<script>
import {
  Toast,
  ActionSheet,
  QBtn,
  QList,
  QItem,
  QItemSide,
  QCard,
  QCardTitle,
  QCardSeparator
} from 'quasar'
import { mapGetters } from 'vuex'
import bInjury from './bInjury.vue'

export default {
  name: 'BTeam',
  components: {
    QBtn,
    QList,
    QItem,
    QItemSide,
    QCard,
    QCardTitle,
    QCardSeparator,
    bInjury
  },
  props: {
    thisTeam: String
  },
  data () {
    return {
      response: null
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
      currentWeek: 'currentWeek',
      teamMap: 'teamMap',
      displayTeam: 'displayTeam'
    }),
    rosterLookup () {
      var array = this.rosters.franchise
      return this.lookup(array, 'id')
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    projectedLookup () {
      var array = this.projectedScores.playerScore
      return this.lookup(array, 'id')
    },
    updatedProjection () {
      var obj = {}
      this.teamScoring.players.player.forEach(el => {
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
      var object = {}
      this.league.starters.position.forEach(el => {
        object[el.name] = this.matchupPointsUtil(el.name)
      })
      return object
    },
    teamScoring () {
      var scoring = ''
      this.liveScoring.matchup.forEach((el) => {
        el.franchise.forEach((el2) => {
          if (el2.id === this.thisTeam) {
            scoring = el2
          }
        })
      })
      if (this.liveScoring.franchise) {
        this.liveScoring.franchise.forEach((el) => {
          if (el.id === this.thisTeam) {
            scoring = el
          }
        })
      }
      return scoring
    },
    scoringLookup () {
      var array = this.teamScoring.players.player
      return this.lookup(array, 'id')
    },
    startersSorted () {
      var array = []
      var positions = this.positionsBasic
      this.teamScoring.players.player.forEach((el) => {
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
      var positions = this.positions
      var playerCheck = ''
      this.teamScoring.players.player.forEach(el => {
        if (el.status === 'starter') {
          players.push(el.id)
        }
      })
      positions.forEach((elarray) => {
        elarray.some((elPos) => {
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
            playerCheck = elId
            return this.playerLookup[elId].position === elPos
          })
          return this.playerLookup[playerCheck].position === elPos
        })
      })
      return starters
    },
    bench () {
      var bench = []
      this.teamScoring.players.player.forEach(el => {
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
      this.rosterLookup[this.thisTeam].player.forEach(el => {
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
      this.rosterLookup[this.thisTeam].player.forEach(el => {
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
    goToPlayer (id) {
      this.$store.commit('SET_DATA', {type: 'activePlayer', data: id})
      this.$router.push('/player')
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    order (list, key) {
      return list.sort((a, b) => {
        var x = parseInt(a[key]); var y = parseInt(b[key])
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
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
    }
  }
}
</script>

<style lang="stylus">
.team-child .q-item-side.player-avatar
  min-width 40px
  border-radius 50%
  overflow hidden
  height 40px
.team-child .q-item-side.player-avatar img
  width 30px
  height 40px
  border-radius 0
  margin 0 5px
</style>

