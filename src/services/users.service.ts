import api from "./api";
import type { User } from "@/types";

export const usersService = {
  getUsers: () => api.get<User[]>("/users").then((r) => r.data),

  getUserById: (id: string) =>
    api.get<User>(`/users/${id}`).then((r) => r.data),
};
