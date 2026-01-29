import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProduct } from "../../hooks/useGetProduct";
import Input from "./Input";
import { VariableContext } from "../../context/VariableContext";
import Spinner from "../../components/Spinner";
import { useCheckId } from "../../hooks/useCheckId";
import { FaGamepad } from 'react-icons/fa';

const UserIDForm = () => {
  const { setInput1, setInput2, input1, input2, setVerified , product, selected, show, setShow} = useContext(VariableContext);
  const { checkId, isLoading1, message } = useCheckId();
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  
  useEffect(() => {
    setVerified(false);
  }, [input1, input2]);

  const handleSubmit = async () => {

    // Toggle `setShow` based on the value of `selected`
    if (selected === null) {
      setShow(true);
    } else {
      setShow(false);
    }

    await checkId(input1, input2, product, selected);
  };
  

  return (
    <>
        <div className="py-[1.5em] px-[2em] bg-[#FFFFFF] flex flex-col items-center rounded-[1em] w-full ">
          <div className="flex items-center text-[#E11D48] font-[500]">
            <span className="flex items-center gap-2"> 
              <FaGamepad />
              Order Information
              </span>
            {/* Question mark icon with background color */}
            <span
              className="ml-2 cursor-pointer text-xl px-2 bg-red-200 rounded-full"
              onClick={() => setIsGuideVisible(!isGuideVisible)}
            >
              ?
            </span>
          </div>
          {/* Guide image modal */}
          {isGuideVisible && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-4 rounded-lg relative">
                <img src="/form.png" alt="Guide" className="w-64 h-auto" />
                <button
                  onClick={() => setIsGuideVisible(false)}
                  className="absolute top-0 right-0 px-4 py-2 bg-red-500 text-white rounded-full"
                >
                  X
                </button>
              </div>
            </div>
          )}
          <form className="flex flex-col gap-3 mt-5 w-full" onSubmit={(e) => e.preventDefault()}>
            {/* Inputs */}
            <div className="relative">
              <input
                type="text"
                id="input-group-1"
                className="bg-[#FFFFFF] border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-[#03045E] focus:red-[#03045E] block w-full ps-[7rem] p-2.5 dark:bg-[#FFFFFF] dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-[#03045E] dark:focus:border-[#03045E]"
                placeholder={`Please Enter ${product?.inputs[0].label}`}
                onChange={(e) => {
                  setInput1(e.target.value)
                  // console.log(input1);
                  ;
                }}
              />
            </div>

            <div className="relative">
              {/* <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <span className="font-[500] text-[#424242]">{product?.inputs[1].label}</span>
              </div> */}
              {(product?.type === "GENSHIN") ?(
                <select
                  id="input-group-2"
                  className="bg-[#FFFFFF] border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-[#03045E] focus:red-[#03045E] block w-full ps-[7rem] p-2.5 dark:bg-[#FFFFFF] dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-[#03045E] dark:focus:border-[#03045E]"
                  onChange={(e) => {
                    setInput2(e.target.value)
                    // console.log(input2);
                    
                  }}
                >
                  <option value="">Select Server</option>
                  <option value="America">America</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="TW_HK_Mo">TW_HK_Mo</option>
                </select>
              ) : (
                <input
                  type="text"
                  id="input-group-2"
                  className="bg-[#FFFFFF] border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-[#03045E] focus:red-[#03045E] block w-full ps-[7rem] p-2.5 dark:bg-[#FFFFFF] dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-[#03045E] dark:focus:border-[#03045E]"
                  placeholder={`Please Enter ${product?.inputs[1].label}`}
                  onChange={(e) => {
                    setInput2(e.target.value);
                    // console.log(input2);
                    
                  }}
                />
                )}
            </div>

            {message && <p className="text-[red]">{message}</p>}

            {!isLoading1 ? (
              (product?.isApi && product?.type === "MLBB") && (
                <button
                  onClick={handleSubmit}
                  className="bg-[#E11D48] hover:bg-[#E11D84] rounded-full p-2.5 text-white font-[600] text-[1.1rem] w-full"
                >
                  Check
                </button>
              )
            ) : (
              <div className="w-full justify-center items-center flex">
                <Spinner />
              </div>
            )}
          </form>
        </div>
    </>
  );
};

export default UserIDForm;
