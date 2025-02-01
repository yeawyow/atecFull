import React, { useState, useEffect } from "react";
import config from '../../config';
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from "../../features/auth/authSlice";

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [user_national_id, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ user_national_id, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      
      navigate('/');
    }
  }, [isAuthenticated, navigate]); 

  return (
    <>
      <div className="flex justify-center py-12">
        <div className="w-full max-w-md bg-white shadow-default rounded-sm border border-stroke dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-wrap items-center">
            <div className="w-full border-stroke dark:border-strokedark xl:w-1/1 xl:border-l-2">
              <div className="w-full p-4 ">
                <span className="mb-1.5 block font-medium text-center">
                  {config.APP_TITLE}
                </span>

                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      ชื่อผู้ใช้งาน
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="กรอกชื่อผู้ใช้งาน"
                        value={user_national_id}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <span className="absolute right-4 top-4">
                        <User />
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      รหัสผ่าน
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="กรอกรหัสผ่าน"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <span className="absolute right-4 top-4">
                        <Lock />
                      </span>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                  <div className="mb-5">
                    <button
                      type="submit"
                      className="w-full rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                      disabled={loading}
                    >
                      {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
