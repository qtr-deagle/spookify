import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Check, Zap } from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import { toast } from "sonner";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { user, setUser } = useMusic();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium" | "pro" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "Perfect to get started",
      features: [
        "Listen to unlimited songs",
        "Ad-supported",
        "Standard audio quality",
        "Create playlists",
        "Basic recommendations",
      ],
      highlighted: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$9.99",
      period: "/month",
      description: "No ads, offline listening",
      features: [
        "Ad-free listening",
        "Offline downloads",
        "High audio quality",
        "Skip unlimited",
        "Exclusive content",
        "Create and share playlists",
      ],
      highlighted: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$14.99",
      period: "/month",
      description: "Full artist control",
      features: [
        "Everything in Premium",
        "Highest audio quality (FLAC)",
        "Lossless audio",
        "Admin panel access",
        "Upload your own songs",
        "Advanced analytics",
        "24/7 priority support",
      ],
      highlighted: false,
    },
  ];

  const handleSelectPlan = async (planId: "free" | "premium" | "pro") => {
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedUser = {
        ...user,
        subscription: planId,
        subscriptionDate: new Date().toISOString(),
      };

      setUser(updatedUser);
      toast.success(`Successfully upgraded to ${plans.find((p) => p.id === planId)?.name}!`);
      
      // Close modal after successful subscription
      setTimeout(() => {
        onClose();
        setSelectedPlan(null);
      }, 1000);
    } catch (error) {
      toast.error("Failed to process subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-surface-hover to-background rounded-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm border-b border-orange-500/20 px-6 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              <Zap className="h-8 w-8 text-orange-500" />
              Choose Your Plan
            </h2>
            <p className="text-white/60 mt-1">Unlock premium features and elevate your music experience</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-orange-500 bg-gradient-to-br from-orange-500/10 to-amber-500/5 shadow-2xl shadow-orange-500/20 transform md:scale-105"
                    : "border-white/10 bg-surface-hover/50 hover:border-orange-500/50"
                }`}
              >
                {/* Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/60 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-white/60">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id as "free" | "premium" | "pro")}
                    disabled={isProcessing && selectedPlan === plan.id}
                    className={`w-full mb-8 py-3 font-bold rounded-full transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-white/10 hover:bg-orange-500/20 text-white border border-white/20 hover:border-orange-500/50"
                    }`}
                  >
                    {isProcessing && selectedPlan === plan.id
                      ? "Processing..."
                      : user?.subscription === plan.id
                      ? "Current Plan"
                      : plan.id === "free"
                      ? "Downgrade"
                      : "Upgrade Now"}
                  </Button>

                  {/* Features List */}
                  <div className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Footer */}
          <div className="mt-12 p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-white/70 text-sm">
              <span className="font-semibold text-white">💳 Secure Payment:</span> All subscriptions are handled securely.
              Cancel anytime, no hidden fees. You can change your plan at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
