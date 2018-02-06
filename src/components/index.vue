<template>
  <div>
    <div class="bg-primary" v-if="!dataLoaded" style="height: 100vh;">
      <b-spinner class="absolute-center"/>
    </div>
    <transition v-if="dataLoaded" :name="transitionName">
      <keep-alive>
        <router-view class="child-slide"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
/*
 * Root component
 */
import { LocalStorage } from 'quasar'
import { loadData } from '../data'
import bSpinner from './bSpinner.vue'

export default {
  components: {
    bSpinner
  },
  data () {
    return {
      dataLoaded: false,
      transitionName: '',
      routeMap: {
        user: 1,
        login: 2,
        matchup: 3,
        team: 4,
        player: 5,
        thread: 6,
        message: 7,
        newmessage: 8,
        settings: 10
      }
    }
  },
  methods: {
    fetchData () {
      if (LocalStorage.has('leagueData')) {
        loadData()
      }
      this.dataLoaded = true
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  beforeRouteUpdate (to, from, next) {
    var fromRoute = from.path.split('/')[1]
    var toRoute = to.path.split('/')[1]
    this.transitionName = this.routeMap[toRoute] < this.routeMap[fromRoute] ? 'overlap-left' : 'overlap-right'
    next()
  },
  created () {
    setTimeout(this.fetchData, 0)
  }
}
</script>

<style lang="stylus">
.child-slide
  width 100%
  min-height 100%
  position absolute
  transition all 0.4s
.overlap-left-enter-active 
  z-index -1
  position fixed
.overlap-left-enter 
  transform translate(-20%, 0)
  position fixed
.overlap-left-leave-active 
  transform translate(100%, 0)
.overlap-right-leave-active 
  z-index -1
  transform translate(-20%, 0)
  position fixed
.overlap-right-enter 
  transform translate(100%, 0)
.overlay
  z-index 4500
  position fixed
  top 0
  left 0
  width 100%
  height 100%
</style>
