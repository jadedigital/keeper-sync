<template>
  <q-pull-to-refresh :handler="refresher" class="chat-layout">
    <q-list highlight v-if="dataLoaded">
      <q-item 
        v-for="chat in franchiseList" 
        :key="chat.id"
        @click="goToThread(chat.id)"
      >
        <q-item-side :avatar="chat.icon ? chat.icon : './statics/avatar.jpg'" />
        <q-item-main :label="chat.name" :sublabel="chatList[chat.id][0] ? chatList[chat.id][0].message : ''" />
        <q-item-side right>
          <q-item-tile>
            {{chat.timestamp}}
          </q-item-tile>
        </q-item-side>
      </q-item>
    </q-list>
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
  date,
  format
} from 'quasar'
import { mapGetters } from 'vuex'
import { getChats } from '../data'
import bTeam from './bTeam.vue'
import bSpinner from './bSpinner.vue'

export default {
  name: 'chat',
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
    bTeam,
    bSpinner
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      newWeek: '',
      search: '',
      monthMap: {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
      },
      timeMap: {
        'a.m.': '1',
        'p.m.': '2'
      }
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      league: 'league',
      chat: 'chat'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    chatList () {
      var chatList = {}
      var chatArray = []
      var commish = {
        id: '0000',
        name: 'Commissioner'
      }
      const franchiseArray = [...this.league.franchises.franchise]
      franchiseArray.unshift(commish)
      franchiseArray.forEach(el => {
        this.chat.message.forEach(el2 => {
          if (el2._attributes.to && (el2._attributes.franchise_id === el.id || el2._attributes.to === el.id)) {
            chatArray.push(el2._attributes)
          }
        })
        chatList[el.id] = chatArray
        chatArray = []
      })

      this.chat.message.forEach(el => {
        if (!el._attributes.to) {
          chatArray.push(el._attributes)
        }
      })
      chatList['1000'] = chatArray

      return chatList
    },
    franchiseList () {
      const { pad } = format
      let timeStamp = Date.now()
      var today = date.formatDate(timeStamp, 'MMM DD')

      var commish = {
        id: '0000',
        name: 'Commissioner'
      }
      var league = {
        id: '1000',
        name: 'League Chat'
      }
      const franchiseArray = [...this.league.franchises.franchise]
      franchiseArray.unshift(commish)
      franchiseArray.unshift(league)
      franchiseArray.splice(franchiseArray.findIndex(this.matchesMyTeam), 1)
      franchiseArray.forEach(el => {
        if (this.chatList[el.id][0]) {
          el['latest'] = parseInt(this.chatList[el.id][0].posted.split(' ')[6] + this.monthMap[this.chatList[el.id][0].posted.split(' ')[1]] + pad(this.chatList[el.id][0].posted.split(' ')[2], 2) + this.timeMap[this.chatList[el.id][0].posted.split(' ')[4]] + pad(this.chatList[el.id][0].posted.split(' ')[3].split(':')[0], 2) + this.chatList[el.id][0].posted.split(' ')[3].split(':')[1] + this.chatList[el.id][0].posted.split(' ')[3].split(':')[2])

          if (today === this.chatList[el.id][0].posted.split(' ')[1] + ' ' + pad(this.chatList[el.id][0].posted.split(' ')[2], 2)) {
            el['timestamp'] = this.chatList[el.id][0].posted.split(' ')[3].split(':')[0] + ':' + this.chatList[el.id][0].posted.split(' ')[3].split(':')[1] + ' ' + this.chatList[el.id][0].posted.split(' ')[4].split('.').join('')
          }
          else {
            el['timestamp'] = this.chatList[el.id][0].posted.split(' ')[1] + ' ' + this.chatList[el.id][0].posted.split(' ')[2]
          }
        }
        else {
          el['latest'] = 0
        }
      })
      franchiseArray.splice(franchiseArray.findIndex(this.matchesNoMsg), 1)
      var franchiseArraySorted = this.order(franchiseArray, 'latest')
      return franchiseArraySorted
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
    matchesMyTeam (el) {
      return el.id === this.myTeam
    },
    matchesNoMsg (el) {
      return el.latest === 0
    },
    order (list, key) {
      return list.sort((a, b) => {
        var x = parseFloat(a[key]); var y = parseFloat(b[key])
        return ((x < y) ? 1 : ((x > y) ? -1 : 0))
      })
    },
    goToThread (id) {
      this.$router.push('/thread/' + id)
    },
    refresher (done) {
      var host = this.leagueData[this.activeLeague].host
      var cookie = this.leagueData[this.activeLeague].cookie
      var league = this.activeLeague
      getChats(host, league, cookie)
        .then((response) => {
          done()
        })
    },
    fetchData () {
      var host = this.leagueData[this.activeLeague].host
      var cookie = this.leagueData[this.activeLeague].cookie
      var league = this.activeLeague
      getChats(host, league, cookie)
        .then((response) => {
          this.dataLoaded = true
        })
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
.chat-layout .q-list
  border none
</style>

