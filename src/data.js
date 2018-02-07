import axios from 'axios'
import store from './store'
import { LocalStorage, Toast } from 'quasar'
import { arrayCheck } from './utils'

export function callApi (week, types) {
  let data = LocalStorage.get.item('leagueData')
  var leagueId = Object.keys(data)[0]
  store.commit('SET_LEAGUE_DATA', data)
  store.commit('CHANGE_ACTIVE_LEAGUE', leagueId)

  var rosterParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'rosters',
    L: leagueId,
    JSON: 1
  }
  var playerParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'players',
    DETAILS: 1,
    JSON: 1
  }
  var injuriesParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'injuries',
    JSON: 1
  }
  var leagueParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'league',
    L: leagueId,
    JSON: 1
  }
  var standingsParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'leagueStandings',
    L: leagueId,
    JSON: 1
  }
  var freeAgentsParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'freeAgents',
    L: leagueId,
    JSON: 1
  }
  var projectedScoresParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'projectedScores',
    L: leagueId,
    W: week,
    COUNT: 3000,
    JSON: 1
  }
  var topAddsParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'topAdds',
    JSON: 1
  }
  var topOwnsParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'topOwns',
    JSON: 1
  }
  var nflScheduleParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'nflSchedule',
    W: 'ALL',
    JSON: 1
  }
  var liveScoringParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'liveScoring',
    L: leagueId,
    W: week,
    DETAILS: 1,
    JSON: 1
  }
  var pointsAllowedParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'pointsAllowed',
    L: leagueId,
    JSON: 1
  }

  var requests = []
  if (types) {
    requests = types
  }
  else {
    requests = [
      {
        type: 'rosters',
        value: 'rosters',
        params: rosterParams,
        timeOut: 3600000
      },
      {
        type: 'players',
        value: 'players',
        params: playerParams,
        timeOut: 3600000
      },
      {
        type: 'leagueStandings',
        value: 'leagueStandings',
        params: standingsParams,
        timeOut: 3600000
      },
      {
        type: 'freeAgents',
        value: 'freeAgents',
        params: freeAgentsParams,
        timeOut: 3600000
      },
      {
        type: 'league',
        value: 'league',
        params: leagueParams,
        timeOut: 3600000
      },
      {
        type: 'projectedScores',
        value: 'projectedScores',
        params: projectedScoresParams,
        timeOut: 3600000
      },
      {
        type: 'topAdds',
        value: 'topAdds',
        params: topAddsParams,
        timeOut: 3600000
      },
      {
        type: 'topOwns',
        value: 'topOwns',
        params: topOwnsParams,
        timeOut: 3600000
      },
      {
        type: 'fullNflSchedule',
        value: 'fullNflSchedule',
        params: nflScheduleParams,
        timeOut: 3600000
      },
      {
        type: 'liveScoring',
        value: 'liveScoring',
        params: liveScoringParams,
        timeOut: 3600000
      },
      {
        type: 'pointsAllowed',
        value: 'pointsAllowed',
        params: pointsAllowedParams,
        timeOut: 3600000
      },
      {
        type: 'injuries',
        value: 'injuries',
        params: injuriesParams,
        timeOut: 3600000
      }
    ]
  }

  var url = 'https://keepersync.com/mfl/export'
  var promises = []
  requests.forEach(el => {
    var timeCheck = Date.now()
    let lastTime = LocalStorage.get.item(el.type + '_time')
    var diff = timeCheck - lastTime
    if (diff > el.timeOut) {
      console.log('fetching ' + el.type + ' data from server')
      promises.push(axios.get(url, {
        params: el.params
      })
        .then((response) => {
          console.log(el)
          console.log(el.value)
          var responseData = JSON.parse(response.data)
          LocalStorage.set(el.type, responseData[el.value])
          store.commit('SET_DATA', {type: el.type, data: responseData[el.value]})
          var key = el.type + '_time'
          var time = Date.now()
          LocalStorage.set(key, time)
          return responseData
        })
        .catch((error) => {
          if (error) {
            Toast.create("Can't fetch " + el.type + ' data from MFL servers. Please try again later')
            return error
          }
        })
      )
    }
  })

  return Promise.all(promises)
}

