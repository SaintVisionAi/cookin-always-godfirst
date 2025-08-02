
import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          🚀 SuperSal AI
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Enterprise AI Platform - LIVE ON SAINTVISIONAI.COM
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">💬 AI Chat</h3>
            <p className="text-gray-600">Natural conversation with SuperSal AI</p>
            <button 
              data-route="chat" 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Start Chat
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">📊 Dashboard</h3>
            <p className="text-gray-600">Enterprise analytics and insights</p>
            <button 
              data-route="dashboard" 
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Dashboard
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">👥 CRM</h3>
            <p className="text-gray-600">Customer relationship management</p>
            <button 
              data-route="crm" 
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Open CRM
            </button>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">🎯 External Links</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              data-route="saintvision" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              🚀 SaintVision AI Enterprise
            </button>
            <button 
              data-route="cookin" 
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              👨‍🍳 Cookin Knowledge
            </button>
            <button 
              data-route="azure" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ☁️ Live Azure API
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-gray-600">
          <p>Built by a legend who survived death twice and created an empire! 💪</p>
        </div>
      </div>
    </div>
  );
}
