import React from "react";
import { Html, Head, Body, Container, Heading, Text, Button, Link, Img } from "@react-email/components";

const logoBase64 = "data:image/png;base64,..." // Replace with your base64 encoded string

const WelcomeEmail = ({ userName }: { userName: string }) => {
  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          {/* Logo Section */}
          <div style={logoContainerStyle}>
            <Img src={logoBase64} alt="NexGen Logo" style={logoStyle} />
            <p style={logoTextStyle}>Nex<span style={{ color: "orange" }}>Gen</span></p>
          </div>
          
          {/* Heading and Welcome Message */}
          <Heading style={headingStyle}>Welcome to NexGenCrypto!</Heading>
          <Text style={textStyle}>
            Hi {userName},
          </Text>
          <Text style={textStyle}>
            Thank you for joining <strong>NexGenCrypto</strong>, the most secure and user-friendly platform for crypto investments. We're thrilled to have you on board!
          </Text>
          <Text style={textStyle}>
            Start exploring your dashboard and make the most of your investment opportunities today.
          </Text>
          
          {/* Call-to-Action Button */}
          <Button style={buttonStyle} href="https://nexgencrypto.live/dashboard">
            Go to Your Dashboard
          </Button>
          
          {/* Support Information */}
          <Text style={textStyle}>
            If you have any questions, feel free to contact us at{" "}
            <Link href="mailto:support@nexgencrypto.live">support@nexgencrypto.live</Link>.
          </Text>
          
          {/* Footer */}
          <Text style={footerStyle}>
            Best regards,  
            <br />
            The NexGenCrypto Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const mainStyle = {
  backgroundColor: "#f4f4f4",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "8px",
  maxWidth: "600px",
  margin: "0 auto",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
};

const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
};

const logoStyle = {
  maxWidth: "50px", // Adjust size as needed
  height: "auto",
  marginRight: "10px",
};

const logoTextStyle = {
  fontSize: "30px",
  color: "#000",
  margin: 0,
};

const headingStyle = {
  fontSize: "24px",
  color: "#333333",
  marginBottom: "20px",
  textAlign: "center" as "center",
};

const textStyle = {
  fontSize: "16px",
  color: "#555555",
  lineHeight: "1.6",
  marginBottom: "20px",
};

const buttonStyle = {
  display: "inline-block",
  padding: "12px 20px",
  fontSize: "16px",
  backgroundColor: "#007bff",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "4px",
  margin: "20px 0",
  textAlign: "center" as "center",
};

const footerStyle = {
  fontSize: "14px",
  color: "#888888",
  marginTop: "20px",
  textAlign: "center" as "center",
};

export default WelcomeEmail;