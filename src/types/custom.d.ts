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

export interface Collection {
  address: string;
  name: string;
  symbol: string;
  owner: string;
  image: string;
  data: Array<{
    name: string;
    description: string;
    image: string;
    attributes: Record<string, string>;
  }>;
  banner?: string;
  description?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  website?: string;
}
