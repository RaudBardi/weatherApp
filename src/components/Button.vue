<template>
    <button
        :class="classes"
        :disabled="disabled"
        @click="$emit('click')"
    >
        <slot>{{ text }}</slot>
    </button>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        /**
         * Отключенная кнопка
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * Вариант (если есть)
         * @values text, icon
         */
        variant: {
            type: String,
            default: 'text',
        },
        
        /**
         * Текст кнопки
         */
        text: {
            type: String,
            default: '',
        },
    },
    computed: {
        classes() {
            return {
                'button': true,
                'state--disabled': this.disabled,
                [`variant-${this.variant}`]: true,
            };
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/styles";

.button {
    display: block;
    outline: none;
    background: none;
    border: none;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-transform: uppercase;
    cursor: pointer;
    
    & + .button {
        margin-left: 30px;
    }
    
    &.variant-text {
        color: $buttonColor;
        
        &:focus {
            background: transparent;
        }
    
        &.state--disabled {
            color: $disabledColor;
        }
    }
    
    &.variant-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        width: 56px;
        height: 56px;
        color: #FFFFFF;
        background: $buttonColor;
        box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2);
        border-radius: 50px;
    
        &.state--disabled {
            background: $disabledColor;
        }
    }
}
</style>
