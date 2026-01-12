export function trackingEmailTemplate(
  name: string,
  trackingCode: string
) {
  const trackingUrl = `https://www.dhl-delivery.org/track?code=${trackingCode}`;

  return `
  <div style="margin:0;padding:0;background-color:#f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0"
            style="max-width:600px;background:#ffffff;border-radius:6px;overflow:hidden;">

            <!-- HEADER -->
            <tr>
              <td style="background:#d40511;padding:20px;text-align:center;">
                <!-- LOGO -->
                <img
                  src="https://www.dhl-delivery.org/logo.png"
                  alt="DHL Delivery"
                  width="120"
                  style="display:block;margin:0 auto 10px;"
                />
                <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;
                  font-size:18px;color:#ffffff;font-weight:bold;">
                  DHL DELIVERY
                </h1>
              </td>
            </tr>

            <!-- YELLOW STRIPE -->
            <tr>
              <td style="background:#ffcc00;height:6px;"></td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:30px;font-family:Arial,Helvetica,sans-serif;color:#333333;">
                <p style="font-size:16px;margin:0 0 15px;">
                  Hello <strong>${name}</strong>,
                </p>

                <p style="font-size:15px;margin:0 0 20px;">
                  Your shipment has been successfully processed.
                  Please use the tracking information below to follow your delivery.
                </p>

                <!-- TRACKING CODE BOX -->
                <div style="
                  background:#fff8e1;
                  border:2px dashed #ffcc00;
                  padding:20px;
                  text-align:center;
                  border-radius:6px;
                  margin-bottom:20px;
                ">
                  <p style="margin:0 0 6px;font-size:13px;color:#555;">
                    TRACKING CODE
                  </p>
                  <p style="
                    margin:0;
                    font-size:24px;
                    font-weight:bold;
                    letter-spacing:3px;
                    color:#d40511;
                  ">
                    ${trackingCode}
                  </p>
                </div>

                <!-- CTA BUTTON -->
                <div style="text-align:center;margin-bottom:30px;">
                  <a href="${trackingUrl}"
                    style="
                      display:inline-block;
                      background:#d40511;
                      color:#ffffff;
                      padding:14px 28px;
                      border-radius:6px;
                      font-size:14px;
                      font-weight:bold;
                      text-decoration:none;
                    ">
                    TRACK YOUR SHIPMENT
                  </a>
                </div>

                <p style="font-size:14px;margin:0;">
                  Thank you for choosing <strong>Global Delivery</strong>.
                  We are committed to fast and reliable delivery services.
                </p>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#f3f4f6;padding:15px;text-align:center;
                font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0;font-size:12px;color:#666;">
                  © ${new Date().getFullYear()} DHL Delivery. All rights reserved.
                </p>
                <p style="margin:5px 0 0;font-size:12px;color:#666;">
                  This is an automated email. Please do not reply.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}
