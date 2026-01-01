import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StorageDebug() {
  const [data, setData] = useState({});
  const [running, setRunning] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    const keys = ["currentUser", "results", "released", "quizTakenBySubject"];
    const out = {};
    keys.forEach(k => {
      try { out[k] = JSON.parse(localStorage.getItem(k)); } catch { out[k] = localStorage.getItem(k); }
    });
    setData(out);
  };

  useEffect(() => { load(); }, []);

  const recompute = async () => {
    if (running) return;
    setRunning(true);
    const subjects = ["astronomy","earth-science","honors-earth-science"];
    const quizData = {};
    for (const s of subjects) {
      try { const r = await fetch(`/questions/${s}.json`); quizData[s]=await r.json(); } catch { quizData[s]=[]; }
    }

    const results = JSON.parse(localStorage.getItem('results')||'{}');
    Object.keys(results||{}).forEach(sub=>{
      const qs = quizData[sub]||[];
      results[sub] = (results[sub]||[]).map(r=>{
        const score = qs.reduce((acc,q)=>{
          const a = r.answers?.[q.id];
          if (a===undefined||a===null) return acc;
          const idx = (typeof a==='number')?Number(a):q.options.indexOf(a);
          return acc + (idx===Number(q.answer)?1:0);
        },0);
        return {...r, score, totalQuestions: qs.length||0};
      });
    });
    localStorage.setItem('results', JSON.stringify(results));
    load();
    setRunning(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="px-3 py-2 bg-gray-200 rounded">Back</button>
        <button onClick={recompute} disabled={running} className="px-3 py-2 bg-blue-600 text-white rounded">
          {running ? 'Recomputing...' : 'Recompute Scores'}
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4">Local Storage Debug</h2>
      <pre className="bg-white p-4 rounded border overflow-auto" style={{maxHeight: '60vh'}}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
