import React from 'react';
import { motion } from 'framer-motion';
import { Users, Rocket, ShieldCheck, BarChart2, HeartHandshake, TrendingUp, Filter, ClipboardCheck, DollarSign } from 'lucide-react';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const stats = [
    { value: '150+', label: 'Verified Creators', icon: <Users size={24} className="text-indigo-400" /> },
    { value: '50+', label: 'Successful Campaigns', icon: <ClipboardCheck size={24} className="text-green-400" /> },
    { value: '30+', label: 'Industry Verticals', icon: <Filter size={24} className="text-amber-400" /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <HeartHandshake size={24} className="text-rose-400" /> }
  ];

  const features = [
    {
      icon: <Rocket size={40} className="text-indigo-500" />,
      title: "Amplify Your Reach",
      description: "Leverage our network of premium influencers to boost brand awareness and engagement across all major social platforms."
    },
    {
      icon: <ShieldCheck size={40} className="text-green-500" />,
      title: "Verified Creator Network",
      description: "Access thoroughly vetted influencers with authentic audiences and transparent performance metrics."
    },
    {
      icon: <TrendingUp size={40} className="text-amber-500" />,
      title: "Data-Driven Matching",
      description: "Our AI-powered algorithm connects brands with ideal creators based on audience demographics and performance history."
    },
    {
      icon: <DollarSign size={40} className="text-emerald-500" />,
      title: "Competitive Pricing",
      description: "Get fair market rates with flexible budget options for campaigns of all sizes."
    },
    {
      icon: <BarChart2 size={40} className="text-purple-500" />,
      title: "Real-Time Analytics",
      description: "Comprehensive campaign tracking with actionable insights to measure ROI and optimize performance."
    },
    {
      icon: <HeartHandshake size={40} className="text-rose-500" />,
      title: "End-to-End Management",
      description: "From contract to payment, our platform streamlines every step of the collaboration process."
    }
  ];

  return (
    <div className="relative flex flex-col h-screen w-full bg-[#151515] text-white">
      {/* Hero Section */}
      <Navbar />
      
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -80 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The Future of <span className="block">Influencer Marketing</span>
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              PromoterLink is the leading influencer marketing platform connecting premium brands with authentic creators through data-driven partnerships.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Trusted by Industry Leaders</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-indigo-400 transition-colors"
            >
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 mb-12 lg:mb-0"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
              <p className="text-lg text-gray-300 mb-4">
                Founded in 2025, PromoterLink emerged from a fundamental need in the influencer marketing space - the demand for transparency, authenticity, and measurable results in brand-creator collaborations.
              </p>
              <p className="text-lg text-gray-300 mb-4">
                As digital marketing veterans, we recognized the industry's pain points: inflated metrics, opaque pricing, and inefficient discovery processes. PromoterLink was built to revolutionize influencer marketing through technology, data integrity, and fair value exchange.
              </p>
              <p className="text-lg text-gray-300">
                Today, we're proud to power performance-driven partnerships for Fortune 500 brands and emerging creators alike, setting new standards for accountability in the influencer economy.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 lg:pl-12"
            >
              <div className="bg-gray-700 p-8 rounded-xl shadow-md border border-gray-600">
                <Users size={48} className="text-indigo-400 mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Our Mission</h3>
                <p className="text-gray-300 mb-4">
                  To democratize access to authentic influencer marketing through transparent, technology-enabled connections that deliver measurable value for both brands and content creators.
                </p>
                <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Core Principles</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span><strong>Radical Transparency:</strong> Real metrics, verified audiences, clear pricing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span><strong>Creator Empowerment:</strong> Fair compensation and creative freedom</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span><strong>Data Integrity:</strong> AI-verified analytics for informed decisions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span><strong>Performance Focus:</strong> ROI-driven campaigns with actionable insights</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">The PromoterLink Advantage</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge technology meets human expertise to deliver unparalleled influencer marketing solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20"
              >
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Elevate Your Marketing Strategy?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join thousands of forward-thinking brands and professional creators in the most trusted influencer marketing ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/RegisterUser')}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors duration-300 shadow-lg hover:shadow-indigo-200"
            >
              Brand Sign Up
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-transparent text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-300 border-2 border-white hover:border-indigo-300 shadow-lg hover:shadow-indigo-200/10"
            >
              Creator Application
            </button>
          </div>
          <p className="mt-6 text-indigo-200">
            Enterprise solutions available • 24/7 support • PCI-compliant payments
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;