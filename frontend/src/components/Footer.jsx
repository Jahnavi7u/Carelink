import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 pt-12 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <Link to="/" className="text-2xl font-bold text-indigo-600 mb-4 block hover:text-indigo-700 transition">
              CareLink
            </Link>
            <p className="text-gray-600">
              Making healthcare accessible to everyone, everywhere.
            </p>
          </div>

          {/* Platform Column */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-500 hover:text-indigo-600 transition">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-indigo-600 transition">Pricing</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-indigo-600 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-500 hover:text-indigo-600 transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-indigo-600 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-500 hover:text-indigo-600 transition">Terms of Service</Link></li>
              <li><Link to="/consent" className="text-gray-500 hover:text-indigo-600 transition">Data Sharing Consent</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-indigo-600 transition">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t">
          <p className="text-sm text-gray-500 sm:mb-0">
            © {new Date().getFullYear()} CareLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}