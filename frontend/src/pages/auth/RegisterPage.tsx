import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerAuth(data.name, data.email, data.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">Create Account</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<User className="w-5 h-5" />}
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="astrologer@example.com"
          autoComplete="username"
          icon={<Mail className="w-5 h-5" />}
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          icon={<Lock className="w-5 h-5" />}
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          icon={<Lock className="w-5 h-5" />}
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center mt-6"
          size="lg"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
