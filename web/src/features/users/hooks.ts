import { useQuery } from "@tanstack/react-query";
import { getProfile, getUsersDeletedFoldersAndFiles, getUsersFoldersAndFiles } from "./api";
import { IFile } from "../files/file";
import { IFolder } from "../folders/folders";

// export const useGetProfile = () => {
//   return useQuery<IUser | null, Error>({
//     queryKey: ["profile"],
//     queryFn: async () => {
//       try {
//         return await getProfile();
//       } catch (error) {
//         return null;
//       }
//     },
//     retry: false,
//   });
// };

export const useGetUsersFoldersAndFiles = () => {
  return useQuery<IFolder | IFile[], Error>({
    queryKey: ["usersFoldersAndFiles"],
    queryFn: () => getUsersFoldersAndFiles(),
  });
};

export const useGetUsersDeletedFoldersAndFiles = () => {
  return useQuery<IFolder | IFile[], Error>({
    queryKey: ["usersDeletedFoldersAndFiles"],
    queryFn: () => getUsersDeletedFoldersAndFiles(),
  });
};