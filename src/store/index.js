import Vue from 'vue'
import Vuex from 'vuex'

/* globalModules */
import ScheduleStore from './modules/scheduleStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ScheduleStore
  }
})
