"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import { fetchNotifications } from "@/utils/api";
import type { Notification } from "@/utils/api";
import { Log } from "@/utils/logger";

const TYPE_COLORS: Record<string, { border: string; bg: string; text: string }> = {
    Placement: { border: "#1D9E75", bg: "#E1F5EE", text: "#0F6E56" },
    Result: { border: "#EF9F27", bg: "#FAEEDA", text: "#854F0B" },
    Event: { border: "#378ADD", bg: "#E6F1FB", text: "#185FA5" },
};

const WEIGHT: Record<string, number> = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

function getPriority(notifications: Notification[], topN: number): Notification[] {
    return [...notifications]
        .sort((a, b) => {
            const w = (WEIGHT[b.Type] ?? 0) - (WEIGHT[a.Type] ?? 0);
            if (w !== 0) return w;
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        })
        .slice(0, topN);
}

export default function PriorityPage() {
    const [all, setAll] = useState<Notification[]>([]);
    const [topN, setTopN] = useState(10);
    const [loading, setLoading] = useState(true);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const router = useRouter();

    useEffect(() => {
        Log("frontend", "info", "page", "Priority Inbox page loaded");
        fetchNotifications().then((data) => {
            setAll(data);
            setLoading(false);
            Log("frontend", "info", "page", `Loaded ${data.length} notifications`);
        });
    }, []);

    const prioritized = getPriority(all, topN);

    function markRead(id: string) {
        setReadIds((prev) => new Set([...prev, id]));
        Log("frontend", "info", "component", `Notification ${id} marked as read`);
    }

    return (
        <>
            <AppBar
                position="static"
                elevation={0}
                sx={{ backgroundColor: "#1a1a2e", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
                <Toolbar>
                    <StarIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontSize: "16px", fontWeight: 500 }}>
                        Priority Inbox
                    </Typography>
                    <Button
                        color="inherit"
                        size="small"
                        startIcon={<NotificationsIcon />}
                        onClick={() => router.push("/")}
                        sx={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "8px", px: 2 }}
                    >
                        All Notifications
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ backgroundColor: "#f5f5f7", minHeight: "100vh", pb: 4 }}>
                <Container maxWidth="md" sx={{ pt: 3 }}>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 500 }}>
                            Priority Notifications
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sorted by importance: Placement → Result → Event
                        </Typography>
                    </Box>

                    {/* Priority Legend */}
                    <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                        {Object.entries(TYPE_COLORS).map(([type, c]) => (
                            <Box
                                key={type}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "999px",
                                    backgroundColor: c.bg,
                                    fontSize: "12px",
                                    color: c.text,
                                    fontWeight: 500,
                                    border: `0.5px solid ${c.border}`,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        backgroundColor: c.border,
                                    }}
                                />
                                {type} — Priority {WEIGHT[type]}
                            </Box>
                        ))}
                    </Box>

                    {/* Top N Control */}
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            border: "0.5px solid #e0e0e0",
                            borderRadius: "12px",
                            p: 2,
                            mb: 2.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Typography sx={{ fontSize: "13px", color: "#666" }}>
                            Show top
                        </Typography>
                        <TextField
                            type="number"
                            value={topN}
                            onChange={(e) => {
                                const val = Math.max(1, Math.min(50, Number(e.target.value)));
                                setTopN(val);
                                Log("frontend", "debug", "component", `Top N changed to ${val}`);
                            }}
                            slotProps={{ htmlInput: { min: 1, max: 50 } }}
                            size="small"
                            sx={{ width: "80px" }}
                        />
                        <Typography sx={{ fontSize: "13px", color: "#666" }}>
                            notifications
                        </Typography>
                        <Box sx={{ ml: "auto" }}>
                            <Chip
                                label={`${prioritized.length} shown`}
                                size="small"
                                sx={{ backgroundColor: "#1a1a2e", color: "#fff", fontSize: "12px" }}
                            />
                        </Box>
                    </Box>

                    {/* Notifications */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : prioritized.length === 0 ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center", pt: 6 }}>
                            No notifications found.
                        </Typography>
                    ) : (
                        prioritized.map((n, index) => {
                            const colors = TYPE_COLORS[n.Type] ?? TYPE_COLORS.Event;
                            const isRead = readIds.has(n.ID);
                            return (
                                <Card
                                    key={n.ID}
                                    onClick={() => markRead(n.ID)}
                                    elevation={0}
                                    sx={{
                                        mb: 1.25,
                                        cursor: "pointer",
                                        opacity: isRead ? 0.5 : 1,
                                        borderRadius: "12px",
                                        border: "0.5px solid #e0e0e0",
                                        borderLeft: isRead
                                            ? "3px solid #ccc"
                                            : `3px solid ${colors.border}`,
                                        transition: "opacity 0.2s",
                                        "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
                                    }}
                                >
                                    <CardContent sx={{ py: "12px !important", px: 2 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                gap: 1,
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: "50%",
                                                        backgroundColor: colors.bg,
                                                        color: colors.text,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "11px",
                                                        fontWeight: 500,
                                                        flexShrink: 0,
                                                        mt: 0.25,
                                                    }}
                                                >
                                                    {index + 1}
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                                                        {n.Message}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "11px", color: "#999", mt: 0.5 }}>
                                                        {new Date(n.Timestamp).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", gap: 0.75, flexShrink: 0, alignItems: "center" }}>
                                                <Chip
                                                    label={n.Type}
                                                    size="small"
                                                    sx={{
                                                        fontSize: "11px",
                                                        height: "22px",
                                                        backgroundColor: colors.bg,
                                                        color: colors.text,
                                                        fontWeight: 500,
                                                    }}
                                                />
                                                {isRead ? (
                                                    <Chip
                                                        label="Read"
                                                        size="small"
                                                        sx={{ fontSize: "11px", height: "22px" }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="NEW"
                                                        size="small"
                                                        sx={{
                                                            fontSize: "11px",
                                                            height: "22px",
                                                            backgroundColor: "#FCEBEB",
                                                            color: "#A32D2D",
                                                            fontWeight: 500,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </Container>
            </Box>
        </>
    );
}