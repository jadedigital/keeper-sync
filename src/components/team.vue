<template>
  <div>
    <q-list highlight>
      <q-list-header>Roster</q-list-header>
      <q-item v-for="(player, key) in rosterLookup[myTeam].player" :key="player.id">
        <q-item-side v-if="playerLookup[player.id].position !== 'Def'" :avatar="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[player.id].cbs_id + '.jpg'" />
        <q-item-side v-if="playerLookup[player.id].position === 'Def'" :avatar="'https://sports.cbsimg.net/images/nfl/logos/100x100/' + playerLookup[player.id].team + '.png'" />
        <q-item-main :label="playerLookup[player.id].name" :sublabel="playerLookup[player.id].team + ' - ' + playerLookup[player.id].position + ' - ' + playerLookup[player.id].cbs_id" />
        <q-item-side right icon="swap_vert" />
      </q-item>
      <q-item-separator />
      <q-list-header>Taxi Squad</q-list-header>
    </q-list>
  </div>
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
  QItemSeparator,
  QRouteTab,
  QTabPane
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  components: {
    QBtn,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemSeparator,
    QRouteTab,
    QTabPane
  },
  data () {
    return {
      response: null
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    rosterLookup () {
      var array = this.rosters.franchise
      return this.lookup(array)
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array)
    },
    activeTeamIcon () {
      var icon = ''
      var this_ = this
      this.teams.forEach(function (el) {
        if (el.team_key === this_.activeTeam) {
          icon = el.team_logos[0].url.replace('/', '')
        }
      })
      return icon
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    lookup (array) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i].id] = array[i]
      }
      return lookup
    }
  }
}
</script>