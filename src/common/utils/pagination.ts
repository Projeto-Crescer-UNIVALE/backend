import {
  paginate,
  PaginationArgs,
  PaginationOptions,
} from 'nestjs-prisma-pagination';

type PrismaDeLegate<E> = {
  count: (args?: any) => Promise<number>;
  findMany: (args?: any) => Promise<E[]>;
};

interface ExtendedPaginationArgs extends PaginationArgs {
  search?: string;
}
// Esses dois para incluir o search neles, para não dar erro de tipo.
interface ExtendedPaginationOptions extends PaginationOptions {
  search?: string[];
}

// Função para remover 'mode' recursivamente
function removeModeFromQuery(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeModeFromQuery(item));
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key === 'mode') {
        continue; // Remove 'mode'
      }
      cleaned[key] = removeModeFromQuery(value);
    }

    return cleaned;
  }

  return obj;
}

export async function Paginate<
  E,
  T extends PrismaDeLegate<E> = PrismaDeLegate<E>,
>(
  params: ExtendedPaginationArgs = { page: 1, limit: 10 },
  options: ExtendedPaginationOptions,
  model: T,
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const prismaQuery = paginate(params, options);
  const cleanedPrismaQuery = removeModeFromQuery(prismaQuery);

  const whereSearch = params.search
    ? {
        OR: (options.search || []).map((campo) => ({
          [campo]: { contains: params.search },
        })),
      }
    : {};

  // Combina o where da busca com o where das options (se existir)
  const combinedWhere = {
    ...cleanedPrismaQuery.where,
    ...whereSearch,
  };

  // Se tanto prismaQuery.where quanto whereSearch existem, usar AND
  const finalWhere =
    cleanedPrismaQuery.where && Object.keys(whereSearch).length > 0
      ? { AND: [cleanedPrismaQuery.where, whereSearch] }
      : combinedWhere;

  const cleanFinalWhere = removeModeFromQuery(finalWhere);

  const [totalCount, data] = await Promise.all([
    model.count({ where: cleanFinalWhere }),
    model.findMany({ ...cleanedPrismaQuery, where: cleanFinalWhere }),
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
