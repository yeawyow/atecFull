import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface ProtectRouteProps {
  children: ReactNode; // กำหนดว่าผ่าน children ได้ทุกประเภทที่เป็น ReactNode
  //  requireRoles?: string[]; // บทบาทที่ต้องการ (optional)
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({
  children,
  // requireRoles = [],
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  /* const userRoles = JSON.parse(
    sessionStorage.getItem('roles') || '[]',
  ) as string[]; // ดึงบทบาทจาก sessionStorage*/

  // ตรวจสอบบทบาทที่จำเป็น
  // const hasRequiredRoles =
  // requireRoles.length === 0 ||
  //requireRoles.some((role) => userRoles.includes(role));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // ถ้าไม่ได้ล็อกอิน ให้ไปหน้า Login
  }

  /* if (!hasRequiredRoles) {
    return <Navigate to="/access-denied" replace />; // ถ้าบทบาทไม่ตรง ให้ไปหน้า Access Denied
  }*/

  return <>{children}</>;
};

export default ProtectRoute;
