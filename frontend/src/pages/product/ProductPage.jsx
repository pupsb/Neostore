import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import UserIDForm from './UserIDForm'
import Products from './Products'
import Payments from './Payments'
import { VariableContext } from '../../context/VariableContext'
import { useGetProduct } from '../../hooks/useGetProduct'
import { useGetItems } from '../../hooks/useGetItems'
import Spinner from '../../components/Spinner'
import Banner from './Banner'

const ProductPage = () => {

  const { _id } = useParams();
  const { productPageLoading} = useContext(VariableContext);
  const { getProduct} = useGetProduct();
  const { isLoading, getItems} = useGetItems();

  useEffect(() => {
    async function fetch() {
      // console.log("fetching product _id: ", _id);
      await getProduct(_id);
    }
    fetch();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      // console.log("fetching items _id: ", _id);
      await getItems(_id);
    }
    fetchItems();
  }, []);

  return (
    <div className='mt-[2rem] md:mx-9 mx-5 '>
        <>
          <Banner />
          {/* for mobile view */}
          {/* <div className=' block md:hidden'><UserIDForm /></div> */}
          <div className='flex md:flex-row flex-col gap-3'><Products />

          <div className='flex flex-col  md:w-[50%] gap-5'>
            {/* for pc view */}
            <div className='block'><UserIDForm /></div>
            <Payments />
          </div>
          </div>
        </>
        {/* : <div className='flex w-full justify-center items-center'><Spinner /></div> */}
    </div>



  )
}

export default ProductPage