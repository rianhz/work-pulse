import { useMutation } from "@tanstack/react-query";
import { login, logout, register } from "@/features/auth/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: login,

    onSuccess: async () => {
      console.log("login success");
    },

    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: register,

    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/login");
    },

    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      console.log("logout success");
      router.push("/login");
    },

    onError: error => {
      toast.error((error as any)?.response?.data?.message || error?.message);
    },
  });
};