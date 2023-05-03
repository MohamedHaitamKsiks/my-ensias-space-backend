<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css">


# my-ensias-space-backend

backend for end of year project.

# Powered By 

<i class="devicon-typescript-plain colored"> typescript</i>

Check [here](https://khalilstemmler.com/blogstypescript/node-starter-project/) to setup typescript in node.

<i class="devicon-nodejs-plain colored"> nodejs</i>

<i class="devicon-express-original"> expressjs</i>

<i class="devicon-sequelize-plain"> sequilize </i>

<i class="devicon-mysql-plain"> MySQL </i>

<i class="devicon-jest-plain"> jest </i>


# Setup

install dependencies

```sh
npm install
```

run as developper
```sh
npm run dev
```

build the project
```sh
npm run build
```

run uint test
```sh
#test all
npm run test:all
#test database
npm run test:database
#test models
npm run test:models
#test api
npm run test:api
```

# Documentation of the API

## User

### Data types


1. AuthState
```ts
enum AuthState {
    VALID,
    USER_NOT_FOUND,
    PASSWORD_INCORRECT
};
```

2. UserType
```ts
enum UserType {
    ETUDIANT,
    ADMIN
};
```

3. UserInterface
```ts
interface UserInterface {
    id: number;
    email: string;
    type: UserType;
    typeName: string;
}

```

4. Change Password Stats
```ts
enum ChangePassowrdState {
    DONE,
    WRONG_OLD_PASSWORD,
    ERROR
}
```

5. Add Account States
```ts
//add account response
enum AddAccountState {
    DONE,
    NOT_ADMIN,
    EMAIL_ALREADY_EXISTS,
    EMAIL_NOT_FOUND,
    TYPE_NOT_FOUND
};


```

### Routes

### 1. login : 

url : POST ```/user/login```

body :
```json
{
    "email": string,
    "password": string
}
```

response: 

```json
{
    "user": UserInterface
    "state": AuthState
}
```

### 2. Add account

You need to be connected before adding people.

Adding an account will automaticaly send an email with the a generated password so the user can conncect.     

I'm using a test email with ethereal.email
You can setup you own email configuration in the `src/config/email.config.ts`

ur: POST `/user/add`

request:
```json
{
    "email": string,
    "type": Auth 
}
```

response:
```json
{
    "password": string
    "state": AddAccountState
}
```

### 3. Logout

url: POST `/user/logout`

### 4. User Informarion

You need to be connected before sending this request or you'll be getting a response like this:
```json
{
    "logged": false
}
```

url: GET `/user/info`


### 5. Change password

url: POST `/user/changepassword`

request:
```json
{
    "oldPassword": string,
    "newPassword": string
}
```

response:
```json
{
    "state": ChangePasswordState
}
```