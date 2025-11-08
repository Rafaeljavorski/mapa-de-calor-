
import React, { useState, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { Heatmap } from './components/Heatmap';
import { ImageGenerator } from './components/ImageGenerator';
import { Activity } from './types';

type MapThemeKey = 'mono' | 'dark' | 'satellite' | 'street';

const mapThemes: Record<MapThemeKey, { name: string; url: string; attribution: string; bgColor: string; }> = {
  mono: {
    name: 'Monochrome',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    bgColor: '#f0f0f0'
  },
  dark: {
    name: 'Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    bgColor: '#1f2937'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    bgColor: '#101010'
  },
  street: {
      name: 'Street View',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      bgColor: '#eeeeee'
  }
};


const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showGenerator, setShowGenerator] = useState<boolean>(false);
  
  // New state for filters
  const [selectedActivityType, setSelectedActivityType] = useState<string>('All');
  const [selectedReason, setSelectedReason] = useState<string>('All');
  const [hideCanceled, setHideCanceled] = useState<boolean>(false);
  const [heatmapColor, setHeatmapColor] = useState<string>('rgba(255, 70, 0, 0.4)');
  const [mapTheme, setMapTheme] = useState<MapThemeKey>('mono');

  const colorOptions = [
      { name: 'Classic Fire', value: 'rgba(255, 70, 0, 0.4)' },
      { name: 'Cool Blue', value: 'rgba(0, 150, 255, 0.4)' },
      { name: 'Electric Green', value: 'rgba(50, 255, 50, 0.4)' },
      { name: 'Plasma Purple', value: 'rgba(200, 0, 255, 0.4)' },
  ];


  const handleDataLoaded = (data: Activity[], name: string) => {
    if (fileNames.includes(name)) {
      setError(`File "${name}" has already been loaded. Please choose a different file.`);
      setIsLoading(false);
      return;
    }
    setActivities(prevActivities => [...prevActivities, ...data]);
    setFileNames(prevNames => [...prevNames, name]);
    setError('');
  };

  const handleFileError = (message: string) => {
    setError(message);
  };
  
  const handleReset = () => {
    setActivities([]);
    setFileNames([]);
    setError('');
    setSelectedActivityType('All');
    setSelectedReason('All');
    setHideCanceled(false);
    setHeatmapColor('rgba(255, 70, 0, 0.4)');
    setMapTheme('mono');
  };

  const toggleGenerator = () => {
    setShowGenerator(prev => !prev);
  }

  const uniqueActivityTypes = useMemo(() => {
    const types = new Set(activities.map(a => a['Tipo de Atividade']));
    return Array.from(types).filter(Boolean).sort();
  }, [activities]);

  const uniqueReasons = useMemo(() => {
    const reasons = new Set(activities.map(a => a['Motivo de Não Realizado']));
    return Array.from(reasons).filter(Boolean).sort();
  }, [activities]);


  const filteredActivities = useMemo(() => {
    let filtered = activities;

    if (hideCanceled) {
      filtered = filtered.filter(a => a['Status da Atividade'] !== 'Cancelada');
    }

    if (selectedActivityType !== 'All') {
      filtered = filtered.filter(a => a['Tipo de Atividade'] === selectedActivityType);
    }

    if (selectedReason !== 'All') {
        filtered = filtered.filter(a => a['Motivo de Não Realizado'] === selectedReason);
    }
    
    return filtered;
  }, [activities, selectedActivityType, selectedReason, hideCanceled]);

  const selectedMapTheme = mapThemes[mapTheme];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header onToggleGenerator={toggleGenerator} showGenerator={showGenerator}/>
      <main className="container mx-auto p-4 md:p-6">
        {activities.length === 0 ? (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center mb-2 text-white">Welcome!</h2>
                <p className="text-center text-gray-400 mb-6">Start by uploading your activity CSV file to visualize the data.</p>
                <FileUpload onDataLoaded={handleDataLoaded} onError={handleFileError} setIsLoading={setIsLoading} />
                {isLoading && (
                  <div className="flex justify-center items-center mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
                    <p className="ml-3 text-gray-300">Parsing CSV data...</p>
                  </div>
                )}
                {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-white truncate" title={fileNames.join(', ')}>
                    Dashboard: <span className="text-cyan-400">{fileNames.length > 1 ? `${fileNames.length} files loaded` : fileNames[0]}</span>
                </h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <button 
                    onClick={handleReset} 
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
                  >
                    Clear & Start Over
                  </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-gray-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-700 mb-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                {/* Activity Type Filter */}
                <div className="flex items-center gap-2">
                    <label htmlFor="activity-filter" className="text-sm font-medium text-gray-400 flex-shrink-0">Activity Type:</label>
                    <select
                      id="activity-filter"
                      value={selectedActivityType}
                      onChange={(e) => setSelectedActivityType(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
                    >
                      <option value="All">All Types</option>
                      {uniqueActivityTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                </div>
                {/* Reason Filter */}
                <div className="flex items-center gap-2">
                    <label htmlFor="reason-filter" className="text-sm font-medium text-gray-400 flex-shrink-0">Reason Not Completed:</label>
                    <select
                      id="reason-filter"
                      value={selectedReason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
                    >
                      <option value="All">All Reasons</option>
                      {uniqueReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                </div>
                {/* Hide Canceled Checkbox */}
                 <div className="flex items-center">
                    <input
                        id="hide-canceled"
                        type="checkbox"
                        checked={hideCanceled}
                        onChange={(e) => setHideCanceled(e.target.checked)}
                        className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-600 ring-offset-gray-800 focus:ring-2"
                    />
                    <label htmlFor="hide-canceled" className="ml-2 text-sm font-medium text-gray-300">Hide Canceled</label>
                </div>
                {/* Heatmap Color Picker */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-400 flex-shrink-0">Heatmap Color:</label>
                    <div className="flex items-center gap-2">
                        {colorOptions.map(option => (
                            <button
                                key={option.name}
                                onClick={() => setHeatmapColor(option.value)}
                                className={`w-6 h-6 rounded-full border-2 transition-transform transform hover:scale-110 ${heatmapColor === option.value ? 'border-white ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : 'border-transparent'}`}
                                style={{ backgroundColor: option.value.replace('0.4', '1') }}
                                title={option.name}
                            />
                        ))}
                    </div>
                </div>
                 {/* Map Style Selector */}
                 <div className="flex items-center gap-2">
                    <label htmlFor="map-style-selector" className="text-sm font-medium text-gray-400 flex-shrink-0">Map Style:</label>
                    <select
                      id="map-style-selector"
                      value={mapTheme}
                      onChange={(e) => setMapTheme(e.target.value as MapThemeKey)}
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
                    >
                      {Object.entries(mapThemes).map(([key, { name }]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                </div>
            </div>


            <DashboardStats data={filteredActivities} />
            <div className="mt-6">
              <Heatmap 
                data={filteredActivities} 
                color={heatmapColor} 
                tileUrl={selectedMapTheme.url}
                attribution={selectedMapTheme.attribution}
                bgColor={selectedMapTheme.bgColor}
              />
            </div>
             <div className="mt-8 max-w-4xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700">
                    <h3 className="text-xl font-bold text-center mb-4 text-white">Add More Data</h3>
                    <FileUpload onDataLoaded={handleDataLoaded} onError={handleFileError} setIsLoading={setIsLoading} />
                     {isLoading && (
                      <div className="flex justify-center items-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
                        <p className="ml-3 text-gray-300">Parsing CSV data...</p>
                      </div>
                    )}
                    {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                </div>
             </div>
          </div>
        )}
        
        {showGenerator && (
           <div className="mt-8 max-w-4xl mx-auto">
             <ImageGenerator />
           </div>
        )}

      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Built by a World-Class React Engineer.</p>
      </footer>
    </div>
  );
};

export default App;
