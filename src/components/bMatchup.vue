<template>
  <div>
    <div class="row items-center border-bottom matchup-header">
      <div class="col-5" @click="goToTeam(teamA)">
        <div class="row items-center">
          <div class="col-12">
            <div class="team-name pull-right">
              {{teamLookup[teamA].name}}
            </div>
          </div>
        </div>
        <div class="row items-center">
          <div class="col-6">
            <img :src="teamLookup[teamA].icon ? teamLookup[teamA].icon : './statics/avatar.jpg'" class="q-item-avatar"/>
          </div>
          <div class="col-6">
            <div :class="[parseFloat(allScoring[teamA].score) > parseFloat(allScoring[teamB].score)? 'strong' : '', 'total-score', 'pull-right']">{{allScoring[teamA].score}}</div>
            <div class="total-projection pull-right">{{totalProjected[teamA]}}</div>
          </div>
        </div>
      </div>
      <div class="col-2 matchup">
      </div>
      <div class="col-5 matchup" @click="goToTeam(teamB)">
        <div class="row items-center">
          <div class="col-12">
            <div class="team-name">
              {{teamLookup[teamB].name}}
            </div>
          </div>
        </div>
        <div class="row items-center">
          <div class="col-6">
            <div :class="[parseFloat(allScoring[teamA].score) < parseFloat(allScoring[teamB].score)? 'strong' : '', 'total-score']">{{allScoring[teamB].score}}</div>
            <div class="total-projection">{{totalProjected[teamB]}}</div>
          </div>
          <div class="col-6">
            <img :src="teamLookup[teamB].icon ? teamLookup[teamB].icon : './statics/avatar.jpg'" class="q-item-avatar pull-right"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="separator-title text-center border-bottom uppercase">Starters</div>
      </div>
    </div>
    <div v-for="player in combinedStarters" :key="player.id">
      <div class="row">
        <div class="col-5 matchup" @click="goToPlayer(player.id)">
          <div class="matchup-list">
            <div class="list-item border-bottom">
              <div class="row">
                <div class="col-9 team-name-container">
                  <div class="team-name pull-left" >{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <div class="team">{{playerLookup[player.id].team}}</div></div>
                  <div v-if="playerLookup[player.id].team !== 'FA' && playerLookup[player.id].team !== 'FA*'" class="team-matchup pull-left" >{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}}</span></div>
                </div>
                <div class="col-3">
                  <div class="team-score pull-right" >{{scoringLookupTeamA[player.id].score}}</div>
                  <div class="team-projection pull-right">{{ updatedProjection[player.id].projection }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2 matchup">
          <div class="position-list bg-grey-2 text-grey-8">
            <div class="row items-center positions border-bottom">
              <div class="col-12">
                {{player.position}}
              </div>
            </div>
          </div>
        </div>
        <div class="col-5 matchup" @click="goToPlayer(player.opp)">
          <div class="matchup-list">
            <div class="list-item border-bottom">
              <div class="row">
                <div class="col-3">
                  <div class="team-score pull-left" >{{scoringLookupTeamB[player.opp].score}}</div>
                  <div class="team-projection pull-left" >{{ updatedProjection[player.opp].projection }}</div>
                </div>
                <div class="col-9 team-name-container">
                  <div class="team-name pull-right" >{{playerLookup[player.opp].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.opp].name.split(', ').slice(0, -1).join(' ')}}<div class="team"> {{playerLookup[player.opp].team}}</div></div>
                  <div v-if="playerLookup[player.opp].team !== 'FA' && playerLookup[player.opp].team !== 'FA*'" class="team-matchup pull-right" >{{matchupLookup[playerLookup[player.opp].team].day}} {{matchupLookup[playerLookup[player.opp].team].time}} - <span :class="matchupPoints[playerLookup[player.opp].position][matchupLookup[playerLookup[player.opp].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.opp].position][matchupLookup[playerLookup[player.opp].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.opp].team].location}} {{matchupLookup[playerLookup[player.opp].team].vs}}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="separator-title text-center border-bottom uppercase">Bench</div>
      </div>
    </div>
    <div v-for="player in combinedBench" :key="player.id">
      <div class="row">
        <div class="col-5 matchup" @click="goToPlayer(player.id)">
          <div class="matchup-list">
            <div class="list-item border-bottom bg-grey-3">
              <div class="row">
                <div class="col-9 team-name-container">
                  <div class="team-name pull-left" >{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <div class="team">{{playerLookup[player.id].team}}</div></div>
                  <div v-if="playerLookup[player.id].team !== 'FA' && playerLookup[player.id].team !== 'FA*'" class="team-matchup pull-left" >{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}}</span></div>
                </div>
                <div class="col-3">
                  <div class="team-score pull-right" >{{scoringLookupTeamA[player.id].score}}</div>
                  <div class="team-projection pull-right">{{ updatedProjection[player.id].projection }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2 matchup">
          <div class="position-list bg-grey-2 text-grey-8">
            <div class="row items-center positions border-bottom">
              <div class="col-12">
                {{player.position}}
              </div>
            </div>
          </div>
        </div>
        <div class="col-5 matchup" @click="goToPlayer(player.opp)">
          <div class="matchup-list">
            <div class="list-item border-bottom bg-grey-3">
              <div class="row">
                <div class="col-3">
                  <div class="team-score pull-left" >{{scoringLookupTeamB[player.opp].score}}</div>
                  <div class="team-projection pull-left" >{{ updatedProjection[player.opp].projection }}</div>
                </div>
                <div class="col-9 team-name-container">
                  <div class="team-name pull-right" >{{playerLookup[player.opp].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.opp].name.split(', ').slice(0, -1).join(' ')}}<div class="team"> {{playerLookup[player.opp].team}}</div></div>
                  <div v-if="playerLookup[player.opp].team !== 'FA' && playerLookup[player.opp].team !== 'FA*'" class="team-matchup pull-right" >{{matchupLookup[playerLookup[player.opp].team].day}} {{matchupLookup[playerLookup[player.opp].team].time}} - <span :class="matchupPoints[playerLookup[player.opp].position][matchupLookup[playerLookup[player.opp].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.opp].position][matchupLookup[playerLookup[player.opp].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.opp].team].location}} {{matchupLookup[playerLookup[player.opp].team].vs}}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'matchup',
  data () {
    return {
      response: null,
      dataLoaded: true,
      newWeek: '',
      modalPlayer: '',
      search: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      league: 'league',
      liveScoring: 'liveScoring',
      projectedScores: 'projectedScores',
      fullNflSchedule: 'fullNflSchedule',
      pointsAllowed: 'pointsAllowed',
      currentWeek: 'currentWeek',
      matchupTeams: 'matchupTeams'
    }),
    teamA () {
      return this.matchupTeams.teamA
    },
    teamB () {
      return this.matchupTeams.teamB
    },
    playerLookup () {
      var array = this.players.player
      return this.lookup(array, 'id')
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    projectedLookup () {
      var array = this.projectedScores.playerScore
      return this.lookup(array, 'id')
    },
    matchupLookup () {
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
      var obj = {}
      var weekNumb = this.currentWeek - 1
      this.fullNflSchedule.nflSchedule[weekNumb].matchup.forEach((el, i) => {
        var date = new Date(el.kickoff * 1000)
        obj[el.team[0].id] = {
          vs: el.team[1].id,
          day: days[date.getDay()],
          time: ((date.getHours() === 0) ? '00' : date.getHours()) + ':' + ((date.getMinutes() === 0) ? '00' : date.getMinutes()),
          location: ((el.team[0].isHome === '0') ? '@' : 'vs')
        }
        obj[el.team[1].id] = {
          vs: el.team[0].id,
          day: days[date.getDay()],
          time: ((date.getHours() === 0) ? '00' : date.getHours()) + ':' + ((date.getMinutes() === 0) ? '00' : date.getMinutes()),
          location: ((el.team[1].isHome === '0') ? '@' : 'vs')
        }
      })
      return obj
    },
    matchupPoints () {
      var object = {}
      this.league.starters.position.forEach(el => {
        object[el.name] = this.matchupPointsUtil(el.name)
      })
      return object
    },
    allScoring () {
      var array = []
      this.liveScoring.matchup.forEach((el) => {
        el.franchise.forEach((el2) => {
          array.push(el2)
        })
      })
      return this.lookup(array, 'id')
    },
    scoringLookupTeamA () {
      var array = this.allScoring[this.teamA].players.player
      return this.lookup(array, 'id')
    },
    scoringLookupTeamB () {
      var array = this.allScoring[this.teamB].players.player
      return this.lookup(array, 'id')
    },
    totalProjected () {
      var obj = {}
      var team1 = 0
      var team2 = 0
      this.startersTeamA.forEach(el => {
        team1 += parseFloat(this.updatedProjection[el.id].projection)
      })
      this.startersTeamB.forEach(el => {
        team2 += parseFloat(this.updatedProjection[el.id].projection)
      })
      obj[this.teamA] = parseFloat(Math.round(team1 * 100) / 100).toFixed(2)
      obj[this.teamB] = parseFloat(Math.round(team2 * 100) / 100).toFixed(2)
      return obj
    },
    updatedProjection () {
      var obj = {}
      this.allScoring[this.teamA].players.player.forEach(el => {
        var score = parseFloat(this.scoringLookupTeamA[el.id].score)
        var projection = parseFloat(this.projectedLookup[el.id].score)
        var newProjection = ''
        var timeRemaining = parseFloat(this.scoringLookupTeamA[el.id].gameSecondsRemaining)
        if (!score) {
          score = 0
        }
        if (!projection) {
          projection = 0
        }
        var rate = projection / 3600
        newProjection = ((timeRemaining * rate) + score).toFixed(2)
        obj[el.id] = {projection: newProjection}
      })
      this.allScoring[this.teamB].players.player.forEach(el => {
        var score = parseFloat(this.scoringLookupTeamB[el.id].score)
        var projection = parseFloat(this.projectedLookup[el.id].score)
        var newProjection = ''
        var timeRemaining = parseFloat(this.scoringLookupTeamB[el.id].gameSecondsRemaining)
        if (!score) {
          score = 0
        }
        if (!projection) {
          projection = 0
        }
        var rate = projection / 3600
        newProjection = ((timeRemaining * rate) + score).toFixed(2)
        obj[el.id] = {projection: newProjection}
      })
      return obj
    },
    startersTeamA () {
      var starters = []
      var players = []
      this.allScoring[this.teamA].players.player.forEach(el => {
        if (el.status === 'starter') {
          players.push(el.id)
        }
      })
      this.positions.forEach((elarray) => {
        elarray.forEach((elPos) => {
          players.some((elId) => {
            if (this.playerLookup[elId].position === elPos) {
              var index = players.indexOf(elId)
              players.splice(index, 1)
              var position = elarray.length > 1 ? elarray.map((pos) => pos[0]).join('/') : elPos
              var obj = {
                id: this.playerLookup[elId].id,
                position: position
              }
              starters.push(obj)
            }
            return this.playerLookup[elId].position === elPos
          })
        })
      })
      return starters
    },
    startersTeamB () {
      var starters = []
      var players = []
      this.allScoring[this.teamB].players.player.forEach(el => {
        if (el.status === 'starter') {
          players.push(el.id)
        }
      })
      this.positions.forEach((elarray) => {
        elarray.forEach((elPos) => {
          players.some((elId) => {
            if (this.playerLookup[elId].position === elPos) {
              var index = players.indexOf(elId)
              players.splice(index, 1)
              var position = elarray.length > 1 ? elarray.map((pos) => pos[0]).join('/') : elPos
              var obj = {
                id: this.playerLookup[elId].id,
                position: position
              }
              starters.push(obj)
            }
            return this.playerLookup[elId].position === elPos
          })
        })
      })
      return starters
    },
    combinedStarters () {
      var teamA = this.startersTeamA
      var teamB = this.startersTeamB
      var combined = []
      var n = 0
      teamA.forEach(el => {
        el['opp'] = teamB[n].id
        combined.push(el)
        n++
      })
      return combined
    },
    benchTeamA () {
      var bench = []
      this.allScoring[this.teamA].players.player.forEach(el => {
        if (el.status === 'nonstarter') {
          var obj = {
            id: el.id
          }
          bench.push(obj)
        }
      })
      return bench
    },
    benchTeamB () {
      var bench = []
      this.allScoring[this.teamB].players.player.forEach(el => {
        if (el.status === 'nonstarter') {
          var obj = {
            id: el.id
          }
          bench.push(obj)
        }
      })
      return bench
    },
    combinedBench () {
      var benchTeamA = this.benchTeamA
      var benchTeamB = this.benchTeamB
      var combined = []
      var n = 0
      benchTeamA.forEach(el => {
        if (benchTeamB[n]) {
          el['opp'] = benchTeamB[n].id
          el['position'] = 'BN'
          combined.push(el)
        }
        n++
      })
      return combined
    },
    positions () {
      var pos = []
      var flex = []
      var kick = []
      var def = []
      var n = 0
      var m = 0
      this.league.starters.position.forEach((el) => {
        var min = 0
        var max = 0
        if (el.limit === '1' && el.name === 'Def') {
          def[0] = new Array(0)
          def[0].push(el.name)
        }
        else if (el.limit === '1' && el.name === 'K') {
          kick[0] = new Array(0)
          kick[0].push(el.name)
        }
        else if (el.limit.indexOf('-')) {
          min = el.limit.split('-')[0]
          max = el.limit.split('-')[1]
        }
        else {
          min = el.limit
          max = el.limit
        }
        for (var i = 0, len = min; i < len; i++) {
          pos[n] = new Array(0)
          pos[n].push(el.name)
          n++
        }
        for (var j = 0, len2 = (max - min); j < len2; j++) {
          if (!flex[m]) {
            flex[m] = new Array(0)
          }
          flex[m].push(el.name)
          m++
        }
        m = 0
      })
      var positions = pos.concat(flex, kick, def)
      return positions
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
    goToTeam (team) {
      this.$store.commit('SET_DATA', {type: 'displayTeam', data: team})
      this.$router.push('/team')
    },
    goToPlayer (id) {
      this.$store.commit('SET_DATA', {type: 'activePlayer', data: id})
      this.$router.push('/player')
    },
    matchupPointsUtil (pos) {
      var array = []
      var object = {}
      this.pointsAllowed.team.forEach(el => {
        var lookup = this.lookup(el.position, 'name')
        var obj = {
          team: el.id,
          points: lookup[pos].points
        }
        array.push(obj)
        object[el.id] = {
          points: lookup[pos].points
        }
      })
      array.sort(function (a, b) {
        if (a.points > b.points) return -1
        if (a.points < b.points) return 1
        return 0
      })
      array.forEach(el => {
        object[el.team].rank = array.findIndex(x => x.team === el.team) + 1
        object[el.team].rankPretty = this.pluralize(array.findIndex(x => x.team === el.team) + 1)
      })
      return object
    },
    pluralize: function (value) {
      value = value.toString()
      if (value.endsWith('1')) {
        value = value.toString() + 'st'
      }
      else if (value.endsWith('2')) {
        value = value.toString() + 'nd'
      }
      else if (value.endsWith('3')) {
        value = value.toString() + 'rd'
      }
      else {
        value = value.toString() + 'th'
      }
      return value
    }
  }
}
</script>