import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Plus, Edit, Trash2, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import toast from 'react-hot-toast';
import { showtimeService } from '@/services/showtimeService';

export interface IHall {
  _id: string;
  hall_name: string;
  total_seats: number;
  layout_rows: number;
  layout_columns: number;
  createdAt: string;
  updatedAt: string;
}

type HallFormData = Omit<IHall, '_id' | 'createdAt' | 'updatedAt'>;

interface HallFormProps {
  hallToEdit: IHall | null;
  onClose: () => void;
  onSave: () => void;
}

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
  exit: { opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.15 } },
}

const HallForm: React.FC<HallFormProps> = ({ hallToEdit, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HallFormData>();

  useEffect(() => {
    if (hallToEdit) {
      reset(hallToEdit);
    } else {
      reset({
        hall_name: '',
        total_seats: 100,
        layout_rows: 10,
        layout_columns: 10,
      });
    }
  }, [hallToEdit, reset]);

  const onSubmit: SubmitHandler<HallFormData> = async (formData) => {
    try {
      const dataToSubmit = {
        ...formData,
        total_seats: Number(formData.total_seats),
        layout_rows: Number(formData.layout_rows),
        layout_columns: Number(formData.layout_columns),
      };

      if (hallToEdit) {
        await showtimeService.updateHall(hallToEdit._id, dataToSubmit);
      } else {
        await showtimeService.createHall(dataToSubmit);
      }

      toast.success(`Hall ${hallToEdit ? 'updated' : 'added'} successfully!`);
      onSave();
    } catch (error: any) {
      toast.error(error.message);
      console.error('Error saving hall:', error);
    }
  };

  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        variants={modalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="card w-full max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-dark-800/60 transition-all duration-200">&times;</button>
        <h2 className="text-2xl font-display font-bold text-white mb-6">{hallToEdit ? 'Edit Hall' : 'Add New Hall'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Hall Name</label>
            <input {...register('hall_name', { required: 'Hall name is required' })} className="input" />
            {errors.hall_name && <p className="text-red-400 text-sm mt-1">{errors.hall_name.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Total Seats</label>
              <input type="number" {...register('total_seats', { required: 'Total seats is required', valueAsNumber: true })} className="input" />
              {errors.total_seats && <p className="text-red-400 text-sm mt-1">{errors.total_seats.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Rows</label>
              <input type="number" {...register('layout_rows', { required: 'Number of rows is required', valueAsNumber: true })} className="input" />
              {errors.layout_rows && <p className="text-red-400 text-sm mt-1">{errors.layout_rows.message}</p>}
            </div>
             <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Columns</label>
              <input type="number" {...register('layout_columns', { required: 'Number of columns is required', valueAsNumber: true })} className="input" />
              {errors.layout_columns && <p className="text-red-400 text-sm mt-1">{errors.layout_columns.message}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : 'Save Hall'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

interface DeleteModalProps {
    hall: IHall;
    onClose: () => void;
    onConfirm: (hallId: string) => void;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ hall, onClose, onConfirm }) => {
    return (
        <motion.div
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="card p-6 w-full max-w-md"
            >
                <h2 className="text-xl font-display font-bold text-white mb-4">Confirm Deletion</h2>
                <p className="text-neutral-300 mb-6">
                    Are you sure you want to delete "<strong className="text-white">{hall.hall_name}</strong>"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <motion.button
                        onClick={() => onConfirm(hall._id)}
                        className="btn btn-danger"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        Delete Hall
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function AdminHallsPage() {
  const [halls, setHalls] = useState<IHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<IHall | null>(null);
  const [hallToDelete, setHallToDelete] = useState<IHall | null>(null);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      setError('');
      const data = await showtimeService.getHalls();
      setHalls(data || []);
    } catch (error) {
      console.error('Error fetching halls:', error);
      setError('Unable to load halls. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (hall: IHall | null) => {
    setEditingHall(hall);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHall(null);
  };
  
  const handleSave = () => {
    fetchHalls();
    handleCloseModal();
  };

  const handleDeleteClick = (hall: IHall) => {
    setHallToDelete(hall);
  };

  const handleConfirmDelete = async (hallId: string) => {
    try {
      await showtimeService.deleteHall(hallId);
      toast.success('Hall deleted successfully');
      fetchHalls();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete hall');
    } finally {
      setHallToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {isModalOpen && (
          <HallForm 
            hallToEdit={editingHall}
            onClose={handleCloseModal}
            onSave={handleSave}
          />
        )}
        {hallToDelete && (
          <DeleteConfirmationModal
            hall={hallToDelete}
            onClose={() => setHallToDelete(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Halls</h1>
          <p className="text-neutral-400">Manage your cinema halls</p>
        </div>
        <motion.button 
          onClick={() => handleOpenModal(null)}
          className="btn btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Hall</span>
        </motion.button>
      </motion.div>

      {halls.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 card"
        >
          <Building className="h-16 w-16 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-400 text-lg mb-4">No halls found</p>
          <motion.button
            onClick={() => handleOpenModal(null)}
            className="btn btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Your First Hall
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {halls.map((hall) => (
            <motion.div
              key={hall._id}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="card p-6 flex flex-col"
            >
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-500/15 rounded-xl flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-display font-semibold text-white">{hall.hall_name}</h3>
                        <p className="text-sm text-neutral-500 truncate">ID: {hall._id}</p>
                    </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                    <span className="text-neutral-500 text-sm">Total Seats</span>
                    <span className="text-white font-medium text-sm">{hall.total_seats}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-neutral-500 text-sm">Layout</span>
                    <span className="text-white font-medium text-sm">
                        {hall.layout_rows} &times; {hall.layout_columns}
                    </span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-neutral-500 text-sm">Created</span>
                    <span className="text-white font-medium text-sm">
                        {new Date(hall.createdAt).toLocaleDateString()}
                    </span>
                    </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-700/50 flex items-center space-x-2">
                <motion.button 
                  onClick={() => handleOpenModal(hall)}
                  className="btn btn-secondary flex-1 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </motion.button>
                <motion.button
                  onClick={() => handleDeleteClick(hall)}
                  className="btn btn-danger flex-1 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
