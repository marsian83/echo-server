export interface Token {
  address: string;
  symbol: string;
  owner: string;
  name: string;
  mintable: boolean;
  burnable: boolean;
  listed?: boolean;
  image?: string;
  banner?: string;
  description?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  website?: string;
}
