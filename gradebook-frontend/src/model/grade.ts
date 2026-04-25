export type AddGradeFormData = {
    value: number;
    comment?: string;
    date: string;
}

export type NewGrade = {
    studentId: string;
    date: string;
    subject: string;
    value: number;
    comment?: string;
}