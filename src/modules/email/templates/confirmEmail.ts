import { ConfirmEmailType } from "../../../common/types";

export function generateVerificationEmail(context: ConfirmEmailType): string {
  const { name, verificationLink, year, appName } = context;

  return `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">

          <tr>
            <td style="padding: 30px; background-color: #0d47a1; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Verify Your Email</h1>
              <p style="margin: 5px 0 0; font-size: 14px;">Let's get you started!</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Hello ${name},</p>
              <p style="font-size: 16px; color: #333;">
                Thank you for signing up. To complete your registration, please verify your email address by clicking the button below.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" target="_blank"
                  style="background-color: #0d47a1; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Verify Email
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px; background-color: #f1f1f1; text-align: center; font-size: 12px; color: #888;">
              &copy; ${year} ${appName}. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
