import { FindPaymentsFilter, FindPaymentsOptions } from "../../domain/dtos";
import { Payment } from "../../domain/entities";
import { IReturnValueWithPagination } from "../../domain/valueObjects/returnValue";
import IPaymentRepository from "../repositories";
import { setupPagination, setupPaymentsFilter } from "./helpers";
import IUseCase from "./protocol";

export default class GetPaymentsUsecase implements IUseCase<{
    filter?: FindPaymentsFilter,
    options?: FindPaymentsOptions
}, IReturnValueWithPagination<Payment>> {
    constructor(private readonly repo: IPaymentRepository) { }

    async execute(query: {
        filter?: FindPaymentsFilter,
        options?: FindPaymentsOptions
    }): Promise<IReturnValueWithPagination<Payment>> {
        const { filter, options } = query;
        // setup filter
        const filterQuery = setupPaymentsFilter(filter)

        const pagination = setupPagination(options)

        const total = await this.repo.countPayments({
            where: filterQuery
        });

        const payments = await this.repo.getPayments({
            where: filterQuery,
            include: {
                installments: options?.withInstallments,
            },
            skip: pagination.skip,
            take: pagination.limit
        });

        return new IReturnValueWithPagination(true, 'Success', {
            data: payments,
            ...pagination,
            total
        })
    }
}