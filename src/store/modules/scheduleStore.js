import Vue from 'vue'
import restApi from '../utils/restApi'

const actions = {
  GET_hoursAvailable ({ commit, state }, data) {
    let url = `${Vue.prototype.$urlServices}/freeschedule?day=${data}`
    return new Promise((resolve, reject) => {
      restApi
        .get(url)
        .then(response => {
          commit({
            type: 'SET_hoursAvailable',
            data: response.data
          })
          resolve()
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  GET_searchAgenda ({ commit, state }, data) {
    let url = `${Vue.prototype.$urlServices}/schedule/${data.id}`
    return new Promise((resolve, reject) => {
      restApi
        .get(url)
        .then(response => {
          commit({
            type: 'SET_searchAgenda',
            data: response
          })
          resolve()
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  POST_schedule ({ commit, state }, data) {
    let newEvent = Object.assign({}, data)
    console.log(newEvent)
    let url = `${Vue.prototype.$urlServices}/schedule`
    return new Promise((resolve, reject) => {
      restApi
        .post(url, newEvent)
        .then(response => {
          commit({
            type: 'SET_schedule',
            data: response
          })
          resolve(response)
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}

const mutations = {
  SET_hoursAvailable (state, payload) {
    state.scheduled.push(payload.data)
  },
  SET_schedule (state, payload) {
    state.schedule.push(payload.data.data)
    localStorage.setItem('schedule', JSON.stringify(state.schedule))
  },
  SET_searchAgenda (state, payload) {
    state.scheduledId = payload.data
  }
}

export default {
  namespaced: true,
  dynamic: true,
  state () {
    return {
      scheduled: [],
      schedule: [],
      scheduledId: {}
    }
  },
  actions,
  mutations
}
