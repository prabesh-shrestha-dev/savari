import resend from "../config/resend.js";

export const sendOTPEmail = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: "Savari <otp@prabeshshrestha1.com.np>", 
    to: ["prabeshshrestha0112@gmail.com"],
    subject: "Verify your account",
    html: `
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0; padding:0; background-color:#f4f5f7; font-family:'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6e8eb;">

                <!-- Header -->
                <tr>
                  <td align="center" style="background-color:#0047FF; padding:32px 24px;">
                    <div style="font-size:35px; font-weight:200; letter-spacing:2px; color:#ffffff; font-family:Futura;">
                      SAVARI
                    </div>
                    <div style="font-size:10px; letter-spacing:1px; color:#c9d9ff; margin-top:4px; text-transform:uppercase;">
                      Less wait, drive more.
                    </div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 32px 24px 32px;">
                    <p style="margin:0 0 8px 0; font-size:20px; font-weight:600; color:#1a1a1a;">
                      Verify your account
                    </p>
                    <p style="margin:0 0 28px 0; font-size:14px; line-height:1.6; color:#5f6672;">
                      Use the code below to verify your Savari account. This code will expire in 10 minutes.
                    </p>

                    <!-- OTP Box -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color:#f0f4ff; border:1px dashed #0047FF; border-radius:8px; padding:20px;">
                          <span style="font-size:34px; font-weight:700; letter-spacing:10px; color:#0047FF; font-family:'Courier New', monospace;">
                            ${otp}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:28px 0 0 0; font-size:13px; line-height:1.6; color:#9aa1ab;">
                      Didn't request this code? You can safely ignore this email — no changes will be made to your account.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 32px;">
                    <div style="border-top:1px solid #eceef1;"></div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding:20px 32px 32px 32px;">
                    <p style="margin:0; font-size:12px; color:#b0b5bd;">
                      ©️ ${new Date().getFullYear()} Savari. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>  
    `,
  });

  if (error) {
    throw new Error(`Resend Error: ${error.message}`);
  }

  return data;
};