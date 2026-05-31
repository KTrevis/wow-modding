import { std } from "wow/wotlk";

const HEROIC_STRIKE = std.Spells.load(78).Subtext.enGB.set("");

console.log(HEROIC_STRIKE.objectify());
