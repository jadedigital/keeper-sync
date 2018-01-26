<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="message">
    <q-toolbar slot="header">
      <q-btn flat>
        <q-icon @click="$router.go(-1)" name="arrow_back" />
      </q-btn>
      <q-toolbar-title>
        {{currentMsgThread.title}}
      </q-toolbar-title>
    </q-toolbar>
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px);">  
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <q-pull-to-refresh 
      :handler="refresher"
      v-if="dataLoaded"
    >
      <q-chat-message
        v-for="(msg, key) in msgPretty"
        :key="key"
        :name="teamLookup[msg.franchise].name"
        :avatar="teamLookup[msg.franchise].icon ? teamLookup[msg.franchise].icon : './statics/avatar.jpg'"
        :text="[msg.body]"
        :stamp="msg.weekday"
        :sent="msg.franchise === myTeam"
        :bg-color="msg.franchise === myTeam ? 'secondary' : 'grey-3'"
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
  QIcon
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi, loadData } from '../data'

export default {
  name: 'message',
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
      timer: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      currentMsgThread: 'currentMsgThread',
      messageBoardThread: 'messageBoardThread',
      league: 'league'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    msgPretty () {
      var locale = 'en-us'
      var array = []
      var msgArray = []
      var obj = {}
      if (!Array.isArray(this.messageBoardThread.post)) {
        msgArray.push(this.messageBoardThread.post)
      }
      else {
        msgArray = this.messageBoardThread.post
      }
      msgArray.forEach(el => {
        var date = new Date(el.postTime * 1000)
        obj = {
          franchise: el.franchise,
          weekday: date.toLocaleString(locale, { weekday: 'short' }),
          day: date.toLocaleString(locale, { day: 'numeric' }),
          month: date.toLocaleString(locale, { month: 'short' }),
          body: el.body
        }
        array.push(obj)
      })
      return array
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      var obj = this.lookup(array, 'id')
      obj['0000'] = {
        name: 'Commissioner'
      }
      return obj
    }
  },
  methods: {
    refresher (done) {
      callApi()
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
      var data = [
        'messageBoardThread'
      ]
      loadData(data)

      var messageBoardThreadParams = {
        cookie: this.leagueData[this.activeLeague].cookie,
        host: this.leagueData[this.activeLeague].host,
        TYPE: 'messageBoardThread',
        L: this.activeLeague,
        THREAD: this.currentMsgThread.id,
        JSON: 1
      }
      var request = [
        {
          type: 'messageBoardThread',
          params: messageBoardThreadParams,
          timeOut: 0
        }
      ]
      callApi('', request)
        .then((response) => {
          this.dataLoaded = true
        })
    }
  },
  activated () {
    setTimeout(this.fetchData, 500)
    this.timer = setInterval(this.fetchData, 5000)
  },
  deactivated () {
    console.log('deactivated')
    clearInterval(this.timer)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="stylus">
.message .msg-input
  margin-bottom 0px
  margin-top 0px
  padding-bottom 14px
  padding-top 14px
  padding-right 6px
  padding-left 6px
  background-color #fff
.layout.message
  background-color #fff
</style>
