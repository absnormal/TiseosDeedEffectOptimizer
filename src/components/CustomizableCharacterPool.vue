<script setup>
import { watch, ref } from 'vue';
import { getCharListByClass } from './functions/getCharListByClass.js'
import { addLegionNumber } from './functions/addLegionNumber.js'
import list from './json/charData.json'
import OptimizeLinks from './OptimizeLinks.vue'

const path = "src/components/imgs/"
const classPath = "src/components/imgs/occupation/"
const cardPath = "src/components/imgs/card/Card_"
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

let highlightlist = [];

</script>

<template>
	<div class="row" :style="{
		float: `right`,
		width: `34%`,
		height: `75vh`,
		marginRight: `0.5%`,
		marginTop: `9%`,
		overflow: `scroll`,
		backgroundColor: `black`
	}">
		<!-- highlighted characters -->
		<template v-for="char in charList">
			<div v-if="!char.disable && char.highlight" class="col-3" :class="$style.cardPoolDiv" @click="modifyCharInList(char)"
				:style="{ borderColor: `cyan`}"
			>
				<div class="row" :style="{paddingLeft:`10%`, paddingRight:`10%`}">
					<div v-for="legion in char.legion" class="col-4" :style="{padding: `2%`}">
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
			<div v-if="char.disable" class="col-3" :class="$style.cardPoolDiv" @click="modifyCharInList(char)"
			:style="{ filter: `grayscale(100%)`, backgroundColor: `rgb(77, 77, 77)` }"
			>
			<div class="row" :style="{paddingLeft:`10%`, paddingRight:`10%`}">
				<div v-for="legion in char.legion" class="col-4" :style="{padding: `2%`}">
					<img :src="path+legion+`.png`" class="img-fluid">
					</div>
				</div>
				<img :src="cardPath+char.fileName+`.png`" class="img-fluid">
			</div>
		</template>

		<!-- unchoosen characters -->
		<template v-for="char in charList">
			<div v-if="!char.disable && !char.highlight" class="col-3" :class="$style.cardPoolDiv" @click="modifyCharInList(char)">
				<div class="row" :style="{paddingLeft:`10%`, paddingRight:`10%`}">
					<div v-for="legion in char.legion" class="col-4" :style="{padding: `2%`}">
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
</template>

<style module>
.cardPoolDiv {
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
</style>