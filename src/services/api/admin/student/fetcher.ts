import type { StudentModel } from '../student/Schemas'
import type {
    ApiResponse,
    Filters,
    PaginatedApiResponse,
} from '../types/apiTypes'

class BackendStudentFetcher {

    async getStudents({ page, search, size, status, email, sortBy, grade, sortOrder }: Partial<Filters<StudentModel>>): Promise<PaginatedApiResponse<StudentModel>> {
        try {
            const url = new URL("http://localhost:8080/students")
            search && url.searchParams.append("search", search.toString())
            page && url.searchParams.append("page", page.toString())
            size && url.searchParams.append("limit", size.toString())
            grade && url.searchParams.append("grade", grade.toString())
            status && url.searchParams.append("status", status.toString())
            email && url.searchParams.append("email", email.toString())
            sortBy && url.searchParams.append("sortBy", sortBy.toString())
            sortOrder && url.searchParams.append("sortOrder", sortOrder.toString())

            const response = await fetch(url.toString())
            const responseData = await response.json()
            return responseData
        } catch (error) {
            return {
                success: false,
                message: "error fetching students data"
            }
        }
    }

    async getStudent(id: string): Promise<ApiResponse<StudentModel>> {
        return fetch(`http://localhost:8080/students/${id}`).then((response) =>
            response.json(),
        )
    }

    async addStudent(student: StudentModel): Promise<ApiResponse<StudentModel>> {
        const response = await fetch(`http://localhost:8080/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student),
        })
        return response.json()
    }

    async editStudent(
        modifiedStudent: StudentModel,
    ): Promise<ApiResponse<StudentModel>> {
        const response = await fetch(
            `http://localhost:8080/students/${modifiedStudent.id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(modifiedStudent),
            },
        )
        return response.json()
    }

    async deleteStudent(id: string): Promise<ApiResponse<void>> {
        const response = await fetch(`http://localhost:8080/students/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
        return response.json()
    }

}
export const studentFetcher = new BackendStudentFetcher()


// import.meta.env.DEV ? new JSONStudentFetcher() : new APIStudentFetcher();
// for automating the data fetching while the backend is not ready.changing the dev state will change the whole website fetching process
// from the json server to the backend
