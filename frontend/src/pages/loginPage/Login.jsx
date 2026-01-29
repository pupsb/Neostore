import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLogin } from '../../hooks/auth/useLogin';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginErr } = useLogin();

  const handleSubmit = async () => {
    await login(email, password);
  };

  return (
    <section className="bg-gray-50 dark:bg-[#F5F5F5] -mb-10">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {/* <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-[#03045E]">
          Woex Supply
        </a> */}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#0077B6] dark:border-[#03045E]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-[gray-900] md:text-2xl dark:text-[#03045E]">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-[#03045E]">
                  Your Website Registered Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute top-2/4 left-3 transform -translate-y-2/4 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg pl-10 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-black-900 dark:text-black dark:focus:ring-[#03045E] dark:focus:border-blue-500"
                    placeholder="name123@gmail.com"
                    required=""
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-[#03045E]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-white-700 dark:border-gray-600 dark:placeholder-black-900 dark:text-black dark:focus:ring-[#03045E] dark:focus:border-blue-500"
                    required=""
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute top-2/4 right-3 transform -translate-y-2/4 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {loginErr ? (
                <p className="text-[red] mt-[-13px] text-[0.9rem] bg-white rounded-lg p-5">{loginErr}</p>
              ) : (
                <></>
              )}
              <div className="flex items-center justify-between">
                <a href="/forgetpassword" className="text-sm font-medium text-primary-600 hover:underline dark:text-[#03045E]">
                  Forgot password?
                </a>
              </div>

              <button
                onClick={() => handleSubmit()}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#03045E] dark:hover:bg-[#023E8A] dark:focus:ring-[#023E8A]"
              >
                Sign in
              </button>

              <p className="mt-6 text-sm font-light text-gray-500 dark:text-white text-center pb-5"> OR </p>

              <a href="/otplogin" className=''>
                <div className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"> Login Using Phone</div>
              </a>

              <p className="text-sm font-light text-gray-500 dark:text-white flex flex-col gap-3 md:block">
                Don’t have an account yet ?{" "} &nbsp;
                <NavLink to="/register">
                  {" "}
                  <span className="font-medium text-primary-600 hover:underline dark:text-[red] bg-white p-2 rounded-lg">Create New Account</span>
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
