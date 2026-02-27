import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "firebase/firestore";

import {
  Box,
  Typography,
  Card,
  CardContent
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

export default function Dashboard() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "analysis"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "asc")
      );

      const snap = await getDocs(q);

      setHistory(
        snap.docs.map(doc => doc.data())
      );
    };

    fetchData();

  }, []);

  if (!history.length)
    return <Typography>No data yet</Typography>;

  const latest = history[history.length - 1];

  const lineData = history.map((item, i) => ({
    name: `Test ${i + 1}`,
    score: item.score
  }));

  const pieData = [
    { name: "Stress", value: latest.inputs.DAILY_STRESS || 0 },
    { name: "Sleep", value: latest.inputs.SLEEP_HOURS || 0 },
    { name: "Social", value: latest.inputs.SOCIAL_NETWORK || 0 }
  ];

  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Typography variant="h3">
            {latest.score}%
          </Typography>

          <Typography>
            {latest.label}
          </Typography>

        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Typography>Score Trend</Typography>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="score"
                stroke="#6366f1"
              />
            </LineChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card>
        <CardContent>

          <Typography>Balance Factors</Typography>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>

    </Box>
  );
}