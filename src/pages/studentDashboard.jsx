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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {subjects.map((subject) => {
        const hasQuiz = quizData[subject.key]?.length > 0;

        return (
          <div
            key={subject.id}
            className="bg-white rounded-lg border shadow-sm flex flex-col"
          >
            <div
              className={`${subject.color} p-4 text-white h-24 rounded-t-lg`}
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{subject.title}</h2>
                  <p className="text-sm">{subject.section}</p>
                </div>
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === subject.id ? null : subject.id)
                  }
                >
                  <MoreVertical />
                </button>
              </div>

              {openMenuId === subject.id && (
                <div className="absolute bg-white shadow rounded mt-2 right-4 z-10">
                  <button
                    onClick={() =>
                      navigate("/result", {
                        state: {
                          subjectKey: subject.key,
                          subjectName: subject.title,
                        },
                      })
                    }
                    className="px-4 py-2 w-full flex gap-2 hover:bg-gray-100"
                  >
                    <BarChart2 size={16} /> View Grades
                  </button>
                  <button
                    onClick={() => handleUnenroll(subject.id)}
                    className="px-4 py-2 w-full flex gap-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Unenroll
                  </button>
                </div>
              )}
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
    </div>
  );
}
