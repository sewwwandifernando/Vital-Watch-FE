import React, { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import "../../assets/scss/pages/PatientDetails.css";
import { Link } from "react-router-dom";
import AddVitalSigns from "./AddVitalSigns";
import TableView from "./PatientDetailsTableView";
import ChartView from "./PatientDetailsChartView";
import { useGetPatientVitalsIdQuery } from "../../store/api/patientDataApi"; // Import your API query hook here
import { useParams } from "react-router-dom";
import { ProgressBar } from "react-loader-spinner";

const vitalTypes = [
  "heartRate",
  "respiratoryRate",
  "supplementalO2",
  "oxygenSaturation",
  "bloodPressure",
  "temperature",
];

function VitalSigns() {
  const { id } = useParams();
  const {
    data: patientvital,
    isLoading,
    isError,
  } = useGetPatientVitalsIdQuery(id);

  const [view, setView] = useState("table");
  const handleViewChange = (selectedView) => {
    setView(selectedView);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOverlayClick = (e) => {
    if (e.target.className === "popup-overlay") {
      handleClose();
    }
  };

  const [isDateRangeVisible, setDateRangeVisible] = useState(false);
  const toggleDateRange = () => {
    setDateRangeVisible(!isDateRangeVisible);
  };

  const [chartDate, setChartDate] = useState(new Date());

  const [selectedType, setSelectedType] = useState("heartRate");

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  const filteredData =
    patientvital && patientvital.payload.id
      ? patientvital.payload.id.filter((entry) => {
          const entryDate = new Date(entry.date);

          if (selectedDateRange.startDate && selectedDateRange.endDate) {
            // Check if the entry's date is within the selected date range
            return (
              entryDate >= selectedDateRange.startDate &&
              entryDate <= selectedDateRange.endDate
            );
          }
          if (
            selectedDateRange.startDate &&
            selectedDateRange.endDate &&
            selectedDateRange.startDate.toDateString() ===
              selectedDateRange.endDate.toDateString()
          ) {
            // If startDate and endDate are the same, display data for that day
            return (
              entryDate.toDateString() ===
              selectedDateRange.startDate.toDateString()
            );
          }

          // If startDate or endDate is null, display all data
          return true;
        })
      : [];

const filteredChart =
  patientvital && Array.isArray(patientvital.payload)
    ? patientvital.payload.map((entry) => ({
        time: entry.time, // Assuming time is available in your data
        heartRate: entry.heartRate,
        respiratoryRate: entry.respiratoryRate,
        supplementalO2: entry.supplementedO2,
        oxygenSaturation: entry.O2saturation,
        bloodPressure: entry.systolicBP,
        temperature: entry.temperature,
        // Add other vital sign properties as needed
      }))
    : [];
      console.log("patientvital data: ", patientvital);

  const dateRangeRef = useRef(null); // Create a ref for the date range content

  // Close date range content when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target)
      ) {
        setDateRangeVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return   <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <ProgressBar
      height="80"
      width="80"
      barColor="#766EAC"
      borderColor="#000000"
      ariaLabel="bars-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  </div>;
  }

  if (isError) {
    return <div>Error loading patient data</div>;
  }

  return (
    <div className="vitalsigns-main-con">
      <div className="vitalsigns-top-con">
        <div className="vitalsigns-top-btns">
          <button
            className={`btn btn-light ${view === "table" ? "active" : ""}`}
            onClick={() => handleViewChange("table")}
          >
            Table View
          </button>
          <button
            className={`btn btn-light ${view === "chart" ? "active" : ""}`}
            onClick={() => handleViewChange("chart")}
          >
            Chart View
          </button>
        </div>
        <div className="vitalsigns-top-date">
          {view === "table" && (
            <button
              type="button"
              className="btn btn-light daterange"
              onClick={toggleDateRange}
            >
              Date Range
              <FontAwesomeIcon icon={faCalendarDays} />
            </button>
          )}
          {isDateRangeVisible && (
            <div className="date-range-content" ref={dateRangeRef}>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setSelectedDateRange(item.selection)}
                moveRangeOnFirstSelection={false}
                ranges={[selectedDateRange]}
                maxDate={new Date()}
                staticRanges={true}
              />
            </div>
          )}
          {view === "chart" && (
            <div className="date-picker-content">
              <DatePicker
                placeholderText="Select Date"
                className="chart-date-picker"
                id="date-picker"
                selected={chartDate}
                onChange={(date) => setChartDate(date)}
                dateFormat="MMM dd yyyy"
                maxDate={new Date()}
              />
            </div>
          )}
        </div>
        <button
          onClick={handleShow}
          type="button"
          className="btn btn-dark addnew"
        >
          Add New
        </button>
        {show && (
          <div className="popup-overlay" onClick={handleOverlayClick}>
            <div className="popup">
              <AddVitalSigns onClose={handleClose} />
            </div>
          </div>
        )}
      </div>
      <div className="vitalsigns-btm-con">
        {view === "table" && <TableView filteredData={filteredData} />}
        {view === "chart" && (
          <ChartView vitalTypes={vitalTypes} filteredChart={filteredChart} />
        )}
      </div>
    </div>
  );
}

export default VitalSigns;
