import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../../components/ui/Input";
import { Alert } from "../../components/ui/Alert";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/Button";

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await axios.post('http://localhost:3011/auth/register', { 
        username, 
        email,
        password 
      });
      navigate('/login');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card 
        title="Create an Account"
        description="Sign up to get started"
        className="w-full max-w-md"
      >
        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-4"
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input 
              label="Username"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required 
              className="mt-2"
            />
          </div>
          <div>
            <Input 
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required 
              className="mt-2"
            />
          </div>
          <div className="relative">
            <Input 
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required 
              error={password ? undefined : ''}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-10 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div>
            <Input 
              label="Confirm Password"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required 
              className="mt-2"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
          >
            Sign Up
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </div>
      </Card>
    </div>
  );
};