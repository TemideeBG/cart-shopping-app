/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */

import { generate } from 'randomstring';
export const isEmpty = (value: string | number | object): boolean => {
    if (value === null) {
      return true;
    } else if (typeof value !== 'number' && value === '') {
      return true;
    } else if (typeof value === 'undefined' || value === undefined) {
      return true;
    } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
      return true;
    } else {
      return false;
    }
  };
  

  export const generateInvoiceNumber = () => {
    const prefix = "EBI-";
    const suffix = generate({
      length: 6,
      charset: "numeric",
    });
    const id = prefix + suffix.padStart(6, "0");
  
    return id;
  };
  