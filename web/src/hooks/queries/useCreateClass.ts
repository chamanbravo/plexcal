import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { FormValues } from "../../pages/homepage/ScheduleClassModal";

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await api.post("/class-schedules", data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
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
    queryKey: ["class-schedules", paginate],
    queryFn: async () => {
      const response = await api.get("/class-schedules", {
        params: {
          page: paginate.skip,
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
