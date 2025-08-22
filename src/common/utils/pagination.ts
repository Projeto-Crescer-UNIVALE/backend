import {
  paginate,
  PaginationArgs,
  PaginationOptions,
} from 'nestjs-prisma-pagination';

type PrismaDelegate<E> = {
  count: (args?: any) => Promise<number>;
  findMany: (args?: any) => Promise<E[]>;
};

interface ExtendedPaginationArgs extends PaginationArgs {
  search?: string;
}
// Esses dois para incluir o search neles, para não dar erro de tipo.
interface ExtendedPaginationOptions extends PaginationOptions {
  search?: string[];
  disableInsensitiveMode?: boolean;
}

export async function paginator<
  E,
  T extends PrismaDelegate<E> = PrismaDelegate<E>,
>(
  params: ExtendedPaginationArgs = { page: 1, limit: 10 },
  options: ExtendedPaginationOptions,
  model: T,
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  // forçando globalmente
  const mergedOptions: ExtendedPaginationOptions = {
    disableInsensitiveMode: true,
    ...options,
  };

  const prismaQuery = paginate(params, mergedOptions);

  const whereSearch = params.search
    ? {
        OR: (mergedOptions.search || []).map((campo) => ({
          [campo]: {
            contains: params.search,
            ...(mergedOptions.disableInsensitiveMode
              ? {}
              : { mode: 'insensitive' }),
          },
        })),
      }
    : {};

  // Combina o where da busca com o where das options (se existir)
  const combinedWhere = {
    ...prismaQuery.where,
    ...whereSearch,
  };

  // Se tanto prismaQuery.where quanto whereSearch existem, usar AND
  const finalWhere =
    prismaQuery.where && Object.keys(whereSearch).length > 0
      ? { AND: [prismaQuery.where, whereSearch] }
      : combinedWhere;

  const [totalCount, data] = await Promise.all([
    model.count({ where: finalWhere }),
    model.findMany({ ...prismaQuery, where: finalWhere }),
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
