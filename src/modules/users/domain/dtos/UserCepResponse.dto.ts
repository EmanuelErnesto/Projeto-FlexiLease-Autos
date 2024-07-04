export class UserCepResponseDto {
  readonly cep: string;
  readonly patio: string;
  readonly complement: string;
  readonly neighborhood: string;
  readonly locality: string;
  readonly uf: string;

  constructor(
    cep: string,
    patio: string,
    complement: string,
    neighborhood: string,
    locality: string,
    uf: string,
  ) {
    this.cep = cep;
    this.patio = patio || 'N/A';
    this.complement = complement || 'N/A';
    this.neighborhood = neighborhood || 'N/A';
    this.locality = locality || 'N/A';
    this.uf = uf || 'N/A';
  }
}
