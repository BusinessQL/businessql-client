import 'dotenv/config';
import axios from 'axios';

export type BusinessQLClientOptions = {
  apiKey?: string;
  url?: string;
};

export type BusinessQLClientGraphqlOptions = {
  query: string;
  variables?: any;
};

export class BusinessQLClient {
  private apiKey: string = '';
  private url: string = '';

  constructor(options?: BusinessQLClientOptions) {
    this.apiKey = options?.apiKey || process.env.BUSINESSQL_API_KEY || '';
    this.url =
      options?.url || process.env.BUSINESSQL_URL || 'http://bql.local:8130';
  }

  graphql = async <T>({
    query,
    variables,
  }: BusinessQLClientGraphqlOptions): Promise<T> => {
    if (!this.apiKey) {
      throw new Error('Missing API key');
    }

    const result = await axios.post(
      `${this.url}/graphql`,
      {
        query,
        variables,
      },
      {
        headers: {
          'x-api-key': this.apiKey,
        },
      },
    );

    return result.data.data as T;
  };
}

export const createClient = (options?: BusinessQLClientOptions) => {
  return new BusinessQLClient(options);
};
