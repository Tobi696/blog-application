import { router, authClient } from "../app"
import { SignupRequest, AuthUserRequest, UsernameUsedRequest, EmailUsedRequest } from "../proto/services_grpc_web_pb"

function Signup() {
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
        let req = new UsernameUsedRequest()
        req.setUsername(username)
        authClient.usernameUsed(req, {}, (err, res) => {
            if (err) return alert(err.message);
            if (res.getUsed()) {
                usernameError.innerText = "This Username is already in use. Please choose another."
                return
            }
        })
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
        let req = new EmailUsedRequest();
        req.setEmail(email);
        authClient.emailUsed(req, {}, (err, res) => {
            if (err) return alert(err.message);
            if (res.getUsed()) {
                emailError.innerText = "This E-Mail is already in use. Please choose another."
                return
            }
        })
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
                router.navigate("/")
            })
        })
    })

    signupDiv.appendChild(signupForm)

    document.body.appendChild(signupDiv)
}

export { Signup }