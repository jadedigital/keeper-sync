<template>
  <q-pull-to-refresh :handler="refresher" class="league">
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px)">
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <q-tabs v-if="dataLoaded" inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab 
        default
        slot="title"
        name="tab-1" 
        label="Standings"
        @click="activeTab('standings')"
      />
      <q-tab 
        slot="title"
        name="tab-2"
        label="Transactions"
        @click="activeTab('transactions')"
      />
      <q-tab
        slot="title"
        name="tab-3"
        label="Message Board"
        @click="activeTab('messages')"
      />
      <!-- Targets -->
      <div class="contain-main bg-white">
        <q-tab-pane class="no-pad no-border standings" name="tab-1">
          <q-card class="compact-card bg-white" v-for="(division, key) in standings" :key="key">
            <q-card-title>
              {{divisionLookup[key].name}}
            </q-card-title>
            <q-card-separator />
            <div class="card-main bg-white">
              <div class="q-table horizontal-separator">
                <div class="row header-row border-bottom">
                  <div @click="sort(key, 'rank', -1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'rank'}">W-L-T</div>
                  <div @click="sort(key, 'streakSort', 1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'streakSort'}">Streak</div>
                  <div @click="sort(key, 'pf', 1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'pf'}">PF</div>
                  <div @click="sort(key, 'pa', 1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'pa'}">PA</div>
                  <div @click="sort(key, 'budget', 1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'budget'}">Budget</div>
                  <div v-if="league.divisions.count > 1" @click="sort(key, 'divw', 1)" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'divw'}">Division</div>
                </div>
                <div 
                  class="border-bottom main-row"
                  v-for="team in division" 
                  :key="team.id"
                  :class="{'active': selectedTeam === team.id}"
                  @click="goToTeam(team.id)"
                >
                  <div class="row text-left col-pad name-row">
                    <q-item separator class="col-12">
                      <div class="rank">{{team.rank}}</div>
                      <q-item-side v-if="teamLookup[team.id].icon" :avatar="teamLookup[team.id].icon"/>
                      <q-btn v-else round small style="font-size: 14px; font-weight:400; height: 38px; width: 38px;" class="q-btn-outline bg-white text-primary q-item-avatar q-item-section">{{ teamLookup[team.id].owner_name ? teamLookup[team.id].owner_name[0] : teamLookup[team.id].name[0] }}</q-btn>
                      <q-item-main :label="teamLookup[team.id].name" :sublabel="teamLookup[team.id].owner_name" />
                    </q-item>
                  </div>
                  <div class="row stat-row">
                    <div nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'rank'}">{{team.h2hw}}-{{team.h2hl}}-{{team.h2ht}}</div>
                    <div nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'streakSort'}">{{team.streak_type}}{{team.streak_len}}</div>
                    <div nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'pf'}">{{team.pf}}</div>
                    <div nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'pa'}">{{team.pa}}</div>
                    <div nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'budget'}">{{teamLookup[team.id].bbidAvailableBalance}}</div>
                    <div v-if="league.divisions.count > 1" nowrap class="text-center col-2" :class="{'text-tertiary': colSortKeys[key] === 'divw'}">{{team.divw}}-{{team.divl}}-{{team.divt}}</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </q-tab-pane>
        <q-tab-pane 
          class="no-pad no-border transactions"
          name="tab-2"
        >
          <q-item separator v-if="transactionPretty" v-for="(move, key) in transactionPretty" :key="key" class="team-name-main">
            <q-item-side :avatar="teamLookup[move.franchise].icon ? teamLookup[move.franchise].icon : './statics/avatar.jpg'" />
            <q-item-main>
              <q-item-tile sublabel class="text-primary">{{move.type.replace('_', ' ')}}<span class="text-tertiary" v-if="move.price"> - ${{move.price}}</span></q-item-tile>
              <q-item-tile label>{{teamLookup[move.franchise].name}}</q-item-tile>
              <q-item-tile class="move" v-if="move.type === 'IR'">
                <span v-if="move.activated">Activated: </span>
                <span v-for="(player, key2) in move.activated" :key="key2">{{playerLookup[player] ? playerLookup[player].name.split(', ').reverse().join(' ') : ''}}<span v-if="move.activated[key2 + 1]">, </span></span>
              </q-item-tile>
              <q-item-tile class="move" v-if="move.type === 'IR'">
                <span v-if="move.deactivated">Deactivated: </span>
                <span v-for="(player, key2) in move.deactivated" :key="key2">{{playerLookup[player] ? playerLookup[player].name.split(', ').reverse().join(' ') : ''}}<span v-if="move.deactivated[key2 + 1]">, </span></span>
              </q-item-tile>
              <q-item-tile class="move" v-if="move.added && move.added[0] !== ''">
                <span>Added: </span>
                <span v-for="(player, key2) in move.added" :key="key2">{{playerLookup[player] ? playerLookup[player].name.split(', ').reverse().join(' ') : ''}}<span v-if="move.added[key2 + 1]">, </span></span>
              </q-item-tile>
              <q-item-tile class="move" v-if="move.dropped && move.dropped[0] !== ''">
                <span>Dropped: </span>
                <span v-for="(player, key2) in move.dropped" :key="key2">{{playerLookup[player] ? playerLookup[player].name.split(', ').reverse().join(' ') : ''}}<span v-if="move.dropped[key2 + 1]">, </span></span>
              </q-item-tile>
            </q-item-main>
            <q-item-side right>
              {{move.weekday}}, {{move.month}} {{move.day}}
            </q-item-side>
          </q-item>
        </q-tab-pane>
        <q-tab-pane 
          class="no-pad no-border msg-board" 
          name="tab-3" 
        >
          <q-list highlight v-if="msgBoardPretty">
            <q-item 
              v-for="chat in msgBoardPretty" 
              :key="chat.id"
              @click="goToMsg(chat.id, chat.subject)"
            >
              <q-item-side :avatar="teamLookup[chat.franchise_id].icon ? teamLookup[chat.franchise_id].icon : './statics/avatar.jpg'" />
              <q-item-main :label="chat.subject" :sublabel="teamLookup[chat.franchise_id].name" />
              <q-item-side right>
                <q-item-tile>
                  {{chat.weekday}}, {{chat.month}} {{chat.day}}
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
  QItemTile,
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
  QCardSeparator,
  QSpinner,
  LocalStorage
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi, loadData } from '../data'

