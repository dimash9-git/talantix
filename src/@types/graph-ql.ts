export interface GraphQLResponse<T> {
  data: T | null;
  errors: {
    message: string;
    locations: any[];
    path: any;
    extensions: any;
  }[];
  extensions: any;
  dataPresent: boolean;
}
