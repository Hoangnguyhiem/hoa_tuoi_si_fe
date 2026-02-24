import instance from "@/configs/axios"

const orderSevices = {
    addOrder: async (data: any) => {
        const res = await instance.post(`/order_add`, data)
        return res.data
    }
}

export default orderSevices