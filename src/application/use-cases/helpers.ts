import { FindPaymentsFilter, FindPaymentsOptions } from "../../domain/dtos"
import { Prisma } from "@prisma/client"

export function setupPaymentsFilter(filter?: FindPaymentsFilter) {
    const filterObj: Prisma.PaymentWhereInput = {}

    if (!filter || !Object.keys(filter).length) {
        return filterObj
    }

    if (filter?.id) {
        filterObj.id = Array.isArray(filter.id) ? { in: filter.id } : filter.id
    }

    if (filter?.userId) {
        filterObj.userId = Array.isArray(filter.userId) ? { in: filter.userId } : filter.userId
    }

    if (filter?.orderId) {
        filterObj.orderId = Array.isArray(filter.orderId) ? { in: filter.orderId } : filter.orderId
    }

    if (!isNaN(Number(filter?.amount?.max)) || !isNaN(Number(filter.amount?.min))) {
        const query: { lte?: number, gte?: number } = {}

        if (filter?.amount?.max) {
            query.lte = filter?.amount?.max
        }
        if (filter?.amount?.min) {
            query.gte = filter?.amount?.min
        }
        filterObj.amount = query
    }

    if (filter?.currency) {
        filterObj.currency = Array.isArray(filter.currency) ? { in: filter.currency } : filter.currency
    }

    if (filter?.email) {
        filterObj.email = Array.isArray(filter.email) ? { in: filter.email } : filter.email
    }

    if (filter?.name) {
        filterObj.name = Array.isArray(filter.name) ? { in: filter.name } : filter.name
    }

    if (filter?.paymentMethod) {
        filterObj.paymentMethod = Array.isArray(filter.paymentMethod) ? { in: filter.paymentMethod } : filter.paymentMethod
    }

    if (filter?.phone) {
        filterObj.mobile = Array.isArray(filter.phone) ? { in: filter.phone } : filter.phone
    }

    if (filter?.provider) {
        filterObj.provider = Array.isArray(filter.provider) ? { in: filter.provider } : filter.provider
    }

    if (filter?.providerPaymentId) {
        filterObj.providerPaymentId = Array.isArray(filter.providerPaymentId) ? { in: filter.providerPaymentId } : filter.providerPaymentId
    }

    if (filter?.status) {
        filterObj.status = Array.isArray(filter.status) ? { in: filter.status } : filter.status
    }

    return filterObj


}

export function setupPagination(options?: FindPaymentsOptions) {

    if (!options || !Object.keys(options).length) {
        return {
            page: 1,
            limit: 10,
            skip: 0
        }
    }

    const page = options?.page && +options?.page > 0 ? +options?.page : 1;

    const limit = options?.limit && +options?.limit > 0 && +options?.limit <= 100 ? +options?.limit : 10;

    const skip = (page - 1) * limit;

    return { page, limit, skip };

}
