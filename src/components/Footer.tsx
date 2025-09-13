import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-white/70 text-sm">
          © {currentYear} Team RRR. All rights reserved.
        </p>
      </div>
    </footer>
  );
}