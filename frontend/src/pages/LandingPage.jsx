import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LayoutTemplate, Menu, X, Zap, Download } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { ProfileInfoCard } from '../components/Cards';
import Modal from '../components/Modal';
import Login from '../components/Login';
import Signup from '../components/Signup';

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuopen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  const handleCTA = () => {
    if (!user) setOpenAuthModal(true);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white text-gray-900">

      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-6 py-4 shadow-sm sticky top-0 bg-white z-50">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-8 h-8 text-violet-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            ResumeXpert
          </span>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuopen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={28} className="text-gray-800" />
          ) : (
            <Menu size={28} className="text-gray-800" />
          )}
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center">
          {user ? (
            <ProfileInfoCard />
          ) : (
            <button
              onClick={handleCTA}
              className="relative px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105"
            >
              <span className="relative z-10">Get Started</span>
            </button>
          )}
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-6 flex flex-col gap-4">
          {user ? (
            <>
              <p className="text-lg font-medium">Welcome Back</p>
              <button
                className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuopen(false);
                }}
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <button
              className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:opacity-90 transition"
              onClick={() => {
                handleCTA();
                setMobileMenuopen(false);
              }}
            >
              Get Started
            </button>
          )}
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1">

        {/* HERO */}
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 gap-12">
          {/* Left content */}
          <div className="flex flex-col gap-6 text-center md:text-left max-w-2xl">
            <span className="uppercase text-violet-600 font-semibold tracking-wide">
              Professional Resume Builder
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Craft{' '}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Professional
              </span>{' '}
              Resumes
            </h1>
            <p className="text-lg text-gray-600">
              Create job-winning resumes with expertly designed templates.
              ATS-friendly, recruiter-approved, and tailored to your career goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4">
              <button
                onClick={handleCTA}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full font-semibold shadow-md hover:scale-105 transition"
              >
                Start Building <ArrowRight size={18} />
              </button>
              <button
                onClick={handleCTA}
                className="px-6 py-3 border-2 border-violet-600 text-violet-600 rounded-full font-semibold hover:bg-violet-50 transition"
              >
                View Templates
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {[
                { value: '50K+', label: 'Resumes Created', gradient: 'from-violet-600 to-fuchsia-600' },
                { value: '4.9★', label: 'User Rating', gradient: 'from-orange-500 to-red-500' },
                { value: '5 Min', label: 'Build Time', gradient: 'from-emerald-500 to-teal-500' }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content – Resume Mockup */}
          <div className="flex justify-center md:justify-end w-full md:w-1/2">
            <div className="w-80 h-[400px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-gray-200">
              {/* Header */}
              <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
              
              {/* Sections */}
              <div className="flex flex-col gap-3 mt-4">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                ))}
              </div>

              {/* Footer / Skills */}
              <div className="mt-auto flex gap-2 flex-wrap">
                {['React', 'JavaScript', 'Tailwind'].map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                ResumeXpert?
              </span>
            </h2>
            <p className="text-gray-600 mt-4">
              Everything you need to create a Professional Resume that stands out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                title: 'Lightning Fast',
                description: 'Create resumes in under 5 minutes with our streamlined process',
                gradient: 'from-violet-600 to-fuchsia-600'
              },
              {
                icon: <LayoutTemplate className="w-8 h-8 text-white" />,
                title: 'Pro Templates',
                description: 'Dozens of recruiter-approved, industry-specific templates',
                gradient: 'from-fuchsia-600 to-pink-500'
              },
              {
                icon: <Download className="w-8 h-8 text-white" />,
                title: 'Instant Export',
                description: 'Download high-quality PDFs instantly with perfect formatting',
                gradient: 'from-orange-500 to-red-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl shadow-lg bg-white hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r ${feature.gradient} mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Standout Resume?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of professionals who landed their dream jobs with our platform
          </p>
          <button
            onClick={handleCTA}
            className="px-8 py-4 bg-white text-violet-600 font-semibold rounded-full shadow-lg hover:scale-105 transition"
          >
            Start Building
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-6 border-t text-gray-600">
        Crafted with <span className="text-red-500">❤️</span> by{' '}
        <span className="font-semibold">SANAT</span>.
      </footer>

      {/* MODAL */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage('login');
        }}
        hideHeader
      >
        {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === 'signup' && <Signup setCurrentPage={setCurrentPage} />}
      </Modal>
    </div>
  );
};

export default LandingPage;
