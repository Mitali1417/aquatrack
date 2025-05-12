import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://gwksmzlgjkfgcocnjatd.supabase.co";
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3a3NtemxnamtmZ2NvY25qYXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDEwMzgsImV4cCI6MjA2MTkxNzAzOH0._hK90p2eglD1V_vjFLLHIhKe50H7lyIpG6IxbDXoaoM";
// export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
 
export const uploadReport = async ({
  lat,
  lng,
  severity,
  photoFile,
  locationName,
  description,
  userName,
  userPhone,
  waterLevel,
}) => {
  let photoUrl = '';

  if (photoFile) {
    const filename = `${Date.now()}-${photoFile.name}`;
    const { data, error } = await supabase.storage
      .from('report-photos')
      .upload(filename, photoFile);
    if (!error && data) {
      const { publicURL } = supabase.storage.from('report-photos').getPublicUrl(filename);
      photoUrl = publicURL || '';
    }
  }

  await supabase.from('reports').insert([{  lat,
    lng,
    user_name: userName,
    user_phone: userPhone,
    location: locationName,
    dateTime: new Date().toISOString(),
    desc: description,
    severity,
    water_level: parseFloat(waterLevel),
    photo_url: photoUrl, }]);
};

// export const uploadReport = async ({
//   lat,
//   lng,
//   severity,
//   photoFiles,
//   locationName,
//   description,
//   dateTime,
//   userName,
//   userPhone,
//   waterLevel,
// }) => {
//   const photoUrls = [];
//   for (const file of photoFiles) {
//     const filename = `${Date.now()}-${file.name}`;
//     const { error } = await supabase.storage
//       .from("report-photos")
//       .upload(filename, file);

//     if (!error) {
//       const { publicURL } = supabase.storage
//         .from("report-photos")
//         .getPublicUrl(filename);
//       photoUrls.push(publicURL);
//     }
//   }


//   // for (const file of photoFiles) {
//   //   const filename = `${Date.now()}-${file.name}`;
//   //   const { error: uploadError } = await supabase.storage
//   //     .from("report-photos")
//   //     .upload(filename, file, {
//   //       cacheControl: '3600',
//   //       upsert: true, // ✅ Prevents conflicts that might cause auth error
//   //     });
  
//   //   if (uploadError) {
//   //     console.error("Upload error:", uploadError.message);
//   //   } else {
//   //     const { data: publicUrlData } = supabase.storage
//   //       .from("report-photos")
//   //       .getPublicUrl(filename);
//   //     photoUrls.push(publicUrlData.publicUrl);
//   //   }
//   // }
  

//   const { data, error } = await supabase.from("reports").insert([
//     {
//       lat,
//       lng,
//       user_name: userName,
//       user_phone: userPhone,
//       location: locationName,
//       dateTime: dateTime,
//       desc: description,
//       severity,
//       water_level: parseFloat(waterLevel),
//       photo_url: photoUrls,
//     },
//   ]);

//   if (error) {
//     console.error("Error inserting report:", error);
//   } else {
//     console.log("Report submitted:", data);
//   }
// };




// export const uploadReport = async ({
//   lat,
//   lng,
//   severity,
//   photoFile,
//   // photoFiles,
//   locationName,
//   description,
//   dateTime,
//   userName,
//   userPhone,
//   waterLevel,
// }) => {
//   // const photoUrls = [];

//   // for (const file of photoFiles) {
//   //   const filename = `${Date.now()}-${file.name}`;
//   //   const { error: uploadError } = await supabase.storage
//   //     .from("report-photos")
//   //     .upload(filename, file, {
//   //       cacheControl: "3600", // Cache control to avoid issues
//   //       upsert: true, // Prevent overwriting issues
//   //     });

//   //   if (uploadError) {
//   //     console.error("Upload error:", uploadError.message);
//   //   } else {
//   //     const { data: publicUrlData } = supabase.storage
//   //       .from("report-photos")
//   //       .getPublicUrl(filename);
//   //     photoUrls.push(publicUrlData.publicUrl);
//   //   }
//   // }


//   let photoUrl = "";

//   if (photoFile) {
//     const filename = `${Date.now()}-${photoFile.name}`;
//     const { error: uploadError } = await supabase.storage
//       .from("report-photos")
//       .upload(filename, photoFile, {
//         cacheControl: "3600", // Cache control to avoid issues
//         upsert: true, // Prevent overwriting issues
//       });

//     if (uploadError) {
//       console.error("Upload error:", uploadError.message);
//     } else {
//       const { data: publicUrlData } = supabase.storage
//         .from("report-photos")
//         .getPublicUrl(filename);
//       photoUrl = publicUrlData.publicUrl;
//     }
//   }



//   const { data, error } = await supabase.from("reports").insert([
//     {
//       lat,
//       lng,
//       user_name: userName,
//       user_phone: userPhone,
//       location: locationName,
//       dateTime: dateTime,
//       desc: description,
//       severity,
//       water_level: parseFloat(waterLevel),
//       photo_url: photoUrl,
//       // photo_url: photoUrls,
//     },
//   ]);

//   if (error) {
//     console.error("Error inserting report:", error);
//   } else {
//     console.log("Report submitted:", data);
//   }
// };
