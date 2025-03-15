import {
  ArrowPathIcon,
  EnvelopeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Switch } from "antd";
import { motion } from "framer-motion";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from "lucide-react";
import React from "react";

interface Props {
  activeTab: string;
  teamMembers: any[];
  teamData: any;
  pendingInvites: any[];
  activityLogs: any[];
  teamName: string;
  teamDescription: string;
  teamSettings: any;
  savingSettings: boolean;
  handleChangeRole: (memberId: string, newRole: string) => void;
  handleDeleteMember: (memberId: string) => void;
  handleResendInvitation: (inviteId: string) => void;
  handleCancelInvitation: (inviteId: string) => void;
  setShowInviteModal: (value: boolean) => void;
  setTeamName: (value: string) => void;
  setTeamDescription: (value: string) => void;
  setTeamSettings: (value: any) => void;
  handleSaveSettings: () => void;
  handleDeleteTeam: () => void;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TeamMember = ({
  activeTab,
  teamMembers,
  teamData,
  pendingInvites,
  activityLogs,
  teamName,
  teamDescription,
  teamSettings,
  savingSettings,
  handleChangeRole,
  handleDeleteMember,
  handleResendInvitation,
  handleCancelInvitation,
  setShowInviteModal,
  setTeamName,
  setTeamDescription,
  setTeamSettings,
  handleSaveSettings,
  handleDeleteTeam,
}: Props) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Team Members Tab */}
      {activeTab === "members" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Active
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          <img
                            src={
                              member.avatar ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={member.name}
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : member.role === "EDITOR"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {member.role}
                        </span>
                        {teamData && teamData.ownerId !== member.userId && (
                          <div className="relative ml-2 group">
                            <button className="text-gray-400 hover:text-gray-600">
                              <ChevronDownIcon className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() =>
                                  handleChangeRole(member.id, "ADMIN")
                                }
                              >
                                Change to Admin
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() =>
                                  handleChangeRole(member.id, "EDITOR")
                                }
                              >
                                Change to Editor
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() =>
                                  handleChangeRole(member.id, "VIEWER")
                                }
                              >
                                Change to Viewer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {teamData && teamData.ownerId !== member.userId && (
                        <div className="flex justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Invitations Tab */}
      {activeTab === "invitations" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {pendingInvites.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Invited On
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingInvites.map((invitation) => (
                    <tr key={invitation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invitation.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            invitation.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : invitation.role === "EDITOR"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {invitation.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invitation.invitedOn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            onClick={() =>
                              handleResendInvitation(invitation.id)
                            }
                          >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            Resend
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() =>
                              handleCancelInvitation(invitation.id)
                            }
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <EnvelopeIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No pending invitations
              </h3>
              <p className="text-gray-500 mb-4">
                You haven't sent any invitations yet or all invitations have
                been accepted.
              </p>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
              >
                Invite Team Member
              </button>
            </div>
          )}
        </div>
      )}

      {/* Activity Log Tab */}
      {activeTab === "activity" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {activityLogs.map((log, index) => (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {index !== activityLogs.length - 1 && (
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        ></span>
                      )}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                            <UserGroupIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">
                                {log.user}
                              </span>
                              <span className="text-gray-500">
                                {" "}
                                {log.action}{" "}
                              </span>
                              <span className="font-medium text-gray-900">
                                {log.target}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500 flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {log.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Team Settings Tab */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Team Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Description
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Team Logo</h3>
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                <img
                  src="/placeholder.svg?height=64&width=64"
                  alt="Team Logo"
                  className="h-16 w-16 object-cover"
                />
              </div>
              <div>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium mr-2">
                  Upload New Logo
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Permissions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">
                    Allow Editors to Invite Members
                  </p>
                  <p className="text-sm text-gray-500">
                    Editors can invite new team members with Viewer role.
                  </p>
                </div>
                <Switch
                  checked={teamSettings.allowEditorsToInvite}
                  onChange={(checked) =>
                    setTeamSettings({
                      ...teamSettings,
                      allowEditorsToInvite: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">
                    Allow Viewers to Export Data
                  </p>
                  <p className="text-sm text-gray-500">
                    Viewers can export form responses and analytics.
                  </p>
                </div>
                <Switch
                  checked={teamSettings.allowViewersToExport}
                  onChange={(checked) =>
                    setTeamSettings({
                      ...teamSettings,
                      allowViewersToExport: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">
                    Require Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    All team members must use two-factor authentication.
                  </p>
                </div>
                <Switch
                  checked={teamSettings.requireTwoFactor}
                  onChange={(checked) =>
                    setTeamSettings({
                      ...teamSettings,
                      requireTwoFactor: checked,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
                onClick={handleSaveSettings}
                disabled={savingSettings}
              >
                {savingSettings ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-50 font-medium flex items-center"
                onClick={handleDeleteTeam}
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete Team
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TeamMember;
