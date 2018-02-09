<template>
  <div class="draftboard">
    <div class="row no-wrap">
      <div 
        class="team-row text-center bg-primary text-white"
        v-for="(team, key) in teamCount"
        :key="key"
      >
        {{team}}
      </div>
    </div>
    <div
      v-for="(round, key) in draftBoard"
      :key="key"
      class="row no-wrap"
    >
      <div 
        class="pick"
        v-for="(pick, key2) in round"
        :key="key2"
        
      >
        <div
          class="player-wrap"
          :class="playerLookup[pick.player].position"
        >
          <div class="row position text-white">
            <span class="col-9">{{playerLookup[pick.player].position}} - {{playerLookup[pick.player].team}}</span>
            <span class="col-3 text-right">{{parseInt(pick.pick) + ((parseInt(pick.round) - 1) * teamCount)}}</span>
          </div>
        </div>
        <div
          class="franchise-wrap"
        >
          <div class="name row text-dark light-paragraph ellipsis">{{playerLookup[pick.player].name.split(', ')[1]}}</div>
          <div class="last-name row text-dark strong ellipsis">{{playerLookup[pick.player].name.split(', ')[0]}}</div>
          <div class="franchise row ellipsis">{{teamLookup[pick.franchise].name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QChip
} from 'quasar'
import { mapGetters } from 'vuex'
import { lookup } from '../utils'

export default {
  name: 'BDraft',
  components: {
    QChip
  },
  data () {
    return {
      data: ''
    }
  },
  computed: {
    ...mapGetters({
      players: 'players',
      league: 'league',
      draftResults: 'draftResults'
    }),
    teamCount () {
      return parseInt(this.league.franchises.count)
    },
    playerLookup () {
      var array = this.players.player
      return lookup(array, 'id')
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return lookup(array, 'id')
    },
    draftBoard () {
      var draftArray = this.draftResults.draftUnit.draftPick
      var pick = 0
      var arr = []
      var arrChild = []

      draftArray.forEach(el => {
        arrChild.push(el)
        pick++
        if (pick === this.teamCount) {
          arr.push(arrChild)
          arrChild = []
          pick = 0
        }
      })
      if (this.draftResults.draftUnit.draftType === 'SDRAFT') {
        arr.forEach((el, index) => {
          if ((index % 2) === 1) {
            el.reverse()
          }
        })
      }
      return arr
    }
  },
  methods: {

  }
}
</script>

<style lang="stylus">
@import '~variables'
.draftboard
  overflow scroll
  padding 4px
.draftboard .player-wrap
  background-color $blue-grey-14
  padding 3px
  border-top-left-radius 6px
  border-top-right-radius 6px
.draftboard .franchise-wrap
  border-bottom-left-radius 6px
  border-bottom-right-radius 6px
  padding 3px
  background-color $indigo-1
.draftboard .pick
  margin 2px
  border-radius 6px
  min-width 100px
  max-width 100px
.draftboard .pick .position
  font-size 12px
.draftboard .player-wrap.QB
  background-color $amber-14
.draftboard .player-wrap.WR
  background-color $light-blue-14
.draftboard .player-wrap.RB
  background-color $green-14
.draftboard .player-wrap.TE
  background-color $red-14
.draftboard .pick .name
  font-weight 500
  font-size 14px
.draftboard .pick .last-name
  font-size 18px
.draftboard .pick .franchise
  padding-top 4px
  font-size 12px
.draftboard .team-row
  margin 2px
  border-radius 6px
  min-width 100px
  max-width 100px
  width 100px
</style>

