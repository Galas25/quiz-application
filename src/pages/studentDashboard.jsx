import { useContext, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Folder,
  BookOpen,
  BarChart2,
  LogOut,
} from "lucide-react";

export default function StudentHome() {
  const { quizData } = useContext(QuizContext);
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      title: "Astronomy",
      key: "astronomy",
      section: "Block 1",
      color: "bg-purple-700",
    },
    {
      id: 2,
      title: "Earth Science",
      key: "earth-science",
      section: "Block 2",
      color: "bg-pink-600",
    },
    {
      id: 3,
      title: "Honors Earth Science",
      key: "honors-earth-science",
      section: "Block 3",
      color: "bg-teal-600",
    },
  ]);

  const handleUnenroll = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
      {subjects.map((subject) => {
        const hasQuiz = quizData[subject.key]?.length > 0;

        return (
          <div
            key={subject.id}
            className="relative bg-white rounded-lg border shadow-sm flex flex-col overflow-visible"
          >
            <div
              className={`${subject.color} p-4 text-white h-24 rounded-t-lg relative`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{subject.title}</h2>
                  <p className="text-sm">{subject.section}</p>
                </div>

                {/* Dropdown button */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === subject.id ? null : subject.id
                      )
                    }
                    className="p-1 hover:bg-white/20 rounded-full"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenuId === subject.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-100 z-30 py-1">
                      <button
                        onClick={() => {
                          navigate("/result", {
                            state: {
                              subjectKey: subject.key,
                              subjectName: subject.title,
                            },
                          });
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <BarChart2 size={16} /> View Grades
                      </button>
                      <button
                        onClick={() => handleUnenroll(subject.id)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Unenroll
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 flex-1">
              {hasQuiz ? (
                <button
                  onClick={() =>
                    navigate("/quiz", {
                      state: {
                        subjectKey: subject.key,
                        subjectName: subject.title,
                      },
                    })
                  }
                  className="flex items-center gap-2 text-blue-600"
                >
                  <BookOpen size={16} /> Start Module 1 Quiz
                </button>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No quiz available
                </p>
              )}
            </div>

            <div className="border-t p-3 flex justify-end">
              <button
                onClick={() =>
                  navigate("/result", {
                    state: {
                      subjectKey: subject.key,
                      subjectName: subject.title,
                    },
                  })
                }
              >
                <Folder />
              </button>
            </div>
          </div>
        );
      })}

      {/* Click outside dropdown to close */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
}
