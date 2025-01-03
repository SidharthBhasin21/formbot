import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import useAuth from '../../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import styles from "./Submission.module.css"
import { fetchFormById } from '../../apis/form';
import { PieChart } from 'react-minimal-pie-chart';
import { useSelector } from 'react-redux';


const Submission = () => {
  const token = useAuth();
  const [searchParams] = useSearchParams();
  const dashboardId = useSelector(state => state.dashboard.dashboardId);
  const [formId, setFormId] = useState(searchParams.get('fid'));
  const [formStarts, setFormStarts] = useState(0);
  const [formCompletion, setFormCompletion] = useState(0);
  
  console.log(searchParams.get('fid'))

  const [noResponse, setNoResponse] = useState(false);
  const [formData, setFormData] = useState({ views: 0, sequence: [], formResponse: [] });

  const { views, sequence, formResponse } = formData;
  const headers = sequence.filter((data) => data.key.includes("user")).map(item => item.key);

  const getFromStats = () => {
      let starts = 0, completes = 0;
      const seqLength = sequence.filter(item => item.data.role === 'user').length;

      formResponse.forEach((item) => {
          const resLength = Object.keys(item).length;
          seqLength == resLength - 2 ? completes++ : starts++;
      })

      setFormStarts(starts);
      setFormCompletion(completes);
  };

  const handleFetchFormById = async () => {
    console.log(formId)
      const data = await fetchFormById(formId);
      setFormData(data);
      if (data.formResponse.length == 0) setNoResponse(true);
  };

  useEffect(() => {
      if (token && formId) {
        handleFetchFormById();
      }
  }, [token, formId]);

  useEffect(() => {
      if (token && formId) {
          getFromStats();
      }
  }, [sequence, formResponse]);
  return (
    <div className={styles.response}>
            <Navbar />
            {noResponse && <p className={styles.noResponse}>No response yet collected</p>}
            <section className={styles.content}>
                <div className={styles.brief}>
                    <div className={styles.card}>
                        <p>Views</p>
                        <p>{views}</p>
                    </div>
                    <div className={styles.card}>
                        <p>Starts</p>
                        <p>{formStarts}</p>
                    </div>
                    <div className={styles.card}>
                        <p>Completion rate</p>
                        <p>{views ? parseInt(formCompletion / views * 100) : 0} %</p>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    {formResponse.length > 0 && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>First Interaction Time</th>
                                    {headers.map((key) => (
                                        <th key={key}>{key.split("-")[1].split(":").join(" ")}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {formResponse.map((valueRow, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{valueRow.startDate}</td>
                                        {headers.map((key) => (
                                            <td key={key}>{valueRow[key]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <PieChart 
                  className={styles.pieChart}
                  lineWidth={25}  
                  tool
                  data={[
                    { 
                      title: "Views", 
                      value: 100-parseInt(formCompletion / views * 100), 
                      color: '#909090' 
                    },
                    { 
                      title: 'Completes', 
                      value: parseInt(formCompletion / views * 100), 
                      color: '#3B82F6' 
                    },
                  ]}
                />
            </section>
        </div>
  )
}

export default Submission