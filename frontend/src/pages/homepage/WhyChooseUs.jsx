import React from "react";
import { Zap, Rocket, CreditCard, Headset, Gift, Trophy } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Easy and Fast",
        desc: "Complete your purchase on this website in just a few seconds.",
        color: "text-amber-500 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
        icon: Rocket,
        title: "Instant Delivery",
        desc: "Your top-up is credited to your game account instantly after payment.",
        color: "text-purple-500 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
        icon: CreditCard,
        title: "Convenient Payments",
        desc: "We've partnered with top providers in India for your convenience.",
        color: "text-blue-500 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
        icon: Headset,
        title: "24/7 Support",
        desc: "Our support team is always ready to assist you.",
        color: "text-rose-500 dark:text-rose-400",
        bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
        icon: Gift,
        title: "Exciting Promotions",
        desc: "Enjoy the best deals and promotions available.",
        color: "text-red-500 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
        icon: Trophy,
        title: "Earn Rewards",
        desc: "Get rewards for every purchase and redeem them for discounts.",
        color: "text-emerald-500 dark:text-dark-accent-primary",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-bg-secondary/40 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Why Choose Neo Store Official?
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 dark:text-dark-text-secondary max-w-2xl mx-auto leading-relaxed">
                        Join millions of users who trust Neo Store Official for fast and
                        secure digital top-ups. Whether it's game credits, gift cards,
                        subscription services or digital services, enjoy instant delivery
                        with no wait.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="group bg-white dark:bg-dark-bg-card rounded-xl border border-gray-100 dark:border-dark-border p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:hover:border-dark-accent-secondary/30"
                            >
                                {/* Icon */}
                                <div
                                    className={`inline-flex items-center justify-center h-14 w-14 rounded-xl ${feature.bg} mb-5 transition-transform duration-300 group-hover:scale-110`}
                                >
                                    <Icon className={`h-7 w-7 ${feature.color}`} strokeWidth={1.8} />
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-500 dark:text-dark-text-secondary leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
