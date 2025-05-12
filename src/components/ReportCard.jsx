import { FiAlertTriangle, FiCalendar, FiUser } from "react-icons/fi";
import { Card } from "./ui/card";

const severityColors = {
  High: "red",
  Medium: "amber",
  Low: "blue",
};

const ReportCard = ({ report }) => {
  // if (!report) return null;

  return (
    <Card className="hover:bg-primary/5 transition-all duration-500 ease-in-out border-l-4 border-${severityColors[report.severity]}-500">
      {report?.photoUrl && (
        <img
          src={report?.photoUrl}
          alt="Flood report"
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null; // prevents looping
            e.target.src = "https://via.placeholder.com/150"; // fallback image
          }}
        />
      )}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-${
              severityColors[report?.severity]
            }-100 text-${severityColors[report?.severity]}-800 border`}
          >
            <FiAlertTriangle className="mr-1" />
            {report?.severity}
          </span>
          <div className="flex items-center text-sm">
            <FiCalendar className="mr-2" />
            {report?.dateTime}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {report?.location || "Unknown location"}
        </h3>

        {report?.user_name && (
          <div className="flex items-center text-sm mb-3">
            <FiUser className="mr-2" />
            Reported by {report?.user_name}
          </div>
        )}

        <p className=" mb-4 line-clamp-3">
          {report?.desc || "No description provided"}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xs">
            Water level: {report?.water_level || "Unknown"} cm
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ReportCard;
