import React, { useEffect, useState } from "react";
import { Users, TrendingUp } from "lucide-react";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  //  Full FC Barcelona Squad (2025)
  const playersData = [
    // --- Goalkeepers ---
    {
      id: 1,
      name: "Marc-André ter Stegen",
      position: "Goalkeeper",
      jersey_number: 1,
      age: 32,
      market_value: "€20M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/1b765077-cfc5-4e66-8169-4e45f6ec7392/01-Ter_Stegen.jpg?width=940&height=940",
    },
    {
      id: 2,
      name: "Joan GARCIA",
      position: "Goalkeeper",
      jersey_number: 13,
      age: 25,
      market_value: "€6M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/2b12f57a-582e-408a-b23e-ec9c42b0d5b9/01-Joan_Garcia.jpg?width=940&height=940",
    },

    // --- Defenders ---
    {
      id: 3,
      name: "Ronald Araújo",
      position: "Defender",
      jersey_number: 4,
      age: 25,
      market_value: "€90M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/46af26e5-df57-406a-9bb1-b6f037631f0f/04-Araujo.jpg?width=940&height=940",
    },
    {
      id: 4,
      name: "Jules Koundé",
      position: "Defender",
      jersey_number: 23,
      age: 26,
      market_value: "€60M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/e25e8ccc-4b69-48ef-8c48-2eebbcc74770/23-Kounde.jpg?width=940&height=940",
    },
    {
      id: 5,
      name: "Pau Cubarsí",
      position: "Defender",
      jersey_number: 2,
      age: 17,
      market_value: "€50M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/2ca1e448-3d31-4ff2-9909-44fd00368472/02-Cubarsi.jpg?width=940&height=940",
    },
    {
      id: 6,
      name: "Alejandro Balde",
      position: "Defender",
      jersey_number: 3,
      age: 21,
      market_value: "€70M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/82dfc9f5-ffc4-4b47-a828-21de924f9b5f/03-Balde.jpg?width=940&height=940",
    },
    {
      id: 7,
      name: "Andreas Christensen",
      position: "Defender",
      jersey_number: 15,
      age: 28,
      market_value: "€40M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/11a6228b-5034-4d25-9fe3-ea3aafd04dd2/15-Christensen.jpg?width=940&height=940",
    },
    {
      id: 8,
      name: "Eric Garcia",
      position: "Defender",
      jersey_number: 32,
      age: 18,
      market_value: "€10M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/ab15b5c3-c764-40f7-983c-0fbd0ccd61bd/24-Eric_Garcia.jpg?width=940&height=940",
    },

    // --- Midfielders ---
    {
      id: 9,
      name: "Frenkie de Jong",
      position: "Midfielder",
      jersey_number: 21,
      age: 27,
      market_value: "€90M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/793001b1-f225-4259-8a74-27e418a3e4c9/21-De_Jong.jpg?width=940&height=940",
    },
    {
      id: 10,
      name: "Pedri",
      position: "Midfielder",
      jersey_number: 8,
      age: 21,
      market_value: "€100M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/10/597a1e13-c0b2-4c93-a2fd-4cc39a9459cc/08-Pedri.jpg?width=940&height=940",
    },
    {
      id: 11,
      name: "Gavi",
      position: "Midfielder",
      jersey_number: 6,
      age: 20,
      market_value: "€90M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/21356702-1d94-49a8-a94a-4170afe7ca16/06-Gavi.jpg?width=940&height=940",
    },
    {
      id: 12,
      name: "Fermin Lopez",
      position: "Midfielder",
      jersey_number: 16,
      age: 34,
      market_value: "€15M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/4e851606-cfd6-4dc4-9042-c3dee40dbeb7/16-Fermin.jpg?width=940&height=940",
    },
    {
      id: 13,
      name: "Marc Casado",
      position: "Midfielder",
      jersey_number: 17,
      age: 21,
      market_value: "€25M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/aee1292c-f40e-46e9-8b45-c19646ad3a04/17-Casado.jpg?width=940&height=940",
    },
    {
      id: 14,
      name: "Dani Olmo",
      position: "Midfielder",
      jersey_number: 20,
      age: 33,
      market_value: "€24M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/79af1dbc-34f3-4bb7-9ee4-08269866ab47/20-Olmo.jpg?width=940&height=940",
    },

    // --- Forwards ---
    {
      id: 15,
      name: "Robert Lewandowski",
      position: "Forward",
      jersey_number: 9,
      age: 36,
      market_value: "€15M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/10/6dd5aa47-d5fb-45a5-b171-0da82c9c7105/09-Lewandowski.jpg?width=940&height=940",
    },
    {
      id: 16,
      name: "Lamine Yamal",
      position: "Forward",
      jersey_number: 10,
      age: 17,
      market_value: "€120M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/a9ecee2c-116c-405c-8524-3127913e7a3c/10-Lamine.jpg?width=940&height=940",
    },
    {
      id: 17,
      name: "Raphinha",
      position: "Forward",
      jersey_number: 11,
      age: 28,
      market_value: "€60M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/10/08bbb1ff-004b-4623-a675-66fd1fbfdc8b/11-Raphinha.jpg?width=940&height=940",
    },
    {
      id: 18,
      name: "Ferran Torres",
      position: "Forward",
      jersey_number: 7,
      age: 25,
      market_value: "€30M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/c83c3cf6-9c12-41c4-b6fa-ea4cfa2bf7dc/07-Ferran_Torres.jpg?width=940&height=940",
    },
    {
      id: 19,
      name: "Marcus Rashford",
      position: "Forward",
      jersey_number: 19,
      age: 20,
      market_value: "€40M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/10/85f7a271-6b29-4459-be8b-128cb25596d0/14-Rashford.jpg?width=940&height=940",
    },
    {
      id: 20,
      name: "Rooni Bhajhi",
      position: "Forward",
      jersey_number: 28,
      age: 22,
      market_value: "€25M",
      image:
        "https://www.fcbarcelona.com/photo-resources/2025/09/09/3ae86d91-e8c5-415e-9299-3b26ec0d2930/28-Bardghji.jpg?width=940&height=940",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setPlayers(playersData);
      setLoading(false);
    }, 400);
  }, []);

  const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];
  const filteredPlayers =
    filter === "All" ? players : players.filter((p) => p.position === filter);

  const getPositionColor = (position) => {
    switch (position) {
      case "Goalkeeper":
        return "bg-yellow-500";
      case "Defender":
        return "bg-blue-500";
      case "Midfielder":
        return "bg-green-500";
      case "Forward":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-shadow-blue-950 text-2xl font-semibold">Loading players...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-indigo-950 mb-3">
            FC Barcelona Squad 2025
          </h1>
          <hr className="font-bold"/>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setFilter(pos)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                filter === pos
                  ? "bg-blue-950 text-white"
                  : "bg-white/100 text-blue hover:bg-white/20"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Player Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="relative group bg-white/10 rounded-1xl overflow-hidden shadow-xl transition-all duration-500 hover:bg-white hover:scale-100"
              style={{ height: "480px" }}
            >
              {/* Image */}
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-4/5 object-cover transition-all duration-500 group-hover:opacity-85"
              />

              {/* Name + Position */}
              <div className="absolute bottom-5 left-0 right-0 text-center text-purple-950 group-hover:text-blue-900 transition-all duration-500">
                <h3 className="text-2xl font-bold">{player.name}</h3>
                <p
                  className={`mt-1 inline-block px-4 py-1 text-sm rounded-full ${getPositionColor(
                    player.position
                  )}`}
                >
                  {player.position}
                </p>
              </div>

              {/* Hover Details */}
              <div className="absolute bottom-[-100%] left-0 right-0 bg-white/100 text-blue-900 text-center p-6 rounded-t-3xl transition-all duration-500 group-hover:bottom-0">
                <h3 className="text-2xl font-bold mb-1">{player.name}</h3>
                <p className="text-lg font-semibold mb-1">{player.position}</p>
                <p className="text-base mb-1">Age: {player.age}</p>
                <p className="text-base mb-1">Jersey: #{player.jersey_number}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold text-lg">
                    {player.market_value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Players */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 px-8 py-5 rounded-full">
            <Users className="w-7 h-7 text-white" />
            <span className="text-white font-semibold text-lg">
              Total Players: {filteredPlayers.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}