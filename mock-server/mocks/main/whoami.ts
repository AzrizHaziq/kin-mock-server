import {MockFn} from "mocks/common";

export const mockFn:  MockFn<any, any> = () => {
  return ({
    "id": 1,
    "firstName": "Tariq",
    "lastName": "Rasheed",
    "email": "tariq.rasheed@kinesso.com",
    "whiteLabel": "interact",
    "admin": true,
    "ipgUser": false,
    "idClient": 1,
  });
}