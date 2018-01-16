<template>
  <q-pull-to-refresh :handler="refresher">
    <div class="contain-main players">
      <q-collapsible 
        icon="filter_list"
        label="Filter Players"
        sublabel="by name, position, status"
        class="shadow-2"
      >
        <q-search
          v-model="query"
          icon="search"
          float-label="Filter by name"
        />
        <q-select
          multiple
          chips
          v-model="positionFilter"
          :options="selectOptions"
          title="Positions"
          float-label="Positions"
        />
        <q-select
          v-model="statusFilter"
          float-label="Status"
          radio
          :options="statusOptions"
        />
      </q-collapsible>
      <q-card class="compact-card">
        <q-card-title>
          {{statusFilter === 'fa' ? 'Free Agents' : 'All Players'}}
        </q-card-title>
        <q-card-separator />
        <q-spinner v-if="!dataLoaded" color="secondary" size="40px" class="players-spinner"/>
        <div v-if="dataLoaded" class="card-main bg-white relative-position no-overflow">
          <table class="q-table">
            <thead>
              <tr>
                <th @click="sort('projected')"  nowrap class="text-center" :class="{'text-red': colSortKey === 'projected'}">Proj</th>
                <th @click="sort('added')" nowrap class="text-center" :class="{'text-red': colSortKey === 'added'}">% Added</th>
                <th @click="sort('owned')" nowrap class="text-center" :class="{'text-red': colSortKey === 'owned'}">% Owned</th>
                <th @click="sort('fpts')"  nowrap class="text-center" :class="{'text-red': colSortKey === 'fpts'}">FPts</th>
                <th @click="sort('added')" nowrap class="text-center">% Added</th>
                <th @click="sort('owned')" nowrap class="text-center">% Owned</th>
              </tr>
            </thead>
            <tbody v-for="player in playersSorted" :key="player.id">
              <tr>
                <td colspan="6" class="text-left col-pad team-name-main">
                  <q-item separator>
                    <q-btn round small outline color="primary" style="font-size: 14px; font-weight:400; margin-right: 20px;" class="q-item-avatar">+</q-btn>
                    <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
                    <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'./statics/' + teamMap[playerLookup[player.id].team] + '.svg'" />
                    <div class="q-item-main q-item-section team-players">
                      <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}}<small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                      <div v-if="playerLookup[player.id].team !== 'FA*'" class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span v-if="matchupPositions.indexOf(playerLookup[player.id].position) !== -1" :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span><span v-if="matchupPositions.indexOf(playerLookup[player.id].position) === -1">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}}</span></div>
                    </div>
                  </q-item>
                </td>
              </tr>
              <tr>
                <td nowrap class="text-center" :class="{'text-red': colSortKey === 'projected'}">{{player.projected}}</td>
                <td nowrap class="text-center" :class="{'text-red': colSortKey === 'added'}">{{player.added}}</td>
                <td nowrap class="text-center" :class="{'text-red': colSortKey === 'owned'}">{{player.owned}}</td>
                <td nowrap class="text-center" :class="{'text-red': colSortKey === 'fpts'}">{{player.fpts}}</td>
                <td nowrap class="text-center">{{player.added}}</td>
                <td nowrap class="text-center">{{player.owned}}</td>
              </tr>
            </tbody>
            <tfoot class="fa-table-footer">
              <tr>
                <td colspan="6" class="text-center">
                  <i>Load more</i>
                </td>
              </tr>
            </tfoot>
          </table>
          <q-btn @click="loadMore" class="load-more" round small color="primary" icon="keyboard_arrow_down"></q-btn>
        </div>
      </q-card>
    </div>
  </q-pull-to-refresh>
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
  QCollapsible,
  QSelect,
  QPullToRefresh,
  QSpinner,
  LocalStorage
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi, getWeek } from '../data'

