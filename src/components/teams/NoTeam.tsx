import React from "react";
import Layout from "../layout";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import router from "next/router";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const NoTeam = () => {
  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-600">
            Create a team to collaborate with others on forms and manage
            permissions.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-8 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserGroupIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No teams found</h3>
          <p className="text-gray-500 mb-6">
            You don't have any teams yet. Create your first team to start
            collaborating with others.
          </p>
          <button
            onClick={() => router.push("/team/create")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium"
          >
            Create Your First Team
          </button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NoTeam;
