import instance from "@/configs/axios";
import { orderMutations } from "@/hooks/orderMutations";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import CheckProducts from "./components/checkProducts";
import FilterSearch from "./components/filterSearch";
import Pagination from "./components/pagination";
const ProductPage = () => {

	const refs = useRef<Record<string, HTMLDivElement | null>>({});

	const [show, setShow] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const [openModal, setOpenModal] = useState(false)
	const [productItem, setProductItem] = useState(null)

	const [keyword, setKeyword] = useState("")

	const { deleteOrderById, updatePinOrder } = orderMutations()

	// download ảnh
	const handleDownload = async (id: string) => {
		const el = refs.current[id];
		if (!el) return;

		const width = el.scrollWidth;
		const height = el.scrollHeight;

		const targetWidth = 800;
		const targetHeight = (height / width) * targetWidth;

		const dataUrl = await toPng(el, {
			cacheBust: true,
			pixelRatio: 2,
			backgroundColor: "#ffffff",
			canvasWidth: targetWidth,
			canvasHeight: targetHeight,
		});
		const link = document.createElement("a");
		link.download = `don-hang-${id}.png`;
		link.href = dataUrl;
		link.click();
	};

	// copy ảnh
	const handleCopy = async (id: string) => {
		const el = refs.current[id];
		if (!el) return;

		const width = el.scrollWidth;
		const height = el.scrollHeight;

		const targetWidth = 800;
		const targetHeight = (height / width) * targetWidth;

		const dataUrl = await toPng(el, {
			cacheBust: true,
			pixelRatio: 2,
			backgroundColor: "#ffffff",
			canvasWidth: targetWidth,
			canvasHeight: targetHeight,
		});

		const blob = await (await fetch(dataUrl)).blob();

		await navigator.clipboard.write([
			new ClipboardItem({ "image/png": blob })
		]);

		alert("Đã copy ảnh!");
	};

	const [currentPage, setCurrentPage] = useState(() => {
		return Number(localStorage.getItem("page")) || 1;
	});

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, [currentPage]);

	useEffect(() => {
		localStorage.setItem("page", String(currentPage));
	}, [currentPage]);

	const [debouncedKeyword, setDebouncedKeyword] =
		useState("");

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedKeyword(keyword);
		}, 700);
		return () => clearTimeout(timeout);
	}, [keyword]);

	const limit = () => {
		if (window.innerWidth > 1200) {
			return 30
		} else if (window.innerWidth > 768) {
			return 20
		} else {
			return 10
		}
	}
	const currentLimit = limit();


	const [status, setStatus] = useState("pending")
	const { data: order } = useQuery({
		queryKey: ["order", status, currentPage, currentLimit, debouncedKeyword],
		queryFn: async () => {
			return await instance.get(`order?status=${status}&search=${debouncedKeyword}&page=${currentPage}&limit=${currentLimit}`)
		},
		staleTime: 1000 * 60
	})

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// 👉 nếu đang ở top thì luôn show
			if (currentScrollY <= 0) {
				setShow(true);
				return;
			}

			if (currentScrollY > lastScrollY) {
				setShow(false);
			} else {
				setShow(true);
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	const handlecheckItem = (data: any) => {
		setOpenModal(!openModal)
		setProductItem(data)
	}

	const location = useLocation();

	const updatedId = location.state?.updatedId;

	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [closingId, setClosingId] = useState<string | null>(null);

	const handleClose = (id: string) => {
		setClosingId(id);

		setTimeout(() => {
			setOpenMenuId(null);
			setClosingId(null);
		}, 300);
	};

	const handleUpdatePin = (pin: boolean, _id: any) => {
		updatePinOrder.mutate({ pin, _id })
	}

	const handleDeleteOrder = (id: number) => {
		const confirmDelete = window.confirm(
			"Bạn có chắc muốn xóa đơn hàng này không?"
		);

		if (!confirmDelete) return;

		deleteOrderById.mutate(id);
	};

	useEffect(() => {
		if (
			updatedId &&
			refs.current[updatedId]
		) {
			refs.current[updatedId]?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
		}
	}, [order]);

	return (
		<div className="bg-slate-300 p-[10px] pt-0 h-full">

			<div className={`sticky top-0 bg-slate-300 mx-[-10px] p-[10px] py-0 transition-transform duration-300 z-50 ${show ? "translate-y-0" : "-translate-y-full"}`}>
				<div className="lg:flex lg:justify-between py-[10px]">
					<div className="lg:w-[calc(100%-420px)] flex justify-between mb-[10px] lg:mb-0 lg:justify-start sm:justify-center *:sm:mx-[10px] *:lg:mr-[15px] *:lg:ml-[0px] *:rounded-[5px] *:p-[5px_15px] *:text-white font-[700] *:bg-orange-400 hover:*:bg-orange-500 *:cursor-pointer">
						<Link to={`/delivery`} className="">Nhà xe</Link>
						<Link to={`/color`} className="">Màu hoa</Link>
						<Link to={`/categories`} className="">Loại Hoa</Link>
						<Link to={`/user`} className="">Người Dùng</Link>
					</div>

					<FilterSearch keyword={keyword} setKeyword={setKeyword} />
				</div>
				<hr />
				<Link className="absolute bg-blue-500 rounded-b-[5px] p-[5px_15px] mx-[10px] text-white font-[700] top-[100%] right-0" to={`/order/add`}>Thêm đơn</Link>
			</div>

			<div className="flex *:p-[5px_10px] my-[10px] rounded-[10px] overflow-hidden border w-fit bg-white text-slate-300 font-[600] cursor-pointer">
				<div onClick={() => setStatus("pending")} className={`${status === "pending" ? "bg-red-400 text-white border-b-[2px] border-red-800" : ""}`}>Cần xử lý</div>
				<div onClick={() => setStatus("success")} className={`${status === "success" ? "bg-green-400 text-white border-b-[2px] border-green-800" : ""}`}>Hoàn tất</div>
			</div>
			<div className="grid-cols-1 gap-2 grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
				{order?.data?.data.map((item: any) => {
					const hasUndelivered = item.products.every(
						(p: any) => p.status === true);
					const totalQuantity = item?.products.reduce((total: number, SubItem: any) => {
						return total + SubItem?.quantity;
					}, 0);
					return (
						<div key={item._id} className={`${updatedId === item._id
							? "animate-highlight"
							: ""}
							bg-white rounded-[5px] shadow-2xl relative border-r-[5px] ${hasUndelivered && item?.paid === 0 ? "border-green-500" : "border-red-500 "}`}>
							{item.pin === true ?
								<div className="absolute right-[-5px] top-[-9px] text-green-500 z-10">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
										<path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
									</svg>
								</div>
								:
								""
							}

							<div className="overflow-hidden relative h-full">
								{openMenuId === item._id && (
									<div className={`${closingId === item._id ? "modal-close" : "modal-open"}  bg-blue-400 absolute right-0 left-0 bottom-0 z-10 rounded-[10px_10px_0px_0px] p-[20px_10px_1px_10px]`}>
										<div className="flex w-full justify-center">
											<div onClick={() => handleClose(item._id)} className="cursor-pointer">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
													<path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
												</svg>
											</div>
										</div>
										<div className="bg-blue-300 rounded-[10px] px-[10px_10px]">
											<div className="my-[10px] hover:*:hover:bg-blue-200 *:p-[15px] *:w-[100%] *:flex *:items-center *:cursor-pointer">
												<div className=" rounded-t-[10px]">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
														<path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
													</svg>
													<span onClick={() => { handleUpdatePin(!item.pin, item._id), handleClose(item._id) }} className={`${closingId === item._id ? "modal-close" : "modal-open"} ml-[5px] w-[100%]`}>{item.pin === true ? "Bỏ ghim đơn hàng" : "Ghim đơn hàng"}</span>
												</div>
												<Link to={`/order/edit/${item._id}`} className="">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
														<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
													</svg>
													<span className="ml-[5px] w-[100%]">Chỉnh sửa đơn hàng</span>
												</Link>
												<div className="">
													<div className="">
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
															<path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
														</svg>
													</div>
													<span onClick={() => handleDeleteOrder(item?._id)} className="ml-[5px] w-[100%]">Xóa đơn hàng</span>
												</div>
												<div onClick={() => handleDownload(item._id)} className=" flex md:mr-[100px] cursor-pointer">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
														<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
													</svg>
													<span className="ml-[5px]">
														Tải ảnh
													</span>
												</div>
												<div onClick={() => handleCopy(item._id)} className="cursor-pointer flex  rounded-b-[10px]">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
														<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
													</svg>
													<span className="ml-[5px]">
														Copy ảnh
													</span>
												</div>
											</div>
										</div>
									</div>
								)}
								{/* phần muốn chụp */}
								<div ref={(el) => (refs.current[item._id] = el)}>
									<div className="p-[10px]">
										<div className="flex justify-between overflow-hidden">
											<div className="w-[100%] border-slate-300">

												<div className="">
													<div className="mb-[10px]">
														<div className="flex justify-between">
															<div className="font-[600] text-[18px] mb-[10px]">
																<div className="flex">
																	<span className="mr-[5px]">{item?.userId?.name}</span>
																	<span className="">
																		- {item?.userId?.phone}
																	</span>
																</div>
																<div className="text-[11px]">
																	<div className="font-[500] text-slate-500">{dayjs(item?.createdAt).format("DD-MM-YYYY HH:mm")}</div>
																</div>
															</div>
															<div className="">
																<div onClick={() =>
																	setOpenMenuId(openMenuId === item._id ? null : item._id)
																} className="cursor-pointer">
																	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
																		<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
																	</svg>
																</div>
															</div>
														</div>
														<div>
															<span className="font-[500]">Địa chỉ: </span>
															<span>{item?.userId?.address}</span>
														</div>
														<div>
															<span className="font-[500]">Số nhà xe:</span>
															<span> {item?.deliveryId?.phone + " (" + item?.deliveryId.name + " - " + item?.deliveryId?.type + ") "}</span>
														</div>
														<div>
															<span className="font-[500]">Nợi nhận: </span>
															<span>{item?.deliveryId.province + " - " + item?.deliveryId.address}</span>
														</div>
														<div className="">
															<span className="font-[500]">Ghi chú: </span>
															{item.note === "" ? (
																<span>Không có ghi chú</span>
															) : (
																<span>{item.note}</span>
															)}
														</div>
													</div>
													<hr className="mb-[10px]" />
													<div className="bg-slate-100 rounded-[3px] p-[5px]">
														<div className="flex justify-between">
															<div className="w-[calc(100%)]">
																<table className="w-full">
																	<tr className="text-left">
																		<th>Đơn</th>
																		<th>Màu</th>
																		<th>Giá</th>
																		<th>Bó</th>
																		<th>Kiện</th>
																		<th>Tổng</th>
																		<th className="text-center">Giao</th>
																	</tr>
																	{
																		item.products.map((SubItem: any) => (
																			<tr key={item._id} className={`${!SubItem.status ? "bg-red-200" : "bg-green-200"} border-b-[1px] font-[500]`}>
																				<td>{SubItem?.categoryId.name}</td>
																				<td>{SubItem?.colorId.name}</td>
																				<td>x{Number(SubItem?.price).toLocaleString("vi-VN") || 0}</td>
																				<td>{SubItem?.bundle}</td>
																				<td>{SubItem?.quantity}</td>
																				<td>{Number(SubItem?.total).toLocaleString("vi-VN") || 0}</td>
																				<div className="h-[26px] flex justify-center items-center">
																					<input
																						onChange={() => handlecheckItem(SubItem)}
																						className=""
																						type="checkbox"
																						checked={SubItem.status}
																					/>
																				</div>
																			</tr>
																		))
																	}

																</table>

															</div>
														</div>
													</div>
													<div className="mb-[5px] font-[600] text-blue-500 text-[18px]">Tổng kiện: {totalQuantity}</div>
													<hr />
												</div>

												<div className="w-full flex justify-between items-center">
													<div className="flex justify-between w-[200px]">
														<div className="font-[600]">
															<p>Tổng đơn: </p>
															<p>Phí khác: </p>
															<p>Đã thanh toán: </p>
															{item.paid >= 0 ?
																(<p>Cần thanh toán: </p>) :
																(<p>Trả lại: </p>)
															}
														</div>
														<div className="font-[700] text-right">
															<p>{Number(item?.totalPrice).toLocaleString("vi-VN") || 0}</p>
															<p>{Number(item?.otherFee).toLocaleString("vi-VN") || 0}</p>
															<p>{Number(item?.pay).toLocaleString("vi-VN") || 0}</p>
															{item?.paid > 0 ? (
																<p className="text-red-700">{Number(item?.paid).toLocaleString("vi-VN") || 0}</p>
															) : (
																<p>{Number(item?.paid).toLocaleString("vi-VN") || 0}</p>
															)}
														</div>
													</div>
												</div>

											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			<Pagination totalPage={order?.data.totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />

			<CheckProducts openModal={openModal} setOpenModal={setOpenModal} productItem={productItem} />
		</div>
	);
}

export default ProductPage