export function loadData (data) {
  var dataArray = []
  if (data) {
    dataArray = data
  }
  else {
    dataArray = [
      'leagueData',
      'activeLeague',
      'rosters',
      'players',
      'leagueStandings',
      'freeAgents',
      'league',
      'projectedScores',
      'topAdds',
      'topOwns',
      'fullNflSchedule',
      'liveScoring',
      'pointsAllowed',
      'playerScores',
      'currentWeek',
      'topStarters',
      'topDrops',
      'injuries'
    ]
  }
  dataArray.forEach(el => {
    var timecheck = el + '_time'
    if (LocalStorage.has(timecheck)) {
      console.log('loading ' + el + ' data from cache')
      let cacheData = LocalStorage.get.item(el)
      store.commit('SET_DATA', {type: el, data: cacheData})
    }
  })
}

export function getWeek () {
  let data = LocalStorage.get.item('leagueData')
  var leagueId = Object.keys(data)[0]
  var nflScheduleParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'nflSchedule',
    JSON: 1
  }
  var url = 'https://keepersync.com/mfl/export'

  return axios.get(url, {
    params: nflScheduleParams
  })
    .then((response) => {
      var responseData = JSON.parse(response.data)
      var timeLeft = 0
      var week = ''
      var schedule = arrayCheck(responseData.nflSchedule.matchup)
      schedule.forEach(el => {
        timeLeft += parseFloat(el.gameSecondsRemaining)
      })
      if (timeLeft > 0) {
        week = parseFloat(responseData.nflSchedule.week)
      }
      else {
        week = parseFloat(responseData.nflSchedule.week) + 1
      }
      return week
    })
    .catch((error) => {
      if (error) {
        Toast.create("Can't fetch nflSchedule data from MFL servers. Please try again later")
        return error
      }
    })
}

export function getLeagueData () {
  console.log('fetching league data from server')
  let data = LocalStorage.get.item('leagueData')
  var leagueId = Object.keys(data)[0]
  var leagueParams = {
    cookie: data[leagueId].cookie,
    host: data[leagueId].host,
    TYPE: 'league',
    L: leagueId,
    JSON: 1
  }
  var url = 'https://keepersync.com/mfl/export'

  return axios.get(url, {
    params: leagueParams
  })
    .then((response) => {
      var responseData = JSON.parse(response.data)
      LocalStorage.set('league', responseData['league'])
      store.commit('SET_DATA', {type: 'league', data: responseData['league']})
      var key = 'league_time'
      var time = Date.now()
      LocalStorage.set(key, time)
      return responseData
    })
    .catch((error) => {
      if (error) {
        Toast.create("Can't fetch league data from MFL servers. Please try again later")
        return error
      }
    })
}

export function getPlayerNews (player) {
  var queryParams = {
    player: parseInt(player)
  }
  var url = 'https://keepersync.com/playernews'

  return axios.get(url, {
    params: queryParams
  })
    .then((response) => {
      return response
    })
    .catch((error) => {
      if (error) {
        Toast.create("Can't fetch news. Please try again later")
        return error
      }
    })
}

export function getPlayerStats (player) {
  var queryParams = {
    player: parseInt(player)
  }
  var url = 'https://keepersync.com/playerstats'

  return axios.get(url, {
    params: queryParams
  })
    .then((response) => {
      return response
    })
    .catch((error) => {
      if (error) {
        Toast.create("Can't fetch stats. Please try again later")
        return error
      }
    })
}

export function getChats (host, league, cookie) {
  var queryParams = {
    host: host,
    league: league,
    cookie: cookie
  }
  var url = 'https://keepersync.com/mfl/chat'

  return axios.get(url, {
    params: queryParams
  })
    .then((response) => {
      var responseData = response.data
      console.log(responseData)
      LocalStorage.set('chat', responseData['messages'])
      store.commit('SET_DATA', {type: 'chat', data: responseData['messages']})
      return response
    })
    .catch((error) => {
      if (error) {
        throw error
      }
    })
}
