// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios'
import router from './router'

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework
Vue.use(VueAxios, axios)
Vue.use(VueAuthenticate, {
  tokenName: 'access_token',
  baseUrl: 'https://keepersync.com', // Your API domain
  providers: {
    yahoo: {
      clientId: 'dj0yJmk9UmVDY1loVEJNTUNZJmQ9WVdrOWJqRklRWGswTjJzbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02YQ--',
      clientSecret: '88246a0b691a0722280325fccb65d7905c45c92f',
      redirectUri: 'https://keepersync.com/auth/yahoo/callback'
    }
  }
})

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    render: h => h(require('./App').default)
  })
})
