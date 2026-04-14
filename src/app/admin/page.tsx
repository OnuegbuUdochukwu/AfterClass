"use client";

import { useState, useEffect } from "react";
import { searchUsers, getCourses, promoteUserRole } from "./actions";
import { Search, ShieldAlert, UserCheck } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
};

type AdminCourse = {
  id: string;
  code: string;
  name: string;
};

export default function AdminPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Form State for Promoting
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("student");

  // Fetch initial data
  useEffect(() => {
    async function loadCourses() {
      const res = await getCourses();
      if (res.data) setCourses(res.data);
    }
    loadCourses();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const res = await searchUsers(query);
    if (res.error) {
      setStatus(`Error: ${res.error}`);
    } else {
      setUsers(res.data || []);
      if (res.data?.length === 0) setStatus("No users found.");
    }
    setLoading(false);
  };

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedCourse) {
      setStatus("Please select a user and a course.");
      return;
    }
    setStatus("Updating role...");
    const res = await promoteUserRole(selectedUser, selectedCourse, selectedRole);
    if (res.error) {
      setStatus(`Failed: ${res.error}`);
    } else {
      setStatus(`Successfully assigned role '${selectedRole}'.`);
      // Reset form
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Search Section */}
      <section className="bg-[#1E2732] border border-gray-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Search size={20} className="mr-2 text-[#1D9BF0]" /> 
          Find User by Email
        </h2>
        
        <form onSubmit={handleSearch} className="flex space-x-3 mb-6">
          <input
            type="text"
            placeholder="student@uni.edu"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#15202B] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#1D9BF0] transition"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {users.length > 0 && (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="flex justify-between items-center bg-[#15202B] p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition">
                <div>
                  <p className="font-medium text-[#F7F9F9]">{u.email}</p>
                  <p className="text-sm text-[#8B98A5]">{u.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedUser(u.id)}
                  className="bg-transparent border border-[#1D9BF0] text-[#1D9BF0] hover:bg-[#1D9BF0]/10 px-4 py-1.5 rounded-full text-sm transition"
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Promotion Status Modal Component-like view */}
      {selectedUser && (
        <section className="bg-[#1E2732] border border-[#D4AF37]/50 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]"></div>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <ShieldAlert size={20} className="mr-2 text-[#D4AF37]" /> 
            Manage Role
          </h2>

          <p className="mb-4 text-sm text-[#8B98A5]">
            Target User ID: <span className="font-mono text-white">{selectedUser}</span>
          </p>

          <form onSubmit={handlePromote} className="space-y-5">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-[#F7F9F9]">Select Course Context</label>
              <select 
                value={selectedCourse} 
                onChange={e => setSelectedCourse(e.target.value)}
                className="bg-[#15202B] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition"
                required
              >
                <option value="" disabled>-- Select a Course --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-[#F7F9F9]">Select Privileged Role</label>
              <select 
                value={selectedRole} 
                onChange={e => setSelectedRole(e.target.value)}
                className="bg-[#15202B] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition"
              >
                <option value="student">Student (Standard)</option>
                <option value="rep">Course Rep (Moderator)</option>
                <option value="lecturer">Lecturer (Admin)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center space-x-4">
              <button 
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#c4a132] text-[#15202B] px-6 py-2 rounded-lg font-semibold flex items-center transition"
              >
                <UserCheck size={18} className="mr-2" /> Assign Role
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedUser(null)}
                className="text-[#8B98A5] hover:text-white transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Global Status Message */}
      {status && (
        <div className="bg-[#1D9BF0]/10 border border-[#1D9BF0]/50 text-[#1D9BF0] p-4 rounded-lg flex items-center">
          <p>{status}</p>
        </div>
      )}

    </div>
  );
}
