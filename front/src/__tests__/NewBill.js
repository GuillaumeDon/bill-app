import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import mockStore from "../__mocks__/store.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

describe("Given I am a user connected as Employee", () => {
  beforeEach(() => {
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

  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      window.onNavigate(ROUTES_PATH.NewBill);
    });

    test("Then the mail icon in vertical layout should be highlighted", async () => {
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      expect(mailIcon).toHaveClass("active-icon");
    });

    describe("When I upload a file", () => {
      test("Then the handleChangeFile function should be called with a valid file", async () => {
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: localStorageMock,
        });

        const handleChangeFile = jest.fn(newBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("change", handleChangeFile);

        fireEvent.change(inputFile, {
          target: {
            files: [new File(["image"], "image.png", { type: "image/png" })],
          },
        });

        expect(handleChangeFile).toHaveBeenCalled();
        await waitFor(() => expect(handleChangeFile).toHaveBeenCalledTimes(1));
      });

      test("Then the handleChangeFile function should alert with an invalid file", async () => {
        window.alert = jest.fn();

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: localStorageMock,
        });

        const handleChangeFile = jest.fn(newBill.handleChangeFile);
        const inputFile = screen.getByTestId("file");
        inputFile.addEventListener("change", handleChangeFile);

        fireEvent.change(inputFile, {
          target: {
            files: [new File(["document"], "document.pdf", { type: "application/pdf" })],
          },
        });

        expect(handleChangeFile).toHaveBeenCalled();
        await waitFor(() => expect(handleChangeFile).toHaveBeenCalledTimes(1));
        expect(window.alert).toHaveBeenCalledWith('Type de fichier invalide. Veuillez télécharger un fichier jpg, jpeg ou png.');
      });
    });
  });

  describe("When I submit a valid NewBill form", () => {


    ///////////////TEST ERREURS/////////////////////

    // test("fetches bills from an API and fails with 404 message error", async () => {
    //   mockStore.NewBill.mockImplementationOnce(() => {
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
    //   mockStore.NewBills.mockImplementationOnce(() => {
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

    ///////////////////////////////////
    test("Then it should call updateBill method", async () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      const form = screen.getByTestId("form-new-bill");

      fireEvent.change(screen.getByTestId("expense-type"), { target: { value: "Transports" } });
      fireEvent.change(screen.getByTestId("expense-name"), { target: { value: "Train" } });
      fireEvent.change(screen.getByTestId("datepicker"), { target: { value: "2023-05-14" } });
      fireEvent.change(screen.getByTestId("amount"), { target: { value: "100" } });
      fireEvent.change(screen.getByTestId("vat"), { target: { value: "20" } });
      fireEvent.change(screen.getByTestId("pct"), { target: { value: "20" } });
      fireEvent.change(screen.getByTestId("commentary"), { target: { value: "Voyage d'affaire" } });

      newBill.fileUrl = "http://localhost:3000/images/test.jpg";
      newBill.fileName = "test.jpg";

      const handleSubmit = jest.fn(newBill.handleSubmit);
      form.addEventListener("submit", handleSubmit);

      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
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

