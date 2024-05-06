

/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, fireEvent, getByTestId, waitFor } from "@testing-library/dom";
import mockStore from "../__mocks__/store.js";


import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

jest.mock("../app/Store", () => mockStore);

describe("When I am on NewBill Page", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
  });

  test("Then mail icon on verticallayout should be highlighted", async () => {
    window.onNavigate(ROUTES_PATH.NewBill);
    await waitFor(() => screen.getByTestId("icon-mail"));
    const Icon = screen.getByTestId("icon-mail");
    expect(Icon).toHaveClass("active-icon");
  });

  describe ("When I am on NewBill form", () => {
    test("Then I add File", async () => {
      const dashboard = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });
  
      const handleChangeFile = jest.fn(dashboard.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["document.jpg"], "document.jpg", {
              type: "document/jpg",
            }),
          ],
        },
      });

      //if pdf a essayer, un else pour l'erreur
  
      expect(handleChangeFile).toHaveBeenCalled();
      expect(handleChangeFile).toBeCalled();
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });
  })
});


describe("When I am on NewBill Page and submit the form", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills");
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);
    router();
  });

  describe("user submit form valid", () => {
    test("Submitting the new bill form should call updateBill method", async () => {
      const inputData = {
        pct: "valeur",
        //ici tu rajouters autres inputs
        fileUrl: "http://example.com/file.jpg",
      };

      const newBillPage = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      screen.getByTestId("pct").value = inputData.pct;
      newBillPage.fileUrl = inputData.fileUrl;
      //tester pour chaque input

      await waitFor(() => {
        screen.getByTestId("form-new-bill");
      });

      const formNewBill = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(newBillPage.handleSubmit);
      newBillPage.updateBill = jest.fn();
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      //update qlq chose 
      expect(newBillPage.updateBill).toHaveBeenCalled();
    });
  });
});
    







//Tester 500, 200 et 404 obligatoire






  //A FAIRE
  // test("fetches bills from an API and fails with 404 message error", async () => {
  //   mockedStore.NewBill.mockImplementationOnce(() => {
  //     return {
  //       list: () => {
  //         return Promise.reject(new Error("Erreur 404"));
  //       },
  //     };
  //   });
  //   window.onNavigate(ROUTES_PATH.Bills);
  //   await new Promise(process.nextTick);
  //   const message = screen.getByText(/Erreur 404/);
  //   expect(message).toBeTruthy();
  // });

  // test("fetches messages from an API and fails with 500 message error", async () => {
  //   mockedStore.NewBills.mockImplementationOnce(() => {
  //     return {
  //       list: () => {
  //         return Promise.reject(new Error("Erreur 500"));
  //       },
  //     };
  //   });

  //   window.onNavigate(ROUTES_PATH.NewBill);
  //   await new Promise(process.nextTick);
  //   const message = screen.getByText(/Erreur 500/);
  //   expect(message).toBeTruthy();
  // });


//3 tests à ajouter:

/*
Si formulaire avec données vide ou non valide. Tester si on reste sur le form
1 .  const inputAmount = screen.getByTestId("amount");
      expect(inputAmount.value).toBe("");


      test : 
       const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit",handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();


Si le form est bien rempli, si il est soumis.

        const newBillPage = new NewBill({
          document, onNavigate, store, localStorage: window.localStorage
        })

        screen.getByTestId("pct").value = "valeur" ou par variable.. //inputData.pct

        newBillPage.fileUrl = inputData.fileUrl // check


        const formNewBill = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn(newBillPage.handleSubmit);
        newBillPage.updateBill = jest.fn();
        formNewBill.addEventListener("submit", handleSubmit);
        fireEvent.submit(formNewBill);
  
        expect(newBillPage.updateBill).toHaveBeenCalled();



Si lorsqu'on change l'image, on doit avoir une fonction appelée pour vérifier l'extension
d'image



test a faire : c'est bon

      const file = new File([""], "upload.jpg",{type:"image/jpeg"});
      const inputFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn(newBillPage.handleChangeFile);
      
			inputFile.addEventListener("change", handleChangeFile);
			fireEvent.change(inputFile,{target:{files:[file]} });

      expect(handleChangeFile).toHaveBeenCalled();


*/
