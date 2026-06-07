import { useMutation } from "@tanstack/react-query";
import { login, logout, register } from "@/features/auth/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ILoginPayload, IRegisterPayload } from "./auth";
import { IResponse } from "@/global";
import { setUser } from "@/store/reducers/userSlice";
import { getMe } from "../users/api";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/store/reducers/userSlice";


export const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (payload: ILoginPayload) => login(payload),

    onSuccess: async () => {
      const user = await getMe();
      dispatch(setUser(user));
      router.push("/dashboard");

    },

    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: IRegisterPayload) => register(payload),

    onSuccess: (data: IResponse<void>) => {
      toast.success(data.message);
      router.push("/login");
    },

    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      toast.success("Logged out successfully");
      dispatch(logoutAction());
      router.push("/login");
    },

    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};