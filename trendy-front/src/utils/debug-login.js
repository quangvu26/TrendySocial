window.debugLogin = async function () {
  // Get token from storage
  const port = window.location.port || "5173";
  const prefix = `trendy_${port}_`;
  const token = localStorage.getItem(prefix + "token");
  const user = localStorage.getItem(prefix + "user");

  try {
    const response = await fetch("http://localhost:8080/trendy/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "123456",
      }),
    });

    const data = await response.json();

    if (data.token) {
      // Parse token
      try {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
      } catch (e) {
        console.error("Failed to parse token:", e);
      }
    } else {
      console.error("❌ No token in response");
    }
  } catch (e) {
    console.error("Login API error:", e);
  }
};

window.debugGoogleLogin = async function () {
  const backend = "http://localhost:8080";
  const frontend = window.location.origin;

  console.log(
    `<a href="${backend}/oauth2/authorization/google">Login with Google</a>`
  );
};

window.debugStorage = function () {
  const port = window.location.port || "5173";
  const prefix = `trendy_${port}_`;

  Object.keys(localStorage).forEach((key) => {
    const value = localStorage.getItem(key);
    console.log(
      `  ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? "..." : ""}`
    );
  });

  Object.keys(sessionStorage).forEach((key) => {
    const value = sessionStorage.getItem(key);
    console.log(
      `  ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? "..." : ""}`
    );
  });
};
