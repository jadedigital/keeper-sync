<template>
  <div class="contain-main">
    <q-search
      v-model="query"
      icon="search"
      float-label="Search free agents"
    />
    <q-select
      v-model="positionFilter"
      :options="selectOptions"
      multiple
      toggle
      chips
      float-label="Position"
      title="Positions"
    />
    <q-card class="compact-card">
      <q-card-title>
        Free Agents
      </q-card-title>
      <q-card-separator />
      <div class="card-main bg-white relative-position no-overflow">
        <table class="q-table horizontal-separator">
          <thead>
            <tr>
              <th @click="sort('projected')"  nowrap class="text-center" :class="{'text-red': colSortKey === 'projected'}">Proj</th>
              <th @click="sort('added')" nowrap class="text-center" :class="{'text-red': colSortKey === 'added'}">% Added</th>
              <th @click="sort('owned')" nowrap class="text-center" :class="{'text-red': colSortKey === 'owned'}">% Owned</th>
            </tr>
          </thead>
          <tbody v-for="player in playersSorted" :key="player.id">
            <tr>
              <td colspan="3" class="text-left col-pad team-name-main">
                <q-item separator>
                  <q-btn round small outline color="primary" style="font-size: 14px; font-weight:400" class="q-item-avatar">+</q-btn>
                  <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
                  <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'https://sports.cbsimg.net/images/nfl/logos/100x100/' + playerLookup[player.id].team + '.png'" />
                  <div class="q-item-main q-item-section team-players">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}}<small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                    <div v-if="playerLookup[player.id].team !== 'FA*'" class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span></div>
                  </div>
                </q-item>
              </td>
            </tr>
            <tr>
              <td nowrap class="text-center" :class="{'text-red': colSortKey === 'projected'}">{{player.projected}}</td>
              <td nowrap class="text-center" :class="{'text-red': colSortKey === 'added'}">{{player.added}}</td>
              <td nowrap class="text-center" :class="{'text-red': colSortKey === 'owned'}">{{player.owned}}</td>
            </tr>
          </tbody>
          <tfoot class="fa-table-footer">
            <tr>
              <td colspan="3" class="text-center">
                <i>Load more</i>
              </td>
            </tr>
          </tfoot>
        </table>
        <q-btn @click="loadMore" class="load-more" round small color="primary" icon="keyboard_arrow_down"></q-btn>
      </div>
    </q-card>
  </div>
</template>


<script>
import {
  openURL,
  QBtn,
  QDataTable,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemSeparator,
  QRouteTab,
  QTabPane,
  QCard,
  QCardTitle,
  QCardSeparator,
  QSearch,
  QSelect
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  components: {
    QBtn,
    QDataTable,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemSeparator,
    QRouteTab,
    QTabPane,
    QCard,
    QCardTitle,
    QCardSeparator,
    QSearch,
    QSelect
  },
  data () {
    return {
      response: null,
      colSortKey: 'projected',
      limit: 10,
      query: '',
      queryColumn: 'name',
      positionFilter: [],
      selectOptions: [
        {
          label: 'QB',
          value: 'qb'
        },
        {
          label: 'RB',
          value: 'rb'
        },
        {
          label: 'WR',
          value: 'wr'
        },
        {
          label: 'TE',
          value: 'te'
        },
        {
          label: 'Def',
          value: 'def'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      freeAgents: 'freeAgents',
      projectedScores: 'projectedScores',
      topAdds: 'topAdds',
      topOwns: 'topOwns',
      nflSchedule: 'nflSchedule',
      pointsAllowed: 'pointsAllowed'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array)
    },
    projectedLookup () {
      var array = this.projectedScores.playerScore
      return this.lookup(array)
    },
    addedLookup () {
      var array = this.topAdds.player
      return this.lookup(array)
    },
    ownedLookup () {
      var array = this.topOwns.player
      return this.lookup(array)
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
      obj['FA*'] = {
        vs: 'FA*',
        day: '',
        time: '',
        location: ''
      }
      return obj
    },
    playersSorted () {
      var list = []
      this.freeAgents.leagueUnit.player.forEach(el => {
        el['projected'] = (this.projectedLookup[el.id].score !== '' ? parseFloat(this.projectedLookup[el.id].score) : 0)
        el['added'] = (this.addedLookup[el.id] ? parseFloat(this.addedLookup[el.id].percent) : 0)
        el['owned'] = (this.ownedLookup[el.id] ? parseFloat(this.ownedLookup[el.id].percent) : 0)
        el['name'] = this.playerLookup[el.id].name
        el['team'] = this.playerLookup[el.id].team
        el['position'] = this.playerLookup[el.id].position
        list.push(el)
      })
      if (this.query) {
        list = this.findBy(list, this.query, this.queryColumn)
      }
      if (this.colSortKey) {
        list = this.order(list, this.colSortKey)
      }
      if (this.positionFilter[0]) {
        list = this.filter(list, this.positionFilter)
      }
      list = list.slice(0, this.limit)
      return list
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
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    lookup (array, key) {
      if (!key) {
        key = 'id'
      }
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    findBy (list, value, key) {
      return list.filter(function (el) {
        return String(el[key]).toLowerCase().includes(value.toLowerCase())
      })
    },
    order (list, key) {
      return list.sort((a, b) => {
        var x = a[key]; var y = b[key]
        return ((x < y) ? 1 : ((x > y) ? -1 : 0))
      })
    },
    filter (list, pos) {
      return list.filter(el => {
        return pos.indexOf(el['position'].toLowerCase()) !== -1
      })
    },
    sort (key) {
      this.colSortKey = key
    },
    loadMore () {
      this.limit += 10
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
      object['FA*'] = {
        points: '',
        rank: '',
        rankPretty: ''
      }
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
    }
  }
}
</script>

<style lang="stylus">
.sortable span
  font-size 10px
th.sortable
  text-align center
.q-data-table-toolbar.upper-toolbar .q-select
  display none
.load-more
  position absolute
  margin-left calc(50% - 20px)
  margin-top 10px
.card-main.no-overflow
  overflow initial
.fa-table-footer
  font-weight 300
.fa-table-footer
  width 100%
</style>
