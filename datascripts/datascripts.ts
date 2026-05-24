import { std } from "wow/wotlk";
import "./ui/talents-from-level-one";

const NO_MANS_LAND_HYJAL_ID = 42202;
std.Spells.load(NO_MANS_LAND_HYJAL_ID).delete();
