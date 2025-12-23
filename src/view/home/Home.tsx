import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Cpu,
  Edit3,
  GitBranch,
} from "lucide-react";
import type { FC } from "react";
import { Link } from "wouter";

export const Home: FC = () => {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ADAS Integration Toolkit
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Turn your car into an autonomous vehicle
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/routevis/guide/0">
              <button
                type="button"
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                <BookOpen className="w-5 h-5" />
                <span>Start Integration Guide</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Integration Guide Card */}
          <Link href="/routevis/guide/0">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-slate-600">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Integration Guide
              </h3>
              <p className="text-gray-400 mb-4">
                Step-by-step instructions to integrate ADAS into your vehicle
              </p>
              <div className="flex items-center text-cyan-400 font-medium">
                <span>7 Steps</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>

          {/* Route Editor Card */}
          <Link href="/routevis/edit/">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-slate-600">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Edit3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Route Editor
              </h3>
              <p className="text-gray-400 mb-4">
                Design and export test routes with waypoints and segments
              </p>
              <div className="flex items-center text-purple-400 font-medium">
                <span>Create Routes</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>

          {/* Log Analyzer Card */}
          <Link href="/routevis/view/">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-slate-600">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Log Analyzer
              </h3>
              <p className="text-gray-400 mb-4">
                Visualize test data and analyze system performance
              </p>
              <div className="flex items-center text-green-400 font-medium">
                <span>View Logs</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/routevis/guide/0">
              <button
                type="button"
                className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Hardware Setup</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </button>
            </Link>

            <Link href="/routevis/guide/1">
              <button
                type="button"
                className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                  <span className="text-white">CAN Bus Hacking</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </button>
            </Link>

            <Link href="/routevis/guide/3">
              <button
                type="button"
                className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <Edit3 className="w-5 h-5 text-green-400" />
                  <span className="text-white">PID Tuning</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </button>
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Build with safety in mind • Test in controlled environments only
          </p>
        </div>
      </div>
    </div>
  );
};
