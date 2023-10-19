<script setup>
import { watch, ref } from 'vue';
import { sharedLegions } from './functions/sharedLegions.js'
import pageLimits from './json/pageLimits.json'
import DisplayChain from './DisplayChain.vue';
const path = "./src/components/imgs/"
const headPath = "./src/components/imgs/head/Head_"
const classPath = "./src/components/imgs/occupation/"

const props = defineProps({
	pageDisplayName: String,
	charList: Array
});

const emit = defineEmits(['linkOptimized']);
function highlightHero(heros){
	emit('linkOptimized', heros)
}

let limits = {};
const optimizedCombination = ref();
let tmpCombination = [];
let maxLinks = 0;
let classOnMapRequired = pageLimits.filter((limit) => limit.pageDisplayName === props.pageDisplayName)[0].classRequired;
let classOnMapPosition = pageLimits.filter((limit) => limit.pageDisplayName === props.pageDisplayName)[0].position;

function getCombinationOfHero(charList, choosedHeros, numHeroNeed){
	if(numHeroNeed > 0){
		charList.forEach(function(hero){
			// check new hero have the right class
			if(hero.class.includes(limits.classRequired[limits.total-numHeroNeed])){
				// check every link of new hero added have enough shared legions
				let anyLinkFail = false;
				for(let i=0; i<limits.total-numHeroNeed; i++){
					if(limits.linkMap[limits.total-numHeroNeed][i] && sharedLegions(hero, choosedHeros[i]) < limits.minSharedLegions){
						anyLinkFail = true;
						break;
					}
				}
				// if everything right & have potential go next recursive
				if(!anyLinkFail){
					choosedHeros[limits.total-numHeroNeed] = hero;
					getCombinationOfHero(charList.filter((heros) => heros != hero), choosedHeros, numHeroNeed-1);
				}
			}
		})
	} else {
		// get total links
		let currentLinks = 0;
		for(let i=0; i<limits.total; i++){
			for(let j=0; j<i; j++){
				if(limits.linkMap[i][j]) currentLinks += sharedLegions(choosedHeros[i], choosedHeros[j]);
			}
		}
		// change max links
		if(currentLinks > maxLinks){
			maxLinks = currentLinks;
			tmpCombination = [];
			// deep copy
			choosedHeros.forEach(function(hero){
				tmpCombination.push(hero);
			});
		}
	}
}

function optimizeLinks(list, name){
	// sort hero by legionNumber
	list.sort(function compare(a, b){
		if(a.legionNumber < b.legionNumber) return -1;
		if(a.legionNumber > b.legionNumber) return 1;
		return 0;
	})
	
	limits = pageLimits.filter((limit) => limit.pageDisplayName === name)[0];
	classOnMapRequired = pageLimits.filter((limit) => limit.pageDisplayName === name)[0].classRequired;
	classOnMapPosition = pageLimits.filter((limit) => limit.pageDisplayName === name)[0].position;
	
	tmpCombination = [];
	maxLinks = 0;
	
	let choosedHeros = [];
	for(let i=0; i<limits.total; i++)
		choosedHeros.push({});
	
	getCombinationOfHero(list, choosedHeros, limits.total);
	optimizedCombination.value = tmpCombination;

	// emit to parent
	highlightHero(tmpCombination);
}

watch(
	() => props.charList,
	(newList, oldList) => {
		console.log("props.charList changed");
		optimizeLinks(newList.filter((hero) => hero.disable === false), props.pageDisplayName);
	},
	{ deep: true }
)
watch(
	() => props.pageDisplayName,
	(newPage) => {
		console.log("props.pageDisplayName changed");
		optimizeLinks(props.charList.filter((hero) => hero.disable === false), newPage);
	},
	// do once even watch not triggered by "immediate"
	{ immediate: true }
)
</script>

<template>
	<div v-for="(char, index) in optimizedCombination" :class="$style.cardMapDiv" 
	:style="{
		top: `${classOnMapPosition[index][0]}vh`,
		left: `${classOnMapPosition[index][1]}vw`
	}">
		<div class="row" :style="{paddingLeft:`10%`, paddingRight:`10%`}">
			<div v-for="legion in char.legion" class="col-4" :style="{padding: `2%`}">
				<img :src="path+legion+`.png`" class="img-fluid">
			</div>
		</div>
		<a>
			<img :src="headPath+char.fileName+`.png`" class="img-fluid">
			<img :src="classPath+classOnMapRequired[index]+`.png`" class="img-fluid"
			:style="{
				position: `absolute`,
				left: `0vw`,
				width: `40%`,
				top: `16vh`
			}">
		</a>
	</div>
	<DisplayChain
		:charList="optimizedCombination" :pageDisplayName="pageDisplayName"
	/>
</template>

<style module>
.cardMapDiv {
	margin-top: 2%;
	margin-bottom: 1%;
	padding-left: 0%;
	padding-right: 0%;
	background-color: gray;
	border-radius: 10px;
	position: absolute;
	width: 8%;
}
</style>