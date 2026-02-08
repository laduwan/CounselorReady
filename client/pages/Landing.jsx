import { Link } from 'react-router-dom';
import { CheckCircle, BookOpen, Award, Users, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-burgundy-700 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12M8 9l4-6 4 6M6 21h12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-burgundy-800 text-lg">CounselorReady</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Learn. License. Lead.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Clinical training and credential tracking for counselors at every stage of their career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2">
              Start 7-Day Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/courses" className="btn-secondary text-lg px-8 py-3">
              Browse Courses
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Advance Your Career
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-forest-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Practical Courses
              </h3>
              <p className="text-gray-600">
                CEU-eligible courses on telehealth, ethics, documentation, and more. 
                Learn skills that actually prepare you for practice.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-burgundy-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-burgundy-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Credential Tracker
              </h3>
              <p className="text-gray-600">
                Track all your licenses and certifications in one place. 
                Get reminders before renewals and never miss a deadline.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                NCMHCE Prep
              </h3>
              <p className="text-gray-600">
                Prepare for the NCMHCE with AI-powered study tools, 
                practice cases, and proven strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credential Tracker Highlight */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Never Miss a Renewal Again
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our credential tracker knows the requirements for every state license and national certification. 
                Just add your credentials and we'll track your progress automatically.
              </p>
              <ul className="space-y-3">
                {[
                  'All 50 states pre-loaded',
                  'Track multiple credentials at once',
                  'CEUs count toward all applicable licenses',
                  'Email and calendar reminders',
                  'Upload certificates from any provider'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-forest-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 rounded-xl p-6">
              {/* Mock credential tracker UI */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Georgia LPC</h4>
                    <p className="text-sm text-gray-500">Expires: June 2026</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-forest-600 font-medium">20/35 CEUs</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-forest-500 rounded-full" style={{ width: '57%' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">NCC</h4>
                    <p className="text-sm text-gray-500">Expires: March 2027</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-forest-600 font-medium">45/100 CEUs</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-forest-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Affordable Pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Start free, upgrade when you're ready.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">$0</p>
              <ul className="space-y-2 text-left mb-6">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-forest-500" />
                  NCMHCE Study Starter course
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-forest-500" />
                  1 credential tracking
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-forest-500" />
                  Basic progress tracking
                </li>
              </ul>
              <Link to="/register" className="btn-secondary w-full block text-center">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-xl p-6 border-2 border-burgundy-700 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-burgundy-700 text-white text-xs font-medium rounded-full">
                Most Popular
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">$19<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-sm text-gray-500 mb-4">or $149/year (save 35%)</p>
              <ul className="space-y-2 text-left mb-6">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-forest-500" />
                  All courses included
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-forest-500" />
                  Unlimited credentials
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-forest-500" />
                  Email & calendar reminders
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-forest-500" />
                  Certificate storage
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-forest-500" />
                  CEU tracking across credentials
                </li>
              </ul>
              <Link to="/register" className="btn-primary w-full block text-center">
                Start 7-Day Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-burgundy-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Build Your Clinical Confidence?
          </h2>
          <p className="text-lg text-burgundy-100 mb-8">
            Join counselors who are taking control of their professional development.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-forest-600 font-semibold px-8 py-3 rounded-lg hover:bg-forest-100 transition-colors">
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-burgundy-700 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12M8 9l4-6 4 6M6 21h12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-semibold text-white">CounselorReady</span>
            </div>
            <p className="text-gray-400 text-sm">
              Learn. License. Lead.
            </p>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CounselorReady. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
