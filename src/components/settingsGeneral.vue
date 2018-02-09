<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="settings-layout">
    <q-toolbar slot="header">
      <q-btn flat>
        <q-icon @click="$router.go(-1)" name="arrow_back" />
      </q-btn>
      <q-toolbar-title>
        General Settings
      </q-toolbar-title>
    </q-toolbar>
    <div>
      <q-list-header>Navigation Bar Items (max 5)</q-list-header>
      <div class="row list-item">
        <div class="col-9">
          <div>My Team</div>
        </div>
        <div class="col-3">
          <q-toggle 
            @change="navbarUpdate"
            class="pull-right"
            :value="navbar"
            val="team"
            :disabled="!navbar.includes('team') && navbar.length > 4"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>League</div>
        </div>
        <div class="col-3">
          <q-toggle 
            @change="navbarUpdate"
            class="pull-right"
            :value="navbar"
            val="league"
            :disabled="!navbar.includes('league') && navbar.length > 4"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Matchup</div>
        </div>
        <div class="col-3">
          <q-toggle 
            @change="navbarUpdate"
            class="pull-right"
            :value="navbar"
            val="matchup"
            :disabled="!navbar.includes('matchup') && navbar.length > 4"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Players</div>
        </div>
        <div class="col-3">
          <q-toggle 
            @change="navbarUpdate"
            class="pull-right"
            :value="navbar"
            val="players"
            :disabled="!navbar.includes('players') && navbar.length > 4"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Chat</div>
        </div>
        <div class="col-3">
          <q-toggle 
            @change="navbarUpdate"
            class="pull-right"
            :value="navbar"
            val="chat"
            :disabled="!navbar.includes('chat') && navbar.length > 4"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Draft</div>
        </div>
        <div class="col-3">
          <q-toggle 
            @change="navbarUpdate"
            class="pull-right"
            :value="navbar"
            val="draft"
            :disabled="!navbar.includes('draft') && navbar.length > 4"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Polls</div>
        </div>
        <div class="col-3">
          <q-toggle 
            @change="navbarUpdate"
            class="pull-right"
            :value="navbar"
            val="polls"
            :disabled="!navbar.includes('polls') && navbar.length > 4"
          />
        </div>
      </div>

    </div>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QToolbar,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
  QToggle,
  QToolbarTitle,
  LocalStorage
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'settingsGeneral',
  components: {
    QLayout,
    QToolbar,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QToggle,
    QToolbarTitle
  },
  data () {
    return {
      response: null
    }
  },
  computed: {
    ...mapGetters({
      settings: 'settings'
    }),
    navbar () {
      const navbar = [...this.settings.navbar]
      return navbar
    }
  },
  methods: {
    refresher (done) {
      done()
    },
    navbarUpdate (e) {
      var settings = {}
      if (LocalStorage.has('settings')) {
        settings = LocalStorage.get.item('settings')
      }
      settings['navbar'] = e
      LocalStorage.set('settings', settings)
      this.$store.commit('SET_DATA', {type: 'settings', data: settings})
    }
  }
}
</script>

<style lang="stylus">
.layout.settings-layout
  background-color #fff
.settings-layout .list-item
  border-bottom solid 1px rgba(0,0,0,0.1)
  padding 20px 10px
</style>
