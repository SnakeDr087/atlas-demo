import React from 'react';
import { CheckCircleIcon, StarIcon } from './IconComponents.tsx';

const pricingTiers = [
    {
      name: "Core",
      price: 12000,
      priceYear2: 10000,
      onboarding: 2000,
      features: [
        "Manual Review Module",
        "Performance Improvement Plan (PIP) Module",
        "Dashboard Analytics",
        "Standard Reporting",
        "500 GB Storage",
      ],
      description: "For agencies getting started with structured performance reviews.",
    },
    {
      name: "Pro",
      price: 17000,
      priceYear2: 15000,
      onboarding: 2000,
      features: [
        "All Core features",
        "BWC (AI) Analysis & Transcription",
        "Sentiment Analysis (Officer Wellness)",
        "In-Person Review Module",
        "AI Summary Report Generation",
        "1 TB Storage",
      ],
      description: "Advanced AI tools for deeper insights and proactive management.",
      popular: true,
    },
    {
      name: "Elite",
      price: 27000,
      priceYear2: 25000,
      onboarding: 2000,
      features: [
        "All Pro features",
        "Full BWC Reviews by Atlas Team (up to 20/month)",
        "Monthly Performance Reports by Atlas Analysts",
        "Dedicated Account Manager",
        "5 TB Storage",
      ],
      description: "A full-service partnership with hands-on support from our expert team.",
    }
];

const PricingOnePager: React.FC = () => {
    return (
        <div id="pricing-one-pager" className="bg-white p-12 font-sans">
            <header className="flex justify-between items-center pb-8 border-b">
                <div>
                    <h1 className="text-4xl font-bold text-atlas-dark">ATLAS</h1>
                    <p className="text-lg text-gray-500">Performance Management System Pricing</p>
                </div>
                <img src="https://i.postimg.cc/nzWkmYS1/atlas-logo-in-circle.png" alt="ATLAS Logo" className="h-20 w-20" />
            </header>

            <main className="mt-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Transparent Pricing for Every Agency</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Empower your supervisors and enhance officer performance with a plan that fits your agency's needs. All plans are billed annually.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {pricingTiers.map(plan => (
                        <div key={plan.name} className={`relative border rounded-lg p-8 flex flex-col shadow-lg ${plan.popular ? 'border-atlas-blue ring-2 ring-atlas-blue' : 'border-gray-200'}`}>
                            {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center"><StarIcon className="h-4 w-4 mr-1"/> MOST POPULAR</span>}

                            <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                            <p className="text-sm text-gray-500 mt-2 flex-grow">{plan.description}</p>
                            
                            <div className="my-8">
                                <p className="text-gray-900">
                                    <span className="text-5xl font-extrabold">${plan.price.toLocaleString()}</span>
                                    <span className="text-xl font-medium text-gray-500">/ Year 1</span>
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Includes ${plan.onboarding.toLocaleString()} one-time onboarding fee.</p>
                                <p className="text-xl font-semibold text-gray-700 mt-2">${plan.priceYear2.toLocaleString()} <span className="text-base font-medium text-gray-500">/ Year 2+</span></p>
                            </div>

                            <ul className="space-y-4 text-sm">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-start">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"/>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="mt-16 pt-8 border-t text-center text-gray-500">
                <p className="text-sm">&copy; {new Date().getFullYear()} ATLAS Performance Management. All rights reserved.</p>
                <p className="text-xs mt-1">For questions, please contact sales@atlaspm.com.</p>
            </footer>
        </div>
    );
};

export default PricingOnePager;
