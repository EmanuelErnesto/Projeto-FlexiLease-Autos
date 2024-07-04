export class PaginationParamsDto {
  readonly limit: number;
  readonly offset: number;
  readonly name?: string;
  readonly birth?: Date;
  readonly cep?: string;
  readonly qualified?: string;
  readonly patio?: string;
  readonly complement?: string;
  readonly neighborhood?: string;
  readonly locality?: string;
  readonly uf?: string;

  constructor(params: {
    limit: number;
    offset: number;
    name?: string;
    birth?: Date;
    cep?: string;
    qualified?: string;
    patio?: string;
    complement?: string;
    neighborhood?: string;
    locality?: string;
    uf?: string;
  }) {
    Object.assign(this, params);
  }
}
