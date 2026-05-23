#include "livescripts.h"
#include "TCLoader.h"
char const* GetScriptModuleRevisionHash()
{
    return "c797f13b2c9f5a1a2fadef03eab660ffb675800d";
}
void AddTSScripts(TSEvents* handlers)
{
    WriteTables();
    Main(handlers);
}
void AddScripts(){}
char const* GetScriptModule()
{
    return "nikev";
}
char const* GetBuildDirective()
{
    return "Release";
}
