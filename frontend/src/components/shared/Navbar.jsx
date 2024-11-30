import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant.js';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, null, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Logout failed!');
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/">
                        <h1 className="text-2xl font-bold">
                            Vision<span className="text-[#F83002]">Pay</span>
                        </h1>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-12">
                    <ul className="flex items-center gap-8">
                        <li>
                            <Link to="/" className="hover:text-[#6A38C2] transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/addMoney" className="hover:text-[#6A38C2] transition-colors">
                                Deposit
                            </Link>
                        </li>
                        <li>
                            <Link to="/withdraw" className="hover:text-[#6A38C2] transition-colors">
                                withdraw
                            </Link>
                        </li>
                        
                    </ul>

                    {/* Authentication Buttons */}
                    {!user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="outline" className="hover:border-[#6A38C2]">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                                    SignUp
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="ghost">{user?.name || 'User'}</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-white shadow-lg rounded-lg p-4 border">
                                <div className="flex flex-col gap-4 text-gray-700">
                                    {/* Add Money */}
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <Button
                                            onClick={() => navigate('/addMoney')}
                                            variant="link"
                                            className="text-left text-[#6A38C2] hover:text-[#5b30a6]"
                                        >
                                            Add Money
                                        </Button>
                                    </div>

                                    {/* Withdraw Money */}
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <Button
                                            onClick={() => navigate('/withdraw')}
                                            variant="link"
                                            className="text-left text-[#6A38C2] hover:text-[#5b30a6]"
                                        >
                                            Withdraw Money
                                        </Button>
                                    </div>

                                    {/* Logout */}
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <LogOut className="text-gray-600" />
                                        <Button onClick={logoutHandler} variant="link">
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
