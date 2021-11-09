/* eslint-disable prettier/prettier */
import { diskStorage } from 'multer';

export const VendorCoverImages = diskStorage({
  destination: './client/images/vendor',
  filename: (req, file, cd) => {
    cd(
      null,
      new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname,
    );
  },
});

export const ProductCoverImages = diskStorage({
  destination: './client/images/product',
  filename: (req, file, cd) => {
    cd(
      null,
      new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname,
    );
  },
});
