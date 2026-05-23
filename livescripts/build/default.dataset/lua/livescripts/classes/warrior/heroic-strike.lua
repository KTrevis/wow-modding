--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____spell_2Dscaling_2Dcurves = require("livescripts.spell-scaling-curves")
local ClassIDs = ____spell_2Dscaling_2Dcurves.ClassIDs
local SPELL_SCALING = ____spell_2Dscaling_2Dcurves.SPELL_SCALING
local WARRIOR_SCALING = SPELL_SCALING[ClassIDs.WARRIOR]
function ____exports.heroicStrikeScaling(events)
    events.Spell:OnDamageEarly(
        UTAG("nikev", "heroic-strike-tag"),
        function(spell, damage)
            local caster = ToUnit(spell:GetCaster())
            if not caster then
                return
            end
            local level = math.max(
                1,
                math.min(
                    80,
                    caster:GetLevel()
                )
            )
            damage:set(math.floor(WARRIOR_SCALING[level] * 0.5584767617179768 + 0.5))
        end
    )
end
return ____exports
