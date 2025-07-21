import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
} from '@react-email/components';

const OtpEmail = (props) => {
    const { otp, expiryMinutes = "10" } = props;

    return (
        <Html lang="en" dir="ltr">
            <Head />
            <Preview>Your verification code: {otp}</Preview>
            <Tailwind>
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto p-[40px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                                Verification Code
                            </Heading>
                            <Text className="text-[16px] text-gray-600 m-0">
                                Please use the following code to complete your verification
                            </Text>
                        </Section>

                        {/* OTP Code */}
                        <Section className="text-center mb-[32px]">
                            <div className="bg-gray-50 border-[2px] border-dashed border-gray-300 rounded-[12px] p-[32px] mb-[16px]">
                                <Text className="text-[36px] font-bold text-gray-900 m-0 letter-spacing-[8px] font-mono">
                                    {otp}
                                </Text>
                            </div>
                            <Text className="text-[14px] text-gray-500 m-0">
                                This code will expire in {expiryMinutes} minutes
                            </Text>
                        </Section>

                        {/* Instructions */}
                        <Section className="mb-[32px]">
                            <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                                Enter this code in the verification field to complete your request. If you didn't request this code, please ignore this email.
                            </Text>
                            <Text className="text-[14px] text-gray-600 m-0">
                                For your security, never share this code with anyone.
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-[32px]" />

                        {/* Footer */}
                        <Section className="text-center">
                            <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                                This is an automated message, please do not reply to this email.
                            </Text>
                            <Text className="text-[12px] text-gray-500 m-0">
                                © {new Date().getFullYear()} Your Company Name. All rights reserved.
                            </Text>
                            <Text className="text-[12px] text-gray-500 m-0 mt-[8px]">
                                123 Business Street, City, State 12345
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

OtpEmail.PreviewProps = {
    otp: "123456",
    expiryMinutes: "10",
};

export default OtpEmail;
