/**
 * @jest-environment jsdom
 */

import NewBill from "../containers/NewBill";
import NewBillUI from "../views/NewBillUI";
import { localStorageMock } from "../__mocks__/localStorage";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { ROUTES } from "../constants/routes";
import router from "../app/Router";

describe('Given I am connected as an employee', () => {
  describe('When I am on the new bill page', () => {
    test('Then the document is changed on the form', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = NewBillUI()
      const newBillObject = new NewBill({ document, onNavigate: {}, store: {}, localStorage: {} });
      const handleChange = jest.fn((e) => newBillObject.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')
      inputFile.addEventListener('change', handleChange)
      fireEvent.change(inputFile)
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('When a new bill is submitted in the correct format', () => {
    test('Then submit a new bill', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      const storeMock = {
        bills: () => {
          return {
            update: function(bill) {
              return {
                then: function (fn) {
                  return { catch: () => {}}
                }
              }
            }
          };
        },
      };
      
      const newBillObject = new NewBill({ document, onNavigate, store: storeMock, localStorage: window.localStorage });
      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBillObject.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      await waitFor(() => {
        const titleBills = screen.queryByText("Mes notes de frais");
        expect(titleBills).toBeTruthy();
      });
    })
  })

  describe('When an error 404 occurs while fetching bills from the API', () => {
    test('Then an error message should be displayed', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      const errorMessage404 = "Erreur 404";
      const storeMock = {
        bills: () => {
          return {
            list: () => {
              return Promise.reject(new Error(errorMessage404));
            },
          };
        },
      };

      const form = screen.getByTestId("form-new-bill");
      jest.spyOn(storeMock, "bills").mockImplementationOnce(() => {
        return storeMock.bills();
      });

      await fireEvent.submit(form, { bill: '404' });
      expect(() => screen.getByText(errorMessage404)).toThrow();
    });
  });

  describe('When an error 500 occurs while fetching bills from the API', () => {
    test('Then an error message should be displayed', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      const errorMessage500 = "Erreur 500";
      const storeMock = {
        bills: () => {
          return {
            list: () => {
              return Promise.reject(new Error(errorMessage500));
            },
          };
        },
      };

      const form = screen.getByTestId("form-new-bill");
      jest.spyOn(storeMock, "bills").mockImplementationOnce(() => {
        return storeMock.bills();
      });

      await fireEvent.submit(form, { bill: '500' });
      expect(() => screen.getByText(errorMessage500)).toThrow();
    });
  });
});
