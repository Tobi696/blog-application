import Navigo from 'navigo'
import { AuthServiceClient, LoginRequest, SignupRequest, AuthUserRequest } from './proto/services_grpc_web_pb'

const router = new Navigo()
const authClient = new AuthServiceClient('http://localhost:9001')

router
    .on("/", function() {
        document.body.innerHTML = ""
        const homeDiv = document.createElement("div")
        homeDiv.classList.add("home-div")
        const user = JSON.parse(localStorage.getItem("user"))
        if(user == null) {
            const buttonContainer = document.createElement("div")
            buttonContainer.classList.add("button-container")
            const loginButton = document.createElement("button")
            loginButton.innerText = "Login"
            loginButton.addEventListener('click', () => {
                router.navigate("/login")
            })
            buttonContainer.appendChild(loginButton)

            const text = document.createElement("h2")
            text.innerText = "You are not authenticated."
            buttonContainer.appendChild(text)

            const signupButton = document.createElement("button")
            signupButton.innerText = "Sign Up"
            signupButton.addEventListener('click', () => {
                router.navigate("/signup")
            })
            buttonContainer.appendChild(signupButton)
            homeDiv.appendChild(buttonContainer)
        } else {
            const authText = document.createElement("div")
            authText.classList.add("auth-text")
            authText.innerText = `You're logged in as ${user.username} and your E-Mail is ${user.email}`

            const logoutBtn = document.createElement("button")
            logoutBtn.innerText = "Logout"

            logoutBtn.addEventListener('click', () => {
                localStorage.setItem("user", "null")
                localStorage.setItem("token", "null")
                window.location.reload()
            })
            
            authText.appendChild(logoutBtn)
            homeDiv.appendChild(authText)
        }
        document.body.appendChild(homeDiv)
    })
    .on("/login", function() {
        document.body.innerHTML = ""
        const loginDiv = document.createElement('div')
        loginDiv.classList.add("authentication-div")

        const loginLabel = document.createElement('h1')
        loginLabel.innerText = "Login"
        loginDiv.appendChild(loginLabel)

        const loginForm = document.createElement("form")

        const loginInputLabel = document.createElement("label")
        loginInputLabel.classList.add("input-label")
        loginInputLabel.innerText = "Username / E-Mail"
        loginInputLabel.setAttribute("for", "login-input")
        loginForm.appendChild(loginInputLabel)

        const loginInput = document.createElement("input")
        loginInput.id = "login-input"
        loginInput.setAttribute('type', 'text')
        loginInput.setAttribute('placeholder', 'John42')
        loginForm.appendChild(loginInput)

        const passwordInputLabel = document.createElement("label")
        passwordInputLabel.classList.add("input-label")
        passwordInputLabel.innerText = "Password"
        passwordInputLabel.setAttribute("for", "password-input")
        loginForm.appendChild(passwordInputLabel)

        const passwordInput = document.createElement("input")
        passwordInput.setAttribute("type", "password")
        passwordInput.id = "password-input"
        passwordInput.setAttribute("placeholder", "ice-cream")
        loginForm.appendChild(passwordInput)

        const submitBtn = document.createElement("button")
        submitBtn.innerText = "Login"
        loginForm.appendChild(submitBtn)

        loginForm.addEventListener('submit', event => {
            let i = 0;
            event.preventDefault()
            let req = new LoginRequest()
            req.setLogin(loginInput.value)
            req.setPassword(passwordInput.value)
            authClient.login(req, {}, (err, res) => {
                if(i != 0) return
                ++i
                if(err) return alert(err.message)
                localStorage.setItem('token', res.getToken())
                req = new AuthUserRequest()
                req.setToken(res.getToken())
                let j = 0;
                authClient.authUser(req, {}, (err, res) => {
                    if(j != 0) return
                    ++j
                    if(err) return alert(err.message)
                    const user = { id: res.getId(), username: res.getUsername(), email: res.getEmail() }
                    localStorage.setItem('user', JSON.stringify(user))
                })
            })
        })

        loginDiv.appendChild(loginForm)

        document.body.appendChild(loginDiv)
    })
    .on("/signup", function() {
        document.body.innerHTML = ""
        const signupDiv = document.createElement("div")
        signupDiv.classList.add("authentication-div")
        
        const signupLabel = document.createElement("h1")
        signupLabel.innerText = "Signup"
        signupDiv.appendChild(signupLabel)

        const signupForm = document.createElement("form")

        const usernameLabel = document.createElement("label")
        usernameLabel.innerText = "Username"
        usernameLabel.classList.add("input-label")
        usernameLabel.setAttribute("for", "username-input")
        signupForm.appendChild(usernameLabel)

        const usernameInput = document.createElement("input")
        usernameInput.setAttribute("type", "text")
        usernameInput.id = "username-input"
        usernameInput.setAttribute("placeholder", "John42")
        signupForm.appendChild(usernameInput)

        usernameInput.addEventListener('input', () => {
            usernameError.innerText = ""
            const username = usernameInput.value
            if (username.length < 4) {
                usernameError.innerText = "Username must be at least 4 characters long."
                return
            }
            if (username.length > 20) {
                usernameError.innerText = "Username must not be longer than 20 characters."
                return
            }
        })

        const usernameError = document.createElement("div")
        usernameError.id = "username-error"
        usernameError.classList.add("error")
        signupForm.appendChild(usernameError)

        const emailLabel = document.createElement("label")
        emailLabel.innerText = "E-Mail"
        emailLabel.classList.add("input-label")
        emailLabel.setAttribute("for", "email-input")
        signupForm.appendChild(emailLabel)

        const emailInput = document.createElement("input")
        emailInput.setAttribute("type", "email")
        emailInput.id = "email-input"
        emailInput.setAttribute("placeholder", "john@gmail.com")
        signupForm.appendChild(emailInput)

        emailInput.addEventListener('input', () => {
            emailError.innerText = ""
            const email = emailInput.value
            if (email.length < 7) {
                emailError.innerText = "E-Mail must be at least 7 characters long."
                return
            }
            if (email.length > 35) {
                emailError.innerText = "E-Mail must not be longer than 35 characters."
                return
            }
            if (!(new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$").test(email))) {
                emailError.innerText = "Invalid E-Mail"
                return
            }
        })

        const emailError = document.createElement("div")
        emailError.id = "email-error"
        emailError.classList.add("error")
        signupForm.appendChild(emailError)

        const passwordLabel = document.createElement("label")
        passwordLabel.innerText = "Password"
        passwordLabel.classList.add("input-label")
        passwordLabel.setAttribute("for", "password-input")
        signupForm.appendChild(passwordLabel)

        const passwordInput = document.createElement("input")
        passwordInput.setAttribute("type", "password")
        passwordInput.id = "password-input"
        passwordInput.setAttribute("placeholder", "John42")
        signupForm.appendChild(passwordInput)

        passwordInput.addEventListener('input', () => {
            passwordError.innerText = ""
            const password = passwordInput.value
            if (password.length < 8) {
                passwordError.innerText = "Password must be at least 7 characters long."
                return
            }
            if (password.length > 128) {
                passwordError.innerText = "Password must not be longer than 128 characters."
                return
            }
        })

        const passwordError = document.createElement("div")
        passwordError.id = "password-error"
        passwordError.classList.add("error")
        signupForm.appendChild(passwordError)

        const signupBtn = document.createElement("button")
        signupBtn.innerText = "Signup"
        signupForm.appendChild(signupBtn)

        signupForm.addEventListener('submit', event => {
            event.preventDefault()
            if (usernameInput.value == "" || usernameError.innerText != "" || emailInput.value == "" || emailError.innerText != "" || passwordInput.value == "" || passwordError.innerText != "") return
            let request = new SignupRequest()
            request.setUsername(usernameInput.value)
            request.setEmail(emailInput.value)
            request.setPassword(passwordInput.value)
            authClient.signup(request, {}, (err, res) => {
                if(err) return alert(err)
                localStorage.setItem('token', res.getToken())
                request = new AuthUserRequest()
                request.setToken(res.getToken())
                authClient.authUser(request, {}, (err, res) => {
                    if(err) return alert(err)
                    const user = { id: res.getId(), username: res.getUsername(), email: res.getEmail() }
                    localStorage.setItem("user", JSON.stringify(user))
                })
            })
        })

        signupDiv.appendChild(signupForm)

        document.body.appendChild(signupDiv)
    })
    .resolve()