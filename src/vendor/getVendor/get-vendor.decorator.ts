/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Vendor } from 'src/models/vendor.schema';

export const GetVendor = createParamDecorator(
  (_data, ctx: ExecutionContext): Vendor => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);