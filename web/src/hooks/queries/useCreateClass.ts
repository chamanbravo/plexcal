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

export const useGetClassSchedules = (
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
