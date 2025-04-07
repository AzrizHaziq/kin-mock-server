import {MockFn} from "mocks/common";
import {Request} from "express";

const responseA = {
  "id": 1,
  "name": "Client (mock)",
  "status": "ACTIVE",
  "casClientId": 1,
  "currency": {
    "id": 1,  "isoCode": "GBP", "symbol": "£"
  }
};
const responseB: Error = Error('ERROR: No Account Found');

export const mockFn:  MockFn<any, any> = (req: Request) => {
  switch (req.mockProfile) {
    case 'qa-profileA':
      return responseA;
    case 'qa-profileB':
      return responseB;
    default:
      return responseA;
  }
}
