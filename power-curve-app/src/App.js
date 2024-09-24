import React, { useState, useCallback, useMemo } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'; 
import { LocalizationProvider } from '@mui/x-date-pickers';
import { de } from 'date-fns/locale';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { format } from 'date-fns';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PowerCurveApp = () => {
  const [turbineId, setTurbineId] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const convertGermanDecimal = (value) => parseFloat(value.replace(',', '.'));

  // Memoized function to fetch data based on inputs
  const fetchData = useCallback(async () => {
    if (!turbineId || !startTime || !endTime) {
      setErrorMessage('Turbine ID is required');
      return;
    }
    setLoading(true);
    setShowAlert(false);
    setErrorMessage('');
    const formattedStart = format(startTime, "dd.MM.yyyy, HH:mm");
    const formattedEnd = format(endTime, "dd.MM.yyyy, HH:mm");

    try {
      const response = await axios.get(`http://localhost:8000/turbine/${turbineId}/data`, {
        params: {
          start_time: formattedStart,
          end_time: formattedEnd,
        },
      });

      // Process the data for Highcharts
      const formattedData = response.data.data.map((entry) => ({
        x: convertGermanDecimal(entry.wind_speed), // wind speed in m/s
        y: convertGermanDecimal(entry.power), // power in kW
      }));

      setChartData(formattedData);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setShowAlert(true);
      } else {
        console.error("Error fetching data:", error);
      }
    }
    setLoading(false);
  }, [turbineId, startTime, endTime]);

  const chartOptions = useMemo(() => ({
    title: { text: 'Power Curve' },
    xAxis: { title: { text: 'Wind Speed (m/s)' } },
    yAxis: { title: { text: 'Power (kW)' } },
    series: [
      {
        name: 'Power over Wind Speed',
        data: chartData,
      },
    ],
  }), [chartData]);

  return (
    <div>
      <h2>Power Curve Plot</h2>

      {/* Turbine ID input */}
      <TextField
        label="Turbine ID"
        value={turbineId}
        onChange={(e) => setTurbineId(e.target.value)}
        margin="normal"
        error={!!errorMessage} 
        helperText={errorMessage}
      />

      {/* Date-Time Pickers */}
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={de}>
        <DateTimePicker
          label="Start Time"
          value={startTime}
          inputFormat="dd.MM.yyyy, HH:mm"
          onChange={(newValue) => setStartTime(newValue)}
          slots={{ textField: (params) => <TextField {...params} margin="normal" /> }}
        />
        <DateTimePicker
          label="End Time"
          value={endTime}
          inputFormat="dd.MM.yyyy, HH:mm"
          onChange={(newValue) => setEndTime(newValue)}
          slots={{ textField: (params) => <TextField {...params} margin="normal" /> }}
        />
      </LocalizationProvider>

      {/* Button to fetch data */}
      <Button
        variant="contained"
        color="primary"
        onClick={fetchData}
        style={{ marginTop: '20px' }}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Data'}
      </Button>
      {showAlert && (
        <Alert severity="error" onClose={() => setShowAlert(false)} style={{ marginTop: '20px' }}>
          Data does not exist in selected time range.
        </Alert>
      )}
      {/* Highcharts for Power Curve */}
      {chartData && !showAlert && (
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      )}
    </div>
  );
};

export default PowerCurveApp;
