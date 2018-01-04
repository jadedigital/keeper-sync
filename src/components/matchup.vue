<template>
  <q-pull-to-refresh :handler="refresher">
    <div class="contain-main">
      <div class="row items-center border-bottom matchup-header">
        <div class="col-5 matchup">
          <div class="row items-center">
            <div class="col-12">
              <div class="team-name pull-right">
                {{teamLookup[myTeam].name}}
              </div>
            </div>
          </div>
          <div class="row items-center">
            <div class="col-6">
              <img v-if="teamLookup[myTeam].icon" :src="teamLookup[myTeam].icon" class="q-item-avatar"/>
              <img v-else :src="teamLookup[myTeam].icon" class="q-item-avatar"/>
            </div>
            <div class="col-6">
              <div class="total-score pull-right">{{myScoring[myTeam].score}}</div>
            </div>
          </div>
        </div>
        <div class="col-2 matchup"></div>
        <div class="col-5 matchup">
          <div class="row items-center">
            <div class="col-12">
              <div class="team-name">
                {{teamLookup[opponent].name}}
              </div>
            </div>
          </div>
          <div class="row items-center">
            <div class="col-6">
              <div class="total-score">{{myScoring[opponent].score}}</div>
            </div>
            <div class="col-6">
              <img v-if="teamLookup[opponent].icon" :src="teamLookup[opponent].icon" class="q-item-avatar pull-right"/>
              <img v-else :src="teamLookup[opponent].icon" class="q-item-avatar pull-right"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="separator-title text-center border-bottom">Starters</div>
        </div>
      </div>
      <div v-for="player in combinedStarters" :key="player.id">
        <div class="row">
          <div class="col-5 matchup">
            <div class="matchup-list">
              <div class="list-item border-bottom">
                <div class="row">
                  <div class="col-9 team-name-container">
                    <div class="team-name pull-left" >{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <div class="team">{{playerLookup[player.id].team}}</div></div>
                    <div class="team-matchup pull-left" >{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}}</span></div>
                  </div>
                  <div class="col-3">
                    <div class="team-score pull-right" >{{scoringLookup[player.id].score}}</div>
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
          <div class="col-5 matchup">
            <div class="matchup-list">
              <div class="list-item border-bottom">
                <div class="row">
                  <div class="col-3">
                    <div class="team-score pull-left" >{{opponentScoringLookup[player.opp].score}}</div>
                    <div class="team-projection pull-left" >{{ updatedProjection[player.opp].projection }}</div>
                  </div>
                  <div class="col-9 team-name-container">
                    <div class="team-name pull-right" >{{playerLookup[player.opp].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.opp].name.split(', ').slice(0, -1).join(' ')}}<div class="team"> {{playerLookup[player.opp].team}}</div></div>
                    <div class="team-matchup pull-right" >{{matchupLookup[playerLookup[player.opp].team].day}} {{matchupLookup[playerLookup[player.opp].team].time}} - <span :class="matchupPoints[playerLookup[player.opp].position][matchupLookup[playerLookup[player.opp].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.opp].position][matchupLookup[playerLookup[player.opp].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.opp].team].location}} {{matchupLookup[playerLookup[player.opp].team].vs}}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="separator-title text-center border-bottom">Bench</div>
        </div>
      </div>
      <div v-for="player in combinedBench" :key="player.id">
        <div class="row">
          <div class="col-5 matchup">
            <div class="matchup-list">
              <div class="list-item border-bottom">
                <div class="row">
                  <div class="col-9 team-name-container">
                    <div class="team-name pull-left" >{{playerLookup[player.id].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.id].name.split(', ').slice(0, -1).join(' ')}} <div class="team">{{playerLookup[player.id].team}}</div></div>
                    <div class="team-matchup pull-left" >{{matchupLookup[playerLookup[player.id].team].day}} {{matchupLookup[playerLookup[player.id].team].time}} - <span :class="matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.id].position][matchupLookup[playerLookup[player.id].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.id].team].location}} {{matchupLookup[playerLookup[player.id].team].vs}}</span></div>
                  </div>
                  <div class="col-3">
                    <div class="team-score pull-right" >{{scoringLookup[player.id].score}}</div>
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
          <div class="col-5 matchup">
            <div class="matchup-list">
              <div class="list-item border-bottom">
                <div class="row">
                  <div class="col-3">
                    <div class="team-score pull-left" >{{opponentScoringLookup[player.opp].score}}</div>
                    <div class="team-projection pull-left" >{{ updatedProjection[player.opp].projection }}</div>
                  </div>
                  <div class="col-9 team-name-container">
                    <div class="team-name pull-right" >{{playerLookup[player.opp].name.split(', ').slice(1).join(' ').charAt(0)}} . {{playerLookup[player.opp].name.split(', ').slice(0, -1).join(' ')}}<div class="team"> {{playerLookup[player.opp].team}}</div></div>
                    <div class="team-matchup pull-right" >{{matchupLookup[playerLookup[player.opp].team].day}} {{matchupLookup[playerLookup[player.opp].team].time}} - <span :class="matchupPoints[playerLookup[player.opp].position][matchupLookup[playerLookup[player.opp].team].vs].rank < 11 ? 'text-positive' : matchupPoints[playerLookup[player.opp].position][matchupLookup[playerLookup[player.opp].team].vs].rank < 21 ? 'text-warning' : 'text-negative'">{{matchupLookup[playerLookup[player.opp].team].location}} {{matchupLookup[playerLookup[player.opp].team].vs}}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>

    <q-modal class="player-modal" ref="layoutModal" transition="slide-fade" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
      <q-modal-layout v-if="modalPlayer" class="player-header">
        <q-toolbar class= "bg-blue-grey-9 text-white" slot="header">
          <q-btn flat @click="$refs.layoutModal.close()">
            <q-icon name="arrow_back" />
          </q-btn>
        </q-toolbar>
        <div class="player-info bg-blue-grey-9 text-white row reverse items-center">
          <ul class="col-6 player-info-list">
            <li>Team: <span>{{playerLookup[modalPlayer].team}} #{{playerLookup[modalPlayer].jersey}}</span></li>
            <li>HT/WT: <span>{{parseInt(playerLookup[modalPlayer].height / 12)}}'{{playerLookup[modalPlayer].height % 12}}"/{{playerLookup[modalPlayer].weight}}lbs</span></li>
            <li>Age: <span>{{(new Date(Date.now()).getFullYear() - new Date(playerLookup[modalPlayer].birthdate * 1000).getFullYear())}}</span></li>
            <li>Exp: <span>{{new Date(Date.now()).getFullYear() - playerLookup[modalPlayer].draft_year}}</span><span v-if="playerLookup[modalPlayer].status === 'R'">({{playerLookup[modalPlayer].status}})</span></li>
            <li>College: <span>{{playerLookup[modalPlayer].college}}</span></li>
          </ul>
          <div class="col-6">
            <div class="row justify-center">
              <img class="player-img" :src="'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + playerLookup[modalPlayer].cbs_id + '.jpg'" alt="">
            </div>
          </div>
        </div>
        <div class="player-actions pull-right">
          <q-fab
            color="primary"
            icon="compare_arrows"
            direction="down"
          >
            <q-fab-action
              color="red"
              icon="remove"
            />
            <q-fab-action
              color="blue"
              icon="local_hospital"
            />
          </q-fab>
        </div>
        <div class="player-name-main q-toolbar-title">
          {{playerLookup[modalPlayer].name.split(', ').reverse().join(' ')}}
          <div class="q-toolbar-subtitle">{{playerLookup[modalPlayer].position}}</div>
        </div>
        <q-tabs inverted class="secondary-tabs">
          <q-tab default slot="title" name="tab-1" label="News" />
          <q-tab slot="title" name="tab-2" label="Game Log"/>
        </q-tabs>
      </q-modal-layout>
    </q-modal>
  </q-pull-to-refresh>
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
  QTabs,
  QTab,
  QTabPane,
  QCard,
  ActionSheet,
  Toast,
  QPullToRefresh,
  QCardTitle,
  QCardSeparator,
  QToolbar,
  QSearch,
  QIcon,
  QModal,
  QModalLayout,
  QFab,
  QFabAction
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi } from '../data'

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
    QTabs,
    QTab,
    QTabPane,
    QPullToRefresh,
    QCard,
    QCardTitle,
    QCardSeparator,
    QToolbar,
    QSearch,
    QIcon,
    QModal,
    QModalLayout,
    QFab,
    QFabAction
  },
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
      currentWeek: 'currentWeek'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    rosterLookup () {
      var array = this.rosters.franchise
      return this.lookup(array, 'id')
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
    updatedProjection () {
      var obj = {}
      this.myScoring[this.myTeam].players.player.forEach(el => {
        var score = parseFloat(this.scoringLookup[el.id].score)
        var projection = parseFloat(this.projectedLookup[el.id].score)
        var newProjection = ''
        var timeRemaining = parseFloat(this.scoringLookup[el.id].gameSecondsRemaining)
        if (!score) {
          score = 0
        }
        var rate = projection / 3600
        newProjection = ((timeRemaining * rate) + score).toFixed(2)
        obj[el.id] = {projection: newProjection}
      })
      this.myScoring[this.opponent].players.player.forEach(el => {
        var score = parseFloat(this.opponentScoringLookup[el.id].score)
        var projection = parseFloat(this.projectedLookup[el.id].score)
        var newProjection = ''
        var timeRemaining = parseFloat(this.opponentScoringLookup[el.id].gameSecondsRemaining)
        if (!score) {
          score = 0
        }
        var rate = projection / 3600
        newProjection = ((timeRemaining * rate) + score).toFixed(2)
        obj[el.id] = {projection: newProjection}
      })
      return obj
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
      var object = {
        QB: this.matchupPointsUtil('QB'),
        RB: this.matchupPointsUtil('RB'),
        WR: this.matchupPointsUtil('WR'),
        TE: this.matchupPointsUtil('TE'),
        Def: this.matchupPointsUtil('Def')
      }
      return object
    },
    myScoring () {
      var array = []
      this.liveScoring.matchup.forEach((el) => {
        el.franchise.forEach((el2) => {
          array.push(el2)
        })
      })
      return this.lookup(array, 'id')
    },
    opponent () {
      var array = []
      var opponent = ''
      this.liveScoring.matchup.forEach((el) => {
        el.franchise.forEach((el2) => {
          if (el2.id === this.myTeam) {
            array.push(el)
          }
        })
      })
      array.forEach(el => {
        el.franchise.forEach((el2) => {
          if (el2.id !== this.myTeam) {
            opponent = el2.id
          }
        })
      })
      return opponent
    },
    scoringLookup () {
      var array = this.myScoring[this.myTeam].players.player
      return this.lookup(array, 'id')
    },
    opponentScoringLookup () {
      var array = this.myScoring[this.opponent].players.player
      return this.lookup(array, 'id')
    },
    startersOld () {
      var starters = []
      var players = []
      this.myScoring[this.myTeam].players.player.forEach(el => {
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
    opponentStarters () {
      var starters = []
      var players = []
      this.myScoring[this.opponent].players.player.forEach(el => {
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
      var myStarters = this.startersOld
      var oppStarters = this.opponentStarters
      var combined = []
      var n = 0
      myStarters.forEach(el => {
        el['opp'] = oppStarters[n].id
        combined.push(el)
        n++
      })
      return combined
    },
    bench () {
      var bench = []
      this.myScoring[this.myTeam].players.player.forEach(el => {
        if (el.status === 'nonstarter') {
          var obj = {
            id: el.id
          }
          bench.push(obj)
        }
      })
      return bench
    },
    opponentBench () {
      var bench = []
      this.myScoring[this.opponent].players.player.forEach(el => {
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
      var myBench = this.bench
      var oppBench = this.opponentBench
      var combined = []
      var n = 0
      myBench.forEach(el => {
        el['opp'] = oppBench[n].id
        el['position'] = 'BN'
        combined.push(el)
        n++
      })
      return combined
    },
    positionsBasic () {
      var pos = []
      this.league.starters.position.forEach((el) => {
        pos.push(el.name)
      })
      return pos
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
    launch (url) {
      close()
      openURL(url, '_self')
    },
    goPlayer (id) {
      this.$router.push('/player/' + id)
    },
    goPlayerModal (id) {
      this.modalPlayer = id
      this.$refs.layoutModal.open()
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
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
    },
    showAS (name) {
      var actions = []
      this.startersOld.forEach((el) => {
        var action = {
          label: this.playerLookup[el.id].name,
          avatar: 'https://sports.cbsimg.net/images/football/nfl/players/100x100/' + this.playerLookup[el.id].cbs_id + '.jpg',
          handler () {
            Toast.create('API call to submit lineup')
          }
        }
        actions.push(action)
      })
      ActionSheet.create({
        title: 'Move ' + name.split(', ').reverse().join(' '),
        actions: actions,
        dismiss: {
          label: 'Cancel',
          handler () {
            Toast.create('Cancelled...')
          }
        }
      })
    },
    refresher (done) {
      callApi()
      done()
    }
  }
}
</script>

<style lang="stylus">
.matchup-header
  height 100px
.matchup-header .team-name
  font-size 14px
  padding-bottom 4px
.matchup-header .q-item-avatar
  margin-left 10px
  margin-right 10px
.matchup-header .total-score
  font-weight 700
.matchup-list
  font-size 12px
.matchup-list .list-item
  height 48px
  padding 6px 4px
.matchup-list .team-name
  font-weight 500
  padding-bottom 2px
.team-name-container
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.matchup-list .team
  display inline
  font-weight 300
  font-size 12px
.matchup-list .team-score
  font-size 12px
  font-weight 500
  padding-bottom 2px
.matchup-list .team-projection
  font-size 12px
  font-weight 300
.matchup-list .team-matchup
  font-size 12px
  font-weight 300
  white-space nowrap
.position-list .positions
  height 48px
  text-align center
  font-size 9px
  font-weight 500
.matchup.col-5
  max-width 45%
  flex 0 0 45%
.matchup.col-2
  max-width 10%
  flex 0 0 10%
</style>
