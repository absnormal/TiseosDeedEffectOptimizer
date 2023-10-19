// get char list by class

export function getCharListByClass(charData, classesOfChar){
    let charPart = [];
	charData.forEach(function(char){
		for(let i=0; i<char.class.length; i++){
			if(classesOfChar.includes(char.class[i])){
                charPart.push(char);
				break;
			}
		}
	});
	return charPart;
}