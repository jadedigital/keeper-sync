<template>
  <q-pull-to-refresh :handler="refresher" class="chat-layout">
    <q-list highlight>
      <q-item 
        v-for="chat in franchiseList" 
        :key="chat.id"
      >
        <q-item-side :avatar="chat.icon ? chat.icon : './statics/avatar.jpg'" />
        <q-item-main :label="chat.name" :sublabel="chatList[chat.id][0] ? chatList[chat.id][0].message : ''" />
        <q-item-side right>
          <q-item-tile>
            {{chatList[chat.id][0] ? chatList[chat.id][0].posted.substring(0, 5) : ''}}
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
  QIcon
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
      search: ''
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
    franchiseList () {
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
      franchiseArray.splice(franchiseArray.findIndex(this.matchesEl), 1)
      return franchiseArray
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
    matchesEl (el) {
      return el.id === this.myTeam
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