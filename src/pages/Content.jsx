import React, { useState } from "react";
import Payment from "./Payment"; 

const Content = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState(0);

  const handlePackageSelect = (packageItem) => {
    // Convert coins string to number (e.g., "10" → 10)
    const coins = parseInt(packageItem.coins);
    setSelectedCoins(coins);
    setShowPaymentModal(true);
  };

  return (
    <div className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          How Our Platform Works
        </h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
          Connecting brands with the perfect influencers in just a few simple steps
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: "Create Your Account", 
              description: "Sign up in minutes and set up your brand profile to get started.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )
            },
            { 
              title: "Find Perfect Influencers", 
              description: "Use our advanced filters to discover influencers who match your brand values.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )
            },
            { 
              title: "Direct Messaging", 
              description: "Communicate directly with influencers through our secure messaging system.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )
            },
            { 
              title: "Secure Payment", 
              description: "Agree on terms and make payments safely through our escrow system.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            { 
              title: "Campaign Execution", 
              description: "Influencers create authentic content that resonates with their audience.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )
            },
            { 
              title: "Performance Analytics", 
              description: "Track engagement, reach, and ROI with our detailed analytics dashboard.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              )
            },
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-[#151515] p-8 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:-translate-y-2 border border-gray-800 group"
            >
              <div className="text-green-400 mb-4 group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors duration-300">{item.title}</h3>
              <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            LinkCoins Packages
          </h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-2">
            1 LinkCoin = ₹5 | 7 days chat access per influencer
          </p>
          <p className="text-center text-green-400 text-sm mb-12">
            Guarantee: Full refund if influencer doesn't reply within 48 hours
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 items-stretch">
            {[
              { 
                coins: "10",
                free: "+1 free",
                price: "₹50", 
                originalPrice: "₹55",
                features: [
                  "11 total LinkCoins (10+1 free)",
                  "Connect with 11 influencers",
                  "77 total days of chat access",
                  "48-hour reply guarantee",
                  "Save ₹5 (9% discount)"
                ],
                cta: "Start Small",
                popular: false
              },
              { 
                coins: "25",
                free: "+5 free",
                price: "₹125", 
                originalPrice: "₹150",
                features: [
                  "30 total LinkCoins (25+5 free)",
                  "Connect with 30 influencers",
                  "210 total days of chat access",
                  "48-hour reply guarantee",
                  "Save ₹25 (17% discount)"
                ],
                cta: "Most Popular",
                popular: true
              },
              { 
                coins: "50",
                free: "+12 free",
                price: "₹250", 
                originalPrice: "₹310",
                features: [
                  "62 total LinkCoins (50+12 free)",
                  "Connect with 62 influencers",
                  "434 total days of chat access",
                  "48-hour reply guarantee",
                  "Save ₹60 (19% discount)"
                ],
                cta: "Best Value",
                popular: false
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 rounded-xl flex flex-col relative transition-all hover:shadow-lg hover:shadow-green-400/10 ${
                  item.popular 
                    ? "border-2 border-green-400 md:transform md:scale-105 z-10" 
                    : "border border-gray-700"
                }`}
              >
                {item.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-black px-4 py-1 rounded-full text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <div className="flex justify-center items-baseline">
                    <span className="text-4xl font-bold text-green-400">{item.coins}</span>
                    <span className="text-xl ml-2">LinkCoins</span>
                  </div>
                  <div className="text-green-300 font-medium mt-1 bg-gray-800 rounded-full py-1 px-3 inline-block">
                    {item.free}
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-3xl font-extrabold">{item.price}</p>
                  {item.originalPrice && (
                    <p className="text-gray-400 line-through text-sm mt-1">{item.originalPrice}</p>
                  )}
                </div>
                
                <ul className="flex-grow space-y-2.5 mb-6 text-sm">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                onClick={() => handlePackageSelect(item)}
                className={`mt-auto w-full py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                  item.popular 
                    ? "bg-green-400 text-black hover:bg-green-300 shadow-md shadow-green-400/30" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {item.cta}
              </button>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-[#151515] rounded-xl p-6 max-w-4xl mx-auto border border-gray-700">
            <h3 className="text-xl font-bold text-green-400 mb-4">How LinkCoins Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <div className="bg-green-400 text-black rounded-full p-1 mr-3 flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span><strong>1 LinkCoin = ₹5</strong> = 7 days chat with 1 influencer</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-400 text-black rounded-full p-1 mr-3 flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span><strong>Free coins</strong> are instantly added to your wallet</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-400 text-black rounded-full p-1 mr-3 flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span><strong>48-hour guarantee</strong>: Full refund if no reply</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-400 text-black rounded-full p-1 mr-3 flex-shrink-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span><strong>No expiration</strong>: Use your coins anytime</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 text-gray-400 text-sm">
            <p>Need custom packages for your team? <a href="#contact" className="text-green-400 hover:underline font-medium cursor-pointer">Contact our sales team</a></p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform helped us find micro-influencers who genuinely cared about our eco-friendly products. Campaign ROI was 5x our expectations!",
                name: "Priya Sharma",
                role: "Marketing Director, GreenLife",
                avatar: "👩🏽"
              },
              {
                quote: "The messaging system and analytics saved us dozens of hours compared to our old outreach process. Worth every rupee!",
                name: "Rahul Patel",
                role: "Founder, UrbanBites",
                avatar: "👨🏽"
              },
              {
                quote: "As a small business, the pay-per-influencer model was perfect. We started with 10 LinkCoins and scaled up as we saw results.",
                name: "Neha Gupta",
                role: "CEO, CraftCircle",
                avatar: "👩🏽"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#151515] p-6 rounded-xl border border-gray-700">
                <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-8 md:p-12 border border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Influencer Marketing?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Join hundreds of brands already growing with our platform. Get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-green-400 hover:bg-green-300 text-black font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
              Get Started Now
            </button>
            <button className="bg-transparent hover:bg-gray-800 text-white font-bold py-3 px-8 border border-gray-600 rounded-lg transition-all">
              Book a Demo
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-6">No credit card required • 7-day free trial available</p>
        </div>
      </div>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <Payment 
            onClose={() => setShowPaymentModal(false)}
            initialCoins={selectedCoins}
          />
        </div>
      )}
    </div>
  );
};

export default Content;