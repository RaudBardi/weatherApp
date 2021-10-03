<template>
    <div v-if="model" class="modal-wrap">
        <div class="modal-overlay" @click="close"></div>
        <div class="modal">
            <div class="modal__header">
                <div class="title">Choose a city</div>
                <div class="sub">To find city start typing and pick one from the suggestions</div>
            </div>
            <div class="modal__body">
                <div
                    class="form-group"
                    :class="{ 'form-group--error': $v.searchValue.$error }"
                >
                    <input
                        v-model="$v.searchValue.$model"
                        ref="search"
                        type="text"
                        class="search"
                        placeholder="Search city"
                        autocomplete="off"
                        :disabled="loading"
                        @input="getSearch($event.target.value)"
                    >
                    <div
                        v-if="searchResult"
                        class="error"
                    >
                        {{ searchResult.message }}
                    </div>
                    <div v-if="$v.searchValue.$error" class="error">
                        <template v-if="!$v.searchValue.required">
                            Choose a city
                        </template>
                        <template v-if="!$v.searchValue.minLength">
                            Name must have at least {{ $v.searchValue.$params.minLength.min }} letters.
                        </template>
                    </div>
                    <div
                        v-if="searchResult"
                        class="search-result"
                        :class="{'state--selected': this.selectedResult}"
                        @click="selectResult"
                    >
                        {{ searchResult.name }}, {{ searchResult.sys.country }}
                    </div>
                </div>
            </div>
            <div class="modal__footer">
                <Button
                    variant="text"
                    text="Clear"
                    :disabled="!searchValue && !$v.searchValue.$error || loading"
                    @click="clear"
                />
                <div class="button-wrap">
                    <Button
                        variant="text"
                        text="Cancel"
                        :disabled="loading"
                        @click="close"
                    />
                    <Button
                        variant="text"
                        text="Add"
                        :disabled="!selectedResult || loading"
                        @click="add"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Button from '@/components/Button';
import { mapActions, mapState } from "vuex";
import axios from "axios";
import { API_KEY } from "@/env/dev";
import { required, minLength } from 'vuelidate/lib/validators'

export default {
    name: 'Modal',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Button,
    },
    data() {
        return {
            searchValue: '',
            searchResult: null,
            selectedResult: null,
        };
    },
    validations: {
        searchValue: {
            required,
            minLength: minLength(3)
        },
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
        ...mapState({
            loading: (state) => state.loading,
        }),
    },
    created() {
        this.clear();
    },
    mounted() {
        this.$nextTick(() => this.$refs.search.focus());
    },
    methods: {
        ...mapActions({
            setLoading: 'setLoading',
            addLocation: 'addLocation',
        }),
        getWeatherByCityName({ query }) {
            this.setLoading();
            return axios({
                method: 'get',
                url: `http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`,
            })
                .then((response) => {
                    this.searchResult = response.data;
                })
                .catch(function (error) {
                    console.log(error.message);
                })
                .then(() => {
                    this.setLoading(false);
                    this.$nextTick(() => this.$refs.search.focus());
                });
        },
        getSearch(query) {
            if (!this.$v.searchValue.$invalid) {
                this.searchResult = null;
                this.getWeatherByCityName({ query });
            }
        },
        selectResult() {
            this.selectedResult = this.searchResult;
        },
        clear() {
            this.searchValue = '';
            this.searchResult = null;
            this.selectedResult = null;
            this.$v.$reset();
        },
        close() {
            this.clear();
            this.$emit('input', false);
        },
        add() {
            this.$emit('add', this.searchResult);
            this.$nextTick(() => this.close());
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/styles";

.modal {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 751px;
    height: 397px;
    background: #FFFFFF;
    box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.14), 0px 6px 30px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    position: relative;
    padding: 24px;
    z-index: 5;
    
    &__header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        text-align: left;
        
        .title {
            display: inline-block;
            font-style: normal;
            font-weight: bold;
            font-size: 32px;
            line-height: 38px;
            color: $textPrimary;
            margin-bottom: 16px;
        }
        
        .sub {
            display: inline-block;
            font-style: normal;
            font-weight: normal;
            font-size: 24px;
            line-height: 24px;
            color: $textSub;
        }
    }
    
    &__body {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 100px;
        
        .search {
            display: inline-block;
            width: 100%;
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            line-height: 24px;
            padding: 16px 0;
            color: $textPrimary;
            border-bottom: 1px solid $textPrimary;
            
            
            &::placeholder {
                color: $textPlaceholder;
            }
        }
        
        .search-result {
            display: inline-block;
            width: 100%;
            position: absolute;
            bottom: -88px;
            left: 0;
            text-align: left;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 24px;
            padding: 8px;
            color: $textPrimary;
            border-radius: 4px;
            background: $borderLine;
            cursor: pointer;
            
            &.state--selected {
                background: $buttonColor;
                color: #FFFFFF;
            }
        }
        
        .error {
            display: inline-block;
            position: absolute;
            bottom: -36px;
            left: 0;
            text-align: left;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 24px;
            color: $errorColor;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            position: relative;
        }
        
        .form-group--error {
            .search {
                border-bottom: 1px solid $errorColor;
            }
        }
    }
    
    &__footer {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-between;
        width: 100%;
    }
    
    @media screen and (max-width: 812px) {
        width: calc(100vw - 24px);
        height: calc(100vh - 24px);
        max-height: 397px;
    }
}

.modal-wrap {
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
}

.modal-overlay {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    background: rgba(11, 11, 11, 0.5);
}

.button-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
