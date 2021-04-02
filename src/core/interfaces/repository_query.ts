export interface RepositoryQuery {
  filters: unknown;
  pageNumber: number;
  pageSize: number;
  sortBy: { [key: string]: number };
}
