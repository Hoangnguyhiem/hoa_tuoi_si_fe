import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { vi } from "date-fns/locale";
import { subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { useEffect, useState } from "react";

const FilterDate = () => {
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // ================= PRESETS =================
    const presets = [
        {
            label: "Hôm nay",
            getRange: () => ({
                startDate: new Date(),
                endDate: new Date(),
            }),
        },
        {
            label: "Hôm qua",
            getRange: () => {
                const yesterday = subDays(new Date(), 1);
                return { startDate: yesterday, endDate: yesterday };
            },
        },
        {
            label: "7 ngày qua",
            getRange: () => ({
                startDate: subDays(new Date(), 6),
                endDate: new Date(),
            }),
        },
        {
            label: "30 ngày qua",
            getRange: () => ({
                startDate: subDays(new Date(), 29),
                endDate: new Date(),
            }),
        },
        {
            label: "Tháng này",
            getRange: () => ({
                startDate: startOfMonth(new Date()),
                endDate: new Date(),
            }),
        },
        {
            label: "Tháng trước",
            getRange: () => {
                const lastMonth = subMonths(new Date(), 1);
                return {
                    startDate: startOfMonth(lastMonth),
                    endDate: endOfMonth(lastMonth),
                };
            },
        },
    ];

    // ================= DEFAULT =================
    const defaultRange = presets[0].getRange();

    const [range, setRange] = useState([
        { ...defaultRange, key: "selection" },
    ]);

    const [rangePending, setRangePending] = useState([
        { ...defaultRange, key: "selection" },
    ]);

    const [activePreset, setActivePreset] = useState("Hôm nay");

    // ================= RESPONSIVE =================
    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 980);
        };
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    // ================= LOAD LOCAL STORAGE =================

    const saved = localStorage.getItem("dateRange");
    useEffect(() => {
        if (!saved) return;

        try {
            const parsed = JSON.parse(saved);

            const restored = [
                {
                    startDate: new Date(parsed.startDate),
                    endDate: new Date(parsed.endDate),
                    key: "selection",
                },
            ];

            setRange(restored);
            setRangePending(restored);
            setActivePreset(parsed.label);
        } catch (err) {
            console.error("Invalid dateRange in localStorage");
        }
    }, [saved]);

    // ================= ESC CLOSE =================
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // ================= PREVENT SCROLL =================
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    // ================= PRESET CLICK (chỉ update pending) =================
    const handlePresetClick = (preset: any) => {
        const newRange = preset.getRange();

        setRange([{ ...newRange, key: "selection" }]);
        const dataToSave = {
            startDate: newRange.startDate.toISOString(),
            endDate: newRange.endDate.toISOString(),
            label: preset.label,
        };

        console.log(newRange.startDate);
        
        localStorage.setItem("dateRange", JSON.stringify(dataToSave));
        setOpen(false);
    };

    // ================= APPLY =================
    const handleApply = () => {
        setRange(rangePending);
        const dataToSave = {
            startDate: rangePending[0].startDate.toISOString(),
            endDate: rangePending[0].endDate.toISOString(),
            label:"Tùy chỉnh",
        };

        localStorage.setItem("dateRange", JSON.stringify(dataToSave));
        setOpen(false);
    };

    // ================= CANCEL =================
    const handleCancel = () => {
        setRangePending(range); // rollback
        setOpen(false);
    };

    return (
        <div className="relative mt-[10px]">
            {/* Trigger */}
            <div
                onClick={() => {
                    setRangePending(range); // clone dữ liệu cũ
                    setOpen(true);
                }}
                className="flex items-center border border-slate-400 rounded p-[5px] cursor-pointer w-fit"
            >
                <div className="text-[12px] flex *:items-center text-slate-700">
                    <div className="mr-[2px]">
                        {/* SVG giữ nguyên */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                        </svg>

                    </div>

                    <span className="font-semibold">
                        {activePreset + ": "}
                        {/* {range[0].startDate.toLocaleDateString("vi-VN")} -{" "}
                        {range[0].endDate.toLocaleDateString("vi-VN")} */}

                        {range[0].startDate.toLocaleDateString("vi-VN") === range[0].endDate.toLocaleDateString("vi-VN") ?  range[0].startDate.toLocaleDateString("vi-VN"):
                        range[0].startDate.toLocaleDateString("vi-VN") + " - " + range[0].endDate.toLocaleDateString("vi-VN")}
                    </span>
                </div>
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-20 lg:left-0 mt-[5px] flex rounded overflow-hidden border shadow-lg">

                    {/* Presets */}
                    <div className="w-[150px] border-r p-[10px] bg-white text-[14px] text-slate-600">
                        {presets.map((preset, index) => (
                            <div
                                key={index}
                                onClick={() => handlePresetClick(preset)}
                                className={`cursor-pointer px-[5px] py-[10px] rounded
                                    ${activePreset=== preset.label
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-blue-100"
                                    }`}
                            >
                                {preset.label}
                            </div>
                        ))}
                    </div>

                    {/* Calendar */}
                    <div>
                        <div className="bg-white p-4">
                            <DateRange
                                ranges={rangePending}
                                onChange={(item: any) => {
                                    setRangePending([item.selection]);
                                }}
                                months={isMobile ? 1 : 2}
                                direction={isMobile ? "vertical" : "horizontal"}
                                moveRangeOnFirstSelection={false}
                                locale={vi}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end p-[10px] bg-white border-t">
                            <div
                                onClick={handleCancel}
                                className="bg-slate-400 px-[15px] py-[5px] rounded text-white font-semibold cursor-pointer"
                            >
                                Hủy
                            </div>

                            <div
                                onClick={handleApply}
                                className="bg-blue-500 text-white px-[15px] py-[5px] rounded font-semibold ml-[10px] cursor-pointer"
                            >
                                Cập nhật
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDate;