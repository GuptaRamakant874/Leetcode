import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';

const EMPTY_VISIBLE = { input: '', output: '', explanation: '' };
const EMPTY_HIDDEN = { input: '', output: '' };
const LANGUAGE_ORDER = ['c++', 'java', 'javascript'];
const TAG_OPTIONS = ['array', 'LinkedList', 'graph', 'DP'];

const createEmptyForm = () => ({
  title: '',
  description: '',
  difficulty: 'easy',
  tags: ['array'],
  visibleTestCases: [{ ...EMPTY_VISIBLE }],
  hiddenTestCases: [{ ...EMPTY_HIDDEN }],
  startCode: LANGUAGE_ORDER.map((language) => ({ language, initialCode: '' })),
  referenceSolution: LANGUAGE_ORDER.map((language) => ({ language, completeCode: '' }))
});

const normalizeLanguage = (language = '') => {
  const value = String(language).trim().toLowerCase();
  if (value === 'cpp') return 'c++';
  if (value === 'js') return 'javascript';
  return value;
};

const normalizeProblemForForm = (problem = {}) => {
  const startCodeMap = new Map(
    (problem.startCode || []).map((item) => [normalizeLanguage(item.language), item.initialCode || ''])
  );
  const solutionMap = new Map(
    (problem.referenceSolution || []).map((item) => [normalizeLanguage(item.language), item.completeCode || ''])
  );

  return {
    title: problem.title || '',
    description: problem.description || '',
    difficulty: problem.difficulty || 'easy',
    tags: Array.isArray(problem.tags) && problem.tags.length ? problem.tags : ['array'],
    visibleTestCases: Array.isArray(problem.visibleTestCases) && problem.visibleTestCases.length
      ? problem.visibleTestCases.map((item) => ({
          input: item.input || '',
          output: item.output || '',
          explanation: item.explanation || ''
        }))
      : [{ ...EMPTY_VISIBLE }],
    hiddenTestCases: Array.isArray(problem.hiddenTestCases) && problem.hiddenTestCases.length
      ? problem.hiddenTestCases.map((item) => ({
          input: item.input || '',
          output: item.output || ''
        }))
      : [{ ...EMPTY_HIDDEN }],
    startCode: LANGUAGE_ORDER.map((language) => ({
      language,
      initialCode: startCodeMap.get(language) || ''
    })),
    referenceSolution: LANGUAGE_ORDER.map((language) => ({
      language,
      completeCode: solutionMap.get(language) || ''
    }))
  };
};

