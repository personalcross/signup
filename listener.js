document.addEventListener("DOMContentLoaded", () => {

    const signupForm = document.getElementById("signup-form");
    const nameInput = document.getElementById("signup-name");
    const emailInput = document.getElementById("signup-email");
    const passwordInput = document.getElementById("signup-password");
    const errorElement = document.querySelector(".error");

    const redirectUrl = "https://personalcross.github.io/nosso-time/";

    // Check if the user is already authenticated
    auth.onAuthStateChanged((user) => {
        if (user) {
            window.location.href = redirectUrl;
        }
    });

    // Signup
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        errorElement.textContent = "";

        // Basic validation
        if (!name) {
            errorElement.textContent = "Introduza o seu nome.";
            return;
        }

        if (password.length < 6) {
            errorElement.textContent =
                "A senha deve ter pelo menos 6 caracteres.";
            return;
        }

        try {

            // Create Firebase Authentication account
            const userCredential =
                await auth.createUserWithEmailAndPassword(email, password);

            const user = userCredential.user;

            // Save additional user information in Firestore
            await db.collection("users").doc(user.uid).set({
                name: name,
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Redirect after successful registration
            window.location.href = redirectUrl;

        } catch (error) {

            console.error("Signup error:", error);

            switch (error.code) {

                case "auth/email-already-in-use":
                    errorElement.textContent =
                        "Já existe uma conta com este email.";
                    break;

                case "auth/invalid-email":
                    errorElement.textContent =
                        "O email introduzido não é válido.";
                    break;

                case "auth/weak-password":
                    errorElement.textContent =
                        "A senha é demasiado fraca.";
                    break;

                case "auth/operation-not-allowed":
                    errorElement.textContent =
                        "O registo por email e senha não está ativado.";
                    break;

                case "auth/network-request-failed":
                    errorElement.textContent =
                        "Erro de ligação. Verifique a sua internet.";
                    break;

                default:
                    errorElement.textContent =
                        "Não foi possível criar a conta. Tente novamente.";
                    break;
            }
        }
    });
});