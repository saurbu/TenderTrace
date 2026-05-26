import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-gray-900 tracking-wider">TenderTrace</span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-xs tracking-widest uppercase">Contact Details</h4>
            <ul className="space-y-3">
              <li><a href="mailto:support@tendertrace.gov" className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center">support@tendertrace.gov<i className="ri-arrow-right-up-line ml-1"></i></a></li>
              <li className="text-sm text-gray-500">Location: India</li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center">Help/Support<i className="ri-arrow-right-up-line text-blue-400 ml-1"></i></a></li>
            </ul>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-xs tracking-widest uppercase">Key Features</h4>
            <ul className="space-y-3 flex flex-col">
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Attendence Tracking</span></li>
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Material Varification</span></li>
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Express Monitoring</span></li>
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Progress Tracking</span></li>
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Fraud Detection</span></li>
            </ul>
          </div>

          {/* Transparency Section */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-xs tracking-widest uppercase">Transparency Section</h4>
            <ul className="space-y-3 flex flex-col">
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Public Dashboard</span></li>
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Report Corruption</span></li>
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Open Data Access</span></li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-xs tracking-widest uppercase">Legal / Info</h4>
            <ul className="space-y-3 flex flex-col">
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Terms of Use</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          © 2026 TenderTrace
        </div>

      </div>
    </footer>
  )
}

export default Footer
