"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HEROIC_STRIKE = void 0;
var _wotlk = require("wow/wotlk");
var _moduleNameConstants = require("../../utils/constants/module-name.constants");
const ID = "heroic-strike-";
const HEROIC_STRIKE = _wotlk.std.Spells.create(_moduleNameConstants.MODULE_NAME, ID + "spell").Name.enGB.set("Heroic Strike").Subtext.clear().Tags.addUnique(_moduleNameConstants.MODULE_NAME, ID + "tag").Description.enGB.set("A strong attack that deals bonus melee damage scaling with your level and causes a high amount of threat.").Levels.Spell.set(1).Levels.Base.set(1).Levels.Max.set(80).Power.setRage(15).Attributes.NEXT_SWING.set(false).Range.set(2).Effects.get(0).Type.SCHOOL_DAMAGE.set().DamageBase.set(10).ImplicitTargetA.UNIT_TARGET_ENEMY.set();
exports.HEROIC_STRIKE = HEROIC_STRIKE;

//# sourceMappingURL=heroic-strike.js.map