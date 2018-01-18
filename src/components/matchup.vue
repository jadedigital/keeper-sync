<template>
  <q-pull-to-refresh :handler="refresher" class="matchup">
    <q-tabs inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="My Matchup" />
      <q-tab slot="title" name="tab-2" label="All Matchups"/>
      <!-- Targets -->
      <div class="contain-main">
        <q-tab-pane class="no-pad no-border" name="tab-1">
          <b-matchup/>
        </q-tab-pane>
        <q-tab-pane class="no-pad no-border all-matchups" name="tab-2">
          <q-list
            v-for="(match, key) in liveScoring.matchup"
            :key="key"
          >
            <q-item 
              v-for="(team, key2) in match.franchise"
              :key="key2"
            >
              <q-item-side :avatar="teamLookup[team.id].icon ? teamLookup[team.id].icon : './statics/avatar.jpg'" />
              <q-item-main :label="teamLookup[team.id].name" />
              <q-item-side right>
                <q-item-tile :class="winners[team.id] === true ? 'strong text-dark' : 'text-dark'">
                  {{team.score}}
                </q-item-tile>
              </q-item-side>
            </q-item>
          </q-list>
          <div class="separator-title text-center border-bottom uppercase">Bye Week</div>
          <q-list class="bye">
            <q-item 
              v-for="(match, key) in liveScoring.franchise"
              :key="key"
              class="border-bottom"
            >
              <q-item-side :avatar="teamLookup[match.id].icon ? teamLookup[match.id].icon : './statics/avatar.jpg'" />
              <q-item-main :label="teamLookup[match.id].name" />
              <q-item-side right>
                <q-item-tile class="text-dark">
                  {{match.score}}
                </q-item-tile>
              </q-item-side>
            </q-item>
          </q-list>
        </q-tab-pane>
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
  QPullToRefresh,
  QCardTitle,
  QCardSeparator,
  QToolbar,
  QSearch,
  QIcon,
  QModal,
  QModalLayout,
  QFab,
  QItemTile,
  QFabAction
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi } from '../data'
import bMatchup from './bMatchup.vue'

export default {
  name: 'matchup',
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
    QItemTile,
    QFabAction,
    bMatchup
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
      league: 'league',
      liveScoring: 'liveScoring',
      matchupTeams: 'matchupTeams'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    winners () {
      var obj = {}
      this.liveScoring.matchup.forEach(el => {
        el.franchise[0].score > el.franchise[1].score ? obj[el.franchise[0].id] = true : obj[el.franchise[0].id] = false
        el.franchise[0].score < el.franchise[1].score ? obj[el.franchise[1].id] = true : obj[el.franchise[1].id] = false
      })
      return obj
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    setTeams () {
      var myTeam = this.leagueData[this.activeLeague].teamId
      var array = []
      var opponent = ''
      this.liveScoring.matchup.forEach((el) => {
        el.franchise.forEach((el2) => {
          if (el2.id === myTeam) {
            array.push(el)
          }
        })
      })
      array.forEach(el => {
        el.franchise.forEach((el2) => {
          if (el2.id !== myTeam) {
            opponent = el2.id
          }
        })
      })
      this.$store.commit('SET_DATA', {type: 'matchupTeams', data: {teamA: myTeam, teamB: opponent}})
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    refresher (done) {
      callApi()
      done()
    }
  },
  created () {
    this.setTeams()
  }
}
</script>

<style lang="stylus">
.matchup-header
  height 100px
.matchup-header .team-name
  font-size 14px
  padding-bottom 4px
.matchup-header .q-item-avatar
  margin-left 10px
  margin-right 10px
.matchup-header .total-score
  font-weight 700
  font-size 18px
.separator-title
  padding 4px 0
  font-size 12px
  font-weight 300
.matchup-list
  font-size 12px
.matchup-list .list-item
  height 48px
  padding 6px 4px
.matchup-list .team-name
  font-size 14px
  font-weight 500
  padding-bottom 2px
.team-name-container
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.matchup-list .team
  display inline
  font-weight 300
  font-size 12px
.matchup-list .team-score
  font-size 14px
  font-weight 500
  padding-bottom 2px
.matchup-list .team-projection
  font-size 12px
  font-weight 300
.matchup-list .team-matchup
  font-size 12px
  font-weight 300
  white-space nowrap
.position-list .positions
  height 48px
  text-align center
  font-size 9px
  font-weight 500
.matchup .col-5
  max-width 45%
  flex 0 0 45%
.matchup .col-2
  max-width 10%
  flex 0 0 10%
.matchup .q-tabs-panes
  background #fff
</style>
