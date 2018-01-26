<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="newmessage">
    <q-toolbar slot="header">
      <q-btn flat>
        <q-icon @click="$router.go(-1)" name="arrow_back" />
      </q-btn>
      <q-toolbar-title>
        New Message
      </q-toolbar-title>
      <q-btn flat>
        <q-icon name="send" />
      </q-btn>
    </q-toolbar>
    <q-input 
      class="msg-input"
      v-model="subject"
      placeholder="Subject"
      ref="subject"
    />
    <q-input 
      class="msg-body"
      v-model="body"
      type="textarea"
      placeholder="Enter message"
      :min-rows="5"
    />
  </q-layout>
</template>

<script>
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QInput,
  QIcon
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'newmessage',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QInput,
    QIcon
  },
  data () {
    return {
      body: '',
      subject: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    }
  },
  methods: {
    focus () {
      this.$refs.subject.focus()
    }
  },
  activated () {
    setTimeout(this.focus, 500)
  }
}
</script>

<style lang="stylus">
.newmessage .msg-input
  margin-bottom 0px
  margin-top 0px
  padding-bottom 14px
  padding-top 14px
  padding-right 6px
  padding-left 6px
  background-color #fff
.newmessage .msg-body
  padding-right 6px
  padding-left 6px
.layout.newmessage
  background-color #fff
</style>
