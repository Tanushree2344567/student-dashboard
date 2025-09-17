"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

export default function Page() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "assessment_score", direction: "descending" });

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map((s) => ({
          ...s,
          assessment_score: Number(s.assessment_score),
          predicted_score: s.predicted_score !== undefined && s.predicted_score !== null ? Number(s.predicted_score) : 0,
          attention: Number(s.attention),
          focus: Number(s.focus),
          retention: Number(s.retention),
          engagement_time: Number(s.engagement_time),
          comprehension: Number(s.comprehension),
        }));
        console.log("Fetched students:", parsed);
        setStudents(parsed);
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // Filter by search
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort by sortConfig
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  // Toggle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Cluster counts for insights
  const clusterCounts = sortedStudents.reduce((acc, s) => {
    acc[s.cluster_name] = (acc[s.cluster_name] || 0) + 1;
    return acc;
  }, {});

  // Color mapping for clusters
  const clusterColors = {
    "High Performer": "#10b981",
    "Moderate Performer": "#f59e0b",
    "Needs Improvement": "#ef4444",
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by student name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-2 py-1 mb-4"
      />

      {/* Table */}
      <table className="table-auto border-collapse border border-gray-400 w-full mb-10">
        <thead>
          <tr>
            <th
              className="border border-gray-400 px-4 py-2 cursor-pointer"
              onClick={() => requestSort("name")}
            >
              Name {sortConfig.key === "name" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
            </th>
            <th
              className="border border-gray-400 px-4 py-2 cursor-pointer"
              onClick={() => requestSort("assessment_score")}
            >
              Score {sortConfig.key === "assessment_score" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
            </th>
            <th
              className="border border-gray-400 px-4 py-2 cursor-pointer"
              onClick={() => requestSort("predicted_score")}
            >
              Predicted Score {sortConfig.key === "predicted_score" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
            </th>
            <th
              className="border border-gray-400 px-4 py-2 cursor-pointer"
              onClick={() => requestSort("cluster_name")}
            >
              Learning Persona {sortConfig.key === "cluster_name" ? (sortConfig.direction === "ascending" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((s) => (
            <tr key={s.student_id} style={{ backgroundColor: clusterColors[s.cluster_name] + "20" }}>
              <td className="border border-gray-400 px-4 py-2">{s.name}</td>
              <td className="border border-gray-400 px-4 py-2">{s.assessment_score}</td>
              <td className="border border-gray-400 px-4 py-2">{s.predicted_score.toFixed(2)}</td>
              <td className="border border-gray-400 px-4 py-2">{s.cluster_name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bar Chart: Actual vs Predicted Scores */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Actual vs Predicted Scores</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedStudents}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="assessment_score" fill="#8884d8" name="Actual Score" />
            <Bar dataKey="predicted_score" fill="#82ca9d" name="Predicted Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter Chart */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Attention vs Actual Score</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="attention" name="Attention" />
            <YAxis dataKey="assessment_score" name="Actual Score" />
            <ZAxis range={[60, 400]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="Students" data={sortedStudents} fill="#10b981" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Student Profile (1st Student)</h2>
        {sortedStudents.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="80%"
              data={[
                { skill: "Comprehension", value: sortedStudents[0].comprehension },
                { skill: "Attention", value: sortedStudents[0].attention },
                { skill: "Focus", value: sortedStudents[0].focus },
                { skill: "Retention", value: sortedStudents[0].retention },
                { skill: "Engagement", value: sortedStudents[0].engagement_time },
              ]}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis />
              <Radar
                name="Skill Profile"
                dataKey="value"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Cluster Bar Chart */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Learning Persona Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={Object.entries(clusterCounts).map(([name, count]) => ({ name, count }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>
        {sortedStudents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg shadow">
              <h3 className="font-bold">Average Actual Score</h3>
              <p className="text-2xl">
                {(
                  sortedStudents.reduce((acc, s) => acc + s.assessment_score, 0) /
                  sortedStudents.length
                ).toFixed(2)}
              </p>
            </div>
            <div className="p-4 border rounded-lg shadow">
              <h3 className="font-bold">Average Predicted Score</h3>
              <p className="text-2xl">
                {(
                  sortedStudents.reduce((acc, s) => acc + s.predicted_score, 0) /
                  sortedStudents.length
                ).toFixed(2)}
              </p>
            </div>
            <div className="p-4 border rounded-lg shadow">
              <h3 className="font-bold">Top Predicted Student</h3>
              <p>
                {sortedStudents.reduce((prev, curr) =>
                  prev.predicted_score > curr.predicted_score ? prev : curr
                ).name}
              </p>
            </div>
            <div className="p-4 border rounded-lg shadow">
              <h3 className="font-bold">Lowest Predicted Student</h3>
              <p>
                {sortedStudents.reduce((prev, curr) =>
                  prev.predicted_score < curr.predicted_score ? prev : curr
                ).name}
              </p>
            </div>
            <div className="p-4 border rounded-lg shadow">
              <h3 className="font-bold">Learning Persona Counts</h3>
              {Object.entries(clusterCounts).map(([name, count]) => (
                <p key={name}>{name}: {count}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
