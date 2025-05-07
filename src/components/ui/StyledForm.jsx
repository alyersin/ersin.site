import React from "react";

export default function Form() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="grid gap-8">
        <section
          id="back-div"
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl"
        >
          <div className="border-8 border-transparent rounded-xl bg-white dark:bg-gray-900 shadow-xl p-8 m-2">
            <h1 className="text-4xl font-bold text-center cursor-default dark:text-gray-300 text-gray-900 mb-6">
              Contact Me
            </h1>
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Enter your name"
                required
                className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
              />
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
              />
              <textarea
                placeholder="Enter your message"
                rows={5}
                required
                className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
              ></textarea>
              <button
                type="submit"
                disabled
                className="w-full p-3 mt-4 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
