import ScheduleCard from "../ScheduleCard/ScheduleCard";

import "./AvailableScheduleList.css";


export default function AvailableScheduleList({
  schedules,
  type,
  loading,
  onBook,
  bookingLoading,
  alreadyBooked,
}) {


  if (alreadyBooked) {

    return (

      <div className="booking-success">

        <h3>
          Schedule Booked Successfully
        </h3>

        <p>
          Please arrive at the office on your
          scheduled date and bring the required
          documents.
        </p>

      </div>

    );

  }


  if (loading) {

    return (

      <div className="available-loading">

        <div className="small-spinner"></div>

        <p>
          Finding available schedules...
        </p>

      </div>

    );

  }



  if (schedules.length === 0) {

    return (

      <div className="no-schedules">

        <h3>
          No Available Schedules
        </h3>

        <p>
          There are currently no available dates
          for this examination.
        </p>

      </div>

    );

  }



  return (

    <div className="available-schedules">


      <div className="available-header">

        <h3>
          Available Dates
        </h3>


        <span>
          {schedules.length} available
        </span>


      </div>



      <div className="schedule-cards">

        {schedules.map((schedule)=>(

          <ScheduleCard

            key={schedule._id}

            schedule={schedule}

            type={type}

            onBook={onBook}

            bookingLoading={bookingLoading}

          />

        ))}

      </div>


    </div>

  );

}