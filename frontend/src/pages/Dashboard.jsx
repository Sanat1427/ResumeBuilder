import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { dashboardStyles as styles } from '../assets/dummystyle';
import { useNavigate } from 'react-router-dom';
import { LucideFilePlus, LucideTrash2 } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import { ResumeSummaryCard } from '../components/Cards';
import toast from 'react-hot-toast';
import dayjs from 'dayjs'; // ✅ consistent date formatting
import Modal from '../components/Modal';
import CreateResumeForm from '../components/CreateResumeForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const calculateCompletion = (resume) => {
    let completedFields = Object.values(resume).filter(Boolean).length;
    let totalFields = Object.keys(resume).length;
    return totalFields === 0 ? 0 : Math.round((completedFields / totalFields) * 100);
  };

  const fetchAllResumes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      const resumesWithCompletion = response.data.map(resume => ({
        ...resume,
        completion: calculateCompletion(resume),
      }));
      setAllResumes(resumesWithCompletion);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResumes();
  }, []);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
      setAllResumes(prev => prev.filter(resume => resume._id !== resumeToDelete));
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error(error.response?.data?.message || 'Failed to delete resume');
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteClick = (id) => {
    setResumeToDelete(id);
    setShowDeleteConfirm(true);
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>My Resumes</h1>
            <p className={styles.headerSubtitle}>
              {allResumes.length
                ? `You have ${allResumes.length} resume${allResumes.length !== 1 ? 's' : ''}`
                : 'Build your first resume and stand out to employers!'}
            </p>
          </div>
          <button
            className={`${styles.createButton} transition-transform transform hover:scale-105`}
            onClick={() => setOpenCreateModal(true)}
          >
            <div className={styles.createButtonOverlay}></div>
            <span className={styles.createButtonContent}>
              Create Now
              <LucideFilePlus
                className="group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </span>
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && allResumes.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <LucideFilePlus size={48} className="text-violet-500 animate-bounce" />
            </div>
            <h3 className={styles.emptyTitle}>No Resumes Yet</h3>
            <p className={styles.emptyText}>
              Your career journey starts here. Create a resume to showcase your skills and experiences!
            </p>
            <button
              className={`${styles.createButton} transition-transform transform hover:scale-105`}
              onClick={() => setOpenCreateModal(true)}
            >
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                Create Your First Resume
                <LucideFilePlus className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </button>
          </div>
        )}

        {/* GRID VIEW */}
        {!loading && allResumes.length > 0 && (
          <div className={styles.grid}>
            {/* Create New Resume Card */}
            <div
              className={`${styles.newResumeCard} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => setOpenCreateModal(true)}
            >
              <div className={styles.newResumeIcon}>
                <LucideFilePlus size={32} className='text-white' />
              </div>
              <h3 className={styles.newResumeTitle}>Create New Resume</h3>
              <p className={styles.newResumeText}>Start building your career</p>
            </div>

            {/* Resumes List */}
            {allResumes.map((resume) => (
              <ResumeSummaryCard
                key={resume._id}
                title={resume.title}
                createdAt={dayjs(resume.createdAt).toISOString()}
                updatedAt={dayjs(resume.updatedAt).toISOString()}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDeleteClick(resume._id)}
                completion={resume.completion || 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
        maxWidth="max-w-2xl"
      >
        <CreateResumeForm
          onSuccess={() => {
            setOpenCreateModal(false);
            fetchAllResumes();
          }}
        />
      </Modal>

      {/* DELETE RESUME MODAL */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title='Confirm Deletion'
        showActionBtn
        actionBtnText='Delete'
        actionBtnClassName='bg-red-600 hover:bg-red-700'
        onActionClick={handleDeleteResume}
      >
        <div className='p-4 flex flex-col items-center text-center'>
          <LucideTrash2 className='text-orange-600 animate-pulse' size={28}/>
          <h3 className={styles.deleteTitle}>Delete Resume</h3>
          <p className={styles.deleteText}>
            Are you sure you want to delete this resume? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
