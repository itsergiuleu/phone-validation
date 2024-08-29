export class CountryValidationConfig {
  countryCode: string;
  length: {
    min: number;
    max: number;
  };
  startWith: number[];
}
