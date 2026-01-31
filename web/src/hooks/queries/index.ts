import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { FormValues as ScheduleClassFormValues } from "../../pages/homepage/ScheduleClassModal";
import type { FormValues as ClassTypeFormValues } from "../../pages/homepage/ClassTypeModal";

export const useCreateClassSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ScheduleClassFormValues) => {
      const response = await api.post("/class-schedules", data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-schedules"],
        exact: false,
      });
    },

    onError: (error) => {
      console.error("Failed to create class:", error);
    },
  });
};

export const useGetClassSchedulesEvents = (
  dateRange: Record<string, Date> | undefined,
) => {
  return useQuery({
    queryKey: [
      "class-schedules",
      dateRange?.startDate?.toISOString(),
      dateRange?.endDate?.toISOString(),
    ],
    enabled: !!dateRange?.startDate && !!dateRange?.endDate,
    queryFn: async () => {
      const response = await api.get("/class-schedules", {
        params: {
          startDate: dateRange!.startDate.toISOString(),
          endDate: dateRange!.endDate.toISOString(),
        },
      });
      return response.data;
    },
  });
};

export const useGetClassSchedules = (
  paginate: Record<string, number> = { page: 0, limit: 10 },
) => {
  return useQuery({
    queryKey: ["class-schedules", paginate.page, paginate.limit],
    queryFn: async () => {
      const response = await api.get("/class-schedules", {
        params: {
          page: paginate.page,
          limit: paginate.limit,
        },
      });
      return response.data;
    },
  });
};

export const useDeleteClassSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/class-schedules/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-schedules"],
        exact: false,
      });
    },
  });
};

export const useCreateClassType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ClassTypeFormValues) => {
      const response = await api.post("/class-types", data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-types"],
        exact: false,
      });
    },

    onError: (error) => {
      console.error("Failed to create class:", error);
    },
  });
};

export const useGetClassTypes = (
  paginate: Record<string, number> = { page: 0, limit: 10 },
) => {
  return useQuery({
    queryKey: ["class-types", paginate.page, paginate.limit],
    queryFn: async () => {
      const response = await api.get("/class-types", {
        params: {
          page: paginate.page,
          limit: paginate.limit,
        },
      });
      return response.data;
    },
  });
};

export const useDeleteClassType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/class-types/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-types"],
        exact: false,
      });
    },
  });
};
