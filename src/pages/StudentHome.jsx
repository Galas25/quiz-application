// import { useContext, useState, useEffect } from "react";
// import { QuizContext } from "../context/QuizContext";
// import { useNavigate } from "react-router-dom";
//
// export default function StudentHome() {
//   const { setCurrentUser } = useContext(QuizContext);
//   const [name, setName] = useState("");
//   const navigate = useNavigate();
//
//   // Prevent retake if already submitted
//   useEffect(() => {
//     const savedUser = localStorage.getItem("currentUser");
//     const quizTaken = localStorage.getItem("quizTaken");
//     if (savedUser && quizTaken === "true") {
//       alert("You have already taken this quiz. Please wait for the instructor to release your score.");
//       navigate("/result");
//     }
//   }, [navigate]);
//
//   const startQuiz = () => {
//     if (!name.trim()) return alert("Please enter your name.");
//     const trimmedName = name.trim();
//     setCurrentUser(trimmedName);
//     localStorage.setItem("currentUser", trimmedName); // persist
//     navigate("/quiz");
//   };
//
//   return (
//     <div className="flex items-center justify-center min-h-screen w-full px-4 bg-gray-100">
//       <div className="text-center w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
//         <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to the Quiz App</h1>
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full px-4 py-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//         <button
//           className="px-6 py-3 text-lg bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full"
//           onClick={startQuiz}
//         >
//           Start Quiz
//         </button>
//       </div>
//     </div>
//   );
// }
