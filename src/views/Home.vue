<template>
    <div class="home">
        <h1>World Weather</h1>
        <p>Watch weather in your current location</p>
        <div class="current-location">
            <Card
                :card="currentWeatherCard"
                current
                @reload="reload"
            />
        </div>
        <div class="locations">
            <Card
                v-for="card in weatherCards"
                :key="card.id"
                :card="card"
                @remove="remove"
                @reload="reload"
            />
        </div>
        <div class="add-button-wrap">
            <Button
                variant="icon"
                text="+"
                @click="openModal"
            />
        </div>
        <Modal
            v-model="modalShowState"
            @add="addSelectedLocation"
        />
    </div>
</template>

<script>
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { mapState, mapActions } from 'vuex';
import axios from "axios";
import { API_KEY } from "@/env/dev";

export default {
    name: 'Home',
    data() {
        return {
            modalShowState: false,
        };
    },
    components: {
        Card,
        Modal,
        Button,
    },
    computed: {
        ...mapState({
            loading: (state) => state.loading,
            locations: (state) => state.locations,
        }),
        currentWeatherCard() {
            return this.locations[0] || null;
        },
        weatherCards() {
            return [...this.locations].slice(1);
        },
    },
    mounted() {
        this.setLoading();
        navigator.geolocation
            .getCurrentPosition(
                this.getCurrentPositionSuccess,
                this.getCurrentPositionError
            );
    },
    methods: {
        ...mapActions({
            setLoading: 'setLoading',
            addLocation: 'addLocation',
            removeLocation: 'removeLocation',
            setCurrentLocation: 'setCurrentLocation',
        }),
        getWeatherByCoordinates({ lat, lon }) {
            return axios({
                method: 'get',
                url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
            })
                .catch(function (error) {
                    console.log(error.message);
                })
        },
        getCurrentPositionSuccess(position) {
            this.getWeatherByCoordinates({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            })
                .then((response) => {
                    if (!this.currentWeatherCard
                        || response.data.coord.lat !== this.currentWeatherCard.coord.lat
                        || response.data.coord.lon !== this.currentWeatherCard.coord.lon) {
                        this.setCurrentLocation(response.data);
                    }
                    this.setLoading(false);
                });
        },
        getCurrentPositionError(error) {
            console.log(error);
        },
        openModal() {
            this.modalShowState = true;
        },
        addSelectedLocation(location) {
            this.addLocation(location);
        },
        reload(id) {
            const location = this.locations.find((loc) => loc.id === id);
            if (location) {
                this.getWeatherByCoordinates({
                    lat: location.coord.lat,
                    lon: location.coord.lon,
                })
                    .then((response) => {
                        this.addLocation(response.data);
                        this.setLoading(false);
                    });
            }
        },
        remove(id) {
            this.removeLocation(id);
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/styles";

h1 {
    font-style: normal;
    font-weight: 300;
    font-size: 70px;
    line-height: 80px;
    margin: 0 0 32px;
    color: $textPrimary;
}

p {
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 24px;
    margin: 0;
    padding: 0;
    color: $textSub;
}

.home {
    display: flex;
    flex-direction: column;
}

.current-location {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.locations {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.add-button-wrap {
    display: block;
    position: fixed;
    bottom: 34px;
    right: 45px;
    z-index: 5;
}
</style>
