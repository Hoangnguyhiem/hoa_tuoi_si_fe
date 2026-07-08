import instance from "@/configs/axios"

const colorSevices = {
    addColor: async (data: any) => {
        const res = await instance.post(`/color_add`, data)
        return res.data
    },

    listAllColor: async () => {
        const res = await instance.get(`/color`)
        return res.data
    },

    deleteColor: async (id: any) => {
        const res = await instance.delete(`/color_delete/${id}`)
        return res.data
    }
}

export default colorSevices