function AdminUpdate() {
  const { problemId } = useParams();
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(problemId || '');
  const [formData, setFormData] = useState(createEmptyForm());
  const [listLoading, setListLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setListLoading(true);
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch problems for update.');
      } finally {
        setListLoading(false);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    if (!problemId) {
      return;
    }

    setSelectedProblemId(problemId);
  }, [problemId]);

  useEffect(() => {
    if (!selectedProblemId) {
      setFormData(createEmptyForm());
      return;
    }

    const fetchProblem = async () => {
      try {
        setFormLoading(true);
        setError('');
        setSuccess('');
        const { data } = await axiosClient.get(`/problem/admin/problemById/${selectedProblemId}`);
        setFormData(normalizeProblemForForm(data));
      } catch (err) {
        setError('Failed to load the selected problem.');
      } finally {
        setFormLoading(false);
      }
    };

    fetchProblem();
  }, [selectedProblemId]);

  const selectedProblem = useMemo(
    () => problems.find((problem) => problem._id === selectedProblemId),
    [problems, selectedProblemId]
  );

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const addArrayItem = (field, emptyItem) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { ...emptyItem }]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const validateForm = () => {
    if (!selectedProblemId) return 'Please select a problem to update.';
    if (!formData.title.trim()) return 'Title is required.';
    if (!formData.description.trim()) return 'Description is required.';
    if (!formData.tags.length) return 'At least one tag is required.';
    if (formData.visibleTestCases.some((item) => !item.input.trim() || !item.output.trim() || !item.explanation.trim())) {
      return 'All visible test case fields are required.';
    }
    if (formData.hiddenTestCases.some((item) => !item.input.trim() || !item.output.trim())) {
      return 'All hidden test case fields are required.';
    }
    if (formData.startCode.some((item) => !item.initialCode.trim())) {
      return 'Initial code is required for all languages.';
    }
    if (formData.referenceSolution.some((item) => !item.completeCode.trim())) {
      return 'Reference solution is required for all languages.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: formData.tags,
        visibleTestCases: formData.visibleTestCases.map((item) => ({
          input: item.input.trim(),
          output: item.output.trim(),
          explanation: item.explanation.trim()
        })),
        hiddenTestCases: formData.hiddenTestCases.map((item) => ({
          input: item.input.trim(),
          output: item.output.trim()
        })),
        startCode: formData.startCode.map((item) => ({
          language: item.language,
          initialCode: item.initialCode
        })),
        referenceSolution: formData.referenceSolution.map((item) => ({
          language: item.language,
          completeCode: item.completeCode
        }))
      };

      const { data } = await axiosClient.patch(`/problem/update/${selectedProblemId}`, payload);
      setFormData(normalizeProblemForForm(data));
      setProblems((prev) =>
        prev.map((problem) =>
          problem._id === selectedProblemId
            ? { ...problem, title: data.title, difficulty: data.difficulty, tags: data.tags }
            : problem
        )
      );
      setSuccess('Problem updated successfully and saved to the database.');
    } catch (err) {
      setError(err?.response?.data || err?.response?.data?.message || err.message || 'Failed to update problem.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Update Problem</h1>
          <p className="text-base-content/70">Select a problem, edit it, and save the changes to MongoDB.</p>
        </div>
        <Link to="/admin" className="btn btn-ghost">
          Back to Admin
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card bg-base-100 shadow-lg p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Select Problem</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedProblemId}
              onChange={(event) => setSelectedProblemId(event.target.value)}
              disabled={listLoading}
            >
              <option value="">Choose a problem</option>
              {problems.map((problem) => (
                <option key={problem._id} value={problem._id}>
                  {problem.title}
                </option>
              ))}
            </select>
          </div>

          {selectedProblemId && (
            <Link to={`/problem/${selectedProblemId}`} className="btn btn-outline">
              Open Problem
            </Link>
          )}
        </div>
      </div>

      {selectedProblemId && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            {formLoading ? (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    value={formData.title}
                    onChange={(event) => updateField('title', event.target.value)}
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(event) => updateField('description', event.target.value)}
                    className="textarea textarea-bordered h-36"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Difficulty</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.difficulty}
                      onChange={(event) => updateField('difficulty', event.target.value)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tag</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.tags[0] || 'array'}
                      onChange={(event) => updateField('tags', [event.target.value])}
                    >
                      {TAG_OPTIONS.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!formLoading && (
            <>
              <div className="card bg-base-100 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Visible Test Cases</h2>
                  <button type="button" className="btn btn-sm btn-primary" onClick={() => addArrayItem('visibleTestCases', EMPTY_VISIBLE)}>
                    Add Visible Case
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.visibleTestCases.map((testCase, index) => (
                    <div key={`visible-${index}`} className="rounded-lg border border-base-300 p-4 space-y-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Visible Case {index + 1}</h3>
                        {formData.visibleTestCases.length > 1 && (
                          <button type="button" className="btn btn-xs btn-error" onClick={() => removeArrayItem('visibleTestCases', index)}>
                            Remove
                          </button>
                        )}
                      </div>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(event) => updateArrayField('visibleTestCases', index, 'input', event.target.value)}
                      />
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Output"
                        value={testCase.output}
                        onChange={(event) => updateArrayField('visibleTestCases', index, 'output', event.target.value)}
                      />
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Explanation"
                        value={testCase.explanation}
                        onChange={(event) => updateArrayField('visibleTestCases', index, 'explanation', event.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Hidden Test Cases</h2>
                  <button type="button" className="btn btn-sm btn-primary" onClick={() => addArrayItem('hiddenTestCases', EMPTY_HIDDEN)}>
                    Add Hidden Case
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.hiddenTestCases.map((testCase, index) => (
                    <div key={`hidden-${index}`} className="rounded-lg border border-base-300 p-4 space-y-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Hidden Case {index + 1}</h3>
                        {formData.hiddenTestCases.length > 1 && (
                          <button type="button" className="btn btn-xs btn-error" onClick={() => removeArrayItem('hiddenTestCases', index)}>
                            Remove
                          </button>
                        )}
                      </div>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(event) => updateArrayField('hiddenTestCases', index, 'input', event.target.value)}
                      />
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Output"
                        value={testCase.output}
                        onChange={(event) => updateArrayField('hiddenTestCases', index, 'output', event.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Code Templates and Reference Solutions</h2>
                <div className="space-y-6">
                  {LANGUAGE_ORDER.map((language, index) => (
                    <div key={language} className="rounded-lg border border-base-300 p-4 space-y-3">
                      <h3 className="text-lg font-semibold">{language === 'c++' ? 'C++' : language === 'javascript' ? 'JavaScript' : 'Java'}</h3>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Initial Code</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered font-mono h-44"
                          value={formData.startCode[index]?.initialCode || ''}
                          onChange={(event) => updateArrayField('startCode', index, 'initialCode', event.target.value)}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Reference Solution</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered font-mono h-44"
                          value={formData.referenceSolution[index]?.completeCode || ''}
                          onChange={(event) => updateArrayField('referenceSolution', index, 'completeCode', event.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Link to="/admin" className="btn btn-ghost">
                  Cancel
                </Link>
                <button type="submit" className={`btn btn-warning ${saving ? 'loading' : ''}`} disabled={saving}>
                  Save Changes
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {!selectedProblemId && !listLoading && (
        <div className="rounded-xl border border-dashed border-base-300 p-8 text-center text-base-content/70">
          Select a problem above to start editing it.
        </div>
      )}

      {selectedProblem && (
        <div className="text-sm text-base-content/60">
          Editing: <span className="font-medium text-base-content">{selectedProblem.title}</span>
        </div>
      )}
    </div>
  );
}

export default AdminUpdate;
