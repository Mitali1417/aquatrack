/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import SeveritySelector from "./SeveritySelector";
import { uploadReport } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  AlertTriangle,
  Calendar,
  File,
  Image,
  Info,
  Loader2,
  MapPin,
  Phone,
  Upload,
  User,
} from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import * as yup from "yup";

const personalSchema = yup.object({
  userName: yup.string().required("Name is required"),
  userPhone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10 to 15 digits"),
});

const locationSchema = yup.object({
  lat: yup
    .number()
    .required("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  lng: yup
    .number()
    .required("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

const incidentSchema = yup.object({
  reportType: yup.string().required("Report type is required"),
  severity: yup.string().required("Severity is required"),
  waterLevel: yup
    .number()
    .required("Water level is required")
    .min(0, "Water level cannot be negative"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description should be at least 10 characters"),
});

const photoSchema = yup.object({
  consent: yup.boolean().oneOf([true], "Consent is required"),
});

const ReportForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    locationName: "",
    waterLevel: "",
    consent: false,
    // photoFiles: null,
    photoFiles: [],
    lat: "",
    lng: "",
    city: "",
    district: "",
    state: "",
    severity: "",
    description: "",
    reportType: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { coords } = useGeolocated();

  const [currentTab, setCurrentTab] = useState("personal");

  const tabOrder = ["personal", "location", "incident", "photo"];

  const handleNext = async () => {
    let currentSchema;

    switch (currentTab) {
      case "personal":
        currentSchema = personalSchema;
        break;
      case "location":
        currentSchema = locationSchema;
        break;
      case "incident":
        currentSchema = incidentSchema;
        break;
      case "photo":
        currentSchema = photoSchema;
        break;
      default:
        currentSchema = null;
    }

    if (currentSchema) {
      try {
        await currentSchema.validate(formData, { abortEarly: false });
        const currentIndex = tabOrder.indexOf(currentTab);
        if (currentIndex < tabOrder.length - 1) {
          setCurrentTab(tabOrder[currentIndex + 1]);
        }
      } catch (err) {
        if (err.inner) {
          err.inner.forEach((validationError) => {
            toast.error(validationError.message);
          });
        } else {
          toast.error(err.message);
        }
      }
    } else {
      const currentIndex = tabOrder.indexOf(currentTab);
      if (currentIndex < tabOrder.length - 1) {
        setCurrentTab(tabOrder[currentIndex + 1]);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      // [name]:
      //   type === "checkbox" ? checked : type === "file" ? files[0] : value,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? Array.from(files)
          : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (coords) {
      setFormData((prev) => ({
        ...prev,
        lat: coords.latitude.toFixed(6),
        lng: coords.longitude.toFixed(6),
      }));
    }
  }, [coords]);

  const fullSchema = locationSchema
    .concat(incidentSchema)
    .concat(personalSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fullSchema.validate(formData, { abortEarly: false });

      await uploadReport({
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        severity: formData.severity,
        locationName: formData.locationName,
        description: formData.description,
        userName: formData.userName,
        userPhone: formData.userPhone,
        waterLevel: formData.waterLevel,
        photoFiles: formData.photoFiles,
      });

      toast.success("Report submitted successfully!");
      navigate("/");
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((validationError) => {
          toast.error(validationError.message);
        });
      } else {
        toast.error("Failed to submit report. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Report Waterlogging Issues</h1>
        <p className="text-gray-600">
          Help us track and respond to waterlogging issues in your area
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
        {/* Location Section */}

        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="personal">
              <span className="block sm:hidden">
                <User className="h-5 w-5" />
              </span>
              <span className="hidden sm:block">Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="location">
              <span className="block sm:hidden">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="hidden sm:block">Location</span>
            </TabsTrigger>
            <TabsTrigger value="incident">
              <span className="block sm:hidden">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <span className="hidden sm:block">Incident</span>
            </TabsTrigger>
            <TabsTrigger value="photo">
              <span className="block sm:hidden">
                <Upload className="h-5 w-5" />
              </span>
              <span className="hidden sm:block">Photo Upload</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            {/* Your Personal Info JSX */}
            <Card className="overflow-hidden border-none shadow-md !pt-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Full Name</Label>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      <Input
                        type="text"
                        id="userName"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userPhone">Phone Number</Label>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-500" />
                      <Input
                        type="tel"
                        id="userPhone"
                        name="userPhone"
                        value={formData.userPhone}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10,15}"
                        title="Please enter a valid phone number"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <span className="flex justify-end items-center px-4">
                <Button
                  variant={"black"}
                  onClick={handleNext}
                  type="button"
                  className="mt-4"
                >
                  Next
                </Button>
              </span>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
            {/* Your Location Details JSX */}
            <Card className="overflow-hidden border-none shadow-md !pt-0">
              <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      id="lat"
                      name="lat"
                      placeholder="12.345678"
                      value={formData.lat}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      id="lng"
                      name="lng"
                      placeholder="98.765432"
                      value={formData.lng}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <span className="flex justify-end items-center px-4">
                <Button
                  variant={"black"}
                  onClick={handleNext}
                  type="button"
                  className="mt-4"
                >
                  Next
                </Button>
              </span>
            </Card>
          </TabsContent>

          {/* Incident Tab */}
          <TabsContent value="incident">
            {/* Your Incident Details JSX */}
            <Card className="overflow-hidden border-none shadow-md !pt-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Incident Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("reportType", value)
                    }
                    value={formData.reportType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flood">Flood</SelectItem>
                      <SelectItem value="Waterlogging">Waterlogging</SelectItem>
                      <SelectItem value="Drainage Issue">
                        Drainage Issue
                      </SelectItem>
                      <SelectItem value="Stormwater">Stormwater</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {/* <Label>Severity Level</Label> */}
                  <SeveritySelector
                    value={formData.severity}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, severity: value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterLevel">Water Level (cm)</Label>
                  <Input
                    type="number"
                    id="waterLevel"
                    name="waterLevel"
                    value={formData.waterLevel}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of the issue..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                </div>
              </CardContent>
              <span className="flex justify-end items-center px-4">
                <Button
                  variant={"black"}
                  onClick={handleNext}
                  type="button"
                  className="mt-4"
                >
                  Next
                </Button>
              </span>
            </Card>
          </TabsContent>

          {/* Photo Upload Tab */}
          <TabsContent value="photo">
            {/* Your Photo Upload JSX */}
            <Card className="overflow-hidden shadow-md !pt-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Photo Evidence (optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="">
                  <Label
                    htmlFor="photoFiles"
                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors border-gray-300"
                  >
                    <div className="flex flex-col items-center justify-center py-10">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                    </div>
                    <Input
                      id="photoFiles"
                      name="photoFiles"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleChange}
                      className="hidden"
                    />
                  </Label>
                  {formData.photoFiles?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm">
                      {formData.photoFiles.map((file, index) => (
                        <span
                          key={index}
                          className="py-1 px-2 border rounded-sm bg-secondary/30 flex items-center gap-2"
                        >
                          <span className="flex items-center justify-center bg-secondary/80 rounded-full h-6 w-6 p-1.5">
                            <File className="text-primary" />
                          </span>
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="flex items-start space-x-3 px-5 mt-4">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, consent: !!checked }))
                  }
                  required
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="consent"
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I consent to being contacted if more information is needed
                  </Label>
                  <p className="text-sm text-gray-500">
                    Your information will only be used for flood response
                    purposes
                  </p>
                </div>
              </div>
              <span className="flex justify-end items-center gap-2 px-4">
                <Button
                  variant={"black"}
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </span>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default ReportForm;
