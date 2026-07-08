import { deliveryMutations } from '@/hooks/deliveryMutations';
import { useForm } from 'react-hook-form';

const DeliveryAddPage = () => {

    const { deliveryAdd } = deliveryMutations()
    const { register, handleSubmit } = useForm()

    const onSubmit = (data: any) => {
        deliveryAdd.mutate(data)
    }
    return (
        <div className="p-[10px] w-[100%] lg:w-[700px] m-auto">
            <div className="">
                <form onSubmit={handleSubmit(onSubmit)} className="">
                    <div className="">
                        <h2 className="font-[600] mb-[10px] text-[20px]">Thêm Nhà Xe</h2>
                        <div className="">
                            <div className="mb-[5px]">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tên</label>
                                <input
                                    {...register("name", { required: true })}
                                    type="text"
                                    placeholder="Nhập tên nhà xe..."
                                    className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                                />
                            </div>
                            <div className="mb-[5px]">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Số</label>
                                <input
                                    {...register("phone", { required: true })}
                                    type="text"
                                    placeholder="Nhập số nhà xe..."
                                    className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                                />
                            </div>
                            <div className="mb-[5px]">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Tỉnh/Thành</label>
                                <input
                                    {...register("province", { required: true })}
                                    type="text"
                                    placeholder="Nhập tỉnh/thành"
                                    className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                                />
                            </div>
                            <div className="mb-[5px]">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Địa chỉ</label>
                                <input
                                    {...register("address", { required: true })}
                                    type="text"
                                    placeholder="Nhập địa chỉ"
                                    className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                                />
                            </div>
                            <div className="mb-[5px]">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Loại xe</label>
                                <select {...register("type")} className='w-full border border-gray-300 p-[8px_10px] rounded-md'>
                                    <option value="null">Null</option>
                                </select>
                            </div>
                            <div className="mb-[5px]">
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Ghi chú</label>
                                <input
                                    {...register("note")}
                                    type="text"
                                    placeholder="Ghi chú"
                                    className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                                />
                            </div>
                            <button type='submit' className="bg-slate-500 p-[5px_15px] rounded-[3px] text-white font-[600] cursor-pointer float-end">Thêm</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeliveryAddPage;
