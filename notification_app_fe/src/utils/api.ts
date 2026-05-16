const BASE_URL = "http://4.224.186.213/evaluation-service";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNTc0MzQ0LCJpYXQiOjE3NDM1NzQwNDQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImQ5Y2JiNjk5LTZhMjctNDRhNS04ZDU5LThiMWJlZmE4MTZkYSIsInN1YiI6InJhbWtyaXNobmFAYWJjLmVkdSJ9LCJlbWFpbCI6InJhbWtyaXNobmFAYWJjLmVkdSIsIm5hbWUiOiJyYW0ga3Jpc2huYSIsInJvbGxObyI6ImFhMWJiIiwiY2xpZW50SUQiOiJkOWNiYjY5OS02YTI3LTQ0YTUtOGQ1OS04YjFiZWZhODE2ZGEifQ.muUfK1m4hLTm7AIcLDcLAzVg";

export interface Notification {
    ID: string;
    Type: "Event" | "Result" | "Placement";
    Message: string;
    Timestamp: string;
    isRead?: boolean;
}

export async function fetchNotifications(params?: {
    limit?: number;
    page?: number;
    notification_type?: string;
}): Promise<Notification[]> {
    try {
        const query = new URLSearchParams();
        if (params?.limit) query.append("limit", String(params.limit));
        if (params?.page) query.append("page", String(params.page));
        if (params?.notification_type)
            query.append("notification_type", params.notification_type);

        const res = await fetch(
            `${BASE_URL}/notifications?${query.toString()}`,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );

        if (!res.ok) return [];

        const data = await res.json();
        return data.notifications;
    } catch (err) {
        return [];
    }
}