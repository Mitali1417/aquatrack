/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';


const useReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase.from('reports').select('*');
      if (data) setReports(data);
    };

    fetchReports();
  }, []);

  return { reports };
};

export default useReports;
