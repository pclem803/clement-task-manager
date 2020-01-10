window.onload = function() {
  let login_form = document.getElementById("login");
  let sign_up_form = document.getElementById("sign_up");

  login_form.onsubmit = e => {
    e.preventDefault();
    logIn().then(res => {
      if (res.status == 200) {
        window.location.pathname = "/dashboard";
      } else {
        let email_box = document.getElementById("login_email");
        let password_box = document.getElementById("login_password");
        email_box.style.borderColor = "red";
        password_box.style.borderColor = "red";
      }
    });
  };

  sign_up_form.onsubmit = e => {
    e.preventDefault();
    signUp().then(res => {
      if (res.status == 201) {
        window.location.pathname = "/dashboard";
      } else {
        let email_box = document.getElementById("sign_up_email");
        let password_box = document.getElementById("sign_up_password");
        email_box.style.borderColor = "red";
        password_box.style.borderColor = "red";
      }
    });
  };
};

const logIn = () => {
  let email = document.getElementById("login_email").value;
  let password = document.getElementById("login_password").value;
  let post = {
    email: email,
    password: password
  };
  let body = JSON.stringify(post);
  return fetch("/users/login", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const signUp = () => {
  let name = document.getElementById("sign_up_name").value;
  let email = document.getElementById("sign_up_email").value;
  let password = document.getElementById("sign_up_password").value;
  let post = {
    name: name,
    email: email,
    password: password
  };
  let body = JSON.stringify(post);
  return fetch("/users", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
