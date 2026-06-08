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

  // Auto-open the admin-featured platform (homepage placement) on load
  useEffect(() => {
    if (!platforms.length || selectedPlatform) return;
    // First priority: homepage placement
    const featured = platforms.find((p: any) => p.placement === "homepage" && p.apiEndpoint && p.isEnabled);
    if (featured) { setSelectedPlatform(featured); return; }
    // Fallback: first platform with a URL
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
          <h2 className="text-2xl font-black tracking-tight text-foreground">Offerwalls</h2>
          <p className="text-muted-foreground text-sm mt-1">Select a platform to start earning USDT.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4" style={{ height: "calc(100vh - 190px)", minHeight: "520px" }}>
          {/* Platform List */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
            {loadingPlatforms ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))
            ) : platforms.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold text-sm text-foreground">No platforms yet</p>
                <p className="text-muted-foreground text-xs mt-1">Check back soon!</p>
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
                        ? "bg-primary text-white border-primary shadow-[0_2px_12px_rgba(249,115,22,0.25)]"
                        : hasUrl
                        ? "bg-card border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                        : "bg-card border-border opacity-50 cursor-not-allowed"
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
                        isSelected ? "bg-white/20 border-white/30" : "bg-primary/10 border-primary/20"
                      }`}>
                        <Zap className={`h-4 w-4 ${isSelected ? "text-white" : "text-primary"}`} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`font-bold text-sm truncate ${isSelected ? "text-white" : "text-foreground"}`}>
                          {platform.name}
                        </p>
                        {isFeatured && !isSelected && (
                          <span className="text-[9px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shrink-0">
                            Featured
                          </span>
                        )}
                        {isFeatured && isSelected && (
                          <span className="text-[9px] bg-white/25 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${isSelected ? "text-orange-100" : "text-muted-foreground"}`}>
                        {hasUrl ? "Click to open" : "Coming soon"}
                      </p>
                    </div>
                    {hasUrl && (
                      <ChevronRight className={`h-4 w-4 shrink-0 ${isSelected ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Iframe Panel — always shows selected platform */}
          <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
            {selectedPlatform ? (
              <>
                {/* Top bar */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary/5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {selectedPlatform.logoUrl ? (
                    <img src={selectedPlatform.logoUrl} alt={selectedPlatform.name} className="w-6 h-6 rounded object-cover border border-border" />
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <span className="font-bold text-sm text-foreground flex-1">{selectedPlatform.name}</span>
                  <a
                    href={getOfferUrl(selectedPlatform)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
                  </a>
                </div>

                {/* The iframe — always open, never closes */}
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
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">No platforms available</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
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
