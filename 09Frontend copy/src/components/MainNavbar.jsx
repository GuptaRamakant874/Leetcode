import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';

function MainNavbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const userLabel = user?.firstName || user?.name || user?.email || user?.emailId || '?';
  const userInitial = userLabel.trim().charAt(0).toUpperCase() || '?';

  return (
    <nav className="navbar sticky top-0 z-50 bg-base-100/95 shadow-lg backdrop-blur px-4">
      <div className="flex-1">
        <NavLink to="/" className="btn btn-ghost text-xl">
          CodeNexus
        </NavLink>
      </div>
      <div className="flex-none gap-4">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost">
            {userInitial}
          </div>
          <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            {user?.role === 'admin' && (
              <li>
                <NavLink to="/admin">Admin View</NavLink>
              </li>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;
