import React, { useState } from 'react';

const Registration = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        onRegister(formData.nickname);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'ERROR: ACCESS DENIED');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('SYSTEM ERROR: OFFLINE');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) => `
    w-full p-4 bg-black/40 border-2 transition-all duration-300 outline-none
    font-['Press_Start_2P'] text-[10px] text-green-400 placeholder-green-900
    ${focusedField === name ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'border-gray-800'}
  `;

  return (
    <div className="relative group max-w-2xl w-full mx-auto animate-in fade-in zoom-in duration-700">
      {/* Background Decorative Elements */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-800 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-gray-900 border-4 border-gray-800 p-8 md:p-12 shadow-2xl overflow-hidden">
        
        {/* Scanline Effect (Retro CRT) */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]"></div>

        <div className="relative z-10">
          <header className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-green-500 text-black text-[8px] font-bold mb-4 animate-pulse">
              SYSTEM ONLINE
            </div>
            <h1 className="text-2xl md:text-3xl font-['Press_Start_2P'] text-white tracking-tighter mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              PLAYER_ENTRY
            </h1>
            <div className="h-1 w-24 bg-green-500 mx-auto"></div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Row 1: Names */}
              <div className="space-y-2">
                <label className="flex items-center text-[8px] text-green-500 uppercase gap-2">
                  <span className="w-2 h-2 bg-green-500"></span> 01_First_Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  autoComplete="off"
                  className={inputClass('firstName')}
                  value={formData.firstName}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  onChange={handleChange}
                  placeholder="TYPE_HERE..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-[8px] text-green-500 uppercase gap-2">
                  <span className="w-2 h-2 bg-green-500"></span> 02_Last_Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  autoComplete="off"
                  className={inputClass('lastName')}
                  value={formData.lastName}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  onChange={handleChange}
                  placeholder="TYPE_HERE..."
                />
              </div>

              {/* Row 2: Gaming Identity */}
              <div className="space-y-2">
                <label className="flex items-center text-[8px] text-yellow-500 uppercase gap-2">
                  <span className="w-2 h-2 bg-yellow-500"></span> 03_Nickname
                </label>
                <input
                  name="nickname"
                  type="text"
                  required
                  autoComplete="off"
                  className={inputClass('nickname').replace('green', 'yellow').replace('emerald', 'orange')}
                  value={formData.nickname}
                  onFocus={() => setFocusedField('nickname')}
                  onBlur={() => setFocusedField(null)}
                  onChange={handleChange}
                  placeholder="ID_UNIQUE"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-[8px] text-blue-500 uppercase gap-2">
                  <span className="w-2 h-2 bg-blue-500"></span> 04_E-Mail
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  className={inputClass('email').replace('green', 'blue').replace('emerald', 'indigo')}
                  value={formData.email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={handleChange}
                  placeholder="CONTACT_LINK"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`
                  relative w-full py-6 font-['Press_Start_2P'] text-[12px] uppercase transition-all duration-300
                  ${loading 
                    ? 'bg-gray-800 text-gray-500 cursor-wait' 
                    : 'bg-green-600 text-white hover:bg-green-400 hover:shadow-[0_0_30px_rgba(74,222,128,0.6)] active:translate-y-1'}
                  border-b-8 border-green-900 active:border-b-0
                `}
              >
                {loading ? '>_SYNCING_DATA' : 'INITIALIZE_ADVENTURE'}
              </button>
            </div>
          </form>

          <footer className="mt-12 flex justify-between items-center text-[7px] text-gray-500 uppercase tracking-widest border-t border-gray-800 pt-6">
            <span>Auth_Protocol_v2.5</span>
            <span className="text-green-900">Secure_Connection: Stable</span>
            <span>2026_Desotech</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Registration;
