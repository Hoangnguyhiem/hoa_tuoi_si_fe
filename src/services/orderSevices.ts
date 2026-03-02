import instance from "@/configs/axios"

const orderSevices = {
    addOrder: async (data: any) => {
        const res = await instance.post(`/order_add`, data)
        return res.data
    },

    getDeliveryId: async (id: any) => {
        const res = await instance.get(`/deliveryid/${id}`)
        return res.data
    },

    updateStatusProduct: async (data: any) => {
        const res = await instance.put(`updataStatusProduct`, data)
        return res.data
    } 
}

export default orderSevices