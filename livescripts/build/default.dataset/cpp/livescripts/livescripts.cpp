#include "livescripts.h"


void Main(TSEvents *  events)
{
    events->Player->OnSay([=](auto player,auto __tswow_extra_args0,auto __tswow_extra_args1,auto __tswow_extra_args2)
    {
        return player->SendAreaTriggerMessage(std::string("hello"));
    }
    );
};



___livescripts_livescripts_ts::___livescripts_livescripts_ts()
{
}

