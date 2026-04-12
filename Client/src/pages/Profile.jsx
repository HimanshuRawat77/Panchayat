import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch user data using fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setPreviewImage(data.avatar);
        } else {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle Image Upload (Display Picture)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for Base64
        toast.error("Image size should be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        setUser({ ...user, avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  // Update profile using fetch
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        const data = await res.json();
        // Crucial: Update localStorage so Dashboard can see it!
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Profile updated successfully! ✅");
        setEditMode(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Update failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Update error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex justify-center items-center font-outfit">
      <Toaster position="top-center" />
      <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] p-10 w-full max-w-xl border border-slate-100 dark:border-slate-800">
        
        <h2 className="text-3xl font-black mb-10 text-center text-slate-900 dark:text-white tracking-tight">👤 User Profile</h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-6xl shadow-inner">
              {previewImage && (previewImage.startsWith('data') || previewImage.startsWith('http')) ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="opacity-50">{user.avatar || '👤'}</span>
              )}
            </div>
            {editMode && (
              <label className="absolute bottom-1 right-1 bg-blue-600 p-3 rounded-full text-white cursor-pointer shadow-xl hover:bg-blue-700 hover:scale-110 transition-all border-4 border-white dark:border-slate-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 mt-4">Profile Image Status: {previewImage ? 'Active' : 'Not Set'}</p>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Full Name", name: "fullName" },
            { label: "Phone", name: "phoneNumber" },
            { label: "Email", name: "email" },
            { label: "House No.", name: "houseNumber" },
            { label: "Block", name: "block" },
            { label: "Nationality", name: "nationality" },
            { label: "Religion", name: "religion" },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={user[field.name] || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-4 border rounded-2xl font-bold transition-all ${
                  editMode 
                    ? "bg-white dark:bg-slate-800 border-blue-500/40 focus:ring-4 focus:ring-blue-500/10 text-slate-900 dark:text-white" 
                    : "bg-slate-50 dark:bg-slate-950 border-transparent text-slate-500 dark:text-slate-500 cursor-not-allowed"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-12">
          {editMode ? (
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center justify-center"
            >
              {loading ? "Syncing..." : "Publish Changes"}
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-5 rounded-2xl shadow-xl hover:-translate-y-1 transition-all"
            >
              Modify Details
            </button>
          )}

          <div className="flex gap-4">
             <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black py-5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-black py-5 rounded-2xl border-2 border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
            >
              Exit Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;