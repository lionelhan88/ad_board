import { createStore } from 'vuex'

export default createStore({
  state: {
    Authorization: localStorage.getItem('Authorization') ?localStorage.getItem('Authorization') : ''
  },
  getters: {
  },
  mutations: {
    changeLogin(state, user){
      state.Authorization = user.Authorization;
      localStorage.setItem('Authorization', user.Authorization);
    }
  },
  actions: {
  },
  modules: {
  }
})
