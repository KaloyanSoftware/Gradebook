
import { useMutation } from "@tanstack/react-query";
import { createGrade } from "../services/gradeService.ts";

export function useCreateGrade() {
    const { mutate, isPending, isSuccess, isError, error } = useMutation({
        mutationFn: createGrade,
    });

    return { createGrade: mutate, isPending, isSuccess, isError, error };
}