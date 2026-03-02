import { orderMutations } from '@/hooks/orderMutations';
import React from 'react';

const CheckProducts = ({ openModal, setOpenModal, productItem }: any) => {

  const { updateStatusProduct } = orderMutations()

  const handleConfirm = async () => {
    if(productItem)
    updateStatusProduct.mutate({ productId: productItem._id, status: !productItem.status })
    setOpenModal(false)
  }
  const handleCancel = () => {
    setOpenModal(false)
  }
  return (
    <div className={`${!openModal ? "hidden" : "fixed"} flex inset-0 z-10`}>
      <div className="absolute w-[100%] h-[100%] backdrop-blur-[4px] bg-opacity-80"></div>
      <div className={`${productItem?.status ? "border-red-500" : "border-green-500"} border-[2px] relative min-w-[100px] h-auto bg-slate-100 m-auto rounded-[5px] p-[20px_30px]`}>
        <p className='mb-[40px] font-[600] text-[18px]'>
          {productItem?.status ? "Xác nhận kiện hàng chưa giao?" :
          "Xác nhận kiện hàng giao thành công?"}
        </p>
        <div className="flex justify-end">
          <div onClick={handleCancel} className="bg-slate-500 p-[5px_15px] rounded-[3px] text-white font-[600] cursor-pointer">Hủy</div>
          <div onClick={handleConfirm} className={`${productItem?.status ? "bg-red-500" : "bg-green-500"} text-white p-[5px_15px] rounded-[3px] font-[600] ml-[10px] cursor-pointer`}>Xác nhận</div>
        </div>
      </div>
    </div>
  );
}

export default CheckProducts;
