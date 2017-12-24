<template>
  <q-pull-to-refresh :handler="refresher">
    <q-tabs inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="Standings" />
      <q-tab slot="title" name="tab-2" label="Transactions"/>
      <q-tab slot="title" name="tab-3" label="Messages"/>
      <!-- Targets -->
      <div class="contain-main bg-grey-2">
        <q-tab-pane class="no-pad no-border" name="tab-1">
          <q-card class="bg-blue-grey-1 compact-card" v-for="(division, key) in league.divisions.division" :key="division.id" >
            <q-card-title>
              {{division.name}}
            </q-card-title>
            <q-card-separator />
            <div class="card-main bg-white">
              <table class="q-table horizontal-separator">
                <thead>
                  <tr>
                    <th nowrap class="text-center">W-L-T</th>
                    <th nowrap class="text-center">Streak</th>
                    <th nowrap class="text-center">PF</th>
                    <th nowrap class="text-center">PA</th>
                    <th nowrap class="text-center">Budget</th>
                    <th nowrap class="text-center">Moves</th>
                  </tr>
                </thead>
                <tbody v-for="(team, index) in leagueStandings.franchise" v-if="teamLookup[team.id].division === division.id">
                  <tr>
                    <td colspan="6" class="text-left col-pad">
                      <q-item separator>
                        <q-item-side v-if="teamLookup[team.id].icon" :avatar="teamLookup[team.id].icon"/>
                        <q-item-side v-else :avatar="'./statics/avatar.jpg'"/>
                        <q-item-main :label="teamLookup[team.id].name" :sublabel="teamLookup[team.id].owner_name" />
                      </q-item>
                    </td>
                  </tr>
                  <tr>
                    <td nowrap class="text-center">{{team.h2hw}} - {{team.h2hl}} - {{team.h2ht}}</td>
                    <td nowrap class="text-center">{{team.streak_type}}{{team.streak_len}}</td>
                    <td nowrap class="text-center">{{team.pf}}</td>
                    <td nowrap class="text-center">{{team.pa}}</td>
                    <td nowrap class="text-center">{{teamLookup[team.id].bbidAvailableBalance}}</td>
                    <td nowrap class="text-center">{{team.streak_type}}{{team.streak_len}}</td>
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
      response: null
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
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array)
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
.compact-card .q-card-title
  text-align center
  font-size 14px
  font-weight 500
.compact-card .q-card-primary
  padding 4px
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
</style>
