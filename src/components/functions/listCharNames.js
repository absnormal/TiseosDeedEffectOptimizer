// list charList names
export function listCharNames(heroData){
	let log = "";
	heroData.forEach(function(hero){
		if(hero != []) log += hero.name + ", ";
	});
	console.log(log);
}