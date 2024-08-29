import { Injectable } from '@nestjs/common';
import { CountryValidationConfig } from './dtos/country-validation-config.dto';

@Injectable()
export class AppService {
  /**
   * I would also recommend to move this to a separate file and import it here.
   *
   * @private
   */
  private supportedCountriesRules = {
    estonia: {
      countryCode: '+372',
      length: {
        min: 6,
        max: 8,
      },
      startWith: [5],
    },
    belgium: {
      countryCode: '+32',
      length: {
        min: 5,
        max: 7,
      },
      startWith: [46, 58],
    },
  };

  async validate(phoneNumbers: string[]) {
    const numbers = {
      invalid: phoneNumbers, // consider initially all numbers as invalid
    };

    Object.keys(this.supportedCountriesRules).forEach((country) => {
      numbers[country] = [];

      phoneNumbers.forEach((phoneNumber: string) => {
        /**
         * Here we might want to replace not only spaces but also - and other characters.
         */
        phoneNumber = phoneNumber.replaceAll(' ', '');
        const countryRules = this.supportedCountriesRules[country];

        if (
          this.isCountryCodeValid(countryRules, phoneNumber) &&
          this.isLengthValid(countryRules, phoneNumber) &&
          this.isBeginningOfTheNumberValid(countryRules, phoneNumber)
        ) {
          numbers[country].push(phoneNumber);

          // remove the number from the invalid list since it is valid
          numbers.invalid = numbers.invalid.splice(
            numbers.invalid.indexOf(phoneNumber),
            1,
          );
        }
      });
    });

    return numbers;
  }

  private isBeginningOfTheNumberValid(
    countryRules: CountryValidationConfig,
    phoneNumber: string,
  ) {
    return countryRules.startWith.some((startWith: number) =>
      phoneNumber.startsWith(countryRules.countryCode + startWith),
    );
  }

  private isLengthValid(
    countryRules: CountryValidationConfig,
    phoneNumber: string,
  ) {
    return (
      phoneNumber.replace(countryRules.countryCode, '').length >=
        countryRules.length.min &&
      phoneNumber.replace(countryRules.countryCode, '').length <=
        countryRules.length.max
    );
  }

  private isCountryCodeValid(
    countryRules: CountryValidationConfig,
    phoneNumber: string,
  ) {
    return phoneNumber.startsWith(countryRules.countryCode);
  }
}
