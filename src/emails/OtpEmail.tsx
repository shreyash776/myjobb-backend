import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text } from "@react-email/components";
import { Img } from "@react-email/components";

interface OtpEmailProps {
  name: string;
  otp: string;
}

export default function OtpEmail({ name, otp }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Code</Preview>
      <Body style={{ background: "#f4f4f7", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ background: "#fff", margin: "40px auto", padding: "32px", maxWidth: "480px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <Img
    src="http://localhost:5000/images/logo.png"
    alt="Logo"
    width="200"
    height="60"
    style={{ display: "block", margin: "0 auto", marginBottom: "24px" }}
  />
         
          <Section>
            <Text style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Hello {name},</Text>
            <Text style={{ fontSize: "16px", marginBottom: "16px" }}>
              Here is your One-Time Password (OTP) for verification:
            </Text>
            <Text style={{ fontSize: "32px", fontWeight: "bold", color: "#2563eb", letterSpacing: "4px", marginBottom: "24px" }}>
              {otp}
            </Text>
            <Text style={{ fontSize: "14px", color: "#555" }}>
              This code will expire in 10 minutes.<br />
              If you did not request this, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
