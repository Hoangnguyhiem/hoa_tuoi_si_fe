import instance from "@/configs/axios"

const deliverySevices = {
    addDelivery: async (data: any) => {
        const res = await instance.post(`/delivery_add`, data)
        return res.data
    },

    deleteDelivery: async (id: any) => {
        console.log(id);
        
        const res = await instance.delete(`/delivery_delete/${id}`)
        return res.data
    },

    listDelivery: async () => {
        const res = await instance.get(`/delivery`)
        return res.data
    }
}

export default deliverySevices