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
        :style="'color: rgba(255, 255, 255,' + opacity + ')'"
      >
        {{playerLookup[activePlayer].name.split(', ').reverse().join(' ')}}
        <span slot="subtitle">
          {{playerLookup[activePlayer].position}}
        </span>
      </q-toolbar-title>
    </q-toolbar>

    <div style="height: calc(100vh); background-color: #fff;">
      <div class="player-modal player-header">
        <div ref="playerBg" class="player-bg-pic" :style="{background: 'url(./statics/' + teamMap[playerLookup[activePlayer].team] + '.svg) no-repeat center'}">
          <div class="bg-gradient-opacity">
            <div class="player-info text-white row reverse items-center">
              <ul class="col-6 player-info-list">
                <li>Team: <span>{{playerLookup[activePlayer].team}} #{{playerLookup[activePlayer].jersey}}</span></li>
                <li>HT/WT: <span>{{parseInt(playerLookup[activePlayer].height / 12)}}'{{playerLookup[activePlayer].height % 12}}"/{{playerLookup[activePlayer].weight}}lbs</span></li>
                <li>Age: <span>{{(new Date(Date.now()).getFullYear() - new Date(playerLookup[activePlayer].birthdate * 1000).getFullYear())}}</span></li>
                <li>Exp: <span>{{new Date(Date.now()).getFullYear() - playerLookup[activePlayer].draft_year}}</span><span v-if="playerLookup[activePlayer].status === 'R'">({{playerLookup[activePlayer].status}})</span></li>
                <li>College: <span>{{playerLookup[activePlayer].college}}</span></li>
              </ul>
              <div class="col-6">
                <div class="row justify-center">
                  <img class="player-img" :src="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[activePlayer].cbs_id + '.jpg'" alt="">
                </div>
              </div>
            </div>
            <div class="player-name-main q-toolbar-title text-white">
              {{playerLookup[activePlayer].name.split(', ').reverse().join(' ')}}
              <div class="q-toolbar-subtitle">{{playerLookup[activePlayer].position}}</div>
            </div>
          </div>
        </div>
        <q-tabs inverted class="secondary-tabs">
          <q-tab default slot="title" name="tab-1" label="News" />
          <q-tab slot="title" name="tab-2" label="Game Log"/>
          <q-tab-pane class="no-pad no-border news" name="tab-1">
            <q-spinner 
              v-if="!dataLoaded" 
              color="primary" 
              size="40px" 
              class="absolute-center" 
              style="margin-left: -20px;"
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

  </q-layout>
</template>

<script>
import {
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
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
import { getPlayerNews, getPlayerStats } from '../data'

export default {
  name: 'player',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
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
    QItemTile
  },
  data () {
    return {
      dataLoaded: false,
      statsLoaded: false,
      playerNews: [],
      playerStats: [],
      player: '',
      opacity: 0,
      headerShadow: false
    }
  },
  computed: {
    ...mapGetters({
      players: 'players',
      leagueData: 'leagueData',
      activeLeague: 'activeLeague',
      activePlayer: 'activePlayer',
      teamMap: 'teamMap',
      league: 'league'
    }),
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    playerStatsHeader () {
      return this.playerStats[0]
    },
    playerStatsBody () {
      const array = [...this.playerStats]
      array.splice(0, 1)
      return array
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
    }
  },
  activated () {
    this.dataLoaded = false
    this.statsLoaded = false
    if (this.activePlayer !== this.player) {
      this.fetchData()
    }
    else {
      this.dataLoaded = true
      this.statsLoaded = true
    }
    this.player = this.activePlayer
    this.opacity = 0
    this.headerShadow = false
  },
  deactivated () {
    this.dataLoaded = false
    this.statsLoaded = false
  }
}
</script>

<style lang="stylus">
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
</style>

