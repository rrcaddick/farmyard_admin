//TODO: Create styled email templates

const resetEmail = (strings, token) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        .email-heading {
          color: blue;
        }
      </style>
    </head>
    <body>
      <h1 class="email-heading">You requested a password reset</h1>
      <p>Click this <a href="http://localhost:3000/new-password?token=${token}">link to set a new password.</a></p>
    </body>
  </html>
`;
};

module.exports = {
  resetEmail,
};
