import { useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useRef, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';
import UserAdd from '../components/userAdd';
import userServices from '@/services/userServices';
import { orderMutations } from '@/hooks/orderMutations';
import { Link, useNavigate } from 'react-router-dom';
import orderSevices from '@/services/orderSevices';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

const ProductAddPage = () => {
    const [openAddUser, setOpenAddUser] = useState(true);
    const [phone, setPhone] = useState<any>("");
    const [value, setValue] = useState<any>("");
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const [userId, setUserId] = useState<any>(null);
    const savedUserId = localStorage.getItem("userId");

    const { orderAdd } = orderMutations()
    const navigate = useNavigate()

    const { register, control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            userId: userId,
            deliveryId: "",
            products: [{ categoryId: "", colorId: "", price: 0, bundle: 1, quantity: 1 }],
            note: "",
            otherFee: 0,
            pay: 0
        }
    })

    useEffect(() => {
        if (userId)
            localStorage.setItem("userId", userId);
    }, [userId])

    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: async () => { return await instance.get(`/user`) },
    })

    const filtered = useMemo(() => {
        return user?.data?.filter((item: any) =>
            item?.phone?.toLowerCase().includes(value.toLowerCase())
        );
    }, [user, value]);

    useEffect(() => { if (savedUserId) setUserId(savedUserId); }, [savedUserId]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                setShow(false);
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const { data: userById } = useQuery({
        queryKey: ["user_id", userId],
        queryFn: async () => {
            return await userServices.getUserById(userId)
        },
        enabled: !!userId,
    })

    const deleteUser = () => {
        localStorage.removeItem("userId");
        setUserId(null)
        setValue("")
    }

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

    const { data: lastDeliveryId } = useQuery({
        queryKey: ["lastDeliveryId", userId],
        queryFn: async () => {
            return await orderSevices.getDeliveryId(userId)
        },
        enabled: !!userId
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

    useEffect(() => {
        if (userId) {
            reset((prev) => ({
                ...prev,
                userId: userId,
                deliveryId: lastDeliveryId?.deliveryId
            }));
        }
    }, [lastDeliveryId, userId, reset]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    const onSubmit = (data: any) => {
        orderAdd.mutate(data);
        reset();
        navigate(`/`);
        localStorage.removeItem("userId");
    };

    return (
        <div className="p-[10px] w-[100%] lg:w-[700px] m-auto">
            {!userId &&
                <div className="">

                    <form className="">
                        <div className="">
                            <h2 className="font-[600] mb-[10px] text-[20px]">Tìm khách hàng</h2>
                            <div className="">
                                <div className="relative">
                                    <div ref={ref} className="mb-[5px]">
                                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-[2px]">Số điện thoại</label>
                                        <input
                                            type="text"
                                            value={value}
                                            placeholder="Tìm..."
                                            onChange={(e) => {
                                                setValue(e.target.value);
                                                setShow(true);
                                            }}
                                            className="w-full border border-gray-300 p-[8px_10px] rounded-md"
                                        />

                                        {show && (
                                            <div className="absolute w-full border mt-1 bg-white rounded shadow max-h-40 overflow-auto z-50">

                                                {/* list match */}
                                                {filtered?.slice().reverse().map((item: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => {
                                                            setUserId(item._id)
                                                            setValue(item.phone);
                                                            setShow(false);
                                                        }}
                                                    >
                                                        {item.phone + " (" + item.name + ")"}
                                                    </div>
                                                ))}

                                                {/* nút tạo mới */}
                                                {value && filtered.length === 0 && (
                                                    <div
                                                        className="p-2 text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                                                        onClick={() => {
                                                            setOpenAddUser(prev => !prev);
                                                            setPhone(value)
                                                            setValue("");
                                                        }}
                                                    >
                                                        ➕ Tạo "{value}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Link to={`/`} className="bg-slate-500 p-[5px_15px] rounded-[3px] text-white font-[600] cursor-pointer float-end">Trở lại</Link>
                            </div>
                        </div>
                    </form>

                    <div className={`${openAddUser ? "hidden" : "fixed lg:flex"} mx-auto w-screen h-screen inset-0 lg:items-center lg:justify-center lg:backdrop-blur-[4px]`}>
                        <div className="absolute w-screen h-screen bg-slate-100 p-[15px] rounded-[10px] lg:translate-x-[-50%] lg:left-[50%] lg:w-[700px] lg:h-min">
                            <UserAdd phone={phone} setPhone={setPhone} setOpenAddUser={setOpenAddUser} />
                        </div>
                    </div>
                </div>
            }

            {userId &&
                <div className="">
                    <form onSubmit={handleSubmit(onSubmit)} className="">
                        <div className="">
                            <div className="mb-[10px]">
                                <div className="flex justify-between">
                                    <div className="font-[700] flex">
                                        <span className="mr-[10px]">{userById?.name}</span>
                                        <span className="pl-[10px] flex border-l-[1px] border-slate-300">{userById?.phone}</span>
                                    </div>
                                </div>
                                <div>
                                    <span>Địa chỉ: </span>
                                    <span>{userById?.address}</span>
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
                            <div onClick={() => { deleteUser(), reset() }} className='bg-slate-500 p-[5px_15px] rounded-[3px] text-white font-[600] cursor-pointer'>Trở lại</div>
                            <button className='bg-blue-500 p-[5px_15px] rounded-[3px] text-white font-[600] ml-[10px] cursor-pointer'>Tạo đơn hàng</button>
                        </div>
                    </form>
                </div>
            }
        </div>

    );
}

export default ProductAddPage