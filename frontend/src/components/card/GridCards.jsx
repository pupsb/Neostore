import React, { useContext } from 'react'
import defaultImg from '../../assets/defaultImg.jpg';
import { VariableContext } from '../../context/VariableContext';

const GridCards = ({ data }) => {
  const { imageUrl } = useContext(VariableContext);
  return (
    <div className="w-full">
      <a
        href={`/product/${data._id}`}
        className={`relative rounded-[1em] flex items-center text-center flex-col mt-[30px] px-[8px] pt-[33px] pb-[8px] bg-[#fff] dark:bg-[#1A1F2B] h-[89%] transition-colors duration-300 hover:dark:bg-[#2A3040] `}
        style={{ boxShadow: "0 3px 14px 0 rgba(4, 0, 0, .51)" }}
      >
        {/* Out of Stock Badge */}
        {!data.instock && (
          <div className="absolute top-[-8px] right-[-8px] z-10 bg-red-500 text-white text-[0.55rem] md:text-[0.65rem] font-bold px-2 py-0.5 rounded-full shadow-md">
            Out of Stock
          </div>
        )}
        <div className="w-[56px] h-[56px] lg:w-[80px] lg:h-[80px]  absolute top-[-30px] rounded-[1em]" style={{ boxShadow: "0 3px 14px 0 rgba(4, 0, 0, .51)" }}>
          <div className='w-full h-full overflow-hidden rounded-[1em]'>
            <img src={data.imgpath} onError={(e) => {
              e.target.src = defaultImg;
            }} className="object-cover w-full h-full " alt="" />
          </div>
        </div>
        <div className="grow-1  w-full md:mt-4  flex flex-col justify-around h-full">
          <div className="overflow-hidden text-[#E11D48] dark:text-[#B4FF39] md:text-[1.3rem] text-[0.8rem] md:mt-3 line-clamp-2">{data.name}</div>
          <div className="h-[3em] md:text-[1.5rem] text-black dark:text-[#FFFFFF] font-[800] line-clamp-2">Discount</div>

          <div className="w-full  md:mt-auto  ">
            {!data.instock ? (
              <div className="text-white bg-gray-400 dark:bg-gray-600 p-[3px] rounded-full mb-3 mx-3 border border-gray-400 dark:border-gray-600 cursor-not-allowed">Out of Stock</div>
            ) : (
              <div className="text-[#fff] bg-[#E11D48] dark:bg-[#B4FF39] dark:text-[#0A0E13] p-[3px] rounded-full mb-3 mx-3 hover:bg-[#E11D84] dark:hover:bg-[#7FBF3D] hover:text-white transition-colors border border-[#E11D48] dark:border-[#B4FF39]">TOP UP</div>
            )}
          </div>
        </div>
      </a>
    </div>
  )
}

export default GridCards