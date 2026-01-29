import React from 'react'
import Transactions from './transactions/Transactions'
import Balance from '../dashboard/Balance'

const Wallet = () => {
  return (
    <div className="mt-[1rem] lg:mx-[6rem] mx-[1rem] flex flex-col gap-4 ">
      <div className='bg-[#252F3D] flex flex-col items-center p-3 rounded-lg' >
        <div className='font-[800] text-[2rem] mb-5  text-white'>My Wallet</div>
        <Balance/>
      </div>
      <Transactions/>
    </div>
  )
}

export default Wallet