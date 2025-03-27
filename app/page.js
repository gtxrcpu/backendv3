"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaUserPlus } from "react-icons/fa";
import Navbar from "../components/Navbar";
import MobileMenu from "../components/MobileMenu";
import About from "../components/About";
import Skills from "../components/Skills";
import Project from "../components/Project";
import Contact from "../components/Contact";
import CareerSuggestionForm from "../components/CareerSuggestionForm";
import Comments from "../components/Comments";
import Rating from "../components/Rating";
import Chatbot from "../components/Chatbot";

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode) {
      setDarkMode(JSON.parse(storedMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen transition-colors duration-300`}
    >
      {/* Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <MobileMenu darkMode={darkMode} />

      {/* Home */}
      <motion.section
        id="home"
        className="h-screen flex flex-col justify-center items-center relative overflow-hidden px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 opacity-70"></div>
        <div className="relative z-10 flex flex-col text-center md:text-left items-center md:items-start w-full max-w-4xl">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Hi, I'm <span className="text-blue-400">Bentar</span>.
          </motion.h1>
          <motion.h2
            className="text-2xl md:text-3xl font-medium text-gray-300 mt-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            Freelance Web Developer
          </motion.h2>

          <p className="text-lg md:text-xl text-gray-200 max-w-xl mt-4">
            I specialize in building modern web applications with clean design,
            great performance, and an amazing user experience.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            <a
              href="#contact"
              className="flex items-center bg-blue-500 text-white font-semibold py-3 px-6 rounded-md shadow-lg hover:scale-105 transition duration-300"
            >
              <FaUserPlus className="mr-2" /> Hire Me
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-md shadow-lg hover:scale-105 transition duration-300"
            >
              Download CV
            </a>
            <a
              href="https://github.com/gtxrcpu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-gray-800 text-white rounded-full hover:scale-110 transition duration-300"
            >
              <FaGithub size={30} />
            </a>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <About darkMode={darkMode} />

      {/* Skills Section */}
      <Skills darkMode={darkMode} />

      {/* Project Section */}
      <Project darkMode={darkMode} />

      {/* Contact + Career Suggestion */}
      <section id="contact">
        <Contact darkMode={darkMode} />
        <CareerSuggestionForm darkMode={darkMode} />
      </section>

      {/* Comments */}
      <Comments darkMode={darkMode} />

      {/* Rating */}
      <Rating darkMode={darkMode} />

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}
