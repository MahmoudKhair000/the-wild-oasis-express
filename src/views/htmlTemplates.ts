export const mailHTML = (link: string): string => {
	return `
  <div style="background-color: #f9fafb; text-align: center; padding: 20px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
          background-color: #4338ca;
          color: #f9fafb;
          text-align: center;
          padding: 10px 0;
          max-width: 800px;
          margin: 0 auto;
        ">
      <tr>
        <td align="left" style="padding-left: 25px">
          <h1 style="margin: 0; font-size: 36px">The Wild Oasis</h1>
        </td>
        <td align="right" style="padding-right: 25px">
          <img src="https://17-the-wild-oasis-seven.vercel.app/logo-light.png" alt="Logo" height="80" style="
                border-radius: 10%;
                display: block;
                background-color: #f9fafb;
                padding: 10px;
              " />
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
          background-color: #f9fafb;
          color: #4338ca;
          margin: 0 auto;
          padding: 10px 0;
          border: 2px solid #4338ca;
          text-align: center;
          max-width: 800px;
        ">
      <tr>
        <td align="justify" style="padding-inline: 25px; text-align: center">
          <p style="font-size: x-large; margin-block: 50px; color: #374151">
            Click this button to confirm your email
          </p>
          <a target="_blank" href="${link}">
            <button style="
                  font-size: x-large;
                  background-color: #4338ca;
                  color: #f9fafb;
                  padding: 25px 40px;
                  border-radius: 10px;
                  border: none;
                  margin-bottom: 70px;
                  cursor: pointer;
                ">
              <strong>Verify your account</strong>
            </button>
          </a>
        </td>
      </tr>
    </table>
  </div>
  `;
};
