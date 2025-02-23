import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";
import { validatePassword } from "./validatePassword";
import { Account, AccountData, createAccount } from "./../classes/account";
import { create } from "domain";

const app = express();
app.use(express.json());

function getUUID() {
	return crypto.randomUUID();
}

function validateName(name: string) {
	return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function validateEmail(email: string) {
	return email.match(/^(.+)@(.+)$/);
}

function validateCarPlate(carPlate: string) {
	return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

async function userAlreadyExists(email: string, connection: any) {
	const [existingAccount] = await connection.query("select * from ccca.account where email = $1", [email]);
	return existingAccount;
}

async function insertAccount(account: any, connection: any) {
	await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, account.isPassenger, account.isDriver, account.password]);
}

function getDbConnection() {
	return pgp()("postgres://postgres:123456@localhost:8000/app");
}

app.post("/signup", async function (req, res) {
	let input = req.body as AccountData;
	let connection = getDbConnection();
	try {
		if(!validateCpf(input.cpf)) throw new Error("-1");
		if(!validateEmail(input.email)) throw new Error("-2");
		if(!validateName(input.name)) throw new Error("-3");
		if(await userAlreadyExists(input.email, connection)) throw new Error("-4");
		if(!validatePassword(input.password)) throw new Error("-5");
		if(input.isDriver && !validateCarPlate(input.carPlate)) throw new Error("-6");

		let account: Account = {
			accountId: getUUID(),
			name: input.name,
			email: input.email,
			cpf: input.cpf,
			carPlate: input.carPlate,
			isPassenger: !input.isDriver,
			isDriver: !!input.isDriver,
			password: input.password
		};

		await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
			[account.accountId, account.name, account.email, account.cpf, account.carPlate, account.isPassenger, account.isDriver, account.password]);
		
		res.json({ accountId: account.accountId });
	} catch(err: any) {
		res.status(422).json({ message: err.message });
	} finally {
		await connection.$pool.end();
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	let accountId = req.params.accountId;
	let connection = getDbConnection();
	let [output] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
	await connection.$pool.end();
	res.json(output);
});

app.listen(3000);
