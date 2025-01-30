// src/layouts/BlankLayout.tsx
import React from 'react';

const BlankLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="blank-layout">{children}</div>;
};

export default BlankLayout;
