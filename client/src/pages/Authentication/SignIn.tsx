import React from 'react';
import config from '../../config';
import { User, Lock } from 'lucide-react';

const SignIn: React.FC = () => {
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

                <form>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      ชื่อผู้ใช้งาน
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="กรอกชื่อผู้ใช้งาน"
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
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <span className="absolute right-4 top-4">
                        <Lock />
                      </span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <input
                      type="submit"
                      value="เข้าสู่ระบบ"
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    />
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
