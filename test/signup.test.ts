import axios from "axios";
import crypto from "crypto";

const drivers = [
    {
        "name": "Antonio Alencar",
        "email": `${crypto.randomUUID()}@gmail.com`,
        "password": "Antonio123",
        "cpf": "97456321558",
        "isDriver": true,
        "carPlate": "ABC1234",
    },
    {
        "name": "Francisco Lisboa",
        "email": `${crypto.randomUUID()}@gmail.com`,
        "password": "franciscoL123",
        "cpf": "71428793860",
        "isDriver": true,
        "carPlate": "HQZ1589",
    },
    {
        "name": "Robert Silva",
        "email": `${crypto.randomUUID()}@gmail.com`,
        "password": "RobertS0123456",
        "cpf": "974.563.215-58",
        "isDriver": true,
        "carPlate": "AYT7438",
    },
]

const passengers = [
    {
        "name": "Ana Maria",
        "email": `${crypto.randomUUID()}@gmail.com`,
        "password": "asdG123456",
        "cpf": "048.576.990-52",
        "isPassenger": true,
    },
    {
        "name": "Leticia Silva",
        "email": `${crypto.randomUUID()}@gmail.com`,
        "password": "asdG123456",
        "cpf": "662.482.340-27",
        "isPassenger": true,
    },
    {
        "name": "Jessica Medeiros",
        "email": `${crypto.randomUUID()}@gmail.com`,
        "password": "asdG123456",
        "cpf": "769.754.260-90",
        "isPassenger": true,
    },
]

const existentAccountIds = [
    "b44bcf17-0c1e-4c19-bea7-3dbcb02e1577",
    "4ab37dd8-be4e-4190-9836-4fe28914cb20",
    "3e776284-0a66-4ed0-bca4-15668b9a490f",
]

test.each(drivers)("Should create a new driver", async (driver) => {
    const response = await axios.post("http://localhost:3000/signup", driver);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("accountId");
    const account = await axios.get(`http://localhost:3000/accounts/${response.data.accountId}`);
    expect(account.status).toBe(200);
    expect(account.data.is_driver).toBe(true);
    expect(account.data.is_passenger).toBe(false);
});

test.each(passengers)("Should create a new passenger", async (passenger) => {
    const response = await axios.post("http://localhost:3000/signup", passenger);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("accountId");
    const account = await axios.get(`http://localhost:3000/accounts/${response.data.accountId}`);
    expect(account.status).toBe(200);
    expect(account.data.is_driver).toBe(false);
    expect(account.data.is_passenger).toBe(true);
});

test("Should fail when trying to create an account with an invalid cpf", async() => {
    try {
        await axios.post("http://localhost:3000/signup", {
            "name": "marcos silva",
            "email": "marcos@gmail.com",
            "password": "Marcos123",
            "cpf": "123456789",
            "isDriver": true,
            "carPlate": "ABC1234",
        });
    } catch (error: any) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty("message", "-1");
    }
});

test("Should fail when trying to create an account with an invalid name", async() => {
    try {
        await axios.post("http://localhost:3000/signup", {
            "name": "marcos",
            "email": `${crypto.randomUUID()}@gmail.com`,
            "password": "marcos123",
            "cpf": "97456321558",
            "isDriver": true,
            "carPlate": "ABC1234",
        });
    } catch (error: any) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty("message", "-3");
    }
});

test("Should fail when trying to create an account with an invalid email", async() => {
    try {
        await axios.post("http://localhost:3000/signup", {
            "name": "marcos silva",
            "email": "marcos.com",
            "password": "marcos123",
            "cpf": "97456321558",
            "isDriver": true,
            "carPlate": "ABC1234",
        });
    } catch (error: any) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty("message", "-2");
    }
});

test("Should fail when trying to create an account with an invalid password", async() => {
    try {
        await axios.post("http://localhost:3000/signup", {
            "name": "marcos silva",
            "email": "marcos@gmail.com",
            "password": "12345678",
            "cpf": "97456321558",
            "isDriver": true,
            "carPlate": "ABC1234",
        });
    } catch (error: any) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty("message", "-5");
    }
});

test("Should fail when trying to create an account with an invalid car plate", async() => {
    try {
        await axios.post("http://localhost:3000/signup", {
            "name": "Francisco Lisboa",
            "email": `${crypto.randomUUID()}@gmail.com`,
            "password": "franciscoL123",
            "cpf": "71428793860",
            "isDriver": true,
            "carPlate": "HQ41589",
        });
    } catch (error: any) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty("message", "-6");
    }
});

test("Should fail when trying to create an account that already exists", async() => {
    try {
        await axios.post("http://localhost:3000/signup", {
            "name": "Antonio Alencar",
            "email": `${crypto.randomUUID()}@gmail.com`,
            "password": "Antonio123",
            "cpf": "97456321558",
            "isDriver": true,
            "carPlate": "ABC1234",
        });
    } catch (error: any) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty("message", "-4");
    }
});
