import { WelcomeEmailType } from "@shared/types";

export function generateWelcomeEmail(context: WelcomeEmailType): string {
  const { appName, dashboardLink, year, name } = context;

  return `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
<head>
  <meta charset="UTF-8">
  <title>Welcome to ${appName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">

          <tr>
            <td style="padding: 30px; background-color: #4caf50; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 26px;">Welcome to ${appName} 👋</h1>
              <p style="margin: 5px 0 0; font-size: 14px;">We're glad you're here!</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Hey ${name},</p>

              <p style="font-size: 16px; color: #333;">
                Welcome aboard! We're thrilled to have you join our community at <strong>${appName}</strong>.
              </p>

              <p style="font-size: 16px; color: #333;">
                Here's a quick link to get you started:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardLink}" target="_blank"
                  style="background-color: #4caf50; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>

              <p style="font-size: 16px; color: #333;">
                If you have any questions or need help, feel free to reach out to our support team.
              </p>

              <p style="font-size: 16px; color: #333;">
                Happy exploring!<br>
                — The ${appName} Team
              </p>
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
