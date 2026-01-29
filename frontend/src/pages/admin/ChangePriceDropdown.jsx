import React, { useContext, useEffect, useState } from 'react';
import { useGetProducts } from '../../hooks/useGetProducts';
import { useAuth0 } from '@auth0/auth0-react';
import ChangePriceList from './ChangePriceList';
import { VariableContext } from '../../context/VariableContext';

const ChangePrice = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const { getAllProducts, products, isLoading } = useGetProducts();
  console.log(products);
  
  const { token } = useContext(VariableContext);

  useEffect(() => {
    async function fetch() {
      await getAllProducts(token);
      
    }
    fetch();
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      {!isLoading && (
        <div className="mt-1 lg:mx-1 mx-4 flex flex-col gap-6">
<select
  onChange={handleChange}
  className="p-3 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Select Product</option>
  {products && products.length > 0 ? (
    products.map((product) => (
      <option value={product._id} key={product._id}>
        {product.name}
      </option>
    ))
  ) : (
    <option value="">No Products</option>
  )}
</select>

<div className="p-2 md:p-4 bg-gray-900 rounded-lg shadow-lg">
  {selectedOption ? (
    <ChangePriceList _id={selectedOption} />
  ) : (
    <div className="text-white">Please select a product to change the price.</div>
  )}
</div>

        </div>
      )}
    </>
  );
};

export default ChangePrice;
