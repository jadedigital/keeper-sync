<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="thread-layout">
    <q-toolbar slot="header">
      <q-btn flat>
        <q-icon @click="$router.go(-1)" name="arrow_back" />
      </q-btn>
      <q-toolbar-title v-if="dataLoaded">
        {{teamLookup[activeThread].name}}
      </q-toolbar-title>
    </q-toolbar>
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px);">  
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <q-pull-to-refresh 
      :handler="refresher"
      v-if="dataLoaded"
    >
      <div v-if="!thread[0]" style="height: calc(100vh - 50px)">
        <div class="absolute-center text-center light-paragraph">
          Send<br>
          <span class="text-primary text-italic">{{teamLookup[activeThread].name}}</span><br>
          a message
        </div>
      </div>
      <q-chat-message
        v-for="msg in thread"
        :key="msg.id"
        :name="teamLookup[msg.franchise_id].name"
        :avatar="teamLookup[msg.franchise_id].icon ? teamLookup[msg.franchise_id].icon : './statics/avatar.jpg'"
        :text="[msg.message]"
        :stamp="msg.timestamp"
        :sent="msg.franchise_id === myTeam"
        :bg-color="msg.franchise_id === myTeam ? 'primary' : 'grey-3'"
        :text-color="msg.franchise_id === myTeam ? 'white' : 'dark'"
      />
    </q-pull-to-refresh>
    <q-input 
      class="msg-input"
      v-model="msgInput"
      slot="footer"
      placeholder="Enter message"
      :after="[
        {
          icon: 'send',
          handler () {
            // do something...
          }
        }
      ]"
    />
  </q-layout>
</template>

<script>
import {
  QPullToRefresh,
  QChatMessage,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QSpinner,
  QBtn,
  QInput,
  QIcon,
  date,
  format
} from 'quasar'
import { mapGetters } from 'vuex'
import { getChats } from '../data'

export default {
  name: 'thread',
  components: {
    QPullToRefresh,
    QChatMessage,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QSpinner,
    QBtn,
    QInput,
    QIcon
  },
  data () {
    return {
      dataLoaded: false,
      msgInput: '',
      timer: '',
      activeThread: ''
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
      var obj = this.lookup(array, 'id')
      obj['0000'] = {
        name: 'Commissioner'
      }
      obj['1000'] = {
        name: 'League Chat'
      }
      return obj
    },
    thread () {
      var chatArray = []
      const { pad } = format
      let timeStamp = Date.now()
      var today = date.formatDate(timeStamp, 'MMM DD')

      if (this.activeThread === '1000') {
        this.chat.message.forEach(el => {
          if (!el._attributes.to) {
            if (today === el._attributes.posted.split(' ')[1] + ' ' + pad(el._attributes.posted.split(' ')[2], 2)) {
              el._attributes['timestamp'] = el._attributes.posted.split(' ')[3].split(':')[0] + ':' + el._attributes.posted.split(' ')[3].split(':')[1] + ' ' + el._attributes.posted.split(' ')[4].split('.').join('')
            }
            else {
              el._attributes['timestamp'] = el._attributes.posted.split(' ')[1] + ' ' + el._attributes.posted.split(' ')[2]
            }
            chatArray.push(el._attributes)
          }
        })
      }
      else {
        this.chat.message.forEach(el => {
          if (el._attributes.to && (el._attributes.franchise_id === this.activeThread || el._attributes.to === this.activeThread)) {
            if (today === el._attributes.posted.split(' ')[1] + ' ' + pad(el._attributes.posted.split(' ')[2], 2)) {
              el._attributes['timestamp'] = el._attributes.posted.split(' ')[3].split(':')[0] + ':' + el._attributes.posted.split(' ')[3].split(':')[1] + ' ' + el._attributes.posted.split(' ')[4].split('.').join('')
            }
            else {
              el._attributes['timestamp'] = el._attributes.posted.split(' ')[1] + ' ' + el._attributes.posted.split(' ')[2]
            }
            chatArray.push(el._attributes)
          }
        })
      }

      return chatArray.reverse()
    }
  },
  methods: {
    refresher (done) {
      done()
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    fetchData () {
      var host = this.leagueData[this.activeLeague].host
      var cookie = this.leagueData[this.activeLeague].cookie
      var league = this.activeLeague
      getChats(host, league, cookie)
        .then((response) => {
          this.dataLoaded = true
        })
    }
  },
  activated () {
    this.activeThread = this.$route.params.id
    setTimeout(this.fetchData, 500)
  }
}
</script>

<style lang="stylus">
.thread-layout .msg-input
  margin-bottom 0px
  margin-top 0px
  padding-bottom 14px
  padding-top 14px
  padding-right 6px
  padding-left 6px
  background-color #fff
.layout.thread-layout
  background-color #fff
</style>
