import { UserGroupIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { ChevronDownIcon, UserPlusIcon } from "lucide-react";
import router from "next/router";
import React from "react";

interface Props {
  setShowInviteModal: (value: boolean) => void;
  teamName: string;
  allTeams: any[];
  teamId: string;
  handleSwitchTeam: (value: string) => void;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TeamManagement({
  setShowInviteModal,
  teamId,
  teamName,
  allTeams,
  handleSwitchTeam,
}: Props) {
  return (
    <motion.div
      className="mb-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Team Management</h1>
            <div className="relative group">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                {teamName}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 hidden group-hover:block">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Your Teams
                  </div>
                  {allTeams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleSwitchTeam(team.id)}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        team.id === teamId
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {team.name}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => router.push("/dashboard/team/create")}
                    className="block w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50"
                  >
                    + Create New Team
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Manage your team members, roles, and permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard/team/create")}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium flex items-center"
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            New Team
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium flex items-center"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Invite Member
          </button>
        </div>
      </div>
    </motion.div>
  );
}
