import instance from "@/configs/axios"

const orderSevices = {
    addOrder: async (data: any) => {
        const res = await instance.post(`/order_add`, data)
        return res.data
    },

    getOrderById: async (id: any) => {
        const res = await instance.get(`/order/${id}`)
        return res.data
    },

    updateOrderById: async (data: any) => {
        const res = await instance.put(`/updateOrder/${data._id}`, data )
        return res.data
    },

    updatePinById: async (data: any) => {
        const res = await instance.post(`/updatePin`, data)
        return res.data
    },

    deleteOrderbyId: async (id: any) => {
        const res = await instance.delete(`/deleteOrder/${id}`)
        return res.data
    },

    getDeliveryId: async (id: any) => {
        const res = await instance.get(`/deliveryid/${id}`)
        return res.data
    },

    updateStatusProduct: async (data: any) => {
        const res = await instance.put(`updateStatusProduct`, data)
        return res.data
    } 
}

export default orderSevices