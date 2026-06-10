import { Layout } from "@/components/layout";
import { useListPlatforms, useGetMe } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, ExternalLink, ChevronRight, Gamepad2, MonitorPlay } from "lucide-react";
import { useState, useEffect } from "react";

function buildOfferUrl(template: string, userId: number): string {
  return template
    .replace(/\{USER_ID\}/g, String(userId))
    .replace(/\[USER_ID\]/g, String(userId))
    .replace(/%7BUSER_ID%7D/g, String(userId));
}

export default function Platforms() {
  const { data: platformsData, isLoading: loadingPlatforms } = useListPlatforms();
  const { data: user } = useGetMe();
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);

  const platforms = platformsData?.platforms ?? [];

  useEffect(() => {
    if (!platforms.length || selectedPlatform) return;
    const featured = platforms.find((p: any) => p.placement === "homepage" && p.apiEndpoint && p.isEnabled);
    if (featured) { setSelectedPlatform(featured); return; }
    const fallback = platforms.find((p: any) => p.apiEndpoint && p.isEnabled);
    if (fallback) setSelectedPlatform(fallback);
  }, [platforms]);

  const getOfferUrl = (platform: any) => {
    if (!platform?.apiEndpoint || !user?.id) return platform?.apiEndpoint;
    return buildOfferUrl(platform.apiEndpoint, user.id);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15">
            <MonitorPlay className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Offerwalls</h1>
            <p className="text-slate-500">Select a platform to start earning USDT</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4" style={{ height: "calc(100vh - 190px)", minHeight: "520px" }}>
          {/* Platform List */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
            {loadingPlatforms ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl bg-slate-800" />
              ))
            ) : platforms.length === 0 ? (
              <div className="text-center py-16 modern-card rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/15">
                  <Gamepad2 className="h-8 w-8 text-blue-400" />
                </div>
                <p className="font-semibold text-white mb-2">No platforms yet</p>
                <p className="text-slate-500 text-sm">Check back soon!</p>
              </div>
            ) : (
              platforms.map((platform: any) => {
                const isSelected = selectedPlatform?.id === platform.id;
                const hasUrl = !!platform.apiEndpoint;
                const isFeatured = platform.placement === "homepage";

                return (
                  <button
                    key={platform.id}
                    onClick={() => hasUrl && setSelectedPlatform(platform)}
                    disabled={!hasUrl}
                    className={`w-full text-left flex items-center gap-3 px-4 py-4 rounded-xl border transition-all duration-200 group ${
                      isSelected
                        ? "modern-card-accent border-cyan-500/30"
                        : hasUrl
                        ? "modern-card hover:border-blue-500/25 cursor-pointer"
                        : "modern-card opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {platform.logoUrl ? (
                      <img
                        src={platform.logoUrl}
                        alt={platform.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected ? "bg-gradient-to-br from-cyan-500/25 to-teal-500/15 border-cyan-500/20" : "bg-slate-800 border-slate-700"
                      }`}>
                        <Zap className={`h-5 w-5 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-semibold text-sm truncate ${isSelected ? "text-gradient-accent" : "text-white"}`}>
                          {platform.name}
                        </p>
                        {isFeatured && (
                          <span className={`text-[9px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider ${
                            isSelected ? "bg-cyan-500 text-white" : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/15"
                          }`}>
                            Featured
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate mt-1 ${isSelected ? "text-cyan-400/70" : "text-slate-500"}`}>
                        {hasUrl ? "Click to open" : "Coming soon"}
                      </p>
                    </div>
                    {hasUrl && (
                      <ChevronRight className={`h-5 w-5 shrink-0 transition-transform ${isSelected ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1"}`} />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Iframe Panel */}
          <div className="flex-1 modern-card rounded-2xl overflow-hidden flex flex-col">
            {selectedPlatform ? (
              <>
                {/* Top bar */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-blue-900/10 bg-slate-950/50 shrink-0">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-50" />
                  </div>
                  {selectedPlatform.logoUrl ? (
                    <img src={selectedPlatform.logoUrl} alt={selectedPlatform.name} className="w-7 h-7 rounded-lg object-cover border border-slate-700" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center border border-cyan-500/15">
                      <Zap className="h-4 w-4 text-cyan-400" />
                    </div>
                  )}
                  <span className="font-semibold text-white flex-1">{selectedPlatform.name}</span>
                  <a
                    href={getOfferUrl(selectedPlatform)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
                  </a>
                </div>

                <iframe
                  key={selectedPlatform.id}
                  src={getOfferUrl(selectedPlatform)}
                  className="flex-1 w-full border-0"
                  allow="fullscreen"
                  title={selectedPlatform.name}
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mb-6 border border-blue-500/15">
                  <Gamepad2 className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No Platform Selected</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Select a platform from the list to start earning USDT rewards.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
