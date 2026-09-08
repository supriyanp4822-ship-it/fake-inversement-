import { useState } from 'react';
import { reportService } from '../services/api';

interface ReportFormModalProps {
  investment: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportFormModal = ({ investment, onClose, onSuccess }: ReportFormModalProps) => {
  // Location State
  const [searchQuery, setSearchQuery] = useState('Chennai, Tamil Nadu, India');
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'Chennai, Tamil Nadu, India',
    lat: 13.0827,
    lng: 80.2707,
  });

  // Map state
  const [zoomLevel, setZoomLevel] = useState(14);
  const [mapMode, setMapMode] = useState<'roadmap' | 'satellite'>('roadmap');
  const [pinOffset, setPinOffset] = useState({ x: 50, y: 48 }); // Percentage position on map canvas
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState('');

  // Preset location suggestions for instant search feel
  const presetLocations = [
    { name: 'Chennai, Tamil Nadu, India', lat: 13.0827, lng: 80.2707, x: 50, y: 48 },
    { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777, x: 35, y: 60 },
    { name: 'Bengaluru, Karnataka, India', lat: 12.9716, lng: 77.5946, x: 42, y: 52 },
    { name: 'New York Financial District, USA', lat: 40.7074, lng: -74.0093, x: 65, y: 30 },
    { name: 'London City Center, UK', lat: 51.5074, lng: -0.1278, x: 28, y: 35 },
    { name: 'Singapore Financial Hub', lat: 1.3521, lng: 103.8198, x: 75, y: 70 },
  ];

  const filteredPresets = presetLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc: typeof presetLocations[0]) => {
    setSelectedLocation({ name: loc.name, lat: loc.lat, lng: loc.lng });
    setSearchQuery(loc.name);
    setPinOffset({ x: loc.x, y: loc.y });
    setShowSearchDropdown(false);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPinOffset({ x: xPct, y: yPct });

    // Calculate dynamic slight variations in coordinates for interactive realism
    const newLat = parseFloat((selectedLocation.lat + (yPct - 50) * -0.001).toFixed(4));
    const newLng = parseFloat((selectedLocation.lng + (xPct - 50) * 0.001).toFixed(4));

    setSelectedLocation({
      name: `Custom Location (${newLat}, ${newLng})`,
      lat: newLat,
      lng: newLng,
    });
  };

  const handleDetectLocation = () => {
    setLocationLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lng = parseFloat(position.coords.longitude.toFixed(4));
        const locationStr = `Chennai, Tamil Nadu, India (GPS: ${lat}, ${lng})`;

        setSelectedLocation({ name: locationStr, lat, lng });
        setSearchQuery('Chennai, Tamil Nadu, India');
        setPinOffset({ x: 50, y: 48 });
        setLocationLoading(false);
      },
      () => {
        // Fallback gracefully to default Chennai location if permissions denied
        setSelectedLocation({
          name: 'Chennai, Tamil Nadu, India',
          lat: 13.0827,
          lng: 80.2707,
        });
        setSearchQuery('Chennai, Tamil Nadu, India');
        setPinOffset({ x: 50, y: 48 });
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const locationPayload = `${selectedLocation.name} [Lat: ${selectedLocation.lat}, Lng: ${selectedLocation.lng}]`;
      const response = await reportService.create(investment._id || investment.id, locationPayload, comments);
      
      // Mock or use real ID from response
      setGeneratedReportId(response?.data?.data?._id || `FID-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSuccess(true);
      
      // We don't call onSuccess immediately if we want to show the success screen first.
      // The user can close the modal manually from the success screen.
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate scam report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      {isSuccess ? (
        <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-8 animate-in fade-in zoom-in-95 duration-200 relative my-auto">
          {/* Success Header */}
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🚨</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Fraud Report Generated</h2>
          </div>

          {/* Details Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Investment</p>
                <p className="font-bold text-slate-900">{investment.name}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <p className="text-sm font-semibold text-slate-700">Risk Score</p>
              <p className="font-black text-slate-900">{investment.score || 85} / 100</p>
            </div>
            <div className="flex justify-between items-center py-1">
              <p className="text-sm font-semibold text-slate-700">Risk Level</p>
              <p className="font-black text-red-600 bg-red-100 px-2.5 py-0.5 rounded-md text-sm">{investment.score >= 60 ? 'HIGH RISK' : 'MEDIUM RISK'}</p>
            </div>
            
            <div className="flex items-start gap-2 pt-2 border-t border-slate-200">
              <span className="text-slate-400 mt-0.5">📍</span>
              <p className="text-sm font-medium text-slate-800">{selectedLocation.name}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Report ID</p>
                <p className="text-sm font-mono font-bold text-slate-900">{generatedReportId}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                <p className="text-sm font-bold text-amber-600">Pending</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <h3 className="text-center font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Report Officially</h3>
            
            <a 
              href={`/report-government/${generatedReportId}`}
              className="w-full flex items-center justify-between p-3 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🇮🇳</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Cyber Crime / I4C</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800">Report to Portal →</span>
            </a>

            <a 
              href={`/report-government/${generatedReportId}`}
              className="w-full flex items-center justify-between p-3 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📈</span>
                <div>
                  <p className="font-bold text-slate-900 text-sm">SEBI</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 group-hover:text-blue-800">Report to SCORES →</span>
            </a>

            <a
              href={`/track/${generatedReportId}`}
              className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-colors"
            >
              <span>🔍</span> Track Report Status →
            </a>

            <a
              href={`/report-preview/${generatedReportId}`}
              className="w-full flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-colors mt-2"
            >
              <span>📄</span> Download Report
            </a>
          </div>

          {/* Close button for success modal */}
          <button
            onClick={() => {
              onSuccess();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 relative my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report Investment</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Provide additional details for the investment report.</p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Investment Context Tag */}
        <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase text-slate-500">Target:</span>
            <span className="text-xs font-bold text-slate-900 truncate max-w-xs">{investment.name}</span>
          </div>
          {investment.score !== undefined && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                investment.score >= 70
                  ? 'bg-rose-100 text-rose-800'
                  : investment.score >= 31
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Risk: {investment.score}/100
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section Title */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <span>📍</span> Investment / Report Location (Optional)
            </label>

            {/* Location Search Box */}
            <div className="relative mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="Search a location..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium placeholder:text-slate-400"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {showSearchDropdown && filteredPresets.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden text-xs">
                  {filteredPresets.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 font-semibold flex items-center gap-2 border-b border-slate-100 last:border-none"
                    >
                      <span className="text-slate-400">📍</span>
                      <span>{loc.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Google Maps Interactive Canvas */}
            <div
              onClick={handleMapClick}
              className={`h-60 sm:h-64 w-full rounded-2xl relative overflow-hidden border border-slate-200 shadow-inner select-none cursor-crosshair transition-all ${
                mapMode === 'satellite' ? 'bg-slate-800' : 'bg-slate-100'
              }`}
            >
              {/* Realistic Map Vector Features */}
              {mapMode === 'roadmap' ? (
                <svg className="absolute inset-0 w-full h-full opacity-90" preserveAspectRatio="none" viewBox="0 0 400 300">
                  {/* Land background */}
                  <rect width="400" height="300" fill="#f8fafc" />
                  {/* Parks / Water features */}
                  <path d="M 0,220 Q 80,180 180,240 T 400,200 L 400,300 L 0,300 Z" fill="#e0f2fe" />
                  <path d="M 50,0 Q 120,40 180,20 T 320,60 L 320,0 Z" fill="#dcfce7" />
                  
                  {/* Secondary Streets (Grid lines) */}
                  <g stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3">
                    <line x1="0" y1="50" x2="400" y2="50" />
                    <line x1="0" y1="100" x2="400" y2="100" />
                    <line x1="0" y1="150" x2="400" y2="150" />
                    <line x1="0" y1="200" x2="400" y2="200" />
                    <line x1="80" y1="0" x2="80" y2="300" />
                    <line x1="160" y1="0" x2="160" y2="300" />
                    <line x1="240" y1="0" x2="240" y2="300" />
                    <line x1="320" y1="0" x2="320" y2="300" />
                  </g>

                  {/* Main Roads / Highways */}
                  <path d="M 0,120 L 400,120" stroke="#fcd34d" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 200,0 L 200,300" stroke="#fcd34d" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 0,120 L 400,120" stroke="#ffffff" strokeWidth="3" />
                  <path d="M 200,0 L 200,300" stroke="#ffffff" strokeWidth="3" />

                  {/* Diagonal Arterial Road */}
                  <path d="M 20,20 L 380,280" stroke="#ffffff" strokeWidth="5" />
                  <path d="M 20,20 L 380,280" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,4" />

                  {/* Map Text Labels */}
                  <text x="210" y="115" fill="#475569" fontSize="10" fontWeight="bold">Anna Salai / Mount Rd</text>
                  <text x="205" y="40" fill="#475569" fontSize="9" fontWeight="semibold">Financial District</text>
                  <text x="85" y="270" fill="#0284c7" fontSize="9" fontWeight="bold">Marina Coastal Zone</text>
                  <text x="280" y="160" fill="#64748b" fontSize="8" fontWeight="medium font-mono">13°04'57"N 80°16'14"E</text>
                </svg>
              ) : (
                /* Satellite view representation */
                <div className="absolute inset-0 bg-emerald-950/90 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:16px_16px] opacity-90">
                  <div className="absolute inset-0 bg-blue-900/20"></div>
                  <div className="absolute top-10 left-20 w-32 h-32 bg-emerald-800/40 rounded-full blur-xl"></div>
                  <div className="absolute bottom-5 right-20 w-48 h-20 bg-blue-900/60 rounded-full blur-lg"></div>
                </div>
              )}

              {/* Map Mode Pill Overlay */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-lg p-0.5 border border-slate-200 shadow-md flex items-center gap-0.5 z-10 text-[10px] font-extrabold">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMapMode('roadmap');
                  }}
                  className={`px-2.5 py-1 rounded-md transition ${
                    mapMode === 'roadmap' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Map
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMapMode('satellite');
                  }}
                  className={`px-2.5 py-1 rounded-md transition ${
                    mapMode === 'satellite' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Satellite
                </button>
              </div>

              {/* Floating Zoom & Controls (Top Right / Bottom Right) */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDetectLocation();
                  }}
                  className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 p-2 rounded-xl border border-slate-200 shadow-md transition flex items-center gap-1.5 text-xs font-bold"
                  title="Center on My Location"
                >
                  <span>🎯</span>
                  <span className="hidden sm:inline">My Location</span>
                </button>
              </div>

              {/* Zoom Buttons (Bottom Right) */}
              <div className="absolute bottom-3 right-3 flex flex-col bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-md overflow-hidden z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel((z) => Math.min(z + 1, 18));
                  }}
                  className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-extrabold text-sm border-b border-slate-200"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel((z) => Math.max(z - 1, 8));
                  }}
                  className="px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-extrabold text-sm"
                >
                  −
                </button>
              </div>

              {/* Dynamic Red Location Pin Marker */}
              <div
                className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out"
                style={{ left: `${pinOffset.x}%`, top: `${pinOffset.y}%` }}
              >
                {/* Red Pin SVG */}
                <div className="relative flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white shadow-xl flex items-center justify-center border-2 border-white animate-bounce">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  {/* Pulsing ring underneath */}
                  <div className="w-4 h-1.5 bg-rose-500/40 rounded-full blur-[1px] mt-0.5 animate-pulse"></div>
                </div>
              </div>

              {/* Watermark / Map Scale */}
              <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-bold bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-200 pointer-events-none">
                Google Maps Simulation | Zoom {zoomLevel}x
              </div>
            </div>

            {/* Selected Location Metadata Bar Below Map */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-extrabold text-slate-900 flex items-center gap-1">
                  <span>📍</span>
                  <span className="truncate max-w-sm">{selectedLocation.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Latitude: <strong className="text-slate-700">{selectedLocation.lat}</strong> | Longitude: <strong className="text-slate-700">{selectedLocation.lng}</strong>
                </div>
              </div>

              {/* Blue "Use My Current Location" Button */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locationLoading}
                className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-60"
              >
                {locationLoading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Detecting GPS...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
              Additional Comments
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              placeholder="Describe why you believe this investment is suspicious..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-xs shadow-md shadow-rose-200 transition flex items-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting Report...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
};
