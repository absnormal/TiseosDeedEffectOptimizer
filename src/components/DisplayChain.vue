<script setup>
import { watch } from 'vue'
import { sharedLegions } from './functions/sharedLegions'
import pageLimits from './json/pageLimits.json'
const path = "/src/components/imgs/"
const chainPath = ["Frame_Chain02", "Frame_Chain03", "Frame_Chain04"]
const chainColor = ["gray", "mediumblue", "cyan"]

const props = defineProps({
    pageDisplayName: String,
	charList: Array
});

let page;
let chainList = [];

watch(
	() => props.charList,
	(newList, oldList) => {
        if(newList.length != 0){
            chainList = [];
            page = pageLimits.filter((page) => page.pageDisplayName === props.pageDisplayName)[0];
            let chainMap = page.chainMap;
            chainMap.forEach(function(link, index){
                chainList[index] = sharedLegions(newList[link[0]], newList[link[1]])
            });
            console.log(chainList)
        } else {
            chainList = [];
        }
	}
)

</script>

<template>
    <div>
        <template v-for="(chain, index) in chainList">
            <div :class="$style.chainDiv" :style="{
                top: `${page.chainPos[index][0]}vh`,
                left: `${page.chainPos[index][1]}vw`,
                color: `${chainColor[chain-1]}`
            }">
                {{ chain }}
            </div>
        </template>
    </div>
</template>

<style module>
.chainDiv {
	position: absolute;
    font-family: fantasy;
    font-size: xxx-large;
}
</style>