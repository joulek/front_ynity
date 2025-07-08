// src/pages/Course.jsx   (⚠️ un seul composant pour “tous” ou “par matière”)
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams }        from "react-router-dom";

function Course() {
  /* ░░ State principal ░░ */
  const [courses,         setCourses]     = useState([]);
  const [filteredCourses, setFiltered]    = useState([]);

  /* ░░ Filtres ░░ */
  const [searchTitle,     setSearchTitle] = useState("");
  const [onlySummary,     setOnlySummary] = useState(false);
  const [sortOrder,       setSortOrder]   = useState("desc");

  /* ░░ Édition / actions ░░ */
  const [editCourse, setEditCourse] = useState(null);
  const [newTitle,   setNewTitle]   = useState("");
  const [newFile,    setNewFile]    = useState(null);
  const [loadingId,  setLoadingId]  = useState(null);
  const [selected,   setSelected]   = useState([]);

  const navigate            = useNavigate();
  const { id: subjectId }   = useParams();      // ← undefined sur /courses , défini sur /subjects/:id/courses

  /* ---------------------------------------------------------------------- */
  /** Récupération des cours (tous OU par matière) */
  const fetchCourses = useCallback(async () => {
    const base = import.meta.env.VITE_BACKEND_URL;
    const url  = subjectId
      ? `${base}/api/course/by-subject/${subjectId}`
      : `${base}/api/course/my`;

    try {
      const res  = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setCourses(data);
      setFiltered(data);                     // => liste affichée
    } catch (e) {
      console.error("Erreur récupération cours :", e);
    }
  }, [subjectId]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  /* ---------------------------------------------------------------------- */
  /** Filtres dynamiques */
  useEffect(() => {
    let list = [...courses];
    if (searchTitle)  list = list.filter(c =>
      c.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    if (onlySummary)  list = list.filter(c => c.summary);
    list.sort((a,b)=>{
      const dA = new Date(a.createdAt);
      const dB = new Date(b.createdAt);
      return sortOrder === "asc" ? dA - dB : dB - dA;
    });
    setFiltered(list);
  }, [searchTitle, onlySummary, sortOrder, courses]);

  /* ---------------------------------------------------------------------- */
  /** Helpers – mêmes appels réseau qu’avant, puis refresh()            */
  const refresh = () => fetchCourses();

  const api = import.meta.env.VITE_BACKEND_URL;   // racine
  const call = (path, options={}) =>
    fetch(`${api}${path}`, { credentials:"include", ...options });

  const handleDelete = async id => {
    if (!confirm("❗ Supprimer ?")) return;
    await call(`/api/course/delete/${id}`, { method:"DELETE" });
    refresh();
  };

  const handleGenerateFlashcards = async id => {
    setLoadingId(id);
    await call(`/api/flashcards/generate/${id}`, { method:"POST" });
    alert("✅ Flashcards générées !");
    setLoadingId(null);
  };

  const handleSummarize = async id => {
    setLoadingId(id);
    await call(`/api/course/summarize/${id}`, { method:"POST" });
    refresh();
    setLoadingId(null);
  };

  const handleDeleteSummary = async id => {
    if (!confirm("Supprimer le résumé ?")) return;
    await call(`/api/course/summary/${id}`, { method:"DELETE" });
    refresh();
  };

  const handleUpdate = async () => {
    if (!editCourse || !newTitle) return;
    const form = new FormData();
    form.append("title", newTitle);
    if (newFile) form.append("file", newFile);

    setLoadingId(editCourse._id);
    await call(`/api/course/update/${editCourse._id}`, { method:"PUT", body:form });
    refresh();
    setEditCourse(null);
    setLoadingId(null);
  };

  /* ---------------------------------------------------------------------- */
  const toggleSelect = c =>
    setSelected(prev =>
      prev.some(p=>p._id===c._id) ? prev.filter(p=>p._id!==c._id) : [...prev,c]
    );

  const planifier = () =>
    navigate("/planning", { state:{ selectedCourses:selected } });

  /* ---------------------------------------------------------------------- */
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {subjectId ? "📚 Cours de la matière" : "📚 Mes cours"}
      </h2>

      {/* 🔎 Filtres --------------------------------------------------------- */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          className="p-2 border rounded"
          placeholder="🔍 Rechercher par titre"
          value={searchTitle}
          onChange={e=>setSearchTitle(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlySummary}
            onChange={e=>setOnlySummary(e.target.checked)}
          /> 📄 Avec résumé
        </label>
        <select
          className="p-2 border rounded"
          value={sortOrder}
          onChange={e=>setSortOrder(e.target.value)}
        >
          <option value="desc">📅 Plus récent</option>
          <option value="asc">📅 Plus ancien</option>
        </select>
      </div>

      {/* liste ------------------------------------------------------------- */}
      {filteredCourses.length === 0 ? (
        <p className="text-center">Aucun cours trouvé.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map(c=>(
              <div key={c._id} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-xl font-semibold">{c.title}</h3>
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={selected.some(s=>s._id===c._id)}
                    onChange={()=>toggleSelect(c)}
                  />
                </div>

                <a
                  className="text-blue-600 underline"
                  href={`${api}/${c.file}`} target="_blank"
                >
                  📄 Voir fichier
                </a>

                {c.summary ? (
                  <>
                    <a
                      className="block text-green-600 underline mt-2"
                      href={`${api}/uploads/${c.summary}`} target="_blank"
                    >
                      📥 Résumé PDF
                    </a>
                    <div className="flex gap-3 text-sm mt-1">
                      <button className="text-red-600 hover:underline"
                              onClick={()=>handleDeleteSummary(c._id)}>
                        🗑 Supprimer
                      </button>
                      <button className="text-blue-600 hover:underline"
                              onClick={()=>handleSummarize(c._id)}
                              disabled={loadingId===c._id}>
                        ✏️ Re-générer
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    className="text-indigo-600 hover:underline text-sm mt-2"
                    onClick={()=>handleSummarize(c._id)}
                    disabled={loadingId===c._id}
                  >
                    📄 Résumer
                  </button>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  📅 {new Date(c.createdAt).toLocaleDateString()}
                </p>

                <div className="flex flex-wrap gap-2 text-sm mt-3">
                  <button className="text-yellow-600 hover:underline"
                          onClick={()=>{
                            setEditCourse(c);
                            setNewTitle(c.title);
                            setNewFile(null);
                          }}>
                    ✏️ Modifier
                  </button>
                  <button className="text-red-600 hover:underline"
                          onClick={()=>handleDelete(c._id)}>
                    🗑 Supprimer
                  </button>
                  <button className="text-green-600 hover:underline"
                          onClick={()=>navigate(`/flashcards/${c._id}`)}>
                    🧠 Flashcards
                  </button>
                  <button className="text-purple-600 hover:underline"
                          onClick={()=>handleGenerateFlashcards(c._id)}
                          disabled={loadingId===c._id}>
                    ⚡ Générer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selected.length>0 && (
            <div className="text-center mt-8">
              <button
                onClick={planifier}
                className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700"
              >
                🗓️ Planifier mes révisions ({selected.length})
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal d’édition très léger ---------------------------------------- */}
      {editCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Modifier le cours</h3>
            <input
              className="w-full p-2 border rounded"
              value={newTitle}
              onChange={e=>setNewTitle(e.target.value)}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e=>setNewFile(e.target.files[0])}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded"
                onClick={handleUpdate}
                disabled={loadingId===editCourse._id}
              >
                💾 Enregistrer
              </button>
              <button className="px-4 py-1 rounded border"
                      onClick={()=>setEditCourse(null)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Course;
