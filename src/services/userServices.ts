import instance from '@/configs/axios';

const userServices = {
  addUser: async (data: any) => {
    const res = await instance.post(`/user_add`, data)
    return res.data
  },

  getUserById: async (id: any) => {
    const res = await instance.get(`/user/${id}`)
    return res.data
  }
};

export default userServices;