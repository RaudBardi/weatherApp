export default {
    addLocation(state, payload) {
        const locIndex = state.locations.findIndex((loc) => loc.id === payload.id);
        if (locIndex === -1) {
            state.locations
                .push({
                    ...payload,
                    timeStamp: new Date(),
                });
        } else {
            state.locations
                .splice(locIndex, 1, {
                    ...payload,
                    timeStamp: new Date(),
                });
        }
    },
    removeLocation(state, payload) {
        const locIndex = state.locations.findIndex((loc) => loc.id === payload);
        state.locations.splice(locIndex, 1);
    },
    setCurrentLocation(state, payload) {
        state.locations
            .splice(0, 1, {
                ...payload,
                timeStamp: new Date(),
            });
    },
    setLoading(state, payload) {
        state.loading = payload;
    },
};
