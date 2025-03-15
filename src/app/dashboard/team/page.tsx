"use client";

import type React from "react";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserPlusIcon,
  UserGroupIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Modal, message, Spin } from "antd";
import Layout from "@/components/layout";
import { useRouter } from "next/navigation";
import NoTeam from "@/components/teams/NoTeam";
import TeamMember from "@/components/teams/TeamMember";
import InviteModal from "@/components/teams/InviteModal";

export default function TeamPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("members");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<any>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamSettings, setTeamSettings] = useState<any>({
    allowEditorsToInvite: true,
    allowViewersToExport: false,
    requireTwoFactor: false,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [allTeams, setAllTeams] = useState<any[]>([]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);

      // First, get the user's teams
      const teamsResponse = await fetch("/api/teams");
      if (!teamsResponse.ok) {
        throw new Error("Failed to fetch teams");
      }

      const teamsData = await teamsResponse.json();
      setAllTeams(teamsData);

      // If no teams, we'll show a create team UI instead of redirecting
      if (teamsData.length === 0) {
        setLoading(false);
        return;
      }

      // Use the first team by default or the one specified in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const urlTeamId = urlParams.get("id");

      const currentTeam = urlTeamId
        ? teamsData.find((team: any) => team.id === urlTeamId) || teamsData[0]
        : teamsData[0];

      setTeamId(currentTeam.id);
      setTeamData(currentTeam);
      setTeamName(currentTeam.name);
      setTeamDescription(currentTeam.description || "");

      if (currentTeam.settings) {
        try {
          const settings =
            typeof currentTeam.settings === "string"
              ? JSON.parse(currentTeam.settings)
              : currentTeam.settings;

          setTeamSettings({
            allowEditorsToInvite: settings.allowEditorsToInvite ?? true,
            allowViewersToExport: settings.allowViewersToExport ?? false,
            requireTwoFactor: settings.requireTwoFactor ?? false,
          });
        } catch (e) {
          console.error("Error parsing team settings:", e);
        }
      }

      // Fetch team members
      await fetchTeamMembers(currentTeam.id);

      // Fetch pending invitations
      await fetchPendingInvitations(currentTeam.id);

      // Fetch activity logs (this would be a separate API endpoint)
      await fetchActivityLogs(currentTeam.id);
    } catch (error) {
      console.error("Error fetching team data:", error);
      message.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`);
      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }

      const data = await response.json();

      // Transform the data to match our UI needs
      const formattedMembers = data.map((member: any) => ({
        id: member.id,
        userId: member.userId,
        name: member.user.name || "Unknown User",
        email: member.user.email,
        role: member.role,
        avatar: member.user.image || "/placeholder.svg?height=40&width=40",
        status: "active", // You might want to track this in your database
        lastActive: "Recently", // This would come from your database
      }));

      setTeamMembers(formattedMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      message.error("Failed to load team members");
    }
  };

  const fetchPendingInvitations = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/invitations`);
      if (!response.ok) {
        throw new Error("Failed to fetch invitations");
      }

      const data = await response.json();

      // Transform the data to match our UI needs
      const formattedInvitations = data.map((invitation: any) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        invitedOn: new Date(invitation.createdAt).toLocaleDateString(),
        invitedBy: invitation.invitedBy?.name || "Unknown",
      }));

      setPendingInvites(formattedInvitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      message.error("Failed to load invitations");
    }
  };

  const fetchActivityLogs = async (teamId: string) => {
    try {
      // This would be a real API endpoint in your application
      // For now, we'll use mock data
      setActivityLogs([
        {
          id: 1,
          user: "Victor Smith",
          action: "created a new form",
          target: "Customer Feedback Survey",
          time: "2 hours ago",
        },
        {
          id: 2,
          user: "Jane Cooper",
          action: "edited",
          target: "Product Evaluation Form",
          time: "Yesterday at 3:45 PM",
        },
        {
          id: 3,
          user: "Victor Smith",
          action: "invited",
          target: "alex.morgan@example.com",
          time: "Sep 10, 2023",
        },
        {
          id: 4,
          user: "Robert Johnson",
          action: "viewed responses for",
          target: "Employee Satisfaction Survey",
          time: "Sep 8, 2023",
        },
      ]);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      message.error("Failed to load activity logs");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamId) {
      message.error("No team selected");
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send invitation");
      }

      message.success(`Invitation sent to ${inviteEmail}`);
      setShowInviteModal(false);
      setInviteEmail("");

      // Refresh the invitations list
      fetchPendingInvitations(teamId);
    } catch (error) {
      console.error("Error sending invitation:", error);
      message.error("Failed to send invitation");
    }
  };

  const handleDeleteMember = (memberId: string) => {
    setMemberToDelete(memberId);
    setShowDeleteModal(true);
  };

  const confirmDeleteMember = async () => {
    if (!teamId || !memberToDelete) {
      message.error("Missing team or member information");
      return;
    }

    try {
      const response = await fetch(
        `/api/teams/${teamId}/members/${memberToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove team member");
      }

      message.success("Team member removed successfully");

      // Refresh the members list
      fetchTeamMembers(teamId);
    } catch (error) {
      console.error("Error removing team member:", error);
      message.error("Failed to remove team member");
    } finally {
      setShowDeleteModal(false);
      setMemberToDelete(null);
    }
  };

  const handleDeleteTeam = () => {
    setShowDeleteTeamModal(true);
  };

  const confirmDeleteTeam = async () => {
    if (!teamId) {
      message.error("No team selected");
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete team");
      }

      message.success("Team deleted successfully");
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Error deleting team:", error);
      message.error("Failed to delete team");
    } finally {
      setShowDeleteTeamModal(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    if (!teamId) {
      message.error("No team selected");
      return;
    }

    try {
      const response = await fetch(
        `/api/teams/${teamId}/invitations/${invitationId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to resend invitation");
      }

      message.success("Invitation resent successfully");
    } catch (error) {
      console.error("Error resending invitation:", error);
      message.error("Failed to resend invitation");
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!teamId) {
      message.error("No team selected");
      return;
    }

    try {
      const response = await fetch(
        `/api/teams/${teamId}/invitations/${invitationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel invitation");
      }

      message.success("Invitation cancelled");

      // Refresh the invitations list
      fetchPendingInvitations(teamId);
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      message.error("Failed to cancel invitation");
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    if (!teamId) {
      message.error("No team selected");
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update role");
      }

      message.success(`Role updated to ${newRole}`);

      // Refresh the members list
      fetchTeamMembers(teamId);
    } catch (error) {
      console.error("Error updating role:", error);
      message.error("Failed to update role");
    }
  };

  const handleSaveSettings = async () => {
    if (!teamId) {
      message.error("No team selected");
      return;
    }

    setSavingSettings(true);

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: teamName,
          description: teamDescription,
          settings: teamSettings,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save team settings");
      }

      message.success("Team settings saved successfully");
    } catch (error) {
      console.error("Error saving team settings:", error);
      message.error("Failed to save team settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSwitchTeam = async (newTeamId: string) => {
    if (newTeamId === teamId) return;

    setLoading(true);

    try {
      const team = allTeams.find((t) => t.id === newTeamId);
      if (!team) {
        throw new Error("Team not found");
      }

      setTeamId(team.id);
      setTeamData(team);
      setTeamName(team.name);
      setTeamDescription(team.description || "");

      if (team.settings) {
        try {
          const settings =
            typeof team.settings === "string"
              ? JSON.parse(team.settings)
              : team.settings;

          setTeamSettings({
            allowEditorsToInvite: settings.allowEditorsToInvite ?? true,
            allowViewersToExport: settings.allowViewersToExport ?? false,
            requireTwoFactor: settings.requireTwoFactor ?? false,
          });
        } catch (e) {
          console.error("Error parsing team settings:", e);
        }
      }

      // Update URL without refreshing the page
      window.history.pushState({}, "", `/dashboard/team?id=${team.id}`);

      // Fetch team members
      await fetchTeamMembers(team.id);

      // Fetch pending invitations
      await fetchPendingInvitations(team.id);

      // Fetch activity logs
      await fetchActivityLogs(team.id);
    } catch (error) {
      console.error("Error switching team:", error);
      message.error("Failed to switch team");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
          <span className="ml-2">Loading team data...</span>
        </div>
      </Layout>
    );
  }

  if (!teamId) {
    return <NoTeam />;
  }

  return (
    <Layout>
      <div className="p-6">
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

        {/* Tabs */}
        <motion.div
          className="mb-6 border-b border-gray-200"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex space-x-8">
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "members"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("members")}
            >
              Team Members
            </button>
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "invitations"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("invitations")}
            >
              Pending Invitations
            </button>
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "activity"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              Activity Log
            </button>
            <button
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "settings"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Team Settings
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <TeamMember
          activeTab={activeTab}
          teamMembers={teamMembers}
          teamData={teamData}
          pendingInvites={pendingInvites}
          activityLogs={activityLogs}
          teamName={teamName}
          teamDescription={teamDescription}
          teamSettings={teamSettings}
          savingSettings={savingSettings}
          handleChangeRole={handleChangeRole}
          handleDeleteMember={handleDeleteMember}
          handleResendInvitation={handleResendInvitation}
          handleCancelInvitation={handleCancelInvitation}
          setShowInviteModal={setShowInviteModal}
          setTeamName={setTeamName}
          setTeamDescription={setTeamDescription}
          setTeamSettings={setTeamSettings}
          handleSaveSettings={handleSaveSettings}
          handleDeleteTeam={handleDeleteTeam}
        />

        {/* Invite Modal */}
        <InviteModal
          showInviteModal={showInviteModal}
          inviteEmail={inviteEmail}
          inviteRole={inviteRole}
          setShowInviteModal={setShowInviteModal}
          handleInvite={handleInvite}
          setInviteEmail={setInviteEmail}
          setInviteRole={setInviteRole}
        />

        {/* Delete Member Modal */}
        <Modal
          title="Remove Team Member"
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onOk={confirmDeleteMember}
          okText="Remove"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to remove this team member? This action cannot
            be undone.
          </p>
        </Modal>

        {/* Delete Team Modal */}
        <Modal
          title="Delete Team"
          open={showDeleteTeamModal}
          onCancel={() => setShowDeleteTeamModal(false)}
          onOk={confirmDeleteTeam}
          okText="Delete Team"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to delete this team? All team members will
            lose access and this action cannot be undone.
          </p>
        </Modal>
      </div>
    </Layout>
  );
}