export default {
  name: 'players',
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
    QCollapsible,
    QSelect,
    QPullToRefresh,
    QSpinner
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      colSortKey: 'projected',
      limit: 10,
      query: '',
      queryColumn: 'name',
      positionFilter: [],
      statusFilter: 'fa',
      playersDetails: [],
      statusOptions: [
        {
          label: 'All Players',
          value: 'all'
        },
        {
          label: 'Free Agents',
          value: 'fa'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      league: 'league',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      freeAgents: 'freeAgents',
      projectedScores: 'projectedScores',
      topAdds: 'topAdds',
      topOwns: 'topOwns',
      fullNflSchedule: 'fullNflSchedule',
      pointsAllowed: 'pointsAllowed',
      currentWeek: 'currentWeek',
      playerScores: 'playerScores',
      endWeek: 'endWeek',
      teamMap: 'teamMap'
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
    ytdLookup () {
      var array = this.playerScores.playerScore
      return this.lookup(array)
    },
    faLookup () {
      var array = this.freeAgents.leagueUnit.player
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
      this.fullNflSchedule.nflSchedule[this.currentWeek].matchup.forEach((el, i) => {
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
      var list = this.playersDetails
      if (this.query) {
        list = this.findBy(list, this.query, this.queryColumn)
      }
      if (this.colSortKey) {
        list = this.order(list, this.colSortKey)
      }
      if (this.positionFilter[0]) {
        list = this.filter(list, 'position', this.positionFilter)
      }
      if (this.statusFilter === 'fa') {
        list = this.filter(list, 'status', ['fa'])
      }
      list = list.slice(0, this.limit)
      return list
    },
    matchupPoints () {
      var object = {}
      this.matchupPositions.forEach(el => {
        object[el] = this.matchupPointsUtil(el)
      })
      return object
    },
    matchupPositions () {
      var array = []
      this.pointsAllowed.team[0].position.forEach(el => {
        array.push(el.name)
      })
      return array
    },
    selectOptions () {
      var array = []
      this.league.starters.position.forEach(el => {
        var obj = {}
        obj['label'] = el.name
        obj['value'] = el.name.toLowerCase()
        array.push(obj)
      })
      return array
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
        return value.toLowerCase().split(' ').every(x => String(el[key]).toLowerCase().includes(x))
      })
    },
    order (list, key) {
      return list.sort((a, b) => {
        var x = parseFloat(a[key]); var y = parseFloat(b[key])
        return ((x < y) ? 1 : ((x > y) ? -1 : 0))
      })
    },
    filter (list, key, value) {
      return list.filter(el => {
        return value.indexOf(el[key].toLowerCase()) !== -1
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
    },
    refresher (done) {
      getWeek()
        .then((response) => {
          var week = Math.min(response, this.endWeek)
          LocalStorage.set('currentWeek', week)
          this.$store.commit('SET_DATA', {type: 'currentWeek', data: week})
          return callApi(week)
        })
        .then((response) => {
          done()
        })
    },
    loadPlayersDetails () {
      var list = []
      var playerArray = this.players.player
      playerArray.forEach(el => {
        if (this.matchupPositions.indexOf(this.playerLookup[el.id].position) !== -1) {
          var obj = {}
          obj['projected'] = (this.projectedLookup[el.id] && this.projectedLookup[el.id].score !== '' ? parseFloat(this.projectedLookup[el.id].score) : 0)
          obj['added'] = (this.addedLookup[el.id] ? parseFloat(this.addedLookup[el.id].percent) : 0)
          obj['owned'] = (this.ownedLookup[el.id] ? parseFloat(this.ownedLookup[el.id].percent) : 0)
          obj['name'] = this.playerLookup[el.id].name
          obj['team'] = this.playerLookup[el.id].team
          obj['position'] = this.playerLookup[el.id].position
          obj['fpts'] = (this.ytdLookup[el.id] ? this.ytdLookup[el.id].score : 0)
          obj['id'] = el.id
          obj['status'] = (this.faLookup[el.id] ? 'fa' : 'owned')
          list.push(obj)
        }
      })
      this.playersDetails = list
    }
  },
  created () {
    var playerScoresParams = {
      cookie: this.leagueData[this.activeLeague].cookie,
      host: this.leagueData[this.activeLeague].host,
      TYPE: 'playerScores',
      L: this.activeLeague,
      W: 'YTD',
      JSON: 1
    }
    var request = [
      {
        type: 'playerScores',
        params: playerScoresParams,
        timeOut: 3600000
      }
    ]
    callApi('', request)
      .then((response) => {
        this.loadPlayersDetails()
        this.dataLoaded = true
      })
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
.contain-main.players
  padding-bottom 122px
.players-spinner
  position relative
  left 50%
  margin 100px 0 100px -20px
.list-enter-active, .list-leave-active {
  transition: all 0.2s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.players .q-collapsible .q-item-division
  padding 5px 16px
</style>
