<script setup>
import { watch, ref } from 'vue';
import { getCharListByClass } from './functions/getCharListByClass.js'
import { addLegionNumber } from './functions/addLegionNumber.js'
import list from './json/charData.json'
import OptimizeLinks from './OptimizeLinks.vue'

const path = "/TiseosDeedEffectOptimizer/imgs/"
const classPath = "/TiseosDeedEffectOptimizer/imgs/occupation/"
const cardPath = "/TiseosDeedEffectOptimizer/imgs/card/Card_"
const props = defineProps({
	page: Object
});

let displayName = props.page.pageDisplayName;
const charList = ref();
list.forEach(function(hero){
    hero.disable = false;
	hero.highlight = false;
});
charList.value = list;
charList.value = addLegionNumber(charList.value);
charList.value = getCharListByClass(list, props.page.reqiredClass);

watch(
	() => props.page,
	(newPage) => {
		charList.value = getCharListByClass(list, newPage.reqiredClass);
		displayName = newPage.pageDisplayName;
		console.log("page changed to: "+displayName);
	}
)

function modifyCharInList(targetChar){
	targetChar.disable = !targetChar.disable;
}

function removeAll(){
	charList.value.forEach(function(char){
		char.disable = true;
	})
}

let highlightlist = [];

</script>

<template>
	<div class="row" :class="$style.cardPoolDiv">
		<!-- highlighted characters -->
		<template v-for="char in charList">
			<div v-if="!char.disable && char.highlight" class="col-3" :class="$style.cardDiv" @click="modifyCharInList(char)"
				:style="{ borderColor: `cyan`}"
			>
				<div class="row" :style="{paddingLeft:`10%`, paddingRight:`10%`}">
					<div v-for="legion in char.legion" class="col-4" :class="$style.cardLegionDiv">
						<img :src="path+legion+`.png`" class="img-fluid">
					</div>
				</div>
				<img :src="cardPath+char.fileName+`.png`" class="img-fluid">
				<!-- <div class="row" :style="{paddingLeft:`10%`, paddingRight:`10%`}">
					<div v-for="c1ass in char.class" class="col-4" :style="{paddingLeft:`0%`,paddingRight:`0%`}">
						<img :src="classPath+c1ass+`.png`" class="img-fluid">
					</div>
				</div> -->
			</div>
		</template>
		
		<!-- disaled characters -->	
		<template v-for="char in charList">
			<div v-if="char.disable" class="col-3" :class="$style.cardDiv" @click="modifyCharInList(char)"
			:style="{ filter: `grayscale(100%)`, backgroundColor: `rgb(77, 77, 77)` }"
			>
			<div class="row" :style="{paddingLeft:`10%`, paddingRight:`10%`}">
				<div v-for="legion in char.legion" class="col-4" :class="$style.cardLegionDiv">
					<img :src="path+legion+`.png`" class="img-fluid">
					</div>
				</div>
				<img :src="cardPath+char.fileName+`.png`" class="img-fluid">
			</div>
		</template>

		<!-- unchoosen characters -->
		<template v-for="char in charList">
			<div v-if="!char.disable && !char.highlight" class="col-3" :class="$style.cardDiv" @click="modifyCharInList(char)">
				<div class="row" :style="{paddingLeft:`10%`, paddingRight:`10%`}">
					<div v-for="legion in char.legion" class="col-4" :class="$style.cardLegionDiv">
						<img :src="path+legion+`.png`" class="img-fluid">
					</div>
				</div>
				<img :src="cardPath+char.fileName+`.png`" class="img-fluid">
			</div>
		</template>
	</div>
	<OptimizeLinks :charList="charList" :pageDisplayName="displayName" @link-optimized="(heros) => {
		charList.forEach(function(char){
			if(heros.includes(char)) char.highlight = true;
			else char.highlight = false;
		})
	}"/>
	<div>
		<button class="btn btn-primary" type="submit" @click="removeAll()">移除全部</button>
	</div>
</template>

<style module>
.cardDiv {
	margin-top: 2%;
	margin-bottom: 1%;
	padding-left: 0%;
	padding-right: 0%;
	background-color: gray;
	border-radius: 10px;
	border-width: thick;
	border: inset;
	border-color: black;
}
.cardPoolDiv{
	float: right;
	width: 34%;
	height: 72%;
	margin-right: 0.5%;
	margin-top: 9%;
	overflow-x: hidden;
	background-color: black;
}
.cardLegionDiv {
	position: relative;
	margin-top: -2%;
	margin-bottom: -2%;
	padding: 2%;
}
</style>