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
        className="p-[1em] bg-[#fff] rounded-[1em] md:flex flex-col lg:w-[17rem] border border-[#023E8A]"
        style={
          !data.inStock
            ? outOfStockStyle
            : selected?._id === data._id
              ? selectedStyle
              : {}
        }
        onClick={() => data.inStock && handleSelected(data)}
      >
        <div className="flex gap-2 items-center">
          <img
            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-md"
            src={data.imgpath}
            // src={`/${data.imgpath}`}
            alt=" Item Image"
            onError={(e) => {
              e.target.src = defaultImg;
            }}
          />

          {data.suggestedTask ? (
            <div className="text-blue-700 bg-[#E8F7FF] px-3 py-1 rounded-lg text-xs font-semibold border border-[#BDE0FF] shadow-sm">
              {data.suggestedTask}
            </div>
          ) : (" ")}

        </div>
        <div className="lg:flex flex-row gap-5">
          <div className="text-[#424242] font-[500]">{data.name}</div>
          <div className="flex gap-2 items-center">
            
              <div className="text-[0.9rem] line-through text-[#9ACD32]">
                ₹{data.originalprice}
              </div>
           
            <div className="text-[#E11D48] text-[1rem] font-[500]">
              {user?.role === "reseller"
                ? `₹${data.resellprice}`
                : `₹${data.discountedprice}`}
            </div>
          </div>
        </div>
        {/* Display 'Out of Stock' if the product is not in stock */}
        {!data.inStock && (
          <div className="text-red-500 font-bold mt-2 text-center">
            Out of Stock
          </div>
        )}
      </div>
    </li>
  );
};

export default ProductCard;
