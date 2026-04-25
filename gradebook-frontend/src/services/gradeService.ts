
import type { NewGrade } from "../model/grade.ts";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export async function createGrade(request: NewGrade): Promise<void> {
    try {
        const response = await axios.post("/v1.0/grades", request);
        return response.data;
    } catch (err) {
        console.error("Error creating grade:", err);
        throw err;
    }
}