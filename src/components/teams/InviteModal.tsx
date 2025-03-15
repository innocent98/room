import { Modal } from "antd";
import React from "react";

interface Props {
  showInviteModal: boolean;
  inviteEmail: string;
  inviteRole: string;
  setShowInviteModal: (value: boolean) => void;
  handleInvite: (e: React.FormEvent) => void;
  setInviteEmail: (value: string) => void;
  setInviteRole: (value: string) => void;
}

const InviteModal = ({
  showInviteModal,
  inviteEmail,
  inviteRole,
  setShowInviteModal,
  handleInvite,
  setInviteEmail,
  setInviteRole,
}: Props) => {
  return (
    <Modal
      title="Invite Team Member"
      open={showInviteModal}
      onCancel={() => setShowInviteModal(false)}
      footer={null}
    >
      <form onSubmit={handleInvite}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="colleague@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          >
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            {inviteRole === "ADMIN" && "Can manage team members and all forms"}
            {inviteRole === "EDITOR" &&
              "Can create and edit forms, view responses"}
            {inviteRole === "VIEWER" && "Can only view forms and responses"}
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => setShowInviteModal(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Send Invitation
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteModal;
