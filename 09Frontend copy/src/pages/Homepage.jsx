import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import MainNavbar from '../components/MainNavbar';
import PaginationControls from '../components/PaginationControls';

const PROBLEMS_PER_PAGE = 10;

function Homepage() {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const solvedProblemIds = new Set(solvedProblems.map((problem) => problem._id));

  const filteredProblems = problems.filter(problem => {
    const normalizedTitle = (problem.title || '').toLowerCase();
    const normalizedDifficulty = (problem.difficulty || '').toLowerCase();
    const normalizedTags = Array.isArray(problem.tags)
      ? problem.tags.map((tag) => (tag || '').toLowerCase())
      : [(problem.tags || '').toLowerCase()];

    const searchMatch =
      normalizedTitle.includes(filters.search.trim().toLowerCase());
    const difficultyMatch =
      filters.difficulty === 'all' || normalizedDifficulty === filters.difficulty;
    const tagMatch =
      filters.tag === 'all' || normalizedTags.includes(filters.tag.toLowerCase());
    const statusMatch =
      filters.status === 'all' || solvedProblemIds.has(problem._id);

    return searchMatch && difficultyMatch && tagMatch && statusMatch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.difficulty, filters.tag, filters.status]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const totalPages = Math.ceil(filteredProblems.length / PROBLEMS_PER_PAGE);
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * PROBLEMS_PER_PAGE,
    currentPage * PROBLEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-base-200">
      <MainNavbar />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <label className="input input-bordered flex items-center gap-3 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.5 3a5.5 5.5 0 013.937 9.34l3.611 3.612a1 1 0 01-1.414 1.414l-3.612-3.611A5.5 5.5 0 118.5 3zm-3.5 5.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Search problems by title"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </label>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* New Status Filter */}
          <select 
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select 
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.length > 0 ? (
            paginatedProblems.map(problem => (
              <div key={problem._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <h2 className="card-title">
                      <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
                        {problem.title}
                      </NavLink>
                    </h2>
                    {solvedProblemIds.has(problem._id) && (
                      <div className="badge badge-success gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Solved
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
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
              </div>
            ))
          ) : (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p className="text-base-content/70">No problems match your search and selected filters.</p>
              </div>
            </div>
          )}
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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

export default Homepage;
