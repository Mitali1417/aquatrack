import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useReports from '../hooks/useReports';
import { FiAlertTriangle, FiInfo, FiCalendar, FiMapPin } from 'react-icons/fi';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

const getMarkerColor = (severity) => {
  switch (severity) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'blue';
  }
};

const center = [19.076, 72.877]; // Mumbai by default

const Map = () => {
  const { reports } = useReports();

  return (
    <MapContainer 
      center={center} 
      zoom={12} 
      className="h-full w-full z-0"
      zoomControl={true}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      touchZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {reports.map((report) => {
        const markerColor = getMarkerColor(report.severity);
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${markerColor}" class="marker-pin"></div><div class="marker-pulse"></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        });

        return (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={customIcon}
          >
            <Popup className="custom-popup">
              <div className="space-y-2">
                <div className="flex items-center">
                  <FiAlertTriangle className={`text-${markerColor}-500 mr-2`} />
                  <h3 className="font-bold">{report.severity} Severity</h3>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>{report.locationName || 'Unknown location'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>{new Date(report.dateTime).toLocaleString()}</span>
                </div>
                {report.description && (
                  <p className="text-sm mt-2">{report.description}</p>
                )}
                {report.photoUrl && (
                  <img 
                    src={report.photoUrl} 
                    alt="Flood report" 
                    className="mt-2 w-full rounded border border-gray-200" 
                  />
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;