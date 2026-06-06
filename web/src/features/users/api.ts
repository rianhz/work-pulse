import { AxiosError } from "axios";

export const getMe = async ({ Cookie }: { Cookie: string }) => {
  try {
    console.log("getMe");
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || error.response?.data.error || 'Failed to get profile');
    }
    throw new Error('Failed to get profile');
  }
};