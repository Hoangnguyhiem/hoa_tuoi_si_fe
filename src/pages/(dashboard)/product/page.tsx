import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import CheckProducts from "./components/checkProducts";
import FilterDate from "./components/filterDate";
import FilterCategories from "./components/filterCategories";
import FilterSearch from "./components/filterSearch";
const ProductPage = () => {

	const refs = useRef<Record<string, HTMLDivElement | null>>({});

	const [show, setShow] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const [openModal, setOpenModal] = useState(false)
	const [productItem, setProductItem] = useState(null)

	// download ảnh
	const handleDownload = async (id: string) => {
		const el = refs.current[id];
		if (!el) return;

		const dataUrl = await toPng(el, {
			cacheBust: true,
			pixelRatio: 2,
			backgroundColor: "#ffffff"
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

		const dataUrl = await toPng(el, {
			cacheBust: true,
			pixelRatio: 2,
			backgroundColor: "#ffffff"
		});

		const blob = await (await fetch(dataUrl)).blob();

		await navigator.clipboard.write([
			new ClipboardItem({ "image/png": blob })
		]);

		alert("Đã copy ảnh!");
	};

	const { data: order } = useQuery({
		queryKey: ["order"],
		queryFn: async () => {
			return await instance.get(`order`)
		}
	})

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY > lastScrollY) {
				setShow(false);
			} else {
				setShow(true);
			}
			setLastScrollY(currentScrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [lastScrollY]);

	const handlecheckItem = (data: any) => {
		setOpenModal(!openModal)
		setProductItem(data)
	}

	return (
		<div className="bg-slate-300 p-[10px] pt-0">

			<div className={`sticky top-0 bg-slate-300 mx-[-10px] p-[10px] py-0 transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"}`}>

				<div className="lg:flex lg:justify-between py-[10px]">
					<div className="flex justify-between lg:block lg:w-[calc(100%-420px)]">
						<FilterCategories />
						<FilterDate />
					</div>

					<FilterSearch />
				</div>
				<hr />
				<Link className="absolute bg-blue-500 rounded-b-[5px] p-[5px_15px] mx-[10px] text-white font-[700] top-[100%] right-0" to={`/add`}>Thêm đơn</Link>
			</div>

			<div className="grid-cols-1 gap-2 grid lg:grid-cols-2 lg:gap-3 mt-[45px]">
				{order?.data.slice().reverse().map((item: any) => {
					const hasUndelivered = item.products.every(
						(p: any) => p.status === true);
					return (
						<div key={item._id} className="bg-white rounded-[5px] shadow-2xl">
							{/* phần muốn chụp */}
							<div ref={(el) => (refs.current[item._id] = el)}>
								<div className={`p-[10px_10px_0px_10px] border-r-[5px] ${hasUndelivered && item?.paid === 0 ? "border-green-500" : "border-red-500 "} rounded-t-[5px]`}>
									<div className="flex justify-between overflow-hidden">
										<div className="w-[100%] border-slate-300">
											<div className="mb-[10px]">
												<div className="flex justify-between">
													<div className="font-[600] text-[17px] mb-[5px] lg:flex">
														<span className="lg:pr-[10px]">{item?.userId?.name}</span>
														<span className="flex lg:border-l-[1px] lg:border-slate-300 lg:pl-[10px]">
															{item?.userId?.phone}
														</span>
													</div>
													<div className="font-[600]">{dayjs(item?.createdAt).format("DD/MM/YYYY HH:mm")}</div>
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
											<div className="mb-[10px] bg-slate-100 rounded-[3px] p-[5px]">
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
																	<tr className={`${!SubItem.status ? "bg-red-200" : "bg-green-200"} border-b-[1px] font-[500]`}>
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
											<div className="w-full flex mb-[10px] justify-between">
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
												<div className="flex items-end">
													<button className="bg-slate-300 font-[600] p-[5px_15px] rounded-[5px]">Chỉnh sửa</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<hr />
							<div className="hidden md:flex justify-center">
								<div className="flex m-[8px]">
									<div onClick={() => handleDownload(item._id)} className="flex md:mr-[100px] cursor-pointer">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
										</svg>
										<button>
											Tải ảnh
										</button>
									</div>
									<div onClick={() => handleCopy(item._id)} className="cursor-pointer flex">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
										</svg>
										<button>
											Copy ảnh
										</button>
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>
			<CheckProducts openModal={openModal} setOpenModal={setOpenModal} productItem={productItem} />
		</div>
	);
}

export default ProductPage
