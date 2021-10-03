<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'WeatherApp',
};
</script>

<style lang="scss">
@import "@/styles";

* {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
}

*, :after, :before {
    box-sizing: border-box
}

:focus {
    outline: none;
}

body {
    overflow: initial;
}

html {
    overflow-x: initial;
    scroll-behavior: smooth;
    font-size: 16px;
    @media screen and (max-width: 812px) {
        font-size: 14px;
    }
}

#app {
    font-family: 'Lato', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $textPrimary;
    padding: 24px;
}
</style>
