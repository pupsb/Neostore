import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { VariableContext } from '../../context/VariableContext';

export const ForgetPassword = () => {

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const { host } = useContext(VariableContext);

  const handleSubmit = async () => {
    const response = await fetch(`${host}/password/forgetpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email
      })
    })

    const data = await response.json();
    if (data && data.msg) {
      setError(data.msg);
      if (data.msg === "User does not exist.")
        return;
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-white-900 -mb-10 mt-20 md:mt-5">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-black">
          Woex Supply
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#0077B6] dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forget Password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your website registered email.</label>
                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name123@gmail.com" required onChange={(e) => setEmail(e.target.value)} />
              </div>
              {error ? <p className='text-[#E72929] mt-[-13px] text-[0.9rem] bg-white p-2 rounded-lg '>{error}</p> : <></>}


              <button onClick={() => handleSubmit()} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <NavLink to="/register" > <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</span></NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgetPassword