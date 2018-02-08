<template>
  <div class="draftboard">
    <div
      v-for="(round, key) in draftBoard"
      :key="key"
      class="row no-wrap"
    >
      <div 
        class="pick"
        v-for="(pick, key2) in round"
        :key="key2"
        :class="playerLookup[pick.player].position"
      >
        <div
          class="player-wrap"
        >
          <div class="row position text-dark strong">
            <span class="col-9">{{playerLookup[pick.player].position}} - {{playerLookup[pick.player].team}}</span>
            <span class="col-3 text-right">{{parseInt(pick.pick) + ((parseInt(pick.round) - 1) * teamCount)}}</span>
          </div>
          <div class="name row text-dark light-paragraph ellipsis">{{playerLookup[pick.player].name.split(', ')[1]}}</div>
          <div class="name row text-dark strong ellipsis">{{playerLookup[pick.player].name.split(', ')[0]}}</div>
        </div>
        <div
          class="franchise-wrap"
          :class="playerLookup[pick.player].position"
        >
          <div class="franchise row ellipsis text-white">{{teamLookup[pick.franchise].name}}</div>
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
  padding 2px
.draftboard .player-wrap
  padding 2px
.draftboard .franchise-wrap
  border-bottom-left-radius 6px
  border-bottom-right-radius 6px
  padding 2px
  background-color $blue-grey-14
.draftboard .pick
  margin 1px
  border-radius 6px
  min-width 100px
  max-width 100px
  background-color $blue-grey-11
.draftboard .pick .position
  font-size 12px
.draftboard .pick.QB
  background-color $amber-11
.draftboard .pick.WR
  background-color $light-blue-11
.draftboard .pick.RB
  background-color $green-11
.draftboard .pick.TE
  background-color $red-11
.draftboard .franchise-wrap.QB
  background-color $amber-14
.draftboard .franchise-wrap.WR
  background-color $light-blue-14
.draftboard .franchise-wrap.RB
  background-color $green-14
.draftboard .franchise-wrap.TE
  background-color $red-14
.draftboard .pick .name
  font-size 16px
.draftboard .pick .franchise
  font-size 12px
</style>

