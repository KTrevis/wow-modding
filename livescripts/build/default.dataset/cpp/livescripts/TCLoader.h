#include "TSAll.h"
void WriteTables();
extern "C"
{
    __declspec(dllexport) char const* GetScriptModuleRevisionHash();
    __declspec(dllexport) void AddTSScripts(TSEvents* handlers);
    __declspec(dllexport) void AddScripts();
    __declspec(dllexport) char const* GetScriptModule();
    __declspec(dllexport) char const* GetBuildDirective();
}
