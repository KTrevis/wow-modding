import { std } from "wow/wotlk";
import { ONE_HOUR } from "../../../utils/constants/duration.constants";

std.Spells.load(20217).Duration.setSimple(ONE_HOUR);
