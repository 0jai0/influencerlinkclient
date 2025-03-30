import React from 'react';
import { motion } from 'framer-motion';
import { Users, Rocket, ShieldCheck, BarChart2, HeartHandshake } from 'lucide-react';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const stats = [
    { value: '10,000+', label: 'Creators' },
    { value: '5,000+', label: 'Successful Collabs' },
    { value: '200+', label: 'Industries' },
    { value: '24/7', label: 'Support' }
  ];

  const features = [
    {
      icon: <Rocket size={40} className="text-indigo-500" />,
      title: "Boost Your Reach",
      description: "Connect with creators who can amplify your brand's visibility across social platforms."
    },
    {
      icon: <ShieldCheck size={40} className="text-green-500" />,
      title: "Verified Analytics",
      description: "Authentic performance data you can trust for making collaboration decisions."
    },
    {
      icon: <HeartHandshake size={40} className="text-rose-500" />,
      title: "Seamless Partnerships",
      description: "Our integrated tools make negotiating and managing campaigns effortless."
    },
    {
      icon: <BarChart2 size={40} className="text-amber-500" />,
      title: "Performance Tracking",
      description: "Real-time metrics to measure the success of your collaborations."
    }
  ];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#151515] text-white">
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
              Connecting Brands <span className="block">with Creative Talent</span>
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              The premier marketplace for authentic influencer partnerships powered by transparent data.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 mb-12 lg:mb-0"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-lg text-gray-300 mb-4">
                Founded in 2025, we recognized the growing need for a transparent, efficient platform connecting brands with authentic creators.
              </p>
              <p className="text-lg text-gray-300 mb-4">
                Frustrated by the lack of reliable performance data and inflated follower counts in the influencer space, we built a solution that values genuine engagement over vanity metrics.
              </p>
              <p className="text-lg text-gray-300">
                Today, we're proud to be the most trusted marketplace for performance-driven influencer collaborations.
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
                  To democratize access to authentic influencer marketing by removing gatekeepers and providing direct access to vetted creators.
                </p>
                <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Our Values</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Transparency in all metrics and pricing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Fair compensation for creators</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Data-driven collaboration decisions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-400 mr-2">•</span>
                    <span>Authentic engagement over vanity metrics</span>
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
            <h2 className="text-3xl font-bold text-white">Why Choose Our Platform?</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              We're redefining influencer marketing with tools that benefit both brands and creators.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-indigo-400 transition-all duration-300"
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
      <div className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Marketing?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join thousands of brands and creators already growing together on our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
            onClick={() => navigate('/RegisterUser')}
             className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors duration-300">
              Sign Up as Brand
            </button>
            <button
            onClick={() => navigate('/')}
             className="bg-indigo-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-900 transition-colors duration-300 border border-indigo-600">
              Join as Creator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;