export default {
  name: 'league',
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
    QTabPane,
    QPullToRefresh,
    QCard,
    QTabs,
    QTab,
    QFixedPosition,
    QIcon,
    QCardTitle,
    QCardSeparator,
    QSpinner
  },
  data () {
    return {
      response: null,
      colSortKeys: {},
      colSortOrders: {},
      dataLoaded: false,
      selectedTeam: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      leagueStandings: 'leagueStandings',
      league: 'league',
      transactions: 'transactions',
      messageBoard: 'messageBoard'
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
    transactionPretty () {
      var locale = 'en-us'
      var array = []
      var transArray = []
      var obj = {}
      if (this.transactions.transaction) {
        if (!Array.isArray(this.transactions.transaction)) {
          transArray.push(this.transactions.transaction)
        }
        else {
          transArray = this.transactions.transaction
        }
        transArray.forEach(el => {
          var date = new Date(el.timestamp * 1000)
          obj = {
            franchise: el.franchise,
            type: el.type,
            transaction: el.transaction,
            weekday: date.toLocaleString(locale, { weekday: 'short' }),
            day: date.toLocaleString(locale, { day: 'numeric' }),
            month: date.toLocaleString(locale, { month: 'short' }),
            activated: el.activated ? el.activated.split(',') : '',
            deactivated: el.deactivated ? el.deactivated.split(',') : '',
            added: el.transaction ? el.transaction.split('|').slice(0, 1).join().split(',') : '',
            dropped: el.transaction ? el.transaction.split('|').slice(-1).join().split(',') : '',
            price: el.type === 'BBID_WAIVER' ? el.transaction.split('|').slice(1, 2).join() : ''
          }
          array.push(obj)
        })
      }
      return array
    },
    msgBoardPretty () {
      var locale = 'en-us'
      var array = []
      var msgArray = []
      var obj = {}
      if (this.messageBoard.thread) {
        if (!Array.isArray(this.messageBoard.thread)) {
          msgArray.push(this.messageBoard.thread)
        }
        else {
          msgArray = this.messageBoard.thread
        }
        msgArray.forEach(el => {
          var date = new Date(el.lastPostTime * 1000)
          obj = {
            franchise_id: el.franchise_id,
            weekday: date.toLocaleString(locale, { weekday: 'short' }),
            day: date.toLocaleString(locale, { day: 'numeric' }),
            month: date.toLocaleString(locale, { month: 'short' }),
            subject: el.subject,
            id: el.id
          }
          array.push(obj)
        })
      }
      return array
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      var obj = this.lookup(array, 'id')
      obj['0000'] = {
        name: 'Commissioner'
      }
      return obj
    },
    divisionLookup () {
      var array = this.league.divisions.division
      return this.lookup(array, 'id')
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
    activeTab (tab) {
      this.$store.commit('SET_DATA', {type: 'leagueTab', data: tab})
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
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    goToMsg (id, title) {
      LocalStorage.set('currentMsgThread', {id: id, title: title})
      this.$store.commit('SET_DATA', {type: 'currentMsgThread', data: {id: id, title: title}})
      this.$router.push('/message')
    },
    goToTeam (team) {
      this.selectedTeam = team
      this.$router.push('/team/' + team)
    },
    fetchStandings () {
      var data = [
        'transactions',
        'messageBoard'
      ]
      loadData(data)

      var transactionsParams = {
        cookie: this.leagueData[this.activeLeague].cookie,
        host: this.leagueData[this.activeLeague].host,
        TYPE: 'transactions',
        L: this.activeLeague,
        COUNT: 30,
        JSON: 1
      }
      var messageBoardParams = {
        cookie: this.leagueData[this.activeLeague].cookie,
        host: this.leagueData[this.activeLeague].host,
        TYPE: 'messageBoard',
        L: this.activeLeague,
        JSON: 1
      }
      var request = [
        {
          type: 'transactions',
          value: 'transactions',
          params: transactionsParams,
          timeOut: 3600000
        },
        {
          type: 'messageBoard',
          value: 'messageBoard',
          params: messageBoardParams,
          timeOut: 3600000
        }
      ]
      callApi('', request)
        .then((response) => {
          this.dataLoaded = true
        })
    }
  },
  created () {
    setTimeout(this.fetchStandings, 500)
  },
  activated () {
    this.selectedTeam = ''
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
.league .rank
  padding-right 12px
  font-weight 500
.league .q-item-label
  font-weight 500
  font-size 14px
.league .q-item
  font-size 14px
.league .q-item-sublabel
  font-weight 300
  font-size 12px
.league .transactions .q-item-sublabel
  font-weight 400
  font-size 12px
.league .transactions .move
  font-size 12px
.league .q-item .price
  font-weight 500
  font-size 14px
.league .msg-board .q-list
  border 0
.league .main-row
  padding 8px 0
.league .name-row
  padding 0 10px
.league .header-row
  font-weight 700
  text-align center
  padding 6px 0
.league .stat-row
  padding-top 6px
.league .q-table .q-item
  padding 0
.league .q-table
  font-size 12px
  width 100%
.league .q-table .active
  background-color #ccc
</style>

