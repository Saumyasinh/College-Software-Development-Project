import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Gift, Check, X } from "lucide-react";

export default function FirstLoginBonus() {
  const { showFirstLoginBonus, clearFirstLoginBonus, walletBalance } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showFirstLoginBonus) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        clearFirstLoginBonus();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showFirstLoginBonus, clearFirstLoginBonus]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm mx-4 animate-in fade-in slide-in-from-right">
      <div className="rounded-2xl bg-gradient-to-br from-plum to-plum/80 shadow-2xl overflow-hidden border border-plum/30">
        {/* Header */}
        <div className="bg-plum/20 backdrop-blur px-6 py-4 border-b border-plum/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
              <Gift size={20} className="text-white" />
            </div>
            <h3 className="font-display text-lg font-semibold text-white">Welcome Bonus!</h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="mb-4">
            <p className="text-sm text-white/90 mb-3">
              🎉 Welcome to Tone! You've received a special welcome bonus.
            </p>
            
            <div className="bg-white/15 backdrop-blur rounded-xl p-4 mb-3 border border-white/20">
              <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Free Cash Added</p>
              <p className="text-3xl font-bold text-white">₹1,000</p>
              <p className="text-xs text-white/70 mt-2">Use it whenever you want, on any order</p>
            </div>

            <div className="bg-white/10 rounded-lg p-3 border border-white/10">
              <div className="flex items-start gap-2">
                <Check size={16} className="text-green-300 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/90">
                  Your Tone Wallet now has <span className="font-semibold">₹{walletBalance.toLocaleString("en-IN")}</span> available
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              clearFirstLoginBonus();
            }}
            className="w-full bg-white text-plum font-semibold py-2.5 rounded-lg hover:bg-white/90 transition-colors text-sm"
          >
            Get Started
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            clearFirstLoginBonus();
          }}
          className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
