import axios from 'axios'
import store from './store'
import { LocalStorage, Toast } from 'quasar'

export function callApi () {
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

  var requests = [
    {
      type: 'rosters',
      params: rosterParams
    },
    {
      type: 'players',
      params: playerParams,
      timeOut: 86400
    },
    {
      type: 'leagueStandings',
      params: standingsParams
    },
    {
      type: 'freeAgents',
      params: freeAgentsParams
    },
    {
      type: 'league',
      params: leagueParams
    },
    {
      type: 'projectedScores',
      params: projectedScoresParams
    },
    {
      type: 'topAdds',
      params: topAddsParams
    },
    {
      type: 'topOwns',
      params: topOwnsParams
    },
    {
      type: 'fullNflSchedule',
      params: nflScheduleParams
    },
    {
      type: 'liveScoring',
      params: liveScoringParams
    },
    {
      type: 'pointsAllowed',
      params: pointsAllowedParams
    }
  ]
  var url = 'https://keepersync.com/mfl/export'
  var promises = []
  requests.forEach(el => {
    var timeCheck = Date.now()
    let lastTime = LocalStorage.get.item(el.type + '_time')
    var diff = timeCheck - lastTime
    console.log(diff)
    promises.push(axios.get(url, {
      params: el.params
    })
      .then((response) => {
        console.log(response)
        var responseData = JSON.parse(response.data)
        LocalStorage.set(el.type, responseData[el.type])
        store.commit('SET_DATA', {type: el.type, data: responseData[el.type]})
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
  })

  return Promise.all(promises)
}
