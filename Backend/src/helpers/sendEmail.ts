import SibApiV3Sdk from 'sib-api-v3-sdk';


/**
 * Helper function responsible for sending invite links from organisations
 * @param email Email of the person to be invited
 * @param orgName Name of the organisation
 */

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

const sendEmail = async (mailOptions) => {

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = {
      email: "support@blockfundz.com",
      name: "BlockFundz"
    }

    try {
      const sent = await apiInstance.sendTransacEmail({
        subject: mailOptions.subject,
        htmlContent: mailOptions.htmlContent,
        sender,
        messageVersions: [
          {
            to: mailOptions.recipients
          }
        ]
      });
      
    } catch (error) {
      throw new Error("there was an error sending the mail", error.message)
    }
}

export default sendEmail;