type Result = (data: IResponse, error?: boolean) => void;

interface IResponse<T = any> {
    data: T
    code: number
    message: string
    success: boolean
}