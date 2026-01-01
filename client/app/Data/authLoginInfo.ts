import {api} from "../axios/axiosConfig";
// --- Customer Auth APIs ---
export const customerLogin = async (data: any) => {
  try {
    // Add the config object as the 3rd argument
    const response = await api.post('/api/users/login', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const customerSignup = async (data: any) => {
  try {
    const response = await api.post('/api/users/register', data);
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data);
    throw error.response?.data || error.message;
  }
};

// --- Merchant Auth APIs ---

export const merchantVerifyPhone = async (phone: string) => {
  try {
    const response = await api.post('/auth/merchant/verify-phone', { phone });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const merchantLogin = async (data: any) => {
  try {
    const response = await api.post('/auth/merchant/login', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const merchantSignup = async (data: any) => {
  try {
    const response = await api.post('/auth/merchant/signup', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/api/users/logout');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

