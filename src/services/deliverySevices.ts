import instance from "@/configs/axios"

const deliverySevices = {
    addDelivery: async (data: any) => {
        console.log(data);
        
        const res = await instance.post(`/delivery_add`, data)
        return res.data
    },

    listDelivery: async () => {
        const res = await instance.get(`/delivery`)
        return res.data
    }
}

export default deliverySevices