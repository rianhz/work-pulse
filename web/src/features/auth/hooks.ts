import { useMutation } from "@tanstack/react-query";
import { changePassword, googleLogin, login, logout, register, registerWithGoogle, removeGoogle, removePassword } from "@/features/auth/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IChangePasswordPayload, ILoginPayload, IRegisterPayload, IRegisterWithGooglePayload } from "./auth";
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

export const useGoogleLoginMutation = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (token: string) => googleLogin(token),
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
      router.push("/signin");
    },

    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useRegisterWithGoogle = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: IRegisterWithGooglePayload) => registerWithGoogle(payload),
    onSuccess: (data: IResponse<void>) => {
      toast.success(data.message);
      router.push("/signin");
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
      dispatch(logoutAction());
      router.push("/signin");
    },

    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useRemovePassword = () => {
  return useMutation({
    mutationFn: removePassword,
    onSuccess: () => {
      toast.success("Password disconnected successfully");
    },
    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useRemoveGoogle = () => {
  return useMutation({
    mutationFn: removeGoogle,
    onSuccess: () => {
      toast.success("Google disconnected successfully");
    },
    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: IChangePasswordPayload) => changePassword(payload),
    onSuccess: (data: IResponse<void>) => {
      toast.success(data.message);
    },
    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};