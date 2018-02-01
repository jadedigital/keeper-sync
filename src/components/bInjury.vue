<template>
  <div v-if="injuryLookup[player]">
    <span v-if="!details">
      <q-chip color="tertiary">
        {{map[injuryLookup[player].status]}}
      </q-chip>
    </span>
    <span v-if="details">
      <q-chip color="tertiary">
        {{map[injuryLookup[player].status] + ' - ' + injuryLookup[player].details.trim()}}
      </q-chip>
    </span>
  </div>
</template>

<script>
import {
  QChip
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'BInjury',
  components: {
    QChip
  },
  props: {
    player: String,
    details: Boolean
  },
  data () {
    return {
      map: {
        'Questionable': 'Q',
        'IR': 'IR',
        'Suspended': 'SUS',
        'Out': 'O',
        'Ir-nfi': 'IR',
        'Ir-pup': 'IR'
      }
    }
  },
  computed: {
    ...mapGetters({
      injuries: 'injuries'
    }),
    injuryLookup () {
      var array = this.injuries.injury
      return this.lookup(array, 'id')
    }
  },
  methods: {
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    }
  }
}
</script>
