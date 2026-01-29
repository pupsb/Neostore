import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import { useGetProduct } from '../../hooks/useGetProduct';
import defaultImg from '../../assets/defaultImg.jpg';
import { VariableContext } from '../../context/VariableContext';

const Banner = () => {

  const { product } = useContext(VariableContext);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  return (
    <>
      <div className='w-full mb-10'>
        <div className='flex md:gap-10 gap-5'>
          <div className="max-w-[90px] min-w-[90px] h-[90px] lg:max-w-[130px] lg:h-[130px] lg:min-w-[130px] rounded-[1em] overflow-hidden" style={{ boxShadow: "0 3px 14px 0 rgba(4, 0, 0, .51)" }}>
            <img className="object-cover w-full h-full rounded-[1em]"
              src={product?.imgpath}
              // src={`/${product?.imgpath}`} 
              alt="Banner Image"
              onError={(e) => {
                e.target.src = defaultImg;
              }} />
          </div>
          <div className='flex flex-col'>
            <div className='text-[#424242] font-[700] md:text-[2rem]  text-[1.5rem]'>
              {product && (product?.name)}
            </div>
            <div className='text-[#E11D48] font-[700] lg:text-[1.3rem] text-[1.1rem] '>

              {(product?.isApi) ? "Instant Delivery" : "Delivery within 30 mins"}
            </div>
            <div className='text-[#424242] font-[700] text-[1rem] md:text-[1.1rem] lg:mt-5'>
              Note : {product?.importantnote}

            </div>
            {/* How It Works Button */}
            <span
              className="mt-2 flex justify-center cursor-pointer text-xs text-[#03045E] font-bold bg-[#cfe2ff] rounded-[10px] p-1"
              onClick={() => setIsGuideVisible(!isGuideVisible)}
            >
              How To Purchase ?
            </span>
          </div>
        </div>
        {/* Guide Modal for "How It Works" */}
        {isGuideVisible && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg relative">
              <img src="/guide.png" alt="How It Works" className="w-64 h-auto" />
              <button
                onClick={() => setIsGuideVisible(false)}
                className="absolute top-0 right-0 px-4 py-2 bg-red-500 text-white rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Banner