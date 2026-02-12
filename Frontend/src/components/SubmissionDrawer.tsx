import React, { useState } from 'react';
import { X, Calendar, FileText, Paperclip, MessageSquare, Plus, File } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface SubmissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comic: {
    id: string;
    title: string;
    submissionDeadline?: string;
    maxUploads: number;
  };
  onSuccess: () => void;
}
const HideScrollbarCSS = () => (
  <style>{`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `}</style>
);

export const SubmissionDrawer: React.FC<SubmissionDrawerProps> = ({ 
  isOpen, 
  onClose, 
  comic,
  onSuccess 
}) => {
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const dueDate = comic.submissionDeadline 
    ? new Date(comic.submissionDeadline).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : 'No due date';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (attachments.length + newFiles.length > comic.maxUploads) {
        setError(`You can only upload up to ${comic.maxUploads} files.`);
        return;
      }
      setAttachments([...attachments, ...newFiles]);
      setError(null);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('kidToken');
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('comicId', comic.id);
      formData.append('description', description);
      formData.append('comments', comments);
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await fetch(`${API_BASE_URL}/kid/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.status === 'success') {
        onSuccess();
        onClose();
      } else {
        throw new Error(result.message || 'Failed to submit assignment');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
       <HideScrollbarCSS />
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col animate-slide-in-right p-4">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-gray-900">{comic.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 hide-scrollbar">
          {/* Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-500">
              <Calendar className="w-5 h-5 text-black" />
              <span className="text-sm font-medium text-black">Due Date</span>
              <span className="text-sm text-gray-900 ml-auto font-semibold">{dueDate}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <Calendar className="w-5 h-5 text-black" />
              <span className="text-sm font-medium text-black">Submission Date</span>
              <span className="text-sm text-gray-900 ml-auto font-semibold">{today}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <FileText className="w-5 h-5 text-black" />
              <span className="text-sm font-medium text-black">Description</span>
            </div>
            <textarea
              className="w-full h-32 p-4 bg-white border border-gray-500 rounded-xl focus:ring-2 focus:ring-[#7C1F2D]/20 transition-all outline-none resize-none text-sm placeholder:text-gray-600 shadow-sm"
              placeholder="Enter description of the submitted comic..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-500">
              <Paperclip className="w-5 h-5 text-black" />
              <span className="text-sm font-medium text-black">Attachment</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {attachments.map((file, idx) => (
                <div key={idx} className="relative group p-2 border border-gray-400 rounded-xl flex flex-col items-center text-center gap-1 bg-gray-50/50">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <File className="w-4 h-4 text-[#7C1F2D]" />
                   </div>
                   <div className="flex-1 min-w-0 w-full">
                      <p className="text-[10px] font-semibold text-gray-900 truncate px-1">{file.name}</p>
                      <p className="text-[8px] text-gray-400">{(file.size / 1024).toFixed(0)}KB</p>
                   </div>
                   <button 
                     onClick={() => removeAttachment(idx)}
                     className="absolute -top-1 -right-1 w-5 h-5 bg-white shadow-md border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                   >
                     <X className="w-2.5 h-2.5" />
                   </button>
                </div>
              ))}

              {attachments.length < comic.maxUploads && (
                <label className="border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center h-[60px] cursor-pointer hover:border-[#7C1F2D] hover:bg-[#7C1F2D]/5 transition-all">
                  <Plus className="w-5 h-5 text-gray-600" />
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            <p className="text-[10px] text-gray-700 italic">
              * Maximum {comic.maxUploads} files allowed
            </p>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <MessageSquare className="w-5 h-5 text-black" />
              <span className="text-sm font-medium text-black">Comments</span>
            </div>
            <textarea
              className="w-full h-32 p-4 bg-white border border-gray-500 rounded-xl focus:ring-2 focus:ring-[#7C1F2D]/20 transition-all outline-none resize-none text-sm placeholder:text-gray-600 shadow-sm"
              placeholder="Add any comments here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                {error}
            </div>
          )}

          {/* Footer */}
        <div className="px-6 py-6 flex justify-end mr-[-22px]">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="py-3 bg-[#7C1F2D] text-white font-normal rounded-xl hover:bg-[#6a1a26] transition-all disabled:cursor-not-allowed flex gap-2 items-center px-12 text-[14px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>


        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
