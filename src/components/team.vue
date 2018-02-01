<template>
  <q-pull-to-refresh :handler="refresher" class="team">
    <q-tabs inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="Roster" />
      <q-tab slot="title" name="tab-2" label="Draft Picks" />
      <q-tab count="2" slot="title" name="tab-3" label="Pending Moves"/>
      <!-- Targets -->
      <div v-if="!dataLoaded" style="height: calc(100vh - 112px);">  
        <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
      </div>
      <div v-if="dataLoaded" class="contain-main">
        <q-tab-pane class="no-pad no-border" name="tab-1">
          <b-team :thisTeam="myTeam"/>
        </q-tab-pane>
        <q-tab-pane name="tab-2" class="draft-picks no-border no-padding">
          <q-list
            v-for="(year, key) in pickYears"
            :key="key"
            highlight
            class="no-border"
          >
            <q-list-header class="text-center bg-grey-2 border-bottom">{{year}}</q-list-header>
            <q-item
              v-for="(pick, key) in myPicksPerYear[year]" 
              :key="key"
              class="border-bottom"
            >
              <q-item-main 
                :label="'Round ' + pick.round"
              >
                <q-item-tile class="owner">
                  Original owner: <span>{{teamLookup[pick.originalPickFor].name}}</span>
                </q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-tab-pane>
        <q-tab-pane name="tab-3">Roster Alerts</q-tab-pane>
      </div>
    </q-tabs>
  </q-pull-to-refresh>
</template>

<script>
import {
  QBtn,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
  QItemSeparator,
  QRouteTab,
  QTabs,
  QTab,
  QTabPane,
  QCard,
  QPullToRefresh,
  QCardTitle,
  QCardSeparator,
  QToolbar,
  QSearch,
  QIcon,
  QSpinner,
  LocalStorage
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi, loadData } from '../data'
import bTeam from './bTeam.vue'

export default {
  name: 'team',
  components: {
    QBtn,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
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
    QSpinner,
    bTeam
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      newWeek: '',
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
      currentWeek: 'currentWeek',
      futureDraftPicks: 'futureDraftPicks'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    draftPicksLookup () {
      var array = this.futureDraftPicks.franchise
      return this.lookup(array, 'id')
    },
    myPicks () {
      var myPicks = this.draftPicksLookup[this.myTeam]
      var arr = []
      var obj = {}
      myPicks.futureDraftPick.forEach(el => {
        obj = {
          round: el.round,
          year: el.year,
          originalPickFor: el.originalPickFor
        }
        arr.push(obj)
      })
      arr = this.order(arr, 'year')
      return arr
    },
    pickYears () {
      var year = ''
      var arr = []
      this.myPicks.forEach(el => {
        if (year !== el.year) {
          arr.push(el.year)
        }
        year = el.year
      })
      return arr
    },
    myPicksPerYear () {
      var mainObj = {}
      var obj = {}
      var arr = []
      this.pickYears.forEach(el => {
        this.myPicks.forEach(el2 => {
          if (el2.year === el) {
            obj = {
              round: el2.round,
              originalPickFor: el2.originalPickFor
            }
            arr.push(obj)
            mainObj[el] = arr
          }
        })
        mainObj[el] = this.order(mainObj[el], 'round')
        arr = []
      })
      return mainObj
    }
  },
  methods: {
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
    refresher (done) {
      callApi(this.currentWeek)
      done()
    },
    fetchData () {
      if (LocalStorage.has('futureDraftPicks')) {
        var data = [
          'futureDraftPicks'
        ]
        loadData(data)
        this.dataLoaded = true
      }
      else {
        var futureDraftPicksParams = {
          cookie: this.leagueData[this.activeLeague].cookie,
          host: this.leagueData[this.activeLeague].host,
          TYPE: 'futureDraftPicks',
          L: this.activeLeague,
          JSON: 1
        }
        var request = [
          {
            type: 'futureDraftPicks',
            params: futureDraftPicksParams,
            timeOut: 3600000
          }
        ]
        callApi('', request)
          .then((response) => {
            this.dataLoaded = true
          })
      }
    },
    setTeam () {
      this.dataLoaded = true
    }
  },
  created () {
    setTimeout(this.fetchData, 500)
  }
}
</script>

<style lang="stylus">
@import '~variables'
.team .draft-picks .q-item
  font-size 14px
  background-color #fff
.team .draft-picks .q-item-label
  color $primary
.team .draft-picks .owner span
  font-weight 500
.team .draft-picks .q-list
  margin 0
  padding 0
.team .draft-picks .q-list-header
  font-size 14px
  font-weight 300
  padding 0
  line-height 2rem
  color #0c0c0c
.team .injury
  display inline
.team .team-player-name
  display inline
  overflow hidden 
  -webkit-box-orient vertical
.team-layout .injury
  display inline
.team-layout .team-player-name
  display inline
  overflow hidden 
  -webkit-box-orient vertical
</style>

