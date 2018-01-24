<template>
  <q-layout ref="layout" view="hHh lpr fff">

    <div style="height: calc(100vh - 50px); background-color: #fff;">
      <div v-if="dataLoaded" class="player-modal player-header">
        <div class="player-bg-pic" :style="{background: 'url(./statics/' + teamMap[playerLookup[activePlayer].team] + '.svg) no-repeat center'}">
          <div class="bg-gradient-opacity">
            <div class="row">
              <q-btn flat @click="goBack">
                <q-icon name="arrow_back" color="white"/>
              </q-btn>
            </div>
            <div class="player-info text-white row reverse items-center">
              <ul class="col-6 player-info-list">
                <li>Team: <span>{{playerLookup[activePlayer].team}} #{{playerLookup[activePlayer].jersey}}</span></li>
                <li>HT/WT: <span>{{parseInt(playerLookup[activePlayer].height / 12)}}'{{playerLookup[activePlayer].height % 12}}"/{{playerLookup[activePlayer].weight}}lbs</span></li>
                <li>Age: <span>{{(new Date(Date.now()).getFullYear() - new Date(playerLookup[activePlayer].birthdate * 1000).getFullYear())}}</span></li>
                <li>Exp: <span>{{new Date(Date.now()).getFullYear() - playerLookup[activePlayer].draft_year}}</span><span v-if="playerLookup[activePlayer].status === 'R'">({{playerLookup[activePlayer].status}})</span></li>
                <li>College: <span>{{playerLookup[activePlayer].college}}</span></li>
              </ul>
              <div class="col-6">
                <div class="row justify-center">
                  <img class="player-img" :src="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[activePlayer].cbs_id + '.jpg'" alt="">
                </div>
              </div>
            </div>
            <div class="player-name-main q-toolbar-title text-white">
              {{playerLookup[activePlayer].name.split(', ').reverse().join(' ')}}
              <div class="q-toolbar-subtitle">{{playerLookup[activePlayer].position}}</div>
            </div>
          </div>
        </div>
        <q-tabs inverted class="secondary-tabs">
          <q-tab default slot="title" name="tab-1" label="News" />
          <q-tab slot="title" name="tab-2" label="Game Log"/>
        </q-tabs>
      </div>
      <q-spinner 
        v-if="!dataLoaded" 
        color="secondary" 
        size="40px" 
        class="absolute-center" 
        style="margin-left: -20px;"
      />
    </div>

  </q-layout>
</template>

<script>
import {
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
  QTransition,
  QSpinner
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'player',
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
    QTransition,
    QSpinner
  },
  data () {
    return {
      dataLoaded: true
    }
  },
  computed: {
    ...mapGetters({
      players: 'players',
      activePlayer: 'activePlayer',
      teamMap: 'teamMap'
    }),
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    }
  },
  methods: {
    lookup (array, id) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][id]] = array[i]
      }
      return lookup
    },
    goBack () {
      this.$router.go(-1)
    },
    setPlayer () {
      this.dataLoaded = true
    },
    unsetPlayer () {
      this.dataLoaded = false
    }
  }
}
</script>
