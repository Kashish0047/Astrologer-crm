import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { User as UserIcon, Mail, Calendar, Key, ShieldCheck, Edit2, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().optional().refine(val => !val || val.length >= 6, {
    message: 'Password must be at least 6 characters long',
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: '',
    },
  });

  const handleToggleEdit = () => {
    if (isEditing) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const updatePayload: Record<string, string> = {
        name: data.name,
        email: data.email,
      };
      
      if (data.password) {
        updatePayload.password = data.password;
      }

      await updateProfile(updatePayload);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      reset({
        name: data.name,
        email: data.email,
        password: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
          <p className="text-sm text-slate-400">Manage your astrologer account settings and credentials</p>
        </div>
        <Button
          variant={isEditing ? 'secondary' : 'primary'}
          onClick={handleToggleEdit}
          icon={isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="lg:col-span-1 glass-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>
          
          <div className="relative w-28 h-28 mb-6 group">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-full h-full rounded-3xl bg-surface-card border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 text-5xl font-black shadow-inner">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-1 tracking-tight leading-tight">{user.name}</h2>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-6">
            Professional Astrologer
          </span>

          <div className="w-full space-y-4 pt-6 border-t border-white/10 text-left text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-400" />
                Account Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditing ? (
                  <Input
                    label="Full Name *"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name</span>
                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white flex items-center gap-3 select-none">
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      {user.name}
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <Input
                    label="Email Address *"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Address</span>
                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white flex items-center gap-3 select-none">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {user.email}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password Section */}
            {isEditing && (
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-400" />
                  Security Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="New Password (optional)"
                    type="password"
                    {...register('password')}
                    error={errors.password?.message}
                    placeholder="Min 6 characters to update"
                  />
                  <div className="flex items-center text-xs text-slate-400 bg-white/5 rounded-xl border border-white/5 p-4 mt-6">
                    <ShieldCheck className="w-8 h-8 text-emerald-400/80 mr-3 shrink-0" />
                    <span>Leave password field empty if you do not wish to change your current account password.</span>
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <Button type="button" variant="secondary" onClick={handleToggleEdit}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} icon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

