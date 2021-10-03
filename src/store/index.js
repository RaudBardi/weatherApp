import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import * as Cookies from "js-cookie";

Vue.use(Vuex)

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default new Vuex.Store({
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
    plugins: [
        createPersistedState({
            storage: {
                getItem: (key) => Cookies.get(key),
                // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
                setItem: (key, value) =>
                    Cookies.set(key, value, { expires: 3, secure: true }),
                removeItem: (key) => Cookies.remove(key),
            },
        }),
    ],
})
