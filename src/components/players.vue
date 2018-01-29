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
          @focus="overlay = true"
          v-model="positionFilter"
          :options="selectOptions"
          title="Positions"
          float-label="Positions"
        />
        <q-select
          v-model="statusFilter"
          float-label="Status"
          @focus="overlay = true"
          @change="overlay = false"
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
          <div class="q-table">
            <div class="row header-row border-bottom">
              <div @click="sort('projected')"  nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'projected'}">Proj</div>
              <div @click="sort('fpts')"  nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'fpts'}">FPts</div>
              <div @click="sort('added')" nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'added'}">% Added</div>
              <div @click="sort('owned')" nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'owned'}">% Owned</div>
              <div @click="sort('started')" nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'started'}">% Started</div>
              <div @click="sort('dropped')" nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'dropped'}">% Dropped</div>
            </div>
            <div 
              class="border-bottom main-row"
              v-for="player in playersSorted"
              :key="player.id"
              :class="{'active': selectedPlayer === player.id}"
              @click="goToPlayer(player.id)"
            >
              <div class="row text-left col-pad name-row">
                <q-item separator class="col-12">
                  <q-btn round small outline color="primary" style="font-size: 14px; font-weight:400; margin-right: 20px;" class="q-item-avatar">+</q-btn>
                  <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
                  <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'./statics/' + teamMap[playerLookup[player.id].team] + '.svg'" />
                  <div class="q-item-main q-item-section team-players">
                    <div class="q-item-label" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}}. {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}}<small> {{playerLookup[player.id].team}}  -  {{playerLookup[player.id].position}}</small></div>
                    <div v-if="playerLookup[player.id].team !== 'FA*'" class="q-item-sublabel" style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span v-if="matchupPositions.indexOf(playerLookup[player.id].position) !== -1" :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}} ({{matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rankPretty}})</span><span v-if="matchupPositions.indexOf(playerLookup[player.id].position) === -1">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}}</span></div>
                  </div>
                </q-item>
              </div>
              <div class="row stat-row">
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'projected'}">{{player.projected}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'fpts'}">{{player.fpts}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'added'}">{{player.added}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'owned'}">{{player.owned}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'started'}">{{player.started}}</div>
                <div nowrap class="text-center col-2" :class="{'text-red': colSortKey === 'dropped'}">{{player.dropped}}</div>
              </div>
            </div>
            <div class=" row fa-table-footer">
              <div class="text-center text-primary col-12">
                <i>Load more</i>
                <q-btn @click="loadMore" class="load-more" round small color="primary" icon="keyboard_arrow_down"></q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>
    <div 
      :class="overlay ? 'overlay' : ''"
      @click="overlay = false"
    >
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
      dataLoaded: false,
      colSortKey: 'projected',
      limit: 10,
      query: '',
      queryColumn: 'name',
      positionFilter: [],
      statusFilter: 'fa',
      playersDetails: [],
      overlay: false,
      selectedPlayer: '',
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
      topDrops: 'topDrops',
      topStarters: 'topStarters',
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
    droppedLookup () {
      var array = this.topDrops.player
      return this.lookup(array)
    },
    startedLookup () {
      var array = this.topStarters.player
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
    goToPlayer (id) {
      this.selectedPlayer = id
      this.$store.commit('SET_DATA', {type: 'activePlayer', data: id})
      this.$router.push('/player')
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
          obj['dropped'] = (this.droppedLookup[el.id] ? parseFloat(this.droppedLookup[el.id].percent) : 0)
          obj['started'] = (this.startedLookup[el.id] ? parseFloat(this.startedLookup[el.id].percent) : 0)
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
    },
    fetchData () {
      var playerScoresParams = {
        cookie: this.leagueData[this.activeLeague].cookie,
        host: this.leagueData[this.activeLeague].host,
        TYPE: 'playerScores',
        L: this.activeLeague,
        W: 'YTD',
        JSON: 1
      }
      var topDropsParams = {
        cookie: this.leagueData[this.activeLeague].cookie,
        host: this.leagueData[this.activeLeague].host,
        TYPE: 'topDrops',
        JSON: 1
      }
      var topStartersParams = {
        cookie: this.leagueData[this.activeLeague].cookie,
        host: this.leagueData[this.activeLeague].host,
        TYPE: 'topStarters',
        JSON: 1
      }
      var request = [
        {
          type: 'playerScores',
          params: playerScoresParams,
          timeOut: 3600000
        },
        {
          type: 'topDrops',
          params: topDropsParams,
          timeOut: 3600000
        },
        {
          type: 'topStarters',
          params: topStartersParams,
          timeOut: 3600000
        }
      ]
      callApi('', request)
        .then((response) => {
          this.loadPlayersDetails()
          this.dataLoaded = true
        })
    }
  },
  created () {
    setTimeout(this.fetchData, 500)
  },
  activated () {
    this.limit = 10
    this.selectedPlayer = ''
  }
}
</script>

<style lang="stylus">
.players .main-row
  padding 8px 0
.players .header-row
  font-weight 700
  text-align center
  padding 6px 0
.players .stat-row
  padding-top 6px
.players .q-table .q-item
  padding 0
.players .q-table .q-item-label
  font-weight 500
  font-size 14px
.players .q-table .q-item-sublabel
  font-weight 300
  font-size 12px
.players .q-table
  font-size 12px
  width 100%
.players .q-table .active
  background-color #ccc
.players .col-pad
  padding-left 12px!important
  padding-right 12px!important
.players .sortable span
  font-size 10px
.players .load-more
  margin-left calc(50% - 20px)
  margin-top 10px
  display block
.players .card-main.no-overflow
  overflow initial
.players .fa-table-footer
  font-size 14px
  font-weight 400
  width 100%
  padding 6px 0  
.players.contain-main
  padding-bottom 82px
.players .players-spinner
  position relative
  left 50%
  margin 100px 0 100px -20px
.players .list-enter-active, .list-leave-active {
  transition: all 0.2s;
}
.players .list-enter, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.players .q-collapsible .q-item-division
  padding 5px 16px
</style>
