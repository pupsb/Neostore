import React, { useContext, useEffect, useState } from 'react';
import { useGetItems } from '../../hooks/useGetItems';
import { useUpdateItem } from "../../hooks/admin/useUpdateItem";
import { useUpdateProduct } from '../../hooks/admin/useUpdateProduct'; // Import the new hook
import { VariableContext } from '../../context/VariableContext';

const ChangePriceList = ({ _id }) => {
  const { getItems, isLoading } = useGetItems();
  const { items } = useContext(VariableContext);
  const [price, setPrice] = useState(null);
  const [resellPrice, setResellPrice] = useState(null);
  const [itemInstock, setItemInstock] = useState(null)
  const { UpdateItem } = useUpdateItem();
  const [instock, setInstock] = useState('true');
  const [importantNote, setImportantNote] = useState('');
  const { token } = useContext(VariableContext);

  const { updateProduct, isLoading: isUpdatingProduct } = useUpdateProduct(); // Use the new hook

  const [message, setMessage] = useState(''); // State for message
  // console.log(_id);


  const handleSubmit = async (itemId) => {
    try {
      // console.log(itemInstock);

      await UpdateItem(itemId, token, { price, resellPrice, itemInstock: itemInstock });
      setMessage('Price updated successfully');
    } catch (error) {
      setMessage('Error updating price');
    }
  };

  const handleProductSubmit = async () => {
    try {
      await updateProduct(_id, instock, importantNote);
      setMessage('Product instock status updated successfully');
    } catch (error) {
      setMessage('Error updating instock status');
    }
  };

  useEffect(() => {
    async function fetch() {
      // console.log("Fetching items for ID:", _id);
      await getItems(_id);
      // console.log("Fetched items:", items);
    }
    fetch();
  }, [_id]);


  return (
    <>
      {!isLoading && (
        <div className="bg-gray-800 p-3 rounded-lg shadow-md flex flex-col gap-6">
          {/* Message Display */}
          {message && (
            <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
              {message}
            </div>
          )}

          <div className="text-white text-lg font-medium">Product Instock Status</div>
          <div className="flex gap-4 mb-4">
            <label className='text-white'>
              <input
                type="radio"
                name="instock"
                value="true"
                checked={instock === 'true'}
                onChange={() => setInstock('true')}
              />
              In Stock
            </label>
            <label className='text-white'>
              <input
                type="radio"
                name="instock"
                value="false"
                checked={instock === 'false'}
                onChange={() => setInstock('false')}
              />
              Out of Stock
            </label>
          </div>
          {/* Important Note */}
          <div className="mb-4">
            <label className="text-white mr-3">Important Note - optional</label>
            <input
              type="text"
              value={importantNote}
              onChange={(e) => setImportantNote(e.target.value)}
              className="p-2 w-full sm:w-1/3 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              placeholder="Enter important note"
            />
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleProductSubmit}
            disabled={isUpdatingProduct} // Disable button while updating
          >
            {isUpdatingProduct ? 'Updating...' : 'Update Product'}
          </button>
          {items && items.map((item) => (
            <div
              className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-gray-700 rounded-md"
              key={item._id}
            >
              <div className="text-white text-lg font-medium">{item.name}</div>
              <p className="text-white">Normal Price</p>
              <input
                type="text"
                placeholder={item.discountedprice}
                className="p-2 w-full sm:w-1/3 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPrice(e.target.value)}
              />
              <p className="text-white">Discounted Price</p>
              <input
                type="text"
                placeholder={item.resellprice}
                className="p-2 w-full sm:w-1/3 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setResellPrice(e.target.value)}
              />

              <div className="flex gap-4 mb-4">
                <label>
                  <input
                    type="radio"
                    name="itemInstock"
                    value="true"
                    checked={itemInstock === 'true'}
                    onChange={() => setItemInstock('true')}
                  />
                  In Stock
                </label>
                <label>
                  <input
                    type="radio"
                    name="itemInstock"
                    value="false"
                    checked={itemInstock === 'false'}
                    onChange={() => setItemInstock('false')}
                  />
                  Out of Stock
                </label>
              </div>

              <button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => handleSubmit(item._id)}
              >
                Update Item
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ChangePriceList;
