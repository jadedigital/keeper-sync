import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

const router = new VueRouter({
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
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    else {
      return { x: 0, y: 0 }
    }
  },

  routes: [
    { path: '/',
      component: load('index'),
      redirect: {name: 'team'},
      children: [
        { path: 'user',
          component: load('layout'),
          redirect: {name: 'team'},
          name: 'user',
          meta: { requiresAuth: true },
          children: [
            {
              path: 'team',
              name: 'team',
              component: load('team'),
              meta: { requiresAuth: true }
            },
            {
              path: 'league',
              component: load('league'),
              name: 'league',
              meta: { requiresAuth: true }
            },
            {
              path: 'draft',
              component: load('draft'),
              meta: { requiresAuth: true }
            },
            {
              path: 'matchup',
              component: load('matchup'),
              meta: { requiresAuth: true }
            },
            {
              path: 'players',
              component: load('players'),
              meta: { requiresAuth: true }
            }
          ]
        },
        { path: 'callback', component: load('Callback') },
        { path: '/login', component: load('login') },
        {
          path: 'team',
          component: load('teamOther'),
          name: 'teamOther',
          meta: { requiresAuth: true }
        },
        {
          path: 'player',
          component: load('player'),
          name: 'player',
          meta: { requiresAuth: true }
        },
        {
          path: 'message',
          component: load('message'),
          name: 'message',
          meta: { requiresAuth: true }
        },
        {
          path: 'newmessage',
          component: load('newmessage'),
          name: 'newmessage',
          meta: { requiresAuth: true }
        },
        {
          path: 'matchup',
          component: load('matchupOther'),
          name: 'matchupOther',
          meta: { requiresAuth: true }
        }
      ]
    },
    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (localStorage.getItem('leagueData') === null) {
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
})

export default router
