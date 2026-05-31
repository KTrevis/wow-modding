import { std } from "wow/wotlk";
import "./trainers/remove-class-trainers";

const NO_MANS_LAND_HYJAL_ID = 42202;
std.Spells.load(NO_MANS_LAND_HYJAL_ID).delete();
