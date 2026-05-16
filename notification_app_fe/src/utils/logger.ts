const BASE_URL = "http://4.224.186.213/evaluation-service";

// Your token from registration (image 9)
let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNTc0MzQ0LCJpYXQiOjE3NDM1NzQwNDQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImQ5Y2JiNjk5LTZhMjctNDRhNS04ZDU5LThiMWJlZmE4MTZkYSIsInN1YiI6InJhbWtyaXNobmFAYWJjLmVkdSJ9LCJlbWFpbCI6InJhbWtyaXNobmFAYWJjLmVkdSIsIm5hbWUiOiJyYW0ga3Jpc2huYSIsInJvbGxObyI6ImFhMWJiIiwiY2xpZW50SUQiOiJkOWNiYjY5OS02YTI3LTQ0YTUtOGQ1OS04YjFiZWZhODE2ZGEifQ.muUfK1m4hLTm7AIcLDcLAzVg";

export async function initLogger(token: string) {
    authToken = token;
}

export async function Log(
    stack: "frontend" | "backend",
    level: "debug" | "info" | "warn" | "error" | "fatal",
    package_name: string,
    message: string
): Promise<void> {
    if (!authToken) return;
    try {
        await fetch(`${BASE_URL}/logs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                stack,
                level,
                package: package_name,
                message,
            }),
        });
    } catch (err) {
        console.error("Log failed:", err);
    }
}