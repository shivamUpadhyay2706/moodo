import { useState, useEffect, useCallback } from 'react';
import { listGroupsQuery, createGroupMutation, inviteMemberMutation } from '../../api';
import { showToast } from '../../util/sonner';

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listGroupsQuery();
      setGroups(data);
    } catch (error) {
      showToast.error(error.message || 'Could not fetch groups ❌');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreateGroup = async (values, { resetForm }) => {
    const toastId = showToast.loading('Creating collaboration group...');
    try {
      await createGroupMutation(values);
      showToast.dismiss(toastId);
      showToast.success('Group created successfully! 🎉');
      setIsCreateOpen(false);
      resetForm();
      fetchGroups();
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Group creation failed ❌');
    }
  };

  const handleInviteMember = async (values, { resetForm }) => {
    if (!activeGroupId) return;
    const toastId = showToast.loading(`Inviting ${values.username}...`);
    try {
      const response = await inviteMemberMutation(activeGroupId, values.username);
      showToast.dismiss(toastId);
      showToast.success(response.message || `Added ${values.username} to group! 🎉`);
      setIsInviteOpen(false);
      resetForm();
      fetchGroups(); // Refresh member counts
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Invitation failed ❌');
    }
  };

  const openInviteModal = (groupId) => {
    setActiveGroupId(groupId);
    setIsInviteOpen(true);
  };

  return {
    groups,
    loading,
    isCreateOpen,
    setIsCreateOpen,
    isInviteOpen,
    setIsInviteOpen,
    handleCreateGroup,
    handleInviteMember,
    openInviteModal,
  };
};
