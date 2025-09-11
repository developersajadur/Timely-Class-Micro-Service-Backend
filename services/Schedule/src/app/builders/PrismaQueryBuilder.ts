/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface QueryOptions<T> {
  model: {
    findMany: (args: any) => Promise<T[]>;
    count: (args: any) => Promise<number>;
  };
  where?: any;
  searchFields?: string[];
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  include?: any;
  // page?: number;
  // limit?: number;
}

export async function PrismaQueryBuilder<T>({
  model,
  where = {},
  searchFields = [],
  search = '',
  sortField = 'createdAt',
  sortOrder = 'desc',
  include = undefined,
  // page = 1,
  // limit = 10,
}: QueryOptions<T>) {
  // const skip = (page - 1) * limit;

  let searchFilter = {};
  if (search && searchFields.length > 0) {
    searchFilter = {
      OR: searchFields.map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      })),
    };
  }

  const combinedWhere = {
    AND: [{ isDeleted: false }, where, searchFilter],
  };

  const data = await model.findMany({
    where: combinedWhere,
    orderBy: { [sortField]: sortOrder },
    include,
    // skip,
    // take: limit,
  });

  const total = await model.count({ where: combinedWhere });

  return {
    data,
    meta: {
      // page,
      // limit,
      total,
      // totalPages: Math.ceil(total / limit),
    },
  };
}
