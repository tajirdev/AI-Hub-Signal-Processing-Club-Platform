import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-4 lg:px-8 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-700">AI Hub & Signal Processing Club</span>. Web developers.
        </p>
        <div className="flex items-center space-x-4 font-medium">
          <span className="text-gray-400">Admin Version 1.0</span>
        </div>
      </div>
    </footer>
  );
}
