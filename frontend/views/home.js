import { router } from "../app"

function Home() {
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
            Home()
        })
        
        authText.appendChild(logoutBtn)
        homeDiv.appendChild(authText)
    }
    document.body.appendChild(homeDiv)
}

export { Home }