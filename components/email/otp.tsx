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
import * as React from 'react';

const OtpEmail = (props: { otp: string; expiryMinutes?: string }) => {
    const { otp, expiryMinutes = '10' } = props;

    return (
        <Html lang="en" dir="ltr">
            <Head />
            <Preview>Your verification code: {otp}</Preview>
            <Tailwind>
                <Body className="bg-gray-100 py-[40px] font-sans">
                    <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-lg">
                        {/* Header */}
                        <Section className="mb-[32px] text-center">
                            <Heading className="m-0 mb-[8px] text-[28px] font-bold text-gray-900">
                                Verification Code
                            </Heading>
                            <Text className="m-0 text-[16px] text-gray-600">
                                Please use the following code to complete your verification
                            </Text>
                        </Section>

                        {/* OTP Code */}
                        <Section className="mb-[32px] text-center">
                            <div className="mb-[16px] rounded-[12px] border-[2px] border-dashed border-gray-300 bg-gray-50 p-[32px]">
                                <Text className="letter-spacing-[8px] m-0 font-mono text-[36px] font-bold text-gray-900">
                                    {otp}
                                </Text>
                            </div>
                            <Text className="m-0 text-[14px] text-gray-500">
                                This code will expire in {expiryMinutes} minutes
                            </Text>
                        </Section>

                        {/* Instructions */}
                        <Section className="mb-[32px]">
                            <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                                Enter this code in the verification field to complete your request.
                                If you didn&apos;t request this code, please ignore this email.
                            </Text>
                            <Text className="m-0 text-[14px] text-gray-600">
                                For your security, never share this code with anyone.
                            </Text>
                        </Section>

                        <Hr className="my-[32px] border-gray-200" />

                        {/* Footer */}
                        <Section className="text-center">
                            <Text className="m-0 mb-[8px] text-[12px] text-gray-500">
                                This is an automated message, please do not reply to this email.
                            </Text>
                            <Text className="m-0 text-[12px] text-gray-500">
                                © {new Date().getFullYear()} Your Company Name. All rights
                                reserved.
                            </Text>
                            <Text className="m-0 mt-[8px] text-[12px] text-gray-500">
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
    otp: '123456',
    expiryMinutes: '10',
};

export default OtpEmail;
