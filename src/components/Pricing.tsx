import { useMusic } from "@/context/MusicContext";
import { useState } from "react";
import { SubscriptionModal } from "./SubscriptionModal";
import { Button } from "@/components/ui/button";
import { Check, Zap, X } from "lucide-react";

export function Pricing() {
  const { user } = useMusic();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "Perfect to get started",
      features: [
        { name: "Listen to unlimited songs", included: true },
        { name: "Ad-supported", included: true },
        { name: "Standard audio quality", included: true },
        { name: "Create playlists", included: true },
        { name: "Basic recommendations", included: true },
        { name: "Offline downloads", included: false },
        { name: "Skip unlimited", included: false },
        { name: "High audio quality", included: false },
      ],
      highlighted: false,
      current: user?.subscription === "free" || !user?.subscription,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$9.99",
      period: "/month",
      description: "No ads, offline listening",
      features: [
        { name: "Listen to unlimited songs", included: true },
        { name: "Ad-free listening", included: true },
        { name: "High audio quality", included: true },
        { name: "Skip unlimited", included: true },
        { name: "Create playlists", included: true },
        { name: "Offline downloads", included: true },
        { name: "Exclusive content", included: true },
        { name: "Highest audio quality (FLAC)", included: false },
      ],
      highlighted: true,
      current: user?.subscription === "premium",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$14.99",
      period: "/month",
      description: "Full artist control",
      features: [
        { name: "Listen to unlimited songs", included: true },
        { name: "Ad-free listening", included: true },
        { name: "Highest audio quality (FLAC)", included: true },
        { name: "Lossless audio", included: true },
        { name: "Admin panel access", included: true },
        { name: "Upload your own songs", included: true },
        { name: "Advanced analytics", included: true },
        { name: "24/7 priority support", included: true },
      ],
      highlighted: false,
      current: user?.subscription === "pro",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-orange-500/10 via-background to-background overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm p-6 z-40 border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-orange-500" />
            Pricing Plans
          </h1>
          <p className="text-white/70 text-lg">Choose the perfect plan for your music journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? "border-orange-500 bg-gradient-to-br from-orange-500/10 to-amber-500/5 shadow-2xl shadow-orange-500/20 transform md:scale-105 pt-12"
                  : "border-white/10 bg-surface-hover/50 hover:border-orange-500/50"
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="mt-5 inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Current Plan Badge */}
              {plan.current && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-500/50">
                    Current Plan
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
                    {plan.period && <span className="text-white/60">{plan.period}</span>}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  disabled={plan.current}
                  className={`w-full mb-8 py-3 font-bold rounded-full transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl disabled:from-orange-500/50 disabled:to-amber-500/50"
                      : "bg-white/10 hover:bg-orange-500/20 text-white border border-white/20 hover:border-orange-500/50 disabled:bg-white/5 disabled:border-white/10"
                  }`}
                >
                  {plan.current
                    ? "Current Plan"
                    : plan.id === "free"
                    ? "Downgrade"
                    : "Upgrade Now"}
                </Button>

                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-4">
                    What's included
                  </h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-white/20 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-white/80" : "text-white/40"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-white mb-8">Feature Comparison</h2>
          <div className="bg-surface-hover/50 border border-white/10 rounded-2xl overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-white font-bold">Feature</th>
                  <th className="px-6 py-4 text-center text-white font-bold">Free</th>
                  <th className="px-6 py-4 text-center text-white font-bold">
                    <span className="text-orange-400">Premium</span>
                  </th>
                  <th className="px-6 py-4 text-center text-white font-bold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Unlimited Listening", free: true, premium: true, pro: true },
                  { name: "Ad Supported", free: true, premium: false, pro: false },
                  { name: "Offline Downloads", free: false, premium: true, pro: true },
                  { name: "High Audio Quality", free: false, premium: true, pro: true },
                  { name: "Highest Quality (FLAC)", free: false, premium: false, pro: true },
                  { name: "Skip Unlimited", free: false, premium: true, pro: true },
                  { name: "Create Playlists", free: true, premium: true, pro: true },
                  { name: "Admin Panel Access", free: false, premium: false, pro: true },
                  { name: "Upload Your Songs", free: false, premium: false, pro: true },
                  { name: "Analytics Dashboard", free: false, premium: false, pro: true },
                  { name: "Priority Support", free: false, premium: false, pro: true },
                ].map((feature, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{feature.name}</td>
                    <td className="px-6 py-4 text-center">
                      {feature.free ? (
                        <Check className="h-5 w-5 text-orange-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-white/20 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.premium ? (
                        <Check className="h-5 w-5 text-orange-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-white/20 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.pro ? (
                        <Check className="h-5 w-5 text-orange-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-white/20 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "Our Free plan gives you full access to explore Spookify. Upgrade to Premium or Pro anytime.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and digital payment methods.",
              },
              {
                q: "Do I get a refund if I cancel?",
                a: "Subscriptions are non-refundable, but you can cancel anytime and keep access until the end of your billing period.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-surface-hover/50 border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-bold mb-2">{faq.q}</h4>
                <p className="text-white/70">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="mb-16 bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to upgrade your experience?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Join millions of music lovers who enjoy unlimited, ad-free listening with premium sound quality.
          </p>
          <Button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Zap className="h-5 w-5 mr-2" />
            Choose Your Plan
          </Button>
        </section>
      </div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </div>
  );
}
