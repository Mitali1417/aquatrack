/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import SeveritySelector from "./SeveritySelector";
import { uploadReport } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Calendar,
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
import { AspectRatio } from "./ui/aspect-ratio";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const ReportForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    locationName: "",
    waterLevel: "",
    consent: false,
    photoFiles: null,
    // photoFiles: [],
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
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();

  const { coords } = useGeolocated();

  const [currentTab, setCurrentTab] = useState("location");

  const tabOrder = ["location", "incident", "personal", "photo"];

  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : // ? Array.from(files)
            value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.lat ||
      !formData.lng ||
      !formData.severity ||
      !formData.description ||
      !formData.reportType
    )
      return;

    setIsSubmitting(true);

    try {
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
    } catch (error) {
      console.error(error);
      toast.success("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const previewImageUrl = formData.photoFiles
  //   ? URL.createObjectURL(formData.photoFiles)
  //   : null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Report Flood Incident
        </h1>
        <p className="text-gray-600">
          Help us track and respond to flooding in your area
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
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="incident">Incident</TabsTrigger>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="photo">Photo Upload</TabsTrigger>
          </TabsList>

          {/* Location Tab */}
          <TabsContent value="location">
            {/* Your Location Details JSX */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2">
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

                {/* <Button
            type="button"
            onClick={handleGetLocation}
            disabled={!isGeolocationAvailable || !isGeolocationEnabled}
            variant="outline"
            className="w-full mb-6 bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-800"
          >
            <MapPin className="mr-2 h-5 w-5" />
            {isGeolocationAvailable && isGeolocationEnabled
              ? "Use my current location"
              : "Location services unavailable"}
          </Button> */}

                {locationError && (
                  <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{locationError}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="locationName">Detected Location</Label>
                  <Input
                    type="text"
                    id="locationName"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleChange}
                    placeholder="Location will appear here after detection"
                    className="bg-gray-50"
                  />
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleNext} type="button" className="mt-4">
              Next
            </Button>
          </TabsContent>

          {/* Incident Tab */}
          <TabsContent value="incident">
            {/* Your Incident Details JSX */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
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
                  <Label>Severity Level</Label>
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
            </Card>
            <Button onClick={handleNext} type="button" className="mt-4">
              Next
            </Button>
          </TabsContent>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            {/* Your Personal Info JSX */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
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

                <div className="flex items-start space-x-3">
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
              </CardContent>
            </Card>
            <Button onClick={handleNext} type="button" className="mt-4">
              Next
            </Button>
          </TabsContent>

          {/* Photo Upload Tab */}
          <TabsContent value="photo">
            {/* Your Photo Upload JSX */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Photo Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="photoFiles"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors border-gray-300"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF (MAX. 5MB each)
                        </p>
                      </div>
                      <Input
                        id="photoFile"
                        name="photoFile"
                        type="file"
                        accept="image/*"
                        // multiple
                        onChange={handleChange}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting} className="mt-4">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </TabsContent>
        </Tabs>

        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2">
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

            {/* <Button
            type="button"
            onClick={handleGetLocation}
            disabled={!isGeolocationAvailable || !isGeolocationEnabled}
            variant="outline"
            className="w-full mb-6 bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-800"
          >
            <MapPin className="mr-2 h-5 w-5" />
            {isGeolocationAvailable && isGeolocationEnabled
              ? "Use my current location"
              : "Location services unavailable"}
          </Button> */}

            {locationError && (
              <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-start">
                <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{locationError}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="locationName">Detected Location</Label>
              <Input
                type="text"
                id="locationName"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                placeholder="Location will appear here after detection"
                className="bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Incident Details Section */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
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
                  <SelectItem value="Drainage Issue">Drainage Issue</SelectItem>
                  <SelectItem value="Stormwater">Stormwater</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Severity Level</Label>
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
        </Card>

        {/* Personal Information Section */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
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

            <div className="flex items-start space-x-3">
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
                  Your information will only be used for flood response purposes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload Section */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Photo Evidence
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="photoFiles"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors border-gray-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (MAX. 5MB each)
                    </p>
                  </div>
                  <Input
                    id="photoFile"
                    name="photoFile"
                    type="file"
                    accept="image/*"
                    // multiple
                    onChange={handleChange}
                    className="hidden"
                  />
                </Label>
              </div>

              {/* <div>
                {formData.photoFiles.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {formData.photoFiles.map((file, index) => (
                      <div
                        key={index}
                        className="rounded-lg overflow-hidden border border-gray-200"
                      >
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-sm">No images selected</p>
                  </div>
                )}
              </div> */}
            </div>

            {/* {formData.photoFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Selected files:
                </h3>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {formData.photoFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )} */}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg"
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
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
