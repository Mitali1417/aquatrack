import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  Droplet,
  ShieldAlert,
  CloudRain,
  Wrench,
  ArrowDownLeft,
  ArrowUpLeft,
  ArrowRight,
  MoveRight,
  Squircle,
  MessagesSquare,
  MessageSquareMore,
} from "lucide-react";
import { Badge } from "./ui/badge";

const Hero = () => {
  return (
    <section className="mb-12 animate-fade-in">
      <div className="bg-hero text-white rounded-2xl p-8 md:p-16 shadow-xl overflow-hidden relative">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Droplet className="h-10 w-10 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold">AquaTrack</h1>
          </div>
          <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90 relative z-10">
            Comprehensive monitoring for floods, waterlogging, stormwater, and
            drainage issues
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 group">
            <Button size="lg" variant="black" asChild>
              <Link to="/report">
                <span className="bg-white/30 group-hover:bg-primary/30 rounded-full flex justify-center items-center h-6 w-6 animate-pulse">
                  <span className="h-3 w-3 bg-white group-hover:bg-primary rounded-full animate-pulse" />
                </span>
                Report Water Issues
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="group" asChild>
              <a href="#ask-ai">
                <MoveRight className="group-hover:-translate-x-1.5 transition-all duration-500 ease-in-out" />
                Ask AI
              </a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Badge
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <CloudRain className="h-4 w-4 mr-1" />
              Flood tracking
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Droplet className="h-4 w-4 mr-1" />
              Waterlogging
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Wrench className="h-4 w-4 mr-1" />
              Drainage issues
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
