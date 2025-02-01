import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import verifyToken from '../utils/verifyToken'; // import ฟังก์ชันที่ใช้ตรวจสอบ token
import { useDispatch } from 'react-redux';


interface ProtectRouteProps {
  children: ReactNode; // กำหนดว่าผ่าน children ได้ทุกประเภทที่เป็น ReactNode
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true); 
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // ตรวจสอบ token ผ่าน verifyToken
        const isValidToken = await verifyToken(dispatch);
        if (!isValidToken) {
          setIsLoading(false); // เสร็จสิ้นการตรวจสอบ
        } else {
          setIsLoading(false); // เสร็จสิ้นการตรวจสอบ
        }
      } else {
        setIsLoading(false); // ไม่มี token
      }
    };

    checkToken();
  }, [verifyToken]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }
if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  return <>{children}</>; // ถ้าผ่านการตรวจสอบ token แล้วให้แสดง children
};

export default ProtectRoute;
