import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Map from "../components/Map";
import ReportCard from "../components/ReportCard";
import useReports from "../hooks/useReports";
import {
  AlertTriangle,
  Info,
  MapPin,
  TrendingUp,
  Droplet,
  ShieldAlert,
  CloudRain,
  Wrench,
} from "lucide-react";
import AskAI from "../components/AskAI";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";

const Home = () => {
  const { reports, loading } = useReports();
  const [stats, setStats] = useState({
    totalReports: 0,
    criticalIssues: 0,
    recentReports: 0,
  });

  //   useEffect(() => {
  //     if (reports.length > 0) {
  //       const criticalIssues = reports.filter(r =>
  //         r.severity === "High" ||
  //         r.type === "Flood" ||
  //         r.type === "Drainage Blockage"
  //       ).length;

  //       const recentReports = reports.filter((r) => {
  //   const reportDate = new Date(r.dateTime);
  //   const now = new Date();
  //   const diffHours = (now - reportDate) / (1000 * 60 * 60);
  //   return diffHours <= 24;
  // }).length;

  //       setStats({
  //         totalReports: reports.length,
  //         criticalIssues,
  //         recentReports,
  //       });
  //     }
  //   }, [reports]);

  useEffect(() => {
    if (reports.length > 0) {
      const criticalIssues = reports.filter(
        (r) =>
          r.severity === "High" ||
          r.type === "Flood" ||
          r.type === "Drainage Blockage"
      ).length;

      const recentReports = reports.filter((r) => {
        // Convert Supabase date string (YYYY-MM-DD) to Date object and remove the time component
        const reportDate = new Date(r.dateTime);
        const reportDateString = reportDate.toISOString().split("T")[0]; // "YYYY-MM-DD"

        // Get today's date in the same format (YYYY-MM-DD)
        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        // Check if report's date is today
        return reportDateString === todayString;
      }).length;

      setStats({
        totalReports: reports.length,
        criticalIssues,
        recentReports,
      });
    }
  }, [reports]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-12 relative z-10">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <TrendingUp className="mr-3 text-blue-500" size={24} />
          Current Water Issues Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-red-500/40 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                  <ShieldAlert className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className=" text-sm font-medium uppercase tracking-wider">
                    Critical Issues
                  </h3>
                  <p className="text-4xl font-bold mt-1">
                    {stats.criticalIssues}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md group">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-amber-500/40 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                  <CloudRain className="text-amber-500" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider">
                    Recent Reports (24h)
                  </h3>
                  <p className="text-4xl font-bold mt-1">
                    {stats.recentReports}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-none shadow-md group">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-500/40 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Droplet className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider">
                    Total Reports
                  </h3>
                  <p className="text-4xl font-bold mt-1">
                    {stats.totalReports}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ask AI Section */}
      <section className="py-12 relative max-w-5xl mx-auto" id="ask-ai">
        <AskAI context="floods, waterlogging, stormwater, and drainage issues" />
        <span className="z-0 bg-primary w-52 h-24 rounded-full blur-3xl absolute top-20 left-40 transform -translate-x-1/2 -translate-y-1/2"></span>
        <span className="z-0 bg-rose-700 w-52 h-24 rounded-full blur-3xl absolute top-20 left-64 transform -translate-x-1/2 -translate-y-1/2"></span>
        <span className="z-0 bg-primary w-52 h-24 rounded-full blur-3xl absolute bottom-10 right-0 transform -translate-x-1/2 -translate-y-1/2"></span>
        <span className="z-0 bg-amber-500 w-52 h-24 rounded-full blur-3xl absolute bottom-8 right-0 transform -translate-x-1/2 -translate-y-1/2"></span>
      </section>

      {/* Map Section */}
      <section className="py-12 relative z-10">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <MapPin className="mr-3 text-blue-500" size={24} />
            Water Issues Map
          </h2>
          <div className="flex gap-3">
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Droplet size={14} />
              <span>Waterlogging</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <CloudRain size={14} />
              <span>Floods</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Wrench size={14} />
              <span>Drainage</span>
            </Badge>
          </div>
        </div>
        <Card className="overflow-hidden border-none shadow-xl">
          <div className="h-[600px] w-full relative">
            <Map />
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-cyan-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Recent Reports Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <AlertTriangle className="mr-3 text-blue-500" size={24} />
            Recent Water Issues
          </h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.slice(0, 3).map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-300 p-12 text-center">
            <CardContent className="flex flex-col items-center">
              <div className="bg-gray-100 p-5 rounded-full mb-4">
                <MapPin className="text-gray-400 h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">No reports available</h3>
              <p className="mb-6">
                Be the first to report water issues in your area
              </p>
              <Button asChild>
                <Link to="/report">Submit a Report</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="bg-dot mb-8 text-center rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden relative text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9IndhdmVzIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0iTTAgNSBDIDIwIDIwLCA0MCAwLCA2MCAxNSBDIDgwIDMwLCAxMDAgMjAsIDEyMCA1IFMgMTQwIDIwLCAxNjAgNSB2IDE1IGggLTE2MCB6IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd2F2ZXMpIiAvPgo8L3N2Zz4=')] opacity-20"></div>
        <h2 className="text-3xl font-bold mb-4 relative z-10">
          Help Build Water-Resilient Communities
        </h2>
        <p className="mb-8 max-w-3xl mx-auto opacity-90 relative z-10">
          Report floods, waterlogging, stormwater, or drainage issues to help
          authorities respond faster
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <Button size="lg" variant="black" asChild>
            <Link to="/report">Report an Issue</Link>
          </Button>
          {/* <Button size="lg" variant="outline" asChild>
            <Link to="/resources">Learn About Prevention</Link>
          </Button> */}
        </div>
      </section>
    </div>
  );
};

export default Home;
