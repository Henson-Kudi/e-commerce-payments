import { Payment } from "../../domain/entities";
import { IReturnValue } from "../../domain/valueObjects/returnValue";
import IPaymentRepository from "../repositories";
import IUseCase from "./protocol";

export default class GetPaymentUsecase implements IUseCase<{
    id: string
    userId?: string
    withInstallments?: boolean
}, IReturnValue<Payment | null>> {
    constructor(private readonly repo: IPaymentRepository) { }

    async execute({ id, withInstallments }: {
        id: string
        userId?: string
        withInstallments?: boolean
    }): Promise<IReturnValue<Payment | null>> {
        const payment = await this.repo.getPaymentById(id, withInstallments)

        return {
            success: true,
            data: payment,
            message: 'Success'
        }
    }
}