import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import MainNavbar from '../components/MainNavbar';
import PaginationControls from '../components/PaginationControls';

const SOLVED_PROBLEMS_PER_PAGE = 10;

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loadingSolvedProblems, setLoadingSolvedProblems] = useState(true);
  const [currentSolvedPage, setCurrentSolvedPage] = useState(1);
  const [profileStats, setProfileStats] = useState({
    totalSubmissions: 0,
    totalActiveDays: 0
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [solvedProblemsResponse, profileStatsResponse] = await Promise.all([
          axiosClient.get('/problem/problemSolvedByUser'),
          axiosClient.get('/problem/profileStats')
        ]);

        setSolvedProblems(Array.isArray(solvedProblemsResponse.data) ? solvedProblemsResponse.data : []);
        setProfileStats({
          totalSubmissions: profileStatsResponse.data?.totalSubmissions || 0,
          totalActiveDays: profileStatsResponse.data?.totalActiveDays || 0
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setSolvedProblems([]);
        setProfileStats({
          totalSubmissions: 0,
          totalActiveDays: 0
        });
      } finally {
        setLoadingSolvedProblems(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    setCurrentSolvedPage(1);
  }, [solvedProblems.length]);

  const fullName = user?.firstName || user?.name || 'User';
  const email = user?.emailId || user?.email || 'Not available';
  const role = user?.role || 'user';
  const userInitial = fullName.trim().charAt(0).toUpperCase() || '?';
  const solvedProblemsTotalPages = Math.ceil(solvedProblems.length / SOLVED_PROBLEMS_PER_PAGE);
  const paginatedSolvedProblems = solvedProblems.slice(
    (currentSolvedPage - 1) * SOLVED_PROBLEMS_PER_PAGE,
    currentSolvedPage * SOLVED_PROBLEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-base-200">
      <MainNavbar />

      <div className="container mx-auto p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold">
                {userInitial}
              </div>
              <h1 className="text-2xl font-bold">{fullName}</h1>
              <div className="badge badge-outline capitalize">{role}</div>
              <div className="w-full text-left mt-4 space-y-4">
                <div>
                  <p className="text-sm text-base-content/60">Email</p>
                  <p className="font-medium break-all">{email}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-base-content/60">Solved Problems</p>
                  <p className="font-medium">{solvedProblems.length}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Total Active Days</p>
                  <p className="font-medium">{loadingSolvedProblems ? '...' : profileStats.totalActiveDays}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Total Submissions</p>
                  <p className="font-medium">{loadingSolvedProblems ? '...' : profileStats.totalSubmissions}</p>
                </div> */}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-sm text-base-content/60">Profile Type</p>
                  <p className="text-2xl font-bold capitalize">{role}</p>
                </div>
              </div> */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-sm text-base-content/60">Problems Solved</p>
                  <p className="text-2xl font-bold">{loadingSolvedProblems ? '...' : solvedProblems.length}</p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-sm text-base-content/60">Active Days</p>
                  <p className="text-2xl font-bold">
                    {loadingSolvedProblems ? '...' : `${profileStats.totalActiveDays}`}
                  </p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <p className="text-sm text-base-content/60">Submissions</p>
                  <p className="text-2xl font-bold capitalize">{profileStats.totalSubmissions}</p>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="card-title">Solved Problems</h2>
                    <p className="text-sm text-base-content/70">Problems you have already completed.</p>
                  </div>
                  <NavLink to="/" className="btn btn-outline btn-sm">
                    Back To Homepage
                  </NavLink>
                </div>

                {loadingSolvedProblems ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                ) : solvedProblems.length > 0 ? (
                  <>
                    <div className="grid gap-3 mt-4">
                      {paginatedSolvedProblems.map((problem) => (
                        <div key={problem._id} className="border border-base-300 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                          <div>
                            <NavLink to={`/problem/${problem._id}`} className="font-semibold hover:text-primary">
                              {problem.title}
                            </NavLink>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                                {problem.difficulty}
                              </div>
                              {getProblemTags(problem.tags).map((tag) => (
                                <div key={`${problem._id}-${tag}`} className="badge badge-info">
                                  {formatTagLabel(tag)}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="badge badge-success">Solved</div>
                        </div>
                      ))}
                    </div>

                    <PaginationControls
                      currentPage={currentSolvedPage}
                      totalPages={solvedProblemsTotalPages}
                      onPageChange={setCurrentSolvedPage}
                    />
                  </>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-base-300 p-6 text-center text-base-content/70">
                    No solved problems yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getProblemTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (!tags) return [];
  return [tags];
};

const formatTagLabel = (tag) => {
  switch ((tag || '').toLowerCase()) {
    case 'linkedlist':
      return 'Linked List';
    case 'dp':
      return 'DP';
    default:
      return tag;
  }
};

const getDifficultyBadgeColor = (difficulty) => {
  switch ((difficulty || '').toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Profile;
