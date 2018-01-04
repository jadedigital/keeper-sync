<template>
  <!-- Don't drop "q-app" class -->
  <div>
    <transition :name="transitionName">
      <keep-alive>
        <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
/*
 * Root component
 */
export default {
  data () {
    return {
      transitionName: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  beforeRouteUpdate (to, from, next) {
    var baseRoute = to.path.split('/')[1]
    this.transitionName = baseRoute === 'user' ? 'overlap-left' : 'overlap-right'
    next()
  }
}
</script>

<style>
.child-view {
  width: 100%;
  position: absolute;
  transition: all .5s cubic-bezier(.55,0,.1,1);
}
.overlap-left-enter, .overlap-left-enter-active {
  opacity: 0;
}
.overlap-left-enter-to {
  opacity: 1;
}
.overlap-left-leave-active {
  transform: translate(100%, 0);
}
.overlap-right-leave-active {
  z-index: -1;
  opacity: 1;
}
.overlap-right-enter {
  transform: translate(100%, 0);
}
</style>
