<template>
  <div>
    <q-data-table :data="data" :config="config" :columns="columns">
      <!-- Custom renderer for "message" column -->
      <template slot="col-add" slot-scope="cell">
        <q-btn round small outline color="primary" style="font-size: 26px; font-weight:300">+</q-btn>
      </template>
      <template slot="col-pic" slot-scope="cell">
        <div v-if="playerLookup[cell.data].position !== 'Def'"><img :src="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[cell.data].cbs_id + '.jpg'" onerror="this.src='./statics/avatar.jpg'" class="q-item-avatar"></div>
        <div v-if="playerLookup[cell.data].position === 'Def'"><img :src="'https://sports.cbsimg.net/images/nfl/logos/100x100/' + playerLookup[cell.data].team + '.png'" onerror="this.src='./statics/avatar.jpg'" class="q-item-avatar"></div>
      </template>
      <template slot="col-name" slot-scope="cell">
        <span class="light-paragraph">{{ playerLookup[cell.data].name.split(', ').slice(-1).join('').charAt(0) }}. {{ playerLookup[cell.data].name.split(', ').slice(0, -1).join(' ') }}
        <br> {{ playerLookup[cell.data].team }} - {{ playerLookup[cell.data].position }}</span>
      </template>
      <!-- Custom renderer for "action" column with button for custom action -->
      <template slot="col-projected" slot-scope="cell">
        <span class="light-paragraph">{{cell.data}}</span>
      </template>
      <!-- Custom renderer for "source" column -->
      <template slot="col-added" slot-scope="cell">
        <span class="light-paragraph">{{cell.data}}%</span>
      </template>
      <!-- Custom renderer for "source" column -->
      <template slot="col-owned" slot-scope="cell">
        <span class="light-paragraph">{{cell.data}}%</span>
      </template>
    </q-data-table>
  </div>
</template>


<script>
import {
  openURL,
  QBtn,
  QDataTable,
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
    QDataTable,
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
      response: null,
      config: {
        // [REQUIRED] Set the row height
        rowHeight: '50px',
        // (optional) Title to display
        title: 'Players',
        // (optional) No columns header
        noHeader: false,
        // (optional) Display refresh button
        refresh: false,
        // (optional)
        // User will be able to choose which columns
        // should be displayed
        columnPicker: false,
        // (optional) How many columns from the left are sticky
        leftStickyColumns: 0,
        // (optional) How many columns from the right are sticky
        rightStickyColumns: 0,
        // (optional) By default, Data Table is responsive,
        // but you can disable this by setting the property to "false"
        responsive: false,
        // (optional) Use pagination. Set how many rows per page
        // and also specify an additional optional parameter ("options")
        // which forces user to make a selection of how many rows per
        // page he wants from a specific list
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
        // (optional) Override default messages when no data is available
        // or the user filtering returned no results.
        messages: {
          noData: '<i>warning</i> No data available to show.',
          noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
        }
      },
      columns: [{
        // [REQUIRED] Column name
        label: '',
        // [REQUIRED] Row property name
        field: 'add',
        // [REQUIRED] Column width
        width: '52px',
        // (optional) Column CSS style
        filter: false
      },
      {
        // [REQUIRED] Column name
        label: '',
        // [REQUIRED] Row property name
        field: 'pic',
        // [REQUIRED] Column width
        width: '52px',
        // (optional) Column CSS style
        filter: true
      },
      {
        // [REQUIRED] Column name
        label: 'Player',
        // [REQUIRED] Row property name
        field: 'name',
        // [REQUIRED] Column width
        width: '150px',
        // (optional) Column CSS style
        filter: true
      },
      {
        label: 'Proj',
        field: 'projected',
        width: '80px',
        style: 'text-align: center;',
        filter: false,
        sort (a, b) {
          return (b - a)
        },
        type: 'number'
      },
      {
        label: '%Add',
        field: 'added',
        width: '80px',
        style: 'text-align: center;',
        filter: false,
        sort (a, b) {
          return (b - a)
        },
        type: 'number'
      },
      {
        label: '%Own',
        field: 'owned',
        width: '80px',
        style: 'text-align: center;',
        filter: false,
        sort (a, b) {
          return (b - a)
        },
        type: 'number'
      }]
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      freeAgents: 'freeAgents',
      projectedScores: 'projectedScores',
      topAdds: 'topAdds',
      topOwns: 'topOwns'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    data () {
      var data = []
      var row = {}
      this.freeAgents.leagueUnit.player.forEach((el) => {
        row = {
          add: el.id,
          pic: el.id,
          name: el.id,
          projected: ((this.projectedLookup[el.id].score !== '') ? this.projectedLookup[el.id].score : '0'),
          added: ((this.addedLookup[el.id]) ? this.addedLookup[el.id].percent : '0'),
          owned: ((this.ownedLookup[el.id]) ? this.ownedLookup[el.id].percent : '0')
        }
        data.push(row)
      })
      return data
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array)
    },
    projectedLookup () {
      var array = this.projectedScores.playerScore
      return this.lookup(array)
    },
    addedLookup () {
      var array = this.topAdds.player
      return this.lookup(array)
    },
    ownedLookup () {
      var array = this.topOwns.player
      return this.lookup(array)
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

<style lang="stylus">

.sortable span
  font-size 10px
th.sortable
  text-align center
.q-data-table-toolbar.upper-toolbar .q-select
  display none
</style>
cursor-pointer
