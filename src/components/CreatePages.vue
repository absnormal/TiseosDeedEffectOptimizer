<script setup>
// do once each "CreatePages" creation
import { ref } from 'vue'
import pages from './json/pageData.json'
import CustomizableCharacterPool from './CustomizableCharacterPool.vue'
const path = "src/components/imgs/"
const currentPage = ref(pages[3]);

// switch pages
function changePage(newPage){
    currentPage.value = newPage;
}
changePage(pages[3]);
</script>

<template>
    <!-- button group by pages -->
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
        <template v-for="(page, index) in pages" :key="index" >
            <input type="radio" class="btn-check" name="pageSelect" :id="index" autocomplete="off" @click="changePage(page)" checked>
            <label class="btn btn-outline-primary" :for="index">{{ page.pageDisplayName }}</label>
        </template>
    </div>
    <!-- img from current page -->
    <div :style="{backgroundImage: `url(${path}${currentPage.pageName})`,
            backgroundSize: `100%`,
            backgroundRepeat: `no-repeat`,
            height: `150vh`
    }">
        <CustomizableCharacterPool :page="currentPage"/>
    </div>
</template>