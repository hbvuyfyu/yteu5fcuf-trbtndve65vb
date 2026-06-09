import { Layout } from "@/components/layout";
import { useListPlatforms, useGetMe } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, ExternalLink, ChevronRight } from "lucide-react";
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
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Offerwalls</h2>
          <p className="text-zinc-500 text-sm mt-1">Select a platform to start earning USDT.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4" style={{ height: "calc(100vh - 190px)", minHeight: "520px" }}>
          {/* Platform List */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
            {loadingPlatforms ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl bg-zinc-800" />
              ))
            ) : platforms.length === 0 ? (
              <div className="text-center py-16 dark-card rounded-2xl">
                <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                <p className="font-semibold text-sm text-white">No platforms yet</p>
                <p className="text-zinc-500 text-xs mt-1">Check back soon!</p>
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
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                      isSelected
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-500/30"
                        : hasUrl
                        ? "dark-card hover:border-yellow-500/40 cursor-pointer"
                        : "dark-card opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {platform.logoUrl ? (
                      <img
                        src={platform.logoUrl}
                        alt={platform.name}
                        className="w-9 h-9 rounded-lg object-cover border border-white/20 shrink-0"
                      />
                    ) : (
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected ? "bg-black/20 border-white/30" : "bg-yellow-500/10 border-yellow-500/20"
                      }`}>
                        <Zap className={`h-4 w-4 ${isSelected ? "text-black" : "text-yellow-400"}`} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`font-bold text-sm truncate ${isSelected ? "text-black" : "text-white"}`}>
                          {platform.name}
                        </p>
                        {isFeatured && !isSelected && (
                          <span className="text-[9px] bg-yellow-500/15 text-yellow-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shrink-0">
                            Featured
                          </span>
                        )}
                        {isFeatured && isSelected && (
                          <span className="text-[9px] bg-black/25 text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${isSelected ? "text-black/70" : "text-zinc-500"}`}>
                        {hasUrl ? "Click to open" : "Coming soon"}
                      </p>
                    </div>
                    {hasUrl && (
                      <ChevronRight className={`h-4 w-4 shrink-0 ${isSelected ? "text-black" : "text-zinc-500 group-hover:text-yellow-400"}`} />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Iframe Panel */}
          <div className="flex-1 dark-card rounded-2xl overflow-hidden flex flex-col">
            {selectedPlatform ? (
              <>
                {/* Top bar */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50" />
                  {selectedPlatform.logoUrl ? (
                    <img src={selectedPlatform.logoUrl} alt={selectedPlatform.name} className="w-6 h-6 rounded object-cover border border-zinc-700" />
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-yellow-500/15 border border-yellow-500/25 flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5 text-yellow-400" />
                    </div>
                  )}
                  <span className="font-bold text-sm text-white flex-1">{selectedPlatform.name}</span>
                  <a
                    href={getOfferUrl(selectedPlatform)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-yellow-400 hover:underline font-medium shrink-0"
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
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5">
                  <Zap className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No platforms available</h3>
                <p className="text-zinc-500 text-sm max-w-xs">
                  The admin hasn't added any offerwalls yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
