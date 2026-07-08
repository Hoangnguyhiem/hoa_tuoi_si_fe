import instance from '@/configs/axios';
import { orderMutations } from '@/hooks/orderMutations';
import orderSevices from '@/services/orderSevices';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

const ProductEditPage = () => {
    const { id } = useParams()
    const { upadateOrderById } = orderMutations()
    const navigate = useNavigate()

    const { register, control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            userId: id,
            deliveryId: "",
            products: [{ categoryId: "", colorId: "", price: 0, bundle: 1, quantity: 1 }],
            note: "",
            otherFee: 0,
            pay: 0
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    const { data: orderById } = useQuery({
        queryKey: ["order_id", id],
        queryFn: async () => {
            const req = await orderSevices.getOrderById(id)
            reset({
                ...req,
                deliveryId: req.deliveryId._id,
                products: req.products.map((item: any) => ({
                    ...item,
                    categoryId:
                        typeof item.categoryId === "object"
                            ? item.categoryId._id
                            : item.categoryId,

                    colorId:
                        typeof item.colorId === "object"
                            ? item.colorId._id
                            : item.colorId
                }))
            });
            return req
        },
        enabled: !!id,
    })

    const { data: color } = useQuery({
        queryKey: ["color"],
        queryFn: async () => {
            return await instance.get(`/color`)
        }
    })

    const { data: delivery } = useQuery({
        queryKey: ["delivery"],
        queryFn: async () => {
            return await instance.get(`/delivery`)
        },
    })

    const { data: category } = useQuery({
        queryKey: ["category"],
        queryFn: async () => {
            return await instance.get(`/category`)
        },
    })

    const products = useWatch({
        control,
        name: "products"
    });
    const pay = useWatch({
        control,
        name: "pay"
    });
    const otherFee = useWatch({
        control,
        name: "otherFee"
    });

    const total = useMemo(() => {
        return products?.reduce((sum, item) => {
            return sum + (Number(item.price) * Number(item.bundle) * Number(item.quantity))
        }, 0)
    }, [products])

    const mountTotal = useMemo(() => {
        return total + Number(otherFee) - Number(pay)
    }, [total, otherFee, pay])

    const onSubmit = (data: any) => {
        upadateOrderById.mutate(data)
        navigate("/order", {
            state: {
                updatedId: data._id
            }
        });
    }
    return (
        <div className="p-[10px] w-[100%] lg:w-[700px] m-auto">

            <Link to={`/order`} className="">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </Link>

            <div className="">
                <form onSubmit={handleSubmit(onSubmit)} className="">
                    <div className="">
                        <div className="mb-[10px]">
                            <div className="flex justify-between">
                                <div className="font-[700] flex">
                                    <span className="mr-[10px]">{orderById?.userId.name}</span>
                                    <span className="pl-[10px] flex border-l-[1px] border-slate-300">{orderById?.userId.phone}</span>
                                </div>
                            </div>
                            <div>
                                <span>Địa chỉ: </span>
                                <span>{orderById?.userId.address}</span>
                            </div>
                        </div>

                        <div className="mb-[5px]">
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Số nhà xe</label>
                            <select {...register("deliveryId")} className='w-[100%] border-[1px] p-[9px_10px] rounded-[5px]'>
                                <option value="">Chọn nhà xe</option>
                                {delivery?.data.map((item: any) => (
                                    <option key={item._id} value={item._id}>{item.name + " (" + item.phone + ")" + " - " + item.type + " - (" + item.address + " - " + item.province + ")"}</option>
                                ))}
                            </select>
                        </div>
                        <div className="">
                            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-[2px]">Ghi chú</label>
                            <textarea {...register("note")} className="w-full p-[10px] h-[45px] border-[1px] rounded-[5px]" placeholder="Nhập ghi chú..."></textarea>
                        </div>
                    </div>

                    <div className="mt-[15px]">
                        <h2 className='font-[600] text-[18px]'>Đơn hàng</h2>
                        <div className="p-[10px] bg-slate-200 rounded-[5px]">
                            <div className="grid grid-cols-1 gap-2 ">
                                <div className="p-[10px] bg-slate-100 rounded-[3px]">
                                    <table className="w-full">
                                        <tr className="text-left *:px-[10px]">
                                            <th>Đơn</th>
                                            <th>Màu</th>
                                            <th>Giá</th>
                                            <th>Số bó</th>
                                            <th>Số lượng</th>
                                            <th>Tổng</th>
                                            <th className="text-center">Thao tác</th>
                                        </tr>
                                        {fields.map((item: any, index: number) => {
                                            const price = watch(`products.${index}.price`)
                                            const bundle = watch(`products.${index}.bundle`)
                                            const quantity = watch(`products.${index}.quantity`)
                                            const subTotal = Number(price) * Number(bundle) * Number(quantity)
                                            return (
                                                <tr key={item._id} className="*:px-[10px]">
                                                    <td>
                                                        <select {...register(`products.${index}.categoryId`, { required: true })} className='py-[9px] rounded-[5px] border-b-gray-400 border-[1px]'>
                                                            <option value="">Chọn</option>
                                                            {
                                                                category?.data.map((item: any) => (
                                                                    <option key={item._id} value={item._id}>{item.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select {...register(`products.${index}.colorId`, { required: true })} className='py-[9px] rounded-[5px] border-b-gray-400 border-[1px]'>
                                                            <option selected value="">Chọn</option>
                                                            {
                                                                color?.data.map((item: any) => (
                                                                    <option key={item._id} value={item._id}>{item?.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            {...register(`products.${index}.price`, { required: true })}
                                                            min={1}
                                                            type="number"
                                                            placeholder="Nhập giá"
                                                            className="max-w-[100px] border border-gray-300 p-[8px_10px] rounded-md"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            {...register(`products.${index}.bundle`, { required: true })}
                                                            type="number"
                                                            placeholder="Nhập số bó"
                                                            className=" max-w-[70px] border border-gray-300 p-[8px_10px] rounded-md"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            {...register(`products.${index}.quantity`, { required: true })}
                                                            type="number"
                                                            placeholder="Nhập số lượng"
                                                            className=" max-w-[70px] border border-gray-300 p-[8px_10px] rounded-md"
                                                        />
                                                    </td>
                                                    <td>{Number(subTotal).toLocaleString("vi-VN")}</td>
                                                    <td>
                                                        <div onClick={() => remove(index)} className={` ${index === 0 ? "hidden" : ""} flex justify-center cursor-pointer hover:bg-red-500 hover:text-white font-[600] rounded-[5px] py-[2px]`}>
                                                            <span>Xóa</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </table>
                                </div>
                                <div className="flex justify-between mt-[10px]">
                                    <div className="font-[600] flex justify-between">
                                        <div className="mr-[20px] *:my-[2px]">
                                            <p>Tổng đơn: </p>
                                            <p>Phí khác: </p>
                                            <p>Đã thanh toán: </p>
                                            <p>Cần thanh toán: </p>
                                        </div>
                                        <div className="font-[700] *:my-[2px] *:text-right">
                                            <p>{Number(total).toLocaleString("vi-VN")}</p>
                                            <p>
                                                <input {...register("otherFee")} min={0} className='w-[100px] text-right' type="number" />
                                            </p>
                                            <p>
                                                <input {...register("pay", { required: true })} min={0} className='w-[100px] text-right' type="number" />
                                            </p>
                                            <p>{Number(mountTotal).toLocaleString("vi-VN")}</p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div onClick={() => append({ categoryId: "", colorId: "", price: 0, bundle: 1, quantity: 1 })} className="border-[1px] border-black rounded-[5px]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="float-end mt-[10px] flex">
                        <button className='bg-blue-500 p-[5px_15px] rounded-[3px] text-white font-[600] ml-[10px] cursor-pointer'>Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductEditPage;
