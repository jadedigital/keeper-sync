<template>
  <q-layout
    @scroll="scrollHandler"
    ref="layout"
    view="hHh lpr fff"
    :class="[headerShadow ? 'header-shadow' : 'no-header-shadow', 'player-layout']"
  >
    <q-toolbar :style="'background: linear-gradient(141deg, rgba(61, 90, 254,' + opacity + ') 15%, rgba(61, 90, 254, ' + opacity + ') 100%);'" slot="header">
      <q-btn flat>
        <q-icon @click="goBack" name="arrow_back" />
      </q-btn>

      <q-toolbar-title
        v-if="activePlayer"
        :style="'color: rgba(255, 255, 255,' + (opacity - (1.0 - opacity)) + ')'"
      >
        {{playerLookup[activePlayer].name.split(', ').reverse().join(' ')}}
        <span slot="subtitle">
          {{playerLookup[activePlayer].position}}
        </span>
      </q-toolbar-title>
    </q-toolbar>

    <div style="height: calc(100vh); background-color: #fff;">
      <div class="player-modal player-header">
        <div v-if="activePlayer" ref="playerBg" class="player-bg-pic" :style="{background: 'url(./statics/' + teamMap[playerLookup[activePlayer].team] + '.svg) no-repeat center'}">
          <div class="bg-gradient-opacity">
            <div class="player-info text-white row reverse items-center">
              <ul class="col-6 player-info-list" :style="{'opacity': 1 - opacity}">
                <li class="ellipsis">Team: <span>{{playerLookup[activePlayer].team}} #{{playerLookup[activePlayer].jersey}}</span></li>
                <li class="ellipsis">HT/WT: <span>{{parseInt(playerLookup[activePlayer].height / 12)}}'{{playerLookup[activePlayer].height % 12}}"/{{playerLookup[activePlayer].weight}}lbs</span></li>
                <li class="ellipsis">Age: <span>{{(new Date(Date.now()).getFullYear() - new Date(playerLookup[activePlayer].birthdate * 1000).getFullYear())}}</span></li>
                <li class="ellipsis">Exp: <span>{{new Date(Date.now()).getFullYear() - playerLookup[activePlayer].draft_year}}</span><span v-if="playerLookup[activePlayer].status === 'R'">({{playerLookup[activePlayer].status}})</span></li>
                <li class="ellipsis">College: <span>{{playerLookup[activePlayer].college}}</span></li>
                <li class="ellipsis">Owner: <span v-if="statusLoaded" v-html="playerStatus.status"></span></li>
              </ul>
              <div class="col-6">
                <div class="row justify-center" :style="{'opacity': 1 - opacity}">
                  <img class="player-img" :src="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[activePlayer].cbs_id + '.jpg'" alt="">
                </div>
              </div>
            </div>
            <div class="player-name-main q-toolbar-title text-white" :style="{'opacity': 1 - opacity}">
              {{playerLookup[activePlayer].name.split(', ').reverse().join(' ')}} <b-injury class="injury" :player="activePlayer" details></b-injury>
              <div class="q-toolbar-subtitle">{{playerLookup[activePlayer].position}}</div>
            </div>
          </div>
        </div>
        <q-tabs inverted class="secondary-tabs">
          <q-tab default slot="title" name="tab-1" label="News" />
          <q-tab slot="title" name="tab-2" label="Game Log"/>
          <div class="versus"><span class="strong">Upcoming: </span><b-versus v-if="activePlayer" class="b-versus" rank :player="activePlayer"></b-versus></div>
          <q-tab-pane class="no-pad no-border news" name="tab-1">
            <q-spinner 
              v-if="!dataLoaded" 
              color="primary" 
              size="40px" 
              class="absolute-center" 
              style="margin-left: -20px; margin-top: 100px;"
            />
            <q-list 
              v-if="dataLoaded"
              class="no-border"
            >
              <q-item
                v-for="news in playerNews"
                :key="news.rank"
              >
                <q-item-main>
                  <q-item-tile label>{{news.headline}}</q-item-tile>
                  <q-item-tile sublabel class="timestamp text-red">{{news.timestamp}}</q-item-tile>
                  <q-item-tile sublabel>{{news.body.replace(news.timestamp, '')}}<span class="text-primary" v-if="news.source" @click="launch(news.link)"> Source: {{news.source}}</span></q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
            <div 
              v-if="playerNews.length === 0 && dataLoaded"
              class="no-news"
            >
              No recent news
            </div>
          </q-tab-pane>
          <q-tab-pane class="no-pad no-border stat-pane" name="tab-2">
            <q-spinner 
              v-if="!statsLoaded" 
              color="primary" 
              size="40px" 
              class="absolute-center" 
              style="margin-left: -20px;"
            />
            <table 
              class="stat-table"
              v-if="statsLoaded"
            >
              <tbody>
                <tr>
                  <th
                    v-for="(stat, statKey) in playerStatsHeader"
                    :key="statKey"
                    :colspan="stat.colspan"
                  >
                    {{stat.value}}
                  </th>
                </tr>
                <tr 
                  v-for="(row, key) in playerStatsBody"
                  :key="key"
                  :class="[key % 2 === 0 ? 'even' : 'odd', key === 0 ? 'text-tertiary' : 'stat-body']"
                  class="border-bottom"
                >
                  <td 
                    v-for="(stat, statKey) in row"
                    :key="statKey"
                  >
                    {{stat.value}} 
                  </td>
                </tr>
              </tbody>
            </table>
          </q-tab-pane>
        </q-tabs>
      </div>
    </div>
    <div class="fixed-fab">
      <q-btn
        v-if="faLookup[activePlayer]"
        round
        icon="add"
        class="bg-green-13 shadow-5 text-white"
      />
      <q-fab
        v-if="teamLookup[myTeam].name === playerStatus.status"
        direction="left"
        icon="more_horiz"
        color="primary"
      >
        <button class="q-btn row inline flex-center q-focusable q-hoverable relative-position q-btn-round q-btn-small bg-light-blue-14 text-white"><div class="desktop-only q-focus-helper"></div><span class="q-btn-inner row col flex-center">TS</span></button>
        <button class="q-btn row inline flex-center q-focusable q-hoverable relative-position q-btn-round q-btn-small bg-green-14 text-white"><div class="desktop-only q-focus-helper"></div><span class="q-btn-inner row col flex-center">IR</span></button>
        <button class="q-btn row inline flex-center q-focusable q-hoverable relative-position q-btn-round q-btn-small bg-tertiary text-white"><div class="desktop-only q-focus-helper"></div><span class="q-btn-inner row col flex-center">DROP</span></button>
      </q-fab>
      <q-btn
        v-if="!faLookup[activePlayer] && teamLookup[myTeam].name !== playerStatus.status"
        round
        icon="swap_horiz"
        class="bg-primary shadow-5 text-white"
      />
    </div>
  </q-layout>
