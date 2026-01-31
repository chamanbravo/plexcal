import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../../components/Modal";
import { useCreateClassType } from "../../hooks/queries/useCreateClass";

const formSchema = z.object({
  name: z.string().min(3, "Title is required").max(10, "Name too long"),
  description: z
    .string()
    .min(3, "Title is required")
    .max(50, "Description too long"),
});

export type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ClassTypeModal({ open, onClose }: Props) {
  const { mutateAsync: createClass, isPending } = useCreateClassType();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createClass(data);
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} title="Create Class" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col  gap-4">
          <div className="w-full">
            <label>Class Name</label>
            <input
              placeholder="Class title"
              className="border rounded px-3 py-2 w-full"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="w-full">
            <label>Class Description</label>
            <input
              type="text"
              placeholder="Class Description"
              className="border rounded px-3 py-2 w-full"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
