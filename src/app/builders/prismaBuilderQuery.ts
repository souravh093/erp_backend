import { Prisma } from "../../../generated/prisma/client";

export interface QueryParams {
  searchTerm?: string;
  filter?: Record<string, any>;
  orderBy?: Record<string, any>;
  page?: string | number;
  limit?: string | number;
}

export interface BuilderOptions {
  searchFields?: string[];
}

const safeParseJSON = (value: unknown, fallback: any) => {
  if(!value) return fallback;

  if(typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return fallback;
    }
  }
}

export const buildPrismaQuery = (query: QueryParams, options: BuilderOptions = {}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const take = limit;

  const parsedFilter = safeParseJSON(query.filter, {});
  const parsedOrderBy = safeParseJSON(query.orderBy, { createdAt: 'desc' });
  
  const searchConditions: Prisma.Enumerable<any> = [];

  if (query.searchTerm && options.searchFields?.length) {
    const searchConditionsArray = options.searchFields.map((field) => ({
      [field]: {
        contains: query.searchTerm,
        mode: 'insensitive',
      },
    }));
    searchConditions.push({ OR: searchConditionsArray });
  }

  const where = {
    ...parsedFilter,
    ...(searchConditions.length > 0 ? { AND: searchConditions } : {}),
  };

  return {
    skip,
    take,
    where,
    orderBy: parsedOrderBy,
    page,
  };
};

export const calculatePaginationMeta = (totalItems: number, page: number, limit: number) => {
  return {
    totalItems,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
    limit,
  };
};