</template>

<script>
import {
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QFab,
  QFabAction,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemSeparator,
  QTabs,
  QTab,
  QRouteTab,
  QTabPane,
  QModal,
  QAutocomplete,
  QSearch,
  QFixedPosition,
  QTransition,
  QSpinner,
  QItemTile
} from 'quasar'
import { mapGetters } from 'vuex'
import { getPlayerNews, getPlayerStats, callApi } from '../data'
import bInjury from './bInjury.vue'
import bVersus from './bVersus.vue'

export default {
  name: 'player',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QFab,
    QFabAction,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemSeparator,
    QItemMain,
    QTabs,
    QTab,
    QRouteTab,
    QTabPane,
    QAutocomplete,
    QSearch,
    QFixedPosition,
    QModal,
    QTransition,
    QSpinner,
    QItemTile,
    bInjury,
    bVersus
  },
  data () {
    return {
      dataLoaded: false,
      statsLoaded: false,
      statusLoaded: false,
      playerNews: [],
      playerStats: [],
      activePlayer: '',
      lastPlayer: '',
      opacity: 0,
      headerShadow: false
    }
  },
  computed: {
    ...mapGetters({
      players: 'players',
      leagueData: 'leagueData',
      activeLeague: 'activeLeague',
      teamMap: 'teamMap',
      league: 'league',
      playerStatus: 'playerStatus',
      freeAgents: 'freeAgents'
    }),
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    faLookup () {
      var array = this.freeAgents.leagueUnit.player
      return this.lookup(array, 'id')
    },
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    playerStatsHeader () {
      return this.playerStats[0]
    },
    playerStatsBody () {
      const array = [...this.playerStats]
      array.splice(0, 1)
      return array
    },
    playerStatusParams () {
      var params = {
        cookie: this.leagueData[this.activeLeague].cookie,
        host: this.leagueData[this.activeLeague].host,
        TYPE: 'playerStatus',
        L: this.activeLeague,
        P: this.activePlayer,
        JSON: 1
      }
      return params
    },
    request () {
      var request = [
        {
          type: 'playerStatus',
          value: 'playerStatus',
          params: this.playerStatusParams,
          timeOut: 0
        }
      ]
      return request
    }
  },
  methods: {
    launch (url) {
      openURL(url, '_self')
    },
    scrollHandler (scroll) {
      var height = this.$refs.playerBg.clientHeight
      if (scroll.position === 0) {
        this.opacity = 0
      }
      else if (scroll.position > (height - 50)) {
        this.opacity = 1
      }
      else {
        this.opacity = scroll.position / (height - 50)
      }

      if (scroll.position > height - 2) {
        this.headerShadow = true
      }
      else {
        this.headerShadow = false
      }
    },
    lookup (array, id) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][id]] = array[i]
      }
      return lookup
    },
    goBack () {
      this.$router.go(-1)
    },
    fetchData () {
      var player = this.playerLookup[this.activePlayer].rotoworld_id
      getPlayerNews(player).then((response) => {
        this.playerNews = response.data
        this.dataLoaded = true
      })
      getPlayerStats(player).then((response) => {
        this.playerStats = response.data
        this.statsLoaded = true
      })
      callApi('', this.request).then((response) => {
        this.statusLoaded = true
      })
    }
  },
  activated () {
    this.activePlayer = this.$route.params.id
    this.dataLoaded = false
    this.statsLoaded = false
    if (this.activePlayer !== this.lastPlayer) {
      setTimeout(this.fetchData, 500)
    }
    else {
      this.dataLoaded = true
      this.statsLoaded = true
      this.statusLoaded = true
    }
    this.lastPlayer = this.$route.params.id
    this.opacity = 0
    this.headerShadow = false
  },
  deactivated () {
    this.dataLoaded = false
    this.statsLoaded = false
    this.statusLoaded = false
  }
}
</script>

<style lang="stylus">
.fixed-fab .q-fab-icon
  display flex!important
.fixed-fab .q-fab-active-icon
  display flex!important
.player-layout .news .timestamp
  font-weight 300
.player-layout .news .no-news
  text-align center
  padding 10px
.player-layout .layout-page-container
  padding-top 0!important
.player-layout .player-info
  padding-top 50px
.player-layout .stat-table
  padding-top 10px
  border-spacing 0
  font-size 14px
.player-layout .stat-table td
  padding 2px 6px
.player-layout .stat-table tr.stat-body
  font-weight 300
.player-layout .stat-table tr.odd
  background-color #ececec
.player-layout .stat-pane 
  overflow auto
  padding-bottom 20px
.player-layout .injury
  display inline
  font-size 16px
  font-weight 300
.player-layout .fixed-fab
  position fixed
  bottom 0
  right 0
  margin 18px
.player-layout .versus
  padding 20px 16px
.player-layout .b-versus
  display inline
</style>

