import {
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  FormOutlined,
  UnlockOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  ArrowPathIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import {
  Switch,
  Typography,
  Card,
  Avatar,
  Empty,
  Pagination,
  Spin,
  List,
} from "antd";
import { motion } from "framer-motion";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  Tag,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

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

interface TeamActivity {
  id: string;
  teamId: string;
  userId: string;
  action: string;
  details: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
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
  const params = useSearchParams();
  const teamId = params.get("id");

  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    fetchActivities();
  }, [teamId, pagination.current, pagination.pageSize]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const offset = (pagination.current - 1) * pagination.pageSize;
      const response = await fetch(
        `/api/teams/${teamId}/activities?limit=${pagination.pageSize}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch team activities");
      }

      const data = await response.json();
      setActivities(data.activities);
      setPagination({
        ...pagination,
        total: data.pagination.total,
      });
    } catch (error) {
      console.error("Error fetching team activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "TEAM_CREATED":
        return <TeamOutlined style={{ color: "#52c41a" }} />;
      case "TEAM_UPDATED":
        return <EditOutlined style={{ color: "#1890ff" }} />;
      case "TEAM_DELETED":
        return <DeleteOutlined style={{ color: "#ff4d4f" }} />;
      case "MEMBER_INVITED":
        return <SendOutlined style={{ color: "#722ed1" }} />;
      case "MEMBER_JOINED":
        return <UserAddOutlined style={{ color: "#52c41a" }} />;
      case "MEMBER_REMOVED":
        return <UserDeleteOutlined style={{ color: "#ff4d4f" }} />;
      case "MEMBER_ROLE_UPDATED":
        return <EditOutlined style={{ color: "#faad14" }} />;
      case "FORM_CREATED":
        return <FormOutlined style={{ color: "#52c41a" }} />;
      case "FORM_UPDATED":
        return <EditOutlined style={{ color: "#1890ff" }} />;
      case "FORM_DELETED":
        return <DeleteOutlined style={{ color: "#ff4d4f" }} />;
      case "FORM_PUBLISHED":
        return <UnlockOutlined style={{ color: "#52c41a" }} />;
      case "FORM_ARCHIVED":
        return <LockOutlined style={{ color: "#faad14" }} />;
      default:
        return <TeamOutlined />;
    }
  };

  const getActivityDescription = (activity: TeamActivity) => {
    const { action, details, user } = activity;
    const userName = user.name || user.email || "A user";

    switch (action) {
      case "TEAM_CREATED":
        return `${userName} created the team`;
      case "TEAM_UPDATED":
        return `${userName} updated the team details`;
      case "TEAM_DELETED":
        return `${userName} deleted the team`;
      case "MEMBER_INVITED":
        return `${userName} invited ${details.inviteeEmail} to join as ${details.role}`;
      case "MEMBER_JOINED":
        return `${userName} joined the team as ${details.role}`;
      case "MEMBER_REMOVED":
        if (details.isSelfRemoval) {
          return `${userName} left the team`;
        }
        return `${userName} removed ${details.removedMemberEmail} from the team`;
      case "MEMBER_ROLE_UPDATED":
        return `${userName} changed ${details.memberEmail}'s role from ${details.oldRole} to ${details.newRole}`;
      case "FORM_CREATED":
        return `${userName} created a new form: ${details.formTitle}`;
      case "FORM_UPDATED":
        return `${userName} updated the form: ${details.formTitle}`;
      case "FORM_DELETED":
        return `${userName} deleted the form: ${details.formTitle}`;
      case "FORM_PUBLISHED":
        return `${userName} published the form: ${details.formTitle}`;
      case "FORM_ARCHIVED":
        return `${userName} archived the form: ${details.formTitle}`;
      default:
        return `${userName} performed an action`;
    }
  };

  const getActivityTag = (action: string) => {
    switch (action) {
      case "TEAM_CREATED":
      case "FORM_CREATED":
      case "MEMBER_JOINED":
      case "FORM_PUBLISHED":
        return <Tag color="success">Created</Tag>;
      case "TEAM_UPDATED":
      case "FORM_UPDATED":
      case "MEMBER_ROLE_UPDATED":
        return <Tag color="processing">Updated</Tag>;
      case "TEAM_DELETED":
      case "FORM_DELETED":
      case "MEMBER_REMOVED":
        return <Tag color="error">Deleted</Tag>;
      case "MEMBER_INVITED":
        return <Tag color="purple">Invited</Tag>;
      case "FORM_ARCHIVED":
        return <Tag color="warning">Archived</Tag>;
      default:
        return <Tag>Action</Tag>;
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize,
    });
  };

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
        <div className="max-w-6xl mx-auto p-6 w-full">
          <Card className="mb-6">
            <Title level={4}>Team Activity Log</Title>
            <Text type="secondary">
              View all actions performed by team members
            </Text>
          </Card>

          <Card>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            ) : activities.length === 0 ? (
              <Empty description="No activities found for this team" />
            ) : (
              <>
                <List
                  itemLayout="horizontal"
                  dataSource={activities}
                  renderItem={(activity) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={activity.user.image}
                            icon={!activity.user.image && <UserAddOutlined />}
                          />
                        }
                        title={
                          <div className="flex items-center">
                            <span className="mr-2">
                              {getActivityDescription(activity)}
                            </span>
                            {getActivityTag(activity.action)}
                          </div>
                        }
                        description={
                          <div className="flex items-center">
                            <span className="mr-2">
                              {format(
                                new Date(activity.createdAt),
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                            </span>
                            {getActivityIcon(activity.action)}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />

                <div className="mt-4 flex justify-end">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePageChange}
                    showSizeChanger
                    showTotal={(total) => `Total ${total} activities`}
                  />
                </div>
              </>
            )}
          </Card>
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
