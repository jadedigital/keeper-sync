<template>
  <q-pull-to-refresh :handler="refresher">
    <q-tabs inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="Standings" />
      <q-tab slot="title" name="tab-2" label="Transactions"/>
      <q-tab slot="title" name="tab-3" label="Messages"/>
      <!-- Targets -->
      <div class="contain-main bg-grey-1">
        <q-tab-pane class="no-pad no-border" name="tab-1">
          <q-card class="compact-card bg-white" v-for="(division, key) in standings" :key="key">
            <q-card-title>
              {{divisionLookup[key].name}}
            </q-card-title>
            <q-card-separator />
            <div class="card-main bg-white">
              <table class="q-table horizontal-separator">
                <thead>
                  <tr>
                    <th @click="sort(key, 'rank', -1)" nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'rank'}">W-L-T</th>
                    <th @click="sort(key, 'streakSort', 1)" nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'streakSort'}">Streak</th>
                    <th @click="sort(key, 'pf', 1)" nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'pf'}">PF</th>
                    <th @click="sort(key, 'pa', 1)" nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'pa'}">PA</th>
                    <th @click="sort(key, 'budget', 1)" nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'budget'}">Budget</th>
                    <th v-if="league.divisions.count > 1" @click="sort(key, 'divw', 1)" nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'divw'}">Division</th>
                  </tr>
                </thead>
                <tbody v-for="team in division" :key="team.id">
                  <tr>
                    <td colspan="6" class="text-left col-pad team-name-main">
                      <q-item separator>
                        <div class="rank">{{team.rank}}</div>
                        <q-item-side v-if="teamLookup[team.id].icon" :avatar="teamLookup[team.id].icon"/>
                        <q-item-side v-else :avatar="'./statics/avatar.jpg'"/>
                        <q-item-main :label="teamLookup[team.id].name" :sublabel="teamLookup[team.id].owner_name" />
                      </q-item>
                    </td>
                  </tr>
                  <tr>
                    <td nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'rank'}">{{team.h2hw}}-{{team.h2hl}}-{{team.h2ht}}</td>
                    <td nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'streakSort'}">{{team.streak_type}}{{team.streak_len}}</td>
                    <td nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'pf'}">{{team.pf}}</td>
                    <td nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'pa'}">{{team.pa}}</td>
                    <td nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'budget'}">{{teamLookup[team.id].bbidAvailableBalance}}</td>
                    <td v-if="league.divisions.count > 1" nowrap class="text-center" :class="{'text-red': colSortKeys[key] === 'divw'}">{{team.divw}}-{{team.divl}}-{{team.divt}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card>
        </q-tab-pane>
        <q-tab-pane name="tab-2">Transactions</q-tab-pane>
        <q-tab-pane name="tab-3">Message Board
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
  QTabPane,
  QPullToRefresh,
  QCard,
  QTabs,
  QTab,
  QFixedPosition,
  QIcon,
  QCardTitle,
  QCardSeparator
} from 'quasar'
import { mapGetters } from 'vuex'

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
    QTabPane,
    QPullToRefresh,
    QCard,
    QTabs,
    QTab,
    QFixedPosition,
    QIcon,
    QCardTitle,
    QCardSeparator
  },
  data () {
    return {
      response: null,
      colSortKeys: {},
      colSortOrders: {}
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      leagueStandings: 'leagueStandings',
      league: 'league'
    }),
    standings () {
      var obj = {}
      var array = []
      var index = ''
      this.league.divisions.division.forEach(el => {
        index = 1
        this.leagueStandings.franchise.forEach(el2 => {
          if (this.teamLookup[el2.id].division === el.id) {
            el2['rank'] = index
            el2['budget'] = this.teamLookup[el2.id].bbidAvailableBalance
            if (el2.streak_type === 'L') {
              el2['streakSort'] = el2.streak_len * -1
            }
            else {
              el2['streakSort'] = el2.streak_len
            }
            array.push(el2)
            index += 1
          }
        })
        array = this.order(array, this.colSortKeys[el.id], this.colSortOrders[el.id])
        obj[el.id] = array
        array = []
      })
      return obj
    },
    teamLookup () {
      var obj = this.league.franchises.franchise
      return this.lookup(obj)
    },
    divisionLookup () {
      var obj = this.league.divisions.division
      return this.lookup(obj)
    }
  },
  watch: {
    activeLeague: function () {
      this.fetchStandings()
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    order (list, key, order) {
      return list.sort((a, b) => {
        var x = a[key]; var y = b[key]
        return ((x < y) ? 1 : ((x > y) ? -1 : 0)) * order
      })
    },
    sort (id, key, order) {
      this.colSortKeys[id] = key
      this.colSortOrders[id] = order
    },
    refresher (done) {
      this.fetchStandings()
      done()
    },
    lookup (array) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i].id] = array[i]
      }
      return lookup
    },
    fetchStandings () {
      // refresh
    }
  },
  mounted () {
    this.league.divisions.division.forEach(el => {
      this.$set(this.colSortKeys, el.id, 'rank')
      this.$set(this.colSortOrders, el.id, -1)
    })
  }
}
</script>

<style lang="stylus">
.q-table .q-item
  padding 0
.q-table .q-item-label
  font-weight 500
  font-size 14px
.q-table .q-item-sublabel
  font-weight 300
  font-size 12px
.card-main
  overflow auto
.q-table
  font-size 12px
  width 100%
.q-table th,td
  padding-left 0!important
  padding-right 0!important
.col-pad
  padding-left 12px!important
  padding-right 12px!important
.team-name-main
  border-bottom none!important
  padding-bottom 0!important
tr .rank
  padding-right 12px
  font-weight 500
</style>
