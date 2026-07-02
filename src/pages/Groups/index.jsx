import React from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, UserPlus, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { useGroups } from './useGroups';
import { 
  INITIAL_GROUP_VALUES, 
  GROUP_SCHEMA, 
  INITIAL_INVITE_VALUES, 
  INVITE_SCHEMA 
} from './constant';
import Input from '../../component/Input';
import Button from '../../component/Button';
import Modal from '../../component/Modal';

const Groups = () => {
  const {
    groups,
    loading,
    isCreateOpen,
    setIsCreateOpen,
    isInviteOpen,
    setIsInviteOpen,
    handleCreateGroup,
    handleInviteMember,
    openInviteModal,
  } = useGroups();

  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-pink-900/10 border border-slate-800 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={20} />
            Collab workspaces
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Coordinate task delegation, track split expenses, and share itineraries with friends.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          variant="primary"
          className="flex items-center gap-2 shrink-0"
        >
          <Plus size={18} />
          New Group
        </Button>
      </div>

      {/* Grid of Groups */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-medium">
          Fetching group workspaces...
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl text-slate-500 select-none">
          <Users size={48} className="mx-auto text-slate-700 mb-3" />
          <p className="font-bold">No active groups</p>
          <p className="text-sm mt-1">Create a group to start collaborating on splits & checklists.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/groups/${group._id}`)}
              className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/20 hover:bg-slate-900/45 p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-950/10"
            >
              {/* Overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="h-11 w-11 rounded-xl bg-slate-850 border border-slate-800 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users size={20} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    Creator: @{group.createdBy?.username || 'user'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-xs text-slate-450 mt-1 line-clamp-2 min-h-[2rem]">
                    {group.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex justify-between items-center border-t border-slate-800/60 pt-4 mt-6 relative z-10">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Users size={14} className="text-slate-500" />
                  {group.members?.length || 1} members
                </span>

                <div className="flex gap-2">
                  {/* Invite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInviteModal(group._id);
                    }}
                    title="Invite Friend"
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg border border-transparent hover:border-indigo-500/20 transition-all active:scale-95"
                  >
                    <UserPlus size={16} />
                  </button>
                  {/* Action button */}
                  <div className="p-2 bg-slate-800/50 group-hover:bg-indigo-500 group-hover:text-white text-slate-400 rounded-lg transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ➕ Create Group Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Collab Group 🌟"
      >
        <Formik
          initialValues={INITIAL_GROUP_VALUES}
          validationSchema={GROUP_SCHEMA}
          onSubmit={handleCreateGroup}
        >
          {() => (
            <Form className="space-y-4">
              <Input
                name="name"
                type="text"
                label="Group Name"
                placeholder="Trip to Bali, Coding Hackathon..."
              />
              <Input
                name="description"
                type="text"
                label="Description"
                placeholder="Briefly explain group goals..."
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <Button
                  onClick={() => setIsCreateOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Create Group 🚀
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* ➕ Invite Member Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Collaborator 👽"
      >
        <Formik
          initialValues={INITIAL_INVITE_VALUES}
          validationSchema={INVITE_SCHEMA}
          onSubmit={handleInviteMember}
        >
          {() => (
            <Form className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Send a group invite by entering their registered account username below. They will immediately gain access to this group space.
              </p>
              <Input
                name="username"
                type="text"
                label="Username"
                placeholder="Search username..."
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <Button
                  onClick={() => setIsInviteOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                >
                  Add to Group ⚡
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

    </div>
  );
};

export default Groups;
