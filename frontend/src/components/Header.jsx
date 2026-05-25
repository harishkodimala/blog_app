import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import logo from '../assets/logo.png'
import { useAuth } from '../store/authStore'
import { toast } from 'react-hot-toast'
import { Menu, X } from 'lucide-react'

function Header() {
    const { currentUser, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    const [menuOpen, setMenuOpen] = useState(false)

    const onLogout = async () => {
        try {
            await logout()
            toast.success('Logged out successfully!')
            navigate('/login')
        } catch (err) {
            toast.error('Logout failed!')
        }
    }

    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <NavLink
                    to="/"
                    className="flex items-center gap-3"
                    onClick={closeMenu}
                >
                    <img
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-md"
                        src={logo}
                        alt="Blog App"
                    />

                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                            BlogSphere
                        </h1>

                        <p className="text-xs text-gray-500 hidden sm:block">
                            Share your stories
                        </p>
                    </div>
                </NavLink>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">

                    <ul className="flex items-center gap-7">

                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive
                                        ? 'text-black font-semibold'
                                        : 'text-gray-600 hover:text-black transition'
                                }
                            >
                                Home
                            </NavLink>
                        </li>

                        {!isAuthenticated && (
                            <>
                                <li>
                                    <NavLink
                                        to="/register"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'text-black font-semibold'
                                                : 'text-gray-600 hover:text-black transition'
                                        }
                                    >
                                        Register
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'text-black font-semibold'
                                                : 'text-gray-600 hover:text-black transition'
                                        }
                                    >
                                        Login
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {isAuthenticated && (
                            <>
                                {currentUser?.role === 'USER' && (
                                    <li>
                                        <NavLink
                                            to="/userdashboard"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? 'text-black font-semibold'
                                                    : 'text-gray-600 hover:text-black transition'
                                            }
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                )}

                                {currentUser?.role === 'AUTHOR' && (
                                    <li>
                                        <NavLink
                                            to="/authordashboard"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? 'text-black font-semibold'
                                                    : 'text-gray-600 hover:text-black transition'
                                            }
                                        >
                                            Author Panel
                                        </NavLink>
                                    </li>
                                )}

                                {currentUser?.role === 'ADMIN' && (
                                    <li>
                                        <NavLink
                                            to="/admindashboard"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? 'text-black font-semibold'
                                                    : 'text-gray-600 hover:text-black transition'
                                            }
                                        >
                                            Admin Panel
                                        </NavLink>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>

                    {/* Desktop User Section */}
                    {isAuthenticated && (
                        <div className="flex items-center gap-4 border-l border-gray-200 pl-6">

                            {(currentUser?.profileImageUrl || currentUser?.profileImage) ? (
                                <img
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                    src={currentUser?.profileImageUrl || currentUser?.profileImage}
                                    alt="user"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                                    {currentUser?.name?.charAt(0)}
                                </div>
                            )}

                            <button
                                onClick={onLogout}
                                className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition duration-300 text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden"
                >
                    {menuOpen ? (
                        <X size={28} />
                    ) : (
                        <Menu size={28} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white px-4 py-5 shadow-lg">

                    <ul className="flex flex-col gap-5">

                        <li>
                            <NavLink
                                to="/"
                                onClick={closeMenu}
                                className="text-gray-700 hover:text-black"
                            >
                                Home
                            </NavLink>
                        </li>

                        {!isAuthenticated && (
                            <>
                                <li>
                                    <NavLink
                                        to="/register"
                                        onClick={closeMenu}
                                        className="text-gray-700 hover:text-black"
                                    >
                                        Register
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/login"
                                        onClick={closeMenu}
                                        className="text-gray-700 hover:text-black"
                                    >
                                        Login
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {isAuthenticated && (
                            <>
                                {currentUser?.role === 'USER' && (
                                    <li>
                                        <NavLink
                                            to="/userdashboard"
                                            onClick={closeMenu}
                                            className="text-gray-700 hover:text-black"
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                )}

                                {currentUser?.role === 'AUTHOR' && (
                                    <li>
                                        <NavLink
                                            to="/authordashboard"
                                            onClick={closeMenu}
                                            className="text-gray-700 hover:text-black"
                                        >
                                            Author Panel
                                        </NavLink>
                                    </li>
                                )}

                                {currentUser?.role === 'ADMIN' && (
                                    <li>
                                        <NavLink
                                            to="/admindashboard"
                                            onClick={closeMenu}
                                            className="text-gray-700 hover:text-black"
                                        >
                                            Admin Panel
                                        </NavLink>
                                    </li>
                                )}

                                {/* Mobile User Info */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">

                                    {(currentUser?.profileImageUrl || currentUser?.profileImage) ? (
                                        <img
                                            className="w-10 h-10 rounded-full object-cover"
                                            src={currentUser?.profileImageUrl || currentUser?.profileImage}
                                            alt="user"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                                            {currentUser?.name?.charAt(0)}
                                        </div>
                                    )}

                                    <button
                                        onClick={onLogout}
                                        className="bg-black text-white px-5 py-2 rounded-full text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </header>
    )
}

export default Header