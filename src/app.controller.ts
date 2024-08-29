import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PhoneValidationInput } from './dtos/phone-validation-input.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('phone-validation')
  async validation(@Body() input: PhoneValidationInput) {
    return this.appService.validate(input.phones);
  }
}
