import Navigo from 'navigo'

import { Home } from "./views/home"
import { Login } from "./views/login"
import { Signup } from "./views/signup"
import { AuthServiceClient } from './proto/services_grpc_web_pb'

const authClient = new AuthServiceClient("http://localhost:9001")

const router = new Navigo()

router
    .on("/", Home)
    .on("/login", Login)
    .on("/signup", Signup)
    .resolve()

export { router, authClient }