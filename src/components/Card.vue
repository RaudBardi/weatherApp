<template>
    <div
        class="card"
        :class="{'style--wide': current}"
    >
        <div class="card__header">
            <template v-if="'sys' in card">
                <div class="card__city-name">{{ card.name }}{{current ?', ' + card.sys.country : ''}}</div>
                <div class="card__location">{{ current ? 'Your current location' : card.sys.country}} </div>
            </template>
        </div>
        <div class="card__content">
            <div class="card__content__data">
                <div class="card__content__row">
                    <div class="card__content__name">Weather</div>
                    <template v-if="'weather' in card">
                        <div class="card__content__value">{{ card.weather[0].main }}</div>
                    </template>
                </div>
                <div class="card__content__row">
                    <div class="card__content__name">Temperature</div>
                    <template v-if="'main' in card">
                        <div class="card__content__value">{{ card.main.temp }} °C</div>
                    </template>
                </div>
                <div class="card__content__row">
                    <div class="card__content__name">Humidity</div>
                    <template v-if="'main' in card">
                        <div class="card__content__value">{{ card.main.humidity }} °C</div>
                    </template>
                </div>
            </div>
            <div class="card__content__relative-time">{{ relativeTime }}</div>
        </div>
        <div class="card__footer">
            <template v-if="!current">
                <Button
                    variant="text"
                    text="Remove"
                    :disabled="loading"
                    @click="remove"
                />
            </template>
            <template v-else>
                <div></div>
            </template>
            <Button
                variant="text"
                text="Reload"
                :disabled="loading"
                @click="reload"
            />
        </div>
    </div>
</template>

<script>
import Button from '@/components/Button';
import moment from 'moment';
import { mapState } from "vuex";

export default {
    name: 'WeatherCard',
    props: {
        card: {
            type: Object,
            default: () => {},
        },
        current: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Button,
    },
    data() {
        return {
            relativeTime: null,
            intervalId: null,
        };
    },
    computed: {
        ...mapState({
            loading: (state) => state.loading,
            locations: (state) => state.locations,
        }),
    },
    watch: {
        card: {
            handler() {
                this.relativeTime = moment(this.card.timeStamp).fromNow();
            },
            deep: true,
        },
        locations: {
            handler() {
                this.relativeTime = moment(this.card.timeStamp).fromNow();
            },
            deep: true,
        },
    },
    mounted() {
        this.relativeTime = moment(this.card.timeStamp).fromNow();
        this.intervalId = setInterval(() => {
            this.relativeTime = moment(this.card.timeStamp).fromNow();
        }, 60000);
    },
    beforeDestroy() {
        clearInterval(this.intervalId);
    },
    methods: {
        remove() {
            this.$emit('remove', this.card.id);
        },
        reload() {
            this.$emit('reload', this.card.id);
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/styles";

.card {
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    width: 350px;
    height: 393px;
    background: #FFFFFF;
    box-shadow: 0px 2px 10px rgba(10, 10, 10, 0.25);
    border-radius: 6px;
    padding: 24px;
    margin: 20px;
    
    &.style--wide {
        width: 824px;
    }
    
    &__header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 0 0 1;
    }
    
    &__city-name {
        display: block;
        font-style: normal;
        font-weight: bold;
        font-size: 32px;
        line-height: 38px;
        margin-bottom: 15px;
    }
    
    &__location {
        display: block;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 24px;
    }
    
    &__content {
        display: flex;
        flex-direction: column;
        
        &__row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            height: 36px;
            margin-bottom: 16px;
            font-style: normal;
            font-weight: normal;
            font-size: 18px;
            line-height: 24px;
            color: $textPrimary;
            border-bottom: 1px solid $borderLine;
            
            &:last-of-type {
                margin-bottom: 8px;
            }
        }
        
        &__relative-time {
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: flex-end;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 24px;
            color: $textLabel;
        }
    }
    
    &__footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    
    @media screen and (max-width: 812px) {
        width: 320px;
        margin: 20px;
        
        &.style--wide {
            width: calc(100vw - 40px)
        }
    }
}
</style>
