"use client";

type Incident = {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  status: string;
};

export default function IncidentCard(incident: Incident) {
  return (
    <div className="p-2 flex flex-col gap-2 border border-zinc-800 rounded-lg">
      <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        {incident.title}
      </h1>
      <p>{incident.description}</p>
    </div>
  );
}
