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
import CircularProgress from "@mui/material/CircularProgress";
import StarIcon from "@mui/icons-material/Star";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { fetchNotifications } from "@/utils/api";
import type { Notification } from "@/utils/api";
import { Log } from "@/utils/logger";

const TYPE_COLORS: Record<string, { border: string; bg: string; text: string; chipColor: "success" | "warning" | "info" }> = {
  Placement: { border: "#1D9E75", bg: "#E1F5EE", text: "#0F6E56", chipColor: "success" },
  Result: { border: "#EF9F27", bg: "#FAEEDA", text: "#854F0B", chipColor: "warning" },
  Event: { border: "#378ADD", bg: "#E6F1FB", text: "#185FA5", chipColor: "info" },
};

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page loaded");
    loadNotifications();
  }, [filter]);

  async function loadNotifications() {
    setLoading(true);
    const params = filter !== "all" ? { notification_type: filter } : {};
    const data = await fetchNotifications(params);
    setNotifications(data);
    setLoading(false);
  }

  function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
    Log("frontend", "info", "component", `Notification ${id} marked as read`);
  }

  const filters = ["all", "Placement", "Result", "Event"];

  const counts = {
    Placement: notifications.filter((n) => n.Type === "Placement").length,
    Result: notifications.filter((n) => n.Type === "Result").length,
    Event: notifications.filter((n) => n.Type === "Event").length,
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "#1a1a2e", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: "16px", fontWeight: 500 }}>
            Campus Notifications
          </Typography>
          <Button
            color="inherit"
            size="small"
            startIcon={<StarIcon />}
            onClick={() => router.push("/priority")}
            sx={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "8px", px: 2 }}
          >
            Priority Inbox
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: "#f5f5f7", minHeight: "100vh", pb: 4 }}>
        <Container maxWidth="md" sx={{ pt: 3 }}>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              All Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click a notification to mark it as read
            </Typography>
          </Box>

          {/* Stats Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5, mb: 2.5 }}>
            {Object.entries(counts).map(([type, count]) => (
              <Box
                key={type}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  p: 1.5,
                  textAlign: "center",
                  border: "0.5px solid #e0e0e0",
                }}
              >
                <Typography
                  sx={{ fontSize: "22px", fontWeight: 500, color: TYPE_COLORS[type].border }}
                >
                  {count}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: "#888" }}>{type}</Typography>
              </Box>
            ))}
          </Box>

          {/* Filter Pills */}
          <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
            {filters.map((f) => (
              <Box
                key={f}
                onClick={() => setFilter(f)}
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: "999px",
                  border: "0.5px solid",
                  borderColor: filter === f ? "#1a1a2e" : "#ccc",
                  backgroundColor: filter === f ? "#1a1a2e" : "#fff",
                  color: filter === f ? "#fff" : "#666",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontWeight: filter === f ? 500 : 400,
                }}
              >
                {f === "all" ? "All" : f}
              </Box>
            ))}
          </Box>

          {/* Notifications */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: "center", pt: 6 }}>
              No notifications found.
            </Typography>
          ) : (
            notifications.map((n) => {
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
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                          {n.Message}
                        </Typography>
                        <Typography sx={{ fontSize: "11px", color: "#999", mt: 0.5 }}>
                          {new Date(n.Timestamp).toLocaleString()}
                        </Typography>
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