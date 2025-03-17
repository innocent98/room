"use client";

import type React from "react";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { Modal, message, Spin, Select } from "antd";
import Layout from "@/components/layout";
import { useRouter } from "next/navigation";
import NoTeam from "@/components/teams/NoTeam";
import TeamMember from "@/components/teams/TeamMember";
import InviteModal from "@/components/teams/InviteModal";
import TeamTab from "@/components/teams/TeamTab";
import TeamManagement from "@/components/teams/TeamManagement";

export default function TeamPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("members");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [memberToChangeRole, setMemberToChangeRole] = useState<string | null>(
    null
  );
  const [newRole, setNewRole] = useState("");
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
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

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleOpenRoleModal = (memberId: string, currentRole: string) => {
    setMemberToChangeRole(memberId);
    setNewRole(currentRole);
    setShowRoleModal(true);
  };

  const confirmChangeRole = async () => {
    if (!teamId || !memberToChangeRole || !newRole) {
      message.error("Missing information for role change");
      return;
    }

    try {
      const response = await fetch(
        `/api/teams/${teamId}/members/${memberToChangeRole}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update role");
      }

      message.success(`Role updated to ${newRole}`);

      // Refresh the members list
      fetchTeamMembers(teamId);
    } catch (error) {
      console.error("Error updating role:", error);
      message.error(
        error instanceof Error ? error.message : "Failed to update role"
      );
    } finally {
      setShowRoleModal(false);
      setMemberToChangeRole(null);
    }
  };

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
      // Update URL without refreshing the page

      const currentTeam = urlTeamId
        ? teamsData.find((team: any) => team.id === urlTeamId) || teamsData[0]
        : teamsData[0];

      setTeamId(currentTeam.id);
      setTeamData(currentTeam);
      setTeamName(currentTeam.name);
      setTeamDescription(currentTeam.description || "");

      window.history.pushState({}, "", `/dashboard/team?id=${currentTeam.id}`);

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
      // message.error("Failed to load invitations");
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
        method: "PATCH",
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
        <TeamManagement
          setShowInviteModal={setShowInviteModal}
          teamId={teamId}
          teamName={teamName}
          allTeams={allTeams}
          handleSwitchTeam={handleSwitchTeam}
        />

        {/* Tabs */}
        <TeamTab activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <TeamMember
          activeTab={activeTab}
          teamMembers={teamMembers}
          teamData={teamData}
          pendingInvites={pendingInvites}
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
          handleOpenRoleModal={handleOpenRoleModal}
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

        {/* Change Role Modal */}
        <Modal
          title="Change Member Role"
          open={showRoleModal}
          onCancel={() => setShowRoleModal(false)}
          onOk={confirmChangeRole}
          okText="Update Role"
        >
          <p className="mb-4">Select a new role for this team member:</p>
          <Select
            value={newRole}
            onChange={(value) => setNewRole(value)}
            style={{ width: "100%" }}
            options={[
              {
                value: "ADMIN",
                label: "Admin - Full control over team and members",
              },
              { value: "EDITOR", label: "Editor - Can create and edit forms" },
              {
                value: "VIEWER",
                label: "Viewer - Can only view forms and responses",
              },
            ]}
          />
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
