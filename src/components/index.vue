<template>
  <q-layout ref="layout" view="hHh Lpr lFf" :left-class="{'bg-grey-2': true}">
    <q-toolbar class="bg-gradient" slot="header">
      <q-btn class="desktop-only" flat @click="$refs.layout.toggleLeft()">
        <q-icon name="search" />
      </q-btn>

      <q-toolbar-title>
        {{this.teamLookup[myTeam].name}}
        <span slot="subtitle">
          {{this.league.name}}
        </span>
      </q-toolbar-title>
      <q-btn flat @click="toggleModal">
        <q-icon name="search" />
      </q-btn>
    </q-toolbar>
    <q-modal class="search-modal" @open="$refs.search.focus()" v-model="modal">
      <q-search color="primary" v-model="playerSearch" placeholder="Search" stack-label="Search All Players" ref="search">
      </q-search>
      <div v-if="!playerSearch" class="row flex-center"><i class="info">Start typing to search</i></div>
      <div v-if="playerSearch" v-for="player in playerLookup" :key="player.id" class="row flex-center">{{player.name}} ({{player.team}}) - {{player.id}}</div>
      <q-btn outline color="primary" @click="toggleModal">Cancel</q-btn>
    </q-modal>
    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <transition :name="transitionName">
      <keep-alive>
        <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>

    <q-tabs slot="footer" inverted class="bg-white main-nav">
      <!-- Tabs - notice slot="title" -->
      <q-tab @click="changeTab('team')" :class="((activeTab === 'team') ? 'active' : '')" default slot="title" name="tab-1" icon="list" label="My Team" />
      <q-tab @click="changeTab('league')" :class="((activeTab === 'league') ? 'active' : '')" slot="title" name="tab-2" icon="star" label="League" />
      <div slot="title" class="main-avatar q-tab column flex-center relative-position active icon-and-label"><img :src="teamLookup[myTeam].icon" class="q-item-avatar"></div>
      <q-tab @click="changeTab('draft')" :class="((activeTab === 'draft') ? 'active' : '')" slot="title" name="tab-3" icon="view_comfy" label="Draft"/>
      <q-tab @click="changeTab('players')" :class="((activeTab === 'players') ? 'active' : '')" slot="title" name="tab-4" icon="person" label="Players" />
    </q-tabs>
  </q-layout>
</template>

<script>
import {
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemSeparator,
  QTabs,
  QTab,
  QRouteTab,
  QTabPane,
  QModal,
  QAutocomplete,
  QSearch,
  QFixedPosition,
  QTransition
} from 'quasar'
import { mapGetters } from 'vuex'
import 'quasar-extras/animate'

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemSeparator,
    QItemMain,
    QTabs,
    QTab,
    QRouteTab,
    QTabPane,
    QAutocomplete,
    QSearch,
    QFixedPosition,
    QModal,
    QTransition
  },
  data () {
    return {
      response: null,
      activeTab: '',
      modal: false,
      playerSearch: '',
      routeOrder: {
        team: 1,
        league: 2,
        draft: 3,
        players: 4
      },
      transitionName: 'slide-left'
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  beforeRouteUpdate (to, from, next) {
    const toRoute = this.routeOrder[to.path.split('/')[1]]
    const fromRoute = this.routeOrder[from.path.split('/')[1]]
    console.log(to.path.split('/')[1])
    this.transitionName = toRoute > fromRoute ? 'slide-right' : 'slide-left'
    next()
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      league: 'league',
      players: 'players'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    playerLookup () {
      var list = this.players.player
      var positions = []
      this.league.starters.position.forEach(el => {
        positions.push(el.name)
      })
      list = this.positionFilter(list, positions)
      if (this.playerSearch) {
        list = this.findBy(list, this.playerSearch, 'name')
      }
      list = list.slice(0, 10)
      return list
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    changeTab (route) {
      this.activeTab = route
      this.$router.push('/' + route)
    },
    toggleModal () {
      this.$refs.search.clear()
      this.modal = !this.modal
    },
    lookup (array, id) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][id]] = array[i]
      }
      return lookup
    },
    findBy (list, value, key) {
      return list.filter(function (el) {
        return value.toLowerCase().split(' ').every(x => String(el[key]).toLowerCase().includes(x))
      })
    },
    positionFilter (list, positions) {
      return list.filter(function (el) {
        return positions.some(x => el['position'] === x)
      })
    }
  }
}
</script>

<style lang="stylus">
.logo-container
  width 255px
  height 242px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
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
  color #3f51b5
.bg-gradient
  background linear-gradient(141deg, #3f51b5 15%, #03a9f4 100%)
.search-modal .info
  font-size 120%
  font-weight 300
  margin 20px
.search-modal .q-btn
  margin 20px
  width 90%
.search-modal.fullscreen
  top 50px
.main-avatar
  height 46px
  width 46px
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
.child-view {
  width: 100%;
  position: absolute;
  transition: all .5s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter {
  transform: translate(-100%, 0);
}
.slide-left-leave-active, .slide-right-leave-active {
  opacity: 0;
}
.slide-right-enter {
  transform: translate(100%, 0);
}
</style>
