import Vue from 'vue'
import VueRouter from 'vue-router'
import LocalStorage from 'quasar'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    { path: '/',
      component: load('index'),
      meta: { requiresAuth: true },
      beforeEach: (to, from, next) => {
        if (to.matched.some(record => record.meta.requiresAuth)) {
          // this route requires auth, check if logged in
          // if not, redirect to login page.
          if (LocalStorage.has('leagueData')) {
            next({
              path: '/login',
              query: { redirect: to.fullPath }
            })
          }
          else {
            next()
          }
        }
        else {
          next() // make sure to always call next()!
        }
      },
      children: [
        {
          path: 'team',
          component: load('team'),
          meta: { requiresAuth: true }
        },
        {
          path: 'league',
          component: load('league'),
          meta: { requiresAuth: true }
        },
        {
          path: 'draft',
          component: load('draft'),
          meta: { requiresAuth: true }
        },
        {
          path: 'players',
          component: load('players'),
          meta: { requiresAuth: true }
        }
      ]
    },
    { path: '/callback', component: load('Callback') },
    { path: '/login', component: load('login') },
    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})