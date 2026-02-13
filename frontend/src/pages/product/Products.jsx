import React, { useContext, useState } from 'react';
import ProductCard from './ProductCard';
import { VariableContext } from '../../context/VariableContext';
import Spinner from '../../components/Spinner';

const Products = () => {
  const { setSelected, items } = useContext(VariableContext);
  const [filterType, setFilterType] = useState('all'); // Default to 'all'

  const handleSelected = (data) => {
    setSelected(data);
    window.scrollTo({
      top: document.body.scrollHeight - 700, // Scroll 500 pixels from the bottom
      behavior: 'smooth',
    });
  };

  // Determine if the "Weekly" toggle should be shown
  const showWeeklyToggle = items?.some((item) =>
    item.hasWeeklyPass === true
  );

  // Filter items based on the selected filter type
  const filteredItems =
    filterType === 'all'
      ? items
      : items.filter((item) => item.type === filterType);

  return items ? (
    <div className="w-full">
      {/* Filter Toggle Buttons */}
      <div className="flex justify-center gap-2 md:gap-4 mb-4 mt-4 flex-wrap">
        {['all', 'small', 'medium', 'large', ...(showWeeklyToggle ? ['weekly'] : [])].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg border transition-colors ${filterType === type
              ? 'bg-[#E11D48] dark:bg-dark-accent-primary text-white dark:text-dark-bg-primary border-[#E11D48] dark:border-dark-accent-primary'
              : 'bg-gray-200 dark:bg-dark-bg-card text-black dark:text-dark-text-primary border-gray-300 dark:border-dark-border hover:bg-gray-300 dark:hover:bg-dark-bg-hover'
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredItems.length > 0 ? (
        <ul className="grid xl:grid-cols-3 grid-cols-2 gap-5 w-full">
          {filteredItems.map((item, index) => (
            <ProductCard
              key={item.id || index}
              data={item}
              handleSelected={(data) => handleSelected(data)}
            />
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 dark:text-dark-text-secondary mt-10">No items found</div>
      )}
    </div>
  ) : (
    <Spinner />
  );
};

export default Products;
