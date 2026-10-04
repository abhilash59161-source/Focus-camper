import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  BookOpen,
  GraduationCap,
  Hash,
  Palette,
  Trash2,
  Check,
  ArrowLeft,
  Layers,
  Tag,
  Sparkles,
  Clock,
  PlusCircle,
  Download,
  Search,
  CheckSquare,
  Square,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Subject } from '../types';
import {
  INDIAN_UNIVERSITY_BRANCHES,
  SUBJECT_COLOR_PRESETS,
  BRANCH_STARTER_SUGGESTIONS,
} from '../utils/storage';

interface SubjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onSaveSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddTopicToSubject: (subjectId: string, topicName: string) => void;
  onRemoveTopicFromSubject: (subjectId: string, topicName: string) => void;
  onBulkImportSubjects: (subjects: Subject[]) => void;
  userBranch?: string;
  onStartTimerWithSubject?: (subjectId: string, topic?: string) => void;
}

export const SubjectManagerModal: React.FC<SubjectManagerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSaveSubject,
  onDeleteSubject,
  onAddTopicToSubject,
  onRemoveTopicFromSubject,
  onBulkImportSubjects,
  userBranch = 'Computer Science & Engineering (CSE)',
  onStartTimerWithSubject,
}) => {
  // Mode: 'bulk_import' | 'manual_create' | 'manage_list'
  const [activeTab, setActiveTab] = useState<'bulk_import' | 'manual_create' | 'manage_list'>(
    subjects.length === 0 ? 'bulk_import' : 'bulk_import'
  );

  // Manual creation states
  const [name, setName] = useState('');
  const [branch, setBranch] = useState(userBranch || INDIAN_UNIVERSITY_BRANCHES[0]);
  const [code, setCode] = useState('');
  const [semester, setSemester] = useState('Semester 3');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [topicInput, setTopicInput] = useState('');
  const [topicsList, setTopicsList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Bulk import states
  const [bulkBranch, setBulkBranch] = useState(userBranch || INDIAN_UNIVERSITY_BRANCHES[0]);
  const [bulkSearch, setBulkSearch] = useState('');
  const [selectedSubjectIndices, setSelectedSubjectIndices] = useState<number[]>([]);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // Per-subject inline topic adder state
  const [inlineTopicInputs, setInlineTopicInputs] = useState<Record<string, string>>({});

  // Get syllabus templates for the selected branch
  const branchSuggestions = useMemo(() => {
    return BRANCH_STARTER_SUGGESTIONS[bulkBranch] || BRANCH_STARTER_SUGGESTIONS['Computer Science & Engineering (CSE)'];
  }, [bulkBranch]);

  // Reset selection when branch changes
  React.useEffect(() => {
    if (branchSuggestions) {
      // Default to selecting all subjects in this branch
      setSelectedSubjectIndices(branchSuggestions.map((_, i) => i));
    }
  }, [bulkBranch, branchSuggestions]);

  if (!isOpen) return null;

  // Filtered syllabus subjects for search
  const filteredSuggestions = branchSuggestions
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      if (!bulkSearch.trim()) return true;
      const q = bulkSearch.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchTopic = item.topics.some((t) => t.toLowerCase().includes(q));
      return matchName || matchCode || matchTopic;
    });

  const handleToggleSelectSubject = (originalIndex: number) => {
    setSelectedSubjectIndices((prev) =>
      prev.includes(originalIndex)
        ? prev.filter((i) => i !== originalIndex)
        : [...prev, originalIndex]
    );
  };

  const handleSelectAll = () => {
    setSelectedSubjectIndices(branchSuggestions.map((_, i) => i));
  };

  const handleDeselectAll = () => {
    setSelectedSubjectIndices([]);
  };

  // Perform bulk import
  const handleExecuteBulkImport = () => {
    if (selectedSubjectIndices.length === 0) return;

    const subjectsToImport: Subject[] = selectedSubjectIndices.map((idx) => {
      const template = branchSuggestions[idx];
      const color = SUBJECT_COLOR_PRESETS[template.colorIdx % SUBJECT_COLOR_PRESETS.length];

      return {
        id: `sub_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 5)}`,
        name: template.name,
        branch: bulkBranch,
        code: template.code,
        semester: template.semester || 'Semester 3',
        topics: [...template.topics],
        colorName: color.name,
        bgLight: color.bgLight,
        textDark: color.textDark,
        borderLight: color.borderLight,
        badgeBg: color.badgeBg,
        badgeText: color.badgeText,
        hex: color.hex,
      };
    });

    const totalTopics = subjectsToImport.reduce((acc, s) => acc + s.topics.length, 0);

    onBulkImportSubjects(subjectsToImport);
    setImportSuccessMsg(
      `Successfully imported ${subjectsToImport.length} subjects and ${totalTopics} syllabus topics for ${bulkBranch}!`
    );

    // After 2 seconds, switch to manage_list to see newly imported subjects
    setTimeout(() => {
      setActiveTab('manage_list');
      setImportSuccessMsg(null);
    }, 1600);
  };

  // Manual Subject Creator handlers
  const handleAddTopicToNewSubject = () => {
    const trimmed = topicInput.trim();
    if (!trimmed) return;
    if (topicsList.includes(trimmed)) {
      setError('Topic already added to this subject.');
      return;
    }
    setTopicsList((prev) => [...prev, trimmed]);
    setTopicInput('');
    setError(null);
  };

  const handleRemoveTopicFromNewSubject = (index: number) => {
    setTopicsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a subject title (e.g., Data Structures & Algorithms).');
      return;
    }
    if (!branch.trim()) {
      setError('Please select or specify the branch for this subject.');
      return;
    }

    const colorConfig = SUBJECT_COLOR_PRESETS[selectedColorIdx] || SUBJECT_COLOR_PRESETS[0];

    const finalTopics = [...topicsList];
    if (topicInput.trim() && !finalTopics.includes(topicInput.trim())) {
      finalTopics.push(topicInput.trim());
    }

    const newSub: Subject = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      branch: branch.trim(),
      topics: finalTopics,
      code: code.trim().toUpperCase() || undefined,
      semester: semester.trim() || undefined,
      colorName: colorConfig.name,
      bgLight: colorConfig.bgLight,
      textDark: colorConfig.textDark,
      borderLight: colorConfig.borderLight,
      badgeBg: colorConfig.badgeBg,
      badgeText: colorConfig.badgeText,
      hex: colorConfig.hex,
    };

    onSaveSubject(newSub);
    setName('');
    setCode('');
    setTopicInput('');
    setTopicsList([]);
    setError(null);
    setActiveTab('manage_list');
  };

  const handleAddInlineTopic = (subjectId: string) => {
    const text = (inlineTopicInputs[subjectId] || '').trim();
    if (!text) return;
    onAddTopicToSubject(subjectId, text);
    setInlineTopicInputs((prev) => ({ ...prev, [subjectId]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] transform animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Back button */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Subject & Branch Management
              </h2>
              <span className="text-xs text-slate-500">
                Bulk-import standard university syllabi or create custom courses with topics
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Segmented Navigation Tabs */}
        <div className="bg-slate-100/80 p-2 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              type="button"
              onClick={() => setActiveTab('bulk_import')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'bulk_import'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Bulk-Import Branch Syllabi</span>
              <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] rounded-full font-bold">
                Indian AICTE/UGC
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manual_create')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manual_create'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Create Custom</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manage_list')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manage_list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Your Registered Subjects ({subjects.length})</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: BULK IMPORT SYLLABI */}
          {activeTab === 'bulk_import' && (
            <div className="space-y-5">
              {/* Success Notification */}
              {importSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importSuccessMsg}</span>
                </div>
              )}

              {/* Branch Selector Header */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Indian University Common Syllabi Repository</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Select your engineering or science branch to preview and 1-click import all verified semester subjects and syllabus topics.
                  </p>
                </div>

                {/* Branch Selection Dropdown */}
                <div className="min-w-[260px]">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-900 mb-1">
                    Select Indian University Branch:
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                    <select
                      value={bulkBranch}
                      onChange={(e) => setBulkBranch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
                    >
                      {INDIAN_UNIVERSITY_BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Search & Bulk Select Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                {/* Search Box */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={bulkSearch}
                    onChange={(e) => setBulkSearch(e.target.value)}
                    placeholder={`Search within ${bulkBranch.split(' ')[0]} subjects or topics...`}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Select All / Deselect All Controls */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Select All ({branchSuggestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Deselect All
                  </button>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-800">
                    {selectedSubjectIndices.length} of {branchSuggestions.length} selected
                  </span>
                </div>
              </div>

              {/* Syllabus Subjects Cards Grid */}
              <div className="space-y-3">
                {filteredSuggestions.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
                    No subjects match "{bulkSearch}". Clear your search query to see all subjects for {bulkBranch}.
                  </div>
                ) : (
                  filteredSuggestions.map(({ item, originalIndex }) => {
                    const isSelected = selectedSubjectIndices.includes(originalIndex);
                    const alreadyInLedger = subjects.some(
                      (s) => s.name.trim().toLowerCase() === item.name.trim().toLowerCase()
                    );
                    const colorConfig = SUBJECT_COLOR_PRESETS[item.colorIdx % SUBJECT_COLOR_PRESETS.length];

                    return (
                      <div
                        key={originalIndex}
                        onClick={() => handleToggleSelectSubject(originalIndex)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-2.5 ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Top row: Checkbox, Name, Code, Semester */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <button
                              type="button"
                              className="mt-0.5 text-blue-600 shrink-0 focus:outline-hidden"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 fill-blue-600 text-white" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: colorConfig.hex }}
                                />
                                <h4 className="text-sm font-bold text-slate-900">
                                  {item.name}
                                </h4>
                                {item.code && (
                                  <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                    {item.code}
                                  </span>
                                )}
                                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  {item.semester}
                                </span>
                                {alreadyInLedger && (
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Already in your ledger
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <span className="text-xs font-semibold text-slate-500 shrink-0">
                            {item.topics.length} topics
                          </span>
                        </div>

                        {/* Detailed Syllabus Topics Pills */}
                        <div className="pl-7">
                          <div className="flex flex-wrap gap-1.5">
                            {item.topics.map((top, tIdx) => (
                              <span
                                key={tIdx}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                  isSelected
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                                }`}
                              >
                                {top}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sticky / Floating Import Action Summary */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="text-xs font-semibold text-slate-300">
                    Branch: <span className="text-white font-bold">{bulkBranch}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Ready to import <strong>{selectedSubjectIndices.length}</strong> subjects with syllabus topics into your focus tracker.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('manual_create')}
                    className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Or create custom
                  </button>
                  <button
                    type="button"
                    disabled={selectedSubjectIndices.length === 0}
                    onClick={handleExecuteBulkImport}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Import {selectedSubjectIndices.length} Subjects to Ledger</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL CREATE SUBJECT & TOPICS */}
          {activeTab === 'manual_create' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Prefer pre-built syllabus? Use the Bulk-Import tool to load verified semester courses.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('bulk_import')}
                  className="font-bold underline text-blue-700 hover:text-blue-900 cursor-pointer ml-2 shrink-0"
                >
                  Switch to Bulk Import →
                </button>
              </div>

              <form onSubmit={handleCreateManual} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span>Create Custom Subject with Branch & Topics</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Fully customizable</span>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Subject Name & Subject Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Subject Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="e.g., Finite Element Methods, Cryptography"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Subject Code
                    </label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g., ME401"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Branch of Subject & Semester */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Branch / Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        {INDIAN_UNIVERSITY_BRANCHES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    >
                      <option value="Semester 1">Semester 1 (1st Year)</option>
                      <option value="Semester 2">Semester 2 (1st Year)</option>
                      <option value="Semester 3">Semester 3 (2nd Year)</option>
                      <option value="Semester 4">Semester 4 (2nd Year)</option>
                      <option value="Semester 5">Semester 5 (3rd Year)</option>
                      <option value="Semester 6">Semester 6 (3rd Year)</option>
                      <option value="Semester 7">Semester 7 (Final Year)</option>
                      <option value="Semester 8">Semester 8 (Final Year)</option>
                    </select>
                  </div>
                </div>

                {/* Create Topics Section for this Subject */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700 uppercase flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      <span>Syllabus Topics (Modules, Chapters, Units)</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {topicsList.length} topic(s) staged
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopicToNewSubject();
                        }
                      }}
                      placeholder="Enter topic name (e.g., Boundary Layer Flow, K-Maps) and press Enter"
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddTopicToNewSubject}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Topic</span>
                    </button>
                  </div>

                  {/* Staged Topics Chips */}
                  {topicsList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {topicsList.map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-medium"
                        >
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTopicFromNewSubject(idx)}
                            className="text-blue-500 hover:text-red-600 cursor-pointer"
                            title="Remove topic"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      Tip: Add syllabus topics here so you can easily select them during Pomodoro sessions and daily logging.
                    </p>
                  )}
                </div>

                {/* Visual Color Palette */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-slate-400" />
                    <span>Subject Theme Color</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {SUBJECT_COLOR_PRESETS.map((color, idx) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          selectedColorIdx === idx
                            ? 'ring-2 ring-offset-2 ring-slate-900 scale-110 shadow-xs'
                            : 'opacity-75 hover:opacity-100 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColorIdx === idx && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit New Subject */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <span className="text-xs text-slate-500">
                    Branch: <strong>{branch}</strong>
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Subject & Topics</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: REGISTERED SUBJECTS LIST */}
          {activeTab === 'manage_list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Your Registered Subjects ({subjects.length})
                  </h3>
                  <span className="text-xs text-slate-500">
                    Active academic courses in your focus ledger
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('bulk_import')}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Bulk-Import More</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('manual_create')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add New</span>
                  </button>
                </div>
              </div>

              {subjects.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500 space-y-3">
                  <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Your ledger is currently at zero!</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bulk-import standard semester syllabi for your branch or add custom subjects.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bulk_import')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    + Bulk-Import {userBranch.split(' ')[0]} Syllabi
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {subjects.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-3"
                    >
                      {/* Subject Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
                            style={{ backgroundColor: sub.hex }}
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {sub.name}
                              </h4>
                              {sub.code && (
                                <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                  {sub.code}
                                </span>
                              )}
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                {sub.branch}
                              </span>
                              {sub.semester && (
                                <span className="text-[10px] text-slate-500">
                                  {sub.semester}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions: Focus & Delete */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {onStartTimerWithSubject && (
                            <button
                              type="button"
                              onClick={() => {
                                onStartTimerWithSubject(sub.id);
                                onClose();
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Clock className="w-3 h-3" />
                              <span>Focus</span>
                            </button>
                          )}

                          {deleteConfirmId === sub.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteSubject(sub.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(sub.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Subject"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Topics Sub-section */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold mb-2">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-400" />
                            <span>Syllabus Topics ({sub.topics ? sub.topics.length : 0})</span>
                          </span>
                        </div>

                        {/* List of existing topics for this subject */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          {sub.topics && sub.topics.length > 0 ? (
                            sub.topics.map((top, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg text-[11px] transition-colors"
                              >
                                <span>{top}</span>
                                <button
                                  type="button"
                                  onClick={() => onRemoveTopicFromSubject(sub.id, top)}
                                  className="text-slate-400 hover:text-red-600 ml-0.5 cursor-pointer"
                                  title={`Remove topic "${top}"`}
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              No topics added yet. Add topics below to make session logging seamless.
                            </span>
                          )}
                        </div>

                        {/* Quick inline topic adder for this subject */}
                        <div className="flex items-center gap-1.5 max-w-md">
                          <input
                            type="text"
                            value={inlineTopicInputs[sub.id] || ''}
                            onChange={(e) =>
                              setInlineTopicInputs((prev) => ({
                                ...prev,
                                [sub.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddInlineTopic(sub.id);
                              }
                            }}
                            placeholder={`Add new topic to ${sub.name}...`}
                            className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddInlineTopic(sub.id)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer with Back Button */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
