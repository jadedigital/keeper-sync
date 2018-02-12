<template>
  <q-pull-to-refresh :handler="refresher" class="draft">
    <div v-if="!dataLoaded" style="height: calc(100vh - 112px)">
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <q-tabs v-if="dataLoaded" inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="Draft Results" />
      <q-tab slot="title" name="tab-2" label="Player List" />
      <!-- Targets -->
      <div class="contain-main">
        <q-tab-pane class="no-pad no-border" name="tab-1">
          <b-draft/>
        </q-tab-pane>
      </div>
    </q-tabs>
  </q-pull-to-refresh>
</template>


<script>
import {
  QBtn,
  QPullToRefresh,
  QSpinner,
  QTabs,
  QTab,
  QTabPane
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi, loadData } from '../data'
import bDraft from './bDraft.vue'

export default {
  name: 'draft',
  components: {
    QBtn,
    QPullToRefresh,
    QSpinner,
    QTabs,
    QTab,
    QTabPane,
    bDraft
  },
  data () {
    return {
      dataLoaded: false,
      error: false
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      league: 'league',
      draftResults: 'draftResults'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      var obj = this.lookup(array, 'id')
      obj['0000'] = {
        name: 'Commissioner',
        owner_name: 'Commish'
      }
      obj['1000'] = {
        name: 'League Chat'
      }
      return obj
    },
    request () {
      var draftResultsParams = {
        cookie: this.leagueData[this.activeLeague].cookie,
        host: this.leagueData[this.activeLeague].host,
        TYPE: 'draftResults',
        L: this.activeLeague,
        JSON: 1
      }
      var request = [
        {
          type: 'draftResults',
          value: 'draftResults',
          params: draftResultsParams,
          timeOut: 0
        }
      ]
      return request
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
    refresher (done) {
      var data = [
        'draftResults'
      ]
      loadData(data)

      callApi('', this.request)
        .then((response) => {
          this.dataLoaded = true
          this.error = false
          done()
        })
        .catch((error) => {
          if (error) {
            this.dataLoaded = true
            this.error = true
            done()
          }
        })
    },
    fetchData () {
      var data = [
        'draftResults'
      ]
      loadData(data)

      callApi('', this.request)
        .then((response) => {
          this.dataLoaded = true
        })
    },
    setTeam () {
      this.dataLoaded = true
    }
  },
  activated () {
    setTimeout(this.fetchData, 500)
  },
  deactivated () {
    this.dataLoaded = false
  }
}
</script>
