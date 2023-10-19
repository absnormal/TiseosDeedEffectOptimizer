// return legions shared between heros
import { bitCount } from './bitCount.js'

export function sharedLegions(heroA, heroB){
	return bitCount(heroA.legionNumber & heroB.legionNumber);
}