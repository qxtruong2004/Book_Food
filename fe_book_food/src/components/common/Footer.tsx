// src/components/common/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-light text-center py-3 mt-4" style={{backgroundColor: "#2E7D32"}}>
      <p className="mb-0">&copy; {new Date().getFullYear()} FoodApp. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
