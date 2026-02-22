import React, { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";
import defaultImg from "../../assets/defaultImg.jpg";

const ProductCard = ({ data, handleSelected }) => {
  const { selected, user } = useContext(VariableContext);

  const selectedStyle = {
    boxShadow:
      "rgba(0, 187, 255, 50%) 0 0 0 .25em inset, rgba(0, 187, 255, 5%) 0 0 0 999em inset",
  };
  const outOfStockStyle = {
    opacity: 0.5, // Visually indicate out-of-stock
    pointerEvents: "none", // Disable interaction
  };

  return (
    <li>
      <div
        className="relative p-[1em] bg-[#fff] dark:bg-dark-bg-card rounded-[1em] md:flex flex-col lg:w-[17rem] border border-[#023E8A] dark:border-dark-border transition-colors duration-300 hover:dark:bg-dark-bg-hover cursor-pointer"
        style={
          !data.inStock
            ? { pointerEvents: "none" }
            : selected?._id === data._id
              ? selectedStyle
              : {}
        }
        onClick={() => data.inStock && handleSelected(data)}
      >
        {/* Out of Stock Badge */}
        {!data.inStock && (
          <div className="absolute top-1 right-1 z-10 bg-red-500 text-white text-[0.6rem] md:text-[0.7rem] font-bold px-2 py-0.5 rounded-full shadow-md">
            Out of Stock
          </div>
        )}
        <div className="flex gap-2 items-center">
          <img
            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-md object-contain"
            src={data.imgpath}
            // src={`/${data.imgpath}`}
            alt=" Item Image"
            onError={(e) => {
              e.target.src = defaultImg;
            }}
          />

          {data.suggestedTask ? (
            <div className="text-blue-700 dark:text-dark-accent-primary bg-[#E8F7FF] dark:bg-dark-bg-primary px-3 py-1 rounded-lg text-xs font-semibold border border-[#BDE0FF] dark:border-dark-accent-primary shadow-sm">
              {data.suggestedTask}
            </div>
          ) : (" ")}

        </div>
        <div className="lg:flex flex-row gap-5">
          <div className="text-[#424242] dark:text-dark-text-primary font-[500]">{data.name}</div>
          <div className="flex gap-2 items-center">

            <div className="text-[0.9rem] line-through text-[#9ACD32] dark:text-gray-500">
              ₹{data.originalprice}
            </div>

            <div className="text-[#E11D48] dark:text-dark-accent-primary text-[1rem] font-[500]">
              {user?.role === "reseller"
                ? `₹${data.resellprice}`
                : `₹${data.discountedprice}`}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductCard;
