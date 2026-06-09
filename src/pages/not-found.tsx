import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle, Coins } from "lucide-react";

function CachvioLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
        <Coins className="w-6 h-6 text-black" />
      </div>
      <span className="text-2xl font-black tracking-tight text-white">Cach<span className="text-yellow-400">vio</span></span>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="relative z-10 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-6xl font-black text-yellow-400 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-zinc-500 text-sm">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/30 hover:from-yellow-400 hover:to-yellow-300">
              <Home className="h-4 w-4 mr-2" />Back to Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-yellow-400 hover:border-yellow-500/40">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
