<script setup>
import list from './json/heroData.json'
import OptimizedLinks from './OptimizedLinks.vue';
const charList = list;
// user modify charList here
</script>

<template>
    <div>
        <!-- <OptimizedLinks :heroData="charList" /> -->
        <div v-for="data in charList">{{data}}</div>
    </div>
</template>