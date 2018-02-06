<template>
  <div class="spinner-wrap shadow-3">
    <q-spinner color="secondary" size="24px"/>
  </div>
</template>

<script>
import {
  QSpinner
} from 'quasar'

export default {
  name: 'bSpinner',
  components: {
    QSpinner
  }
}
</script>

<style lang="stylus">
.spinner-wrap
  height 36px
  width 36px
  padding 6px
  background-color #ffffff
  border-radius 50%
</style>
  