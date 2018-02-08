<template>
  <div>
    draft
  </div>
</template>


<script>
import {
  QBtn
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi, loadData } from '../data'

export default {
  name: 'chat',
  components: {
    QBtn
  },
  data () {
    return {
      dataLoaded: false
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
    fetchData () {
      var data = [
        'draftResults'
      ]
      loadData(data)

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
      callApi('', request)
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
  }
}
</script>
