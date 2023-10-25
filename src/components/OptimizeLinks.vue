<script setup>
import { watch, ref } from 'vue';
import { sharedLegions } from './functions/sharedLegions.js'
import pageLimits from './json/pageLimits.json'
import DisplayChain from './DisplayChain.vue';
const path = "/TiseosDeedEffectOptimizer/imgs/"
const headPath = "/TiseosDeedEffectOptimizer/imgs/head/Head_"
const classPath = "/TiseosDeedEffectOptimizer/imgs/occupation/"

const props = defineProps({
	pageDisplayName: String,
	charList: Array
});

const emit = defineEmits(['linkOptimized']);
function highlightHero(heros){
	emit('linkOptimized', heros)
}

const minSharedLegions = ref(2);
function changeMinSharedLegions(){
	if(minSharedLegions.value == 2) minSharedLegions.value = 1;
	else if(minSharedLegions.value == 1) minSharedLegions.value = 2;
}

let limits = {};
const optimizedCombination = ref();
let tmpCombination = [];
let maxLinks = 0;
let classOnMapRequired = pageLimits.filter((limit) => limit.pageDisplayName === props.pageDisplayName)[0].classRequired;
let heroOnMapPosition = pageLimits.filter((limit) => limit.pageDisplayName === props.pageDisplayName)[0].heroPos;

function getCombinationOfHero(charList, choosedHeros, numHeroNeed){
	if(numHeroNeed > 0){
		charList.forEach(function(hero, index){
			// check new hero have the right class
			if(hero.class.includes(limits.classRequired[limits.total-numHeroNeed])){
				// check every link of new hero added have enough shared legions
				let anyLinkFail = false;
				for(let i=0; i<limits.total-numHeroNeed; i++){
					if(limits.linkMap[limits.total-numHeroNeed][i] && sharedLegions(hero, choosedHeros[i]) < minSharedLegions.value){
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
	heroOnMapPosition = pageLimits.filter((limit) => limit.pageDisplayName === name)[0].heroPos;
	
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

let classList = [];
function countClass(list){
	// count every class number
	classList = [["飛", 0], ["僧", 0], ["騎", 0], ["弓", 0], ["槍", 0], ["法", 0], ["步", 0], ["魔", 0]];
	list.forEach(function(char){
		classList.forEach(function(c, index){
			if(char.class.includes(c[0])) classList[index][1] += 1;
		});
	})
}

watch(
	() => props.charList,
	(newList, oldList) => {
		//console.log("props.charList changed");
		optimizeLinks(newList.filter((hero) => hero.disable === false), props.pageDisplayName);
	},
	{ deep: true }
)
watch(
	() => props.pageDisplayName,
	(newPage) => {
		//console.log("props.pageDisplayName changed");
		minSharedLegions.value = 2;
		countClass(props.charList.filter((hero) => hero.disable === false));
		optimizeLinks(props.charList.filter((hero) => hero.disable === false), newPage);
	},
	// do once even watch not triggered by "immediate"
	{ immediate: true }
)
</script>

<template>
	<div v-for="(char, index) in optimizedCombination" :class="$style.cardMapDiv" 
	:style="{
		top: `${heroOnMapPosition[index][0]}%`,
		left: `${heroOnMapPosition[index][1]}%`
	}">
		<div class="row" :style="{paddingLeft:`10%`, paddingRight:`10%`}">
			<div v-for="legion in char.legion" class="col-4" :class="$style.cardLegionDiv">
				<img :src="path+legion+`.png`" class="img-fluid">
			</div>
		</div>
		<a>
			<img :src="headPath+char.fileName+`.png`" class="img-fluid">
			<img :src="classPath+classOnMapRequired[index]+`.png`" class="img-fluid" :class="$style.cardClassImg">
		</a>
	</div>
	<DisplayChain
		:charList="optimizedCombination" :pageDisplayName="pageDisplayName"
	/>
	<div>
		<button class="btn btn-primary" type="submit" @click="changeMinSharedLegions()">最少連結數={{minSharedLegions}}</button>
	</div>
</template>

<style module>
.cardMapDiv {
	background-color: gray;
	border-radius: 10px;
	position: absolute;
	width: 9%;
	transform: translate(-50%, -50%);
}
.cardClassImg {
	position: absolute;
	left: 0%;
	width: 35%;
	top: 73%;
}
.cardLegionDiv {
	position: relative;
	margin-top: -2%;
	margin-bottom: -2%;
	padding: 2%;
}
</style>