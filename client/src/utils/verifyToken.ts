// utils/verifyToken.ts
import axios from 'axios';
import config from '../config';
import { setAuthenticated } from '../features/auth/authSlice';
import { AppDispatch } from '../app/store'; 

// รับ dispatch เป็น argument จากภายนอกแทนการใช้ useDispatch
const verifyToken = async (dispatch: AppDispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(setAuthenticated(false)); 
    return false;
  }

  try {
    const response = await axios.get(
      `${config.API_URL}${config.API_VERIFY_TOKEN}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.valid) {
      dispatch(setAuthenticated(true));
      return true;
    } else {
      dispatch(setAuthenticated(false)); 
      localStorage.removeItem('token'); 
      return false;
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    dispatch(setAuthenticated(false)); 
    return false;
  }
};

export default verifyToken;
