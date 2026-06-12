import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">Sign In</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          autoComplete="current-password"
          icon={<Lock className="w-5 h-5" />}
          {...register('password')}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center mt-6"
          size="lg"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Create one now
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
