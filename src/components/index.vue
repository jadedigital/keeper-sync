<template>
  <div>
    <div v-if="!dataLoaded" class="bg-primary" style="height: 100vh;">  
      <q-spinner color="white" size="40px" class="absolute-center" style="margin-left: -20px;"/>
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
import { QSpinner, LocalStorage } from 'quasar'
import { loadData } from '../data'

export default {
  components: {
    QSpinner
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
      if (LocalStorage.has('settings')) {
        var settings = LocalStorage.get.item('settings')
        this.$store.commit('SET_DATA', {type: 'settings', data: settings})
      }
      this.dataLoaded = true
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  beforeRouteUpdate (to, from, next) {
    var fromRoute = ''
    var toRoute = ''
    if (from.path.split('/')[1] === 'settings' && to.path.split('/')[1] === 'settings') {
      fromRoute = from.path.split('/').length
      toRoute = to.path.split('/').length
      this.transitionName = toRoute < fromRoute ? 'overlap-left' : 'overlap-right'
    }
    else {
      fromRoute = from.path.split('/')[1]
      toRoute = to.path.split('/')[1]
      this.transitionName = this.routeMap[toRoute] < this.routeMap[fromRoute] ? 'overlap-left' : 'overlap-right'
    }
    next()
  },
  created () {
    setTimeout(this.fetchData, 2000)
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
