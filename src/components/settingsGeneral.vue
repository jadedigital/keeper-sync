<template>
  <q-layout ref="childLayout" view="hHh lpr lFf" class="settings-layout">
    <q-toolbar slot="header">
      <q-btn flat>
        <q-icon @click="$router.go(-1)" name="arrow_back" />
      </q-btn>
      <q-toolbar-title>
        General Settings
      </q-toolbar-title>
    </q-toolbar>
    <q-list no-border link separator sparse>
      <q-item @click="navbarModalOpen = true">
        <q-item-side color="primary" icon="mdi-table-row" />
        <q-item-main>Navbar Items</q-item-main>
      </q-item>
      <q-item tag="label">
        <q-item-side color="primary" :icon="settings.toolbarHide ? 'mdi-eye-off' : 'mdi-eye'" />
        <q-item-main>
          <q-item-tile label>Hide Toolbar on Scroll</q-item-tile>
        </q-item-main>
        <q-item-side right>
          <q-toggle v-model="toolbarHide" />
        </q-item-side>
      </q-item>
    </q-list>
    <q-modal
      v-model="navbarModalOpen"
      minimized
      class="settings-modal"
      ref="navbarModal"
    >
      <div class="text-center modal-header">Navigation Bar Items</div>
      <div class="row list-item">
        <div class="col-9">
          <div>My Team</div>
        </div>
        <div class="col-3">
          <q-toggle
            class="pull-right"
            v-model="navbar"
            val="team"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>League</div>
        </div>
        <div class="col-3">
          <q-toggle
            class="pull-right"
            v-model="navbar"
            val="league"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Matchup</div>
        </div>
        <div class="col-3">
          <q-toggle
            class="pull-right"
            v-model="navbar"
            val="matchup"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Players</div>
        </div>
        <div class="col-3">
          <q-toggle
            class="pull-right"
            v-model="navbar"
            val="players"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Chat</div>
        </div>
        <div class="col-3">
          <q-toggle
            class="pull-right"
            v-model="navbar"
            val="chat"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Draft</div>
        </div>
        <div class="col-3">
          <q-toggle
            class="pull-right"
            v-model="navbar"
            val="draft"
          />
        </div>
      </div>
      <div class="row list-item">
        <div class="col-9">
          <div>Polls</div>
        </div>
        <div class="col-3">
          <q-toggle
            class="pull-right"
            v-model="navbar"
            val="polls"
          />
        </div>
      </div>
      <div class="modal-buttons row">
        <q-btn color="primary" @click="navbarModalOpen = false">Ok</q-btn>
      </div>
    </q-modal>
    <q-tabs v-if="navbarModalOpen" slot="footer" inverted class="bg-white main-nav desktop-hide">
      <q-tab v-if="settings.navbar.includes('team')" exact slot="title" icon="mdi-football-helmet" label="My Team" />
      <q-tab v-if="settings.navbar.includes('league')" exact slot="title" icon="mdi-trophy-variant" label="League" />
      <q-tab v-if="settings.navbar.includes('matchup')" exact slot="title" icon="mdi-shield-half-full" label="Matchup"/>
      <q-tab v-if="settings.navbar.includes('players')" exact slot="title" icon="mdi-account-multiple" label="Players"/>
      <q-tab v-if="settings.navbar.includes('chat')" exact slot="title" icon="mdi-forum" label="Chat"/> 
      <q-tab v-if="settings.navbar.includes('draft')" exact slot="title" icon="view_comfy" label="Draft"/> 
      <q-tab v-if="settings.navbar.includes('polls')" exact slot="title" icon="mdi-poll" label="Polls"/> 
    </q-tabs>
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
  QModal,
  QTab,
  QTabs,
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
    QModal,
    QTab,
    QTabs,
    QToolbarTitle
  },
  data () {
    return {
      response: null,
      navbarModalOpen: false,
      toolbarHide: false,
      navbar: []
    }
  },
  watch: {
    toolbarHide (newValue, oldValue) {
      console.log(newValue)
      var settings = {}
      if (LocalStorage.has('settings')) {
        settings = LocalStorage.get.item('settings')
      }
      settings['toolbarHide'] = newValue
      LocalStorage.set('settings', settings)
      this.$store.commit('SET_DATA', {type: 'settings', data: settings})
    },
    navbar (newArray) {
      console.log(newArray)
      var settingsA = {}
      if (LocalStorage.has('settings')) {
        settingsA = LocalStorage.get.item('settings')
      }
      settingsA['navbar'] = newArray
      this.commit(settingsA)
    }
  },
  computed: {
    ...mapGetters({
      settings: 'settings'
    })
  },
  methods: {
    refresher (done) {
      done()
    },
    commit (data) {
      LocalStorage.set('settings', data)
      this.$store.commit('SET_DATA', {type: 'settings', data: data})
    }
  },
  created () {
    this.toolbarHide = this.settings.toolbarHide
    const navbarCache = [...this.settings.navbar]
    this.navbar = navbarCache
  }
}
</script>

<style lang="stylus">
@import '~variables'
.layout.settings-layout
  background-color #fff
.settings-modal .list-item
  padding 10px
.settings-modal .modal-content
  padding 10px 25px
  border-radius 16px
.q-tab
  font-size 10px
  padding 0
  min-height 62px
.q-tab.icon-and-label
  padding 0
  min-height 62px
.q-tabs-inverted .q-tabs-scroller
  color #555
.q-tab.active
  color #3d5afe
.settings-modal.fullscreen
  bottom 62px
.settings-modal .modal-header
  font-size 18px
  font-weight 500
  padding 10px 0
  color $grey-7
</style>
