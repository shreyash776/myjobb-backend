import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text, Img } from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  logoUrl: string;
}

const WelcomeEmail = ({ name, logoUrl }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to MyJobb!</Preview>
    <Body style={{ background: "#f4f4f7", fontFamily: "Arial, sans-serif" }}>
      <Container
        style={{
          background: "#fff",
          margin: "40px auto",
          padding: "32px",
          maxWidth: "480px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
       
        <Img
          src={logoUrl}
          alt="MyJobb Logo"
          width={200}
          height={60}
          style={{ display: "block", margin: "0 auto", marginBottom: "24px" }}
        />
        <Section>
          <Text style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2563eb" }}>
            Welcome to MyJobb, {name}!
          </Text>
          <Text style={{ fontSize: "16px", marginBottom: "16px" }}>
            Your account has been successfully verified. We’re excited to have you on board!
          </Text>
          <Text style={{ fontSize: "16px", marginBottom: "24px" }}>
            You can now log in and start exploring new opportunities tailored just for you.
          </Text>
          <Text style={{ fontSize: "14px", color: "#555" }}>
            If you have any questions or need assistance, feel free to reply to this email.
          </Text>
        </Section>
        <Section>
          <Text style={{ fontSize: "14px", color: "#aaa", marginTop: "32px", textAlign: "center" }}>
            &copy; {new Date().getFullYear()} MyJobb. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;
