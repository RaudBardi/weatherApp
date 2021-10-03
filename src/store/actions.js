export default {
    setLoading({ commit }, payload = true) {
        commit('setLoading', payload);
    },
    addLocation({ commit }, payload) {
        commit('addLocation', payload);
    },
    removeLocation({ commit }, payload) {
        commit('removeLocation', payload);
    },
    setCurrentLocation({ commit }, payload) {
        commit('setCurrentLocation', payload);
    },
};
