import { paginate } from 'nestjs-prisma-pagination';

type PrismaModel<T> = {
  count: (args?: any) => Promise<number>;
  findMany: (args?: any) => Promise<T[]>;
  $transaction?: any;
};

interface PaginateParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginateOptions {
  includes?: string[];
  orderBy?: any;
  search?: string[];
}

export async function minhaPaginacao<T>(
  params: PaginateParams,
  options: PaginateOptions,
  prismaModel: PrismaModel<T>,
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const prismaQuery = paginate(
    { page, limit, search: params.search },
    {
      includes: options.includes || [],
      orderBy: options.orderBy || {},
      search: options.search || [],
    },
  );

  const whereSearch = params.search
    ? {
        OR: (options.search || []).map((campo) => ({
          [campo]: { contains: params.search },
        })),
      }
    : {};

  const [totalCount, data] = (await prismaModel.$transaction)
    ? await prismaModel.$transaction([
        prismaModel.count({ where: whereSearch }),
        prismaModel.findMany({ ...prismaQuery, where: whereSearch }),
      ])
    : await Promise.all([
        prismaModel.count({ where: whereSearch }),
        prismaModel.findMany({ ...prismaQuery, where: whereSearch }),
      ]);

  return {
    data,
    meta: {
      total: totalCount,
      lastPage: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      prev: page > 1 ? page - 1 : null,
      next: page * limit < totalCount ? page + 1 : null,
    },
  };
}
