<template>
  <q-pull-to-refresh :handler="refresher" class="matchup">
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px)">
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <q-tabs v-if="dataLoaded" inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="My Matchup" />
      <q-tab slot="title" name="tab-2" label="All Matchups"/>
      <!-- Targets -->
      <div class="contain-main">
        <q-dialog-select
          align="center"
          title="Select Week"
          v-model="weekSelect"
          :options="weekOptions"
          @change="changeWeek(weekSelect)"
        />
        <q-tab-pane class="no-pad no-border" name="tab-1">
          <div v-if="byeWeek">
            Bye Week
          </div>
          <b-matchup v-if="!byeWeek"/>
        </q-tab-pane>
        <q-tab-pane class="no-pad no-border all-matchups" name="tab-2">
          <div>
            <q-list
              v-for="(match, key) in displayScoring.matchup"
              :key="key"
              @click="goToMatchup(match.franchise, key)"
            >
              <div :class="{'bg-grey-4': selectedMatchup === key}">
                <q-item 
                  v-for="(team, key2) in match.franchise"
                  :key="key2"
                >
                  <q-item-side :avatar="teamLookup[team.id].icon ? teamLookup[team.id].icon : './statics/avatar.jpg'" />
                  <q-item-main 
                    :label="teamLookup[team.id].name"
                    :sublabel="standingsLookup[team.id].h2hw + '-' + standingsLookup[team.id].h2hl + '-' + standingsLookup[team.id].h2ht"
                  />
                  <q-item-side right>
                    <q-item-tile :class="winners[team.id] === true ? 'strong text-dark' : 'text-dark'">
                      {{team.score}}
                    </q-item-tile>
                  </q-item-side>
                </q-item>
              </div>
            </q-list>
            <div v-if="displayScoring.franchise" class="separator-title text-center border-bottom uppercase">Bye Week</div>
            <q-list class="bye">
              <q-item
                link
                v-for="(match, key) in displayScoring.franchise"
                :key="key"
                class="border-bottom"
                @click="goToTeam(match.id)"
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
          </div>
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
  QFabAction,
  QDialogSelect,
  QSpinner
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
    QDialogSelect,
    QSpinner,
    bMatchup
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      newWeek: '',
      modalPlayer: '',
      search: '',
      weekSelect: '',
      byeWeek: false,
      selectedMatchup: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      league: 'league',
      liveScoring: 'liveScoring',
      matchupLiveScoring: 'matchupLiveScoring',
      matchupTeams: 'matchupTeams',
      currentWeek: 'currentWeek',
      leagueStandings: 'leagueStandings'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    standingsLookup () {
      var array = this.leagueStandings.franchise
      return this.lookup(array, 'id')
    },
    displayScoring () {
      if (this.matchupLiveScoring) {
        return this.matchupLiveScoring
      }
      else {
        return this.liveScoring
      }
    },
    winners () {
      var obj = {}
      this.displayScoring.matchup.forEach(el => {
        parseFloat(el.franchise[0].score) > parseFloat(el.franchise[1].score) ? obj[el.franchise[0].id] = true : obj[el.franchise[0].id] = false
        parseFloat(el.franchise[0].score) < parseFloat(el.franchise[1].score) ? obj[el.franchise[1].id] = true : obj[el.franchise[1].id] = false
      })
      return obj
    },
    weekOptions () {
      var options = []
      var obj = {}
      var endWeek = this.currentWeek
      for (let index = 1; index <= endWeek; index++) {
        obj = {
          label: 'Week ' + index,
          value: index
        }
        options.push(obj)
      }
      return options
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
      this.displayScoring.matchup.forEach((el) => {
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
      if (!opponent) {
        this.byeWeek = true
      }
      else {
        this.byeWeek = false
      }
      this.dataLoaded = true
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    changeWeek (week) {
      this.dataLoaded = false
      var matchupLiveScoringParams = {
        cookie: this.leagueData[this.activeLeague].cookie,
        host: this.leagueData[this.activeLeague].host,
        TYPE: 'liveScoring',
        L: this.activeLeague,
        W: week,
        DETAILS: 1,
        JSON: 1
      }
      var request = [
        {
          type: 'matchupLiveScoring',
          value: 'liveScoring',
          params: matchupLiveScoringParams,
          timeOut: 0
        }
      ]
      callApi('', request)
        .then((response) => {
          this.setTeams()
        })
    },
    goToTeam (team) {
      this.$router.push('/team/' + team)
    },
    goToMatchup (match, key) {
      this.selectedMatchup = key
      var obj = {}
      match.forEach(el => {
        obj['teamA'] ? obj['teamB'] = el.id : obj['teamA'] = el.id
      })
      this.$store.commit('SET_DATA', {type: 'matchupTeams', data: obj})
      this.$router.push('/matchup')
    },
    refresher (done) {
      callApi()
      done()
    }
  },
  created () {
    this.weekSelect = parseInt(this.displayScoring.week)
    setTimeout(this.setTeams, 500)
  },
  activated () {
    this.selectedMatchup = ''
    setTimeout(this.setTeams, 500)
  }
}
</script>

<style lang="stylus">
.matchup-header
  height 100px
.matchup-header .team-name
  font-size 11px
  font-weight 700
  padding-bottom 4px
.matchup-header .q-item-avatar
  margin-left 10px
  margin-right 10px
.matchup-header .total-score
  font-weight 400
  font-size 24px
.matchup-header .total-score.strong
  font-weight 700
.matchup-header .total-projection
  font-size 12px
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
.matchup-list .team-matchup span
  font-weight 500
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
.matchup .q-select
  font-size 14px
  font-weight 500
  text-transform uppercase
  margin-bottom 0
.matchup .q-select .q-input-target
  padding-left 24px
.matchup .all-matchups .q-list
  padding 0
.matchup .all-matchups .q-list
  padding 0
</style>
