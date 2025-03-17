"use client";

import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import { useRouter } from "next/navigation";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

interface Invitation {
  id: string;
  email: string;
  invitedOn: string;
}

export default function TeamSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);

      // Fetch team members
      const membersResponse = await fetch("/api/teams/current/members");

      if (!membersResponse.ok) {
        throw new Error("Failed to fetch team members");
      }

      const membersData = await membersResponse.json();
      setMembers(membersData);

      // Fetch pending invitations
      const invitationsResponse = await fetch("/api/teams/current/invitations");

      if (!invitationsResponse.ok) {
        throw new Error("Failed to fetch invitations");
      }

      const invitationsData = await invitationsResponse.json();
      setInvitations(invitationsData);
    } catch (error) {
      console.error("Error fetching team data:", error);
      message.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      message.error("Please enter an email address");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/teams/current/members", {
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
        const data = await response.json();
        throw new Error(data.error || "Failed to send invitation");
      }

      message.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      setShowInviteModal(false);

      // Refresh invitations
      const invitationsResponse = await fetch("/api/teams/current/invitations");
      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json();
        setInvitations(invitationsData);
      }
    } catch (error) {
      console.error("Error inviting member:", error);
      message.error(
        error instanceof Error ? error.message : "Failed to send invitation"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMemberToRemove(memberId);
    setShowRemoveModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/teams/current/members/${memberToRemove}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove team member");
      }

      message.success("Team member removed successfully");

      // Update the members list
      setMembers(members.filter((member) => member.id !== memberToRemove));
    } catch (error) {
      console.error("Error removing team member:", error);
      message.error("Failed to remove team member");
    } finally {
      setLoading(false);
      setShowRemoveModal(false);
      setMemberToRemove(null);
    }
  };

  const handleEditMember = (memberId: string) => {
    // Navigate to the team management page
    router.push(`/team?member=${memberId}`);
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/teams/current/invitations/${invitationId}/resend`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend invitation");
      }

      message.success("Invitation resent successfully");
    } catch (error) {
      console.error("Error resending invitation:", error);
      message.error("Failed to resend invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/teams/current/invitations/${invitationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel invitation");
      }

      message.success("Invitation cancelled successfully");

      // Update the invitations list
      setInvitations(
        invitations.filter((invitation) => invitation.id !== invitationId)
      );
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      message.error("Failed to cancel invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Team Members</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
          onClick={() => setShowInviteModal(true)}
        >
          Invite Member
        </button>
      </div>

      <div className="mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0">
                        <img
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-indigo-600 hover:text-indigo-800 mr-3"
                      onClick={() => handleEditMember(member.id)}
                    >
                      Edit
                    </button>
                    {member.role !== "Admin" && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {invitations.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">Pending Invitations</h3>
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-4 flex items-center"
            >
              <div className="flex-grow">
                <p className="font-medium">{invitation.email}</p>
                <p className="text-sm text-gray-500">
                  Invited on {invitation.invitedOn}
                </p>
              </div>
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-4"
                onClick={() => handleResendInvitation(invitation.id)}
              >
                Resend
              </button>
              <button
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                onClick={() => handleCancelInvitation(invitation.id)}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <Modal
        title="Invite Team Member"
        open={showInviteModal}
        onOk={handleInviteMember}
        onCancel={() => setShowInviteModal(false)}
        okText="Send Invitation"
        okButtonProps={{ loading }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ADMIN">
              Admin - Full control over team and members
            </option>
            <option value="EDITOR">Editor - Can create and edit forms</option>
            <option value="VIEWER">
              Viewer - Can only view forms and responses
            </option>
          </select>
        </div>
      </Modal>

      {/* Remove Member Modal */}
      <Modal
        title="Remove Team Member"
        open={showRemoveModal}
        onOk={confirmRemoveMember}
        onCancel={() => setShowRemoveModal(false)}
        okText="Remove Member"
        okButtonProps={{ danger: true, loading }}
      >
        <p>
          Are you sure you want to remove this team member? They will lose
          access to all team resources.
        </p>
      </Modal>
    </div>
  );
}
