'use client';

import { useState } from 'react';
import { Calendar, Video, Users, Clock, Check, Menu, X } from 'lucide-react';
import { signIn, useSession } from "next-auth/react";

export default function CalendarLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-normal text-blue-600">G</span>
                <span className="text-2xl font-normal text-red-500">o</span>
                <span className="text-2xl font-normal text-yellow-500">o</span>
                <span className="text-2xl font-normal text-blue-600">g</span>
                <span className="text-2xl font-normal text-green-500">l</span>
                <span className="text-2xl font-normal text-red-500">e</span>
              </div>
              <span className="text-xl text-gray-700 font-normal">Workspace</span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <button className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2">
                Contact sales
              </button>
              <button
        onClick={() => signIn("google")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
       Login
      </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 px-4">
            <button className="w-full text-blue-600 hover:text-blue-700 font-medium px-4 py-2 text-left">
              Contact sales
            </button>
            <button
        onClick={() => signIn("google")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
       Login
      </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-6 lg:col-start-1">
            <div className="relative w-full max-w-[800px] mx-auto">
              <picture>
                <source 
                  srcSet="https://lh3.googleusercontent.com/K4ZGtK_csFWLJLlf9l3KT9dUCPld1j2y4MXBdB80AlZm9LeLlUff27IZQrWL5-RNM_jcHaxLp2uNCK8lOdfYH4Voou4XnsvRdik=e365-pa-nu-rw-w1536" 
                  media="(min-width: 1024px)" 
                  width="1416" 
                  height="1260" 
                  type="image/webp"
                />
                <source 
                  srcSet="https://lh3.googleusercontent.com/K4ZGtK_csFWLJLlf9l3KT9dUCPld1j2y4MXBdB80AlZm9LeLlUff27IZQrWL5-RNM_jcHaxLp2uNCK8lOdfYH4Voou4XnsvRdik=e365-pa-nu-rw-w1536 2x" 
                  media="(min-width: 600px)" 
                  width="1536" 
                  height="1002" 
                  type="image/webp"
                />
                <img 
                  src="https://lh3.googleusercontent.com/K4ZGtK_csFWLJLlf9l3KT9dUCPld1j2y4MXBdB80AlZm9LeLlUff27IZQrWL5-RNM_jcHaxLp2uNCK8lOdfYH4Voou4XnsvRdik=e365-pa-nu-rw-w1536" 
                  srcSet="https://lh3.googleusercontent.com/PIA0crC9fHBoMpqPnnifXKhdIzZRlamBe8gXAMxSHGwduEJGgvdpMrA0-ZiuHFpq5vGIrYTQ1c0Ne22P2f7PUVxzVT=e365-pa-nu-rw-w720 1x, https://lh3.googleusercontent.com/PIA0crC9fHBoMpqPnnifXKhdIzZRlamBe8gXAMxSHGwduEJGgvdpMrA0-ZiuHFpq5vGIrYTQ1c0Ne22P2f7PUVxzVT=e365-pa-nu-rw-w1536 2x" 
                  alt="Shareable calendar with Google Workspace" 
                  width="800"
                  height="600" 
                  loading="eager"
                  className="w-full h-auto shadow-xl rounded-lg"
                />
              </picture>
            </div>
          </div>
            

          {/* Right content - Calendar Preview */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-600 text-white p-2.5 rounded-lg">
                <Calendar size={24} />
              </div>
              <span className="text-2xl font-normal text-gray-900">Calendar</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-normal text-gray-900 mb-6 leading-tight">
              Integrated online calendars designed for teams
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
              Spend less time planning and more time doing with shareable calendars that integrate seamlessly with Gmail, Drive, Contacts, Sites and Meet so that you always know what's next.
            </p>
            
            <a href="/calendar" className="inline-block">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md text-base">
                Login with Google
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Smart Scheduling Section */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
                Smart scheduling for meetings
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Schedule events quickly by checking coworkers' availability or layering their calendars in a single view. You can share calendars so that people see full event details or just if you are free.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600" />
                  <span className="font-medium">Calendar</span>
                </div>
                <span className="text-sm text-gray-600">January</span>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-xs text-center mb-4">
                <div className="text-gray-500">M</div>
                <div className="text-gray-500">T</div>
                <div className="text-gray-500">W</div>
                <div className="text-gray-500">T</div>
                <div className="text-gray-500">F</div>
                <div className="text-gray-500">S</div>
                <div className="text-gray-500">S</div>
                {[...Array(31)].map((_, i) => (
                  <div key={i} className={`p-2 ${i === 19 ? 'bg-blue-600 text-white rounded-full font-bold' : 'text-gray-700'}`}>
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="bg-green-500 text-white p-2 rounded text-xs">Breakfast with Jane</div>
                <div className="bg-blue-500 text-white p-2 rounded text-xs">Go food with clients</div>
                <div className="bg-blue-400 text-white p-2 rounded text-xs">Finalize documents</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}