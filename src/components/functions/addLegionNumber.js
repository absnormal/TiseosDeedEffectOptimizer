// add char.legionNumber to charData using legion

export function addLegionNumber(unprocessedCharData){
    let legionArray = ["主角", "戰略", "流星", "公主", "起源", "光輝", "黑暗", "帝國", "傳說", "時空", "超凡", "轉生"];

    unprocessedCharData.forEach(function(char){
        let legionNumber = 0;
		// sum up legion numbers
		// ex. legion: ["主角","流星"], legionNumber = 2^0 + 2^2 = 5
		char.legion.forEach(function(legion){
            if(legionArray.indexOf(legion) != -1)
                legionNumber += (1 << legionArray.indexOf(legion));
            else console.log(char.name);
		})
        // reorder char legion
        let reorderedLegion = [];
        legionArray.forEach(function(legion){
            if(char.legion.includes(legion)) reorderedLegion.push(legion)
        })
        char["legion"] = reorderedLegion;
		char["legionNumber"] = legionNumber;
	});
}