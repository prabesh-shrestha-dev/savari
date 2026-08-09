import {
  FileText,
  User,
  CheckSquare,
  MessageCircle,
  Clock,
  PenLine,
  QrCode,
} from "lucide-react";

import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import { useCallback, useEffect, useState } from "react";




export default function AdminDashboard() {

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");

  const axiosPrivate = useAxiosPrivate();

  const metrics = [
    {
      number: "124",
      title: "New Applications",
      change: "12.4%",
      type: "green",
      subtitle: "Document verified",
      active: false,
    },
    {
      number: "49",
      title: "Pending Verification",
      change: "3.1%",
      type: "red",
      subtitle: "Document verified",
    },
    {
      number: "98",
      title: "Approved Licenses",
      change: "8.7%",
      type: "green",
      subtitle: "Document verified",
    },
  ];


  const pendingApplications = [
    {
      initials: "AM",
      name: "Aashish Mahato",
      type: "New License",
      date: "Aug 5, 2026",
      documents: "3/3",
    },
    {
      initials: "BR",
      name: "Biraj Rijal",
      type: "New License",
      date: "Aug 8, 2026",
      documents: "2/3",
    },
    {
      initials: "PR",
      name: "Pratik Pujara",
      type: "Renewal",
      date: "Aug 4, 2026",
      documents: "3/3",
    },
  ];


  const examSchedules = [
    {
      initials: "PN",
      name: "Pratik Nepal",
      exam: "Practical Exam",
    },
    {
      initials: "AM",
      name: "Aashish Mahato",
      exam: "Biometric",
    },
  ];


  const payments = [
    {
      initials: "AM",
      name: "Aashish Mahato",
      amount: "Rs. 500",
    },
    {
      initials: "AM",
      name: "Aashish Mahato",
      amount: "Rs. 2,500",
    },
    {
      initials: "AM",
      name: "Aashish Mahato",
      amount: "Rs. 1,000",
    },
  ];


  const activities = [
    {
      icon: User,
      title: "New application submitted",
      subtitle: "Aashish Mahato",
      time: "9:42 AM",
    },
    {
      icon: FileText,
      title: "Documents verified",
      subtitle: "Prabesh Shrestha",
      time: "10:12 AM",
    },
    {
      icon: CheckSquare,
      title: "Trial exam scheduled",
      subtitle: "Pratik",
      time: "10:13 AM",
    },
    {
      icon: MessageCircle,
      title: "Payment received",
      subtitle: "Biraj Rijal",
      time: "10:35 AM",
    },
    {
      icon: Clock,
      title: "License issued",
      subtitle: "Ishan Koirala",
      time: "10:42 AM",
    },
    {
      icon: PenLine,
      title: "License issued Receive",
      subtitle: "Suyog Lamsal",
      time: "11:12 AM",
    },
    {
      icon: PenLine,
      title: "License issued Receive",
      subtitle: "Suyog Lamsal",
      time: "11:12 AM",
    },
  ];

  const fetchUserInfo = useCallback(async () => {
    try {

      const response = await axiosPrivate.get(
        `/users/me`
      );

      setUserName(response.data?.user?.fullname || "Prabesh");
    } catch (err) {
      console.error(
        "Failed to fetch user info:",
        err
      );
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo])



  return (
    <div className="admin-dashboard">


      {/* Header */}

      <header className="dashboard-header">

        <div>

          <p className="admin-title">
            ADMIN DASHBOARD
          </p>


          <h1 className="welcome-text">
            Welcome back,{" "}
            <span>
              {userName?.split(" ")[0] || "Admin"}.
            </span>
          </h1>


          <p className="sub-text">
            Here's what's happening in the system today.
          </p>

        </div>


        <div style={{
          display: "flex",
          gap: "20px",
          alignItems: "center"
        }}>

          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#2563eb",
          }}>
            <QrCode />

            <div style={{
              fontSize: "0.8rem"
            }}>QR Code</div>
          </div>

          <button className="primary-btn" onClick={() => {
            navigate("/admin/applications");
          }}>
            Review New Application
          </button>
        </div>


      </header>



      {/* Metrics */}


      <section className="metrics-grid">

        {
          metrics.map((item,index)=>(

            <div
              key={index}
              className={`metric-card ${
                item.active ? "active" : ""
              }`}
              onClick={() => {
                if (item.number === "124") {
                  navigate("/admin/applications");
                } else if (item.number === "49") {
                  navigate("/admin/documents");
                }
              }}
            >

              <div className="metric-header">

                <div className="metric-number">
                  {item.number}
                </div>


                <div className="metric-icon">
                  <FileText size={22}/>
                </div>

              </div>


              <h3>
                {item.title}
              </h3>


              <p className="metric-change">

                <span className={item.type}>
                  {item.change}
                </span>

                {" "}from yesterday

              </p>


              <p className="metric-subtext">
                {item.subtitle}
              </p>


            </div>

          ))
        }

      </section>




      <main className="dashboard-grid">


        <div className="left-column">



          {/* Pending Verification */}


          <section className="dashboard-card">


            <div className="card-heading">

              <div>

                <span>
                  PENDING WORK
                </span>


                <h2>
                  Pending Document Verification
                </h2>

              </div>


              <a>
                View All
              </a>

            </div>



            <table>

              <thead>

                <tr>
                  <th>Applicant</th>
                  <th>License Type</th>
                  <th>Submitted On</th>
                  <th>Documents</th>
                  <th style={{
                    paddingLeft: "15px"
                  }}>Action</th>
                </tr>

              </thead>


              <tbody>

                {
                  pendingApplications.map((item,index)=>(

                    <tr key={index}>

                      <td>

                        <div className="user">

                          <div className="avatar">
                            {item.initials}
                          </div>

                          {item.name}

                        </div>

                      </td>


                      <td>
                        {item.type}
                      </td>


                      <td>
                        {item.date}
                      </td>


                      <td>
                        {item.documents}
                      </td>


                      <td>
                        <button className="review-btn" onClick={() => {
                          navigate("/admin/documents");
                        }}>
                          Review
                        </button>
                      </td>

                    </tr>

                  ))
                }

              </tbody>


            </table>


          </section>





          <div className="bottom-grid">



            {/* Exam */}

            <section className="dashboard-card">

              <span>
                EXAMINATION
              </span>

              <h2>
                Today's Examination Schedule
              </h2>


              <div className="table-header">
                <p>Applicant</p>
                <p>Exam Type</p>
              </div>


              {
                examSchedules.map((item,index)=>(

                  <div
                    className="small-row"
                    key={index}
                  >

                    <div className="user">

                      <div className="avatar">
                        {item.initials}
                      </div>

                      {item.name}

                    </div>


                    <p>
                      {item.exam}
                    </p>


                  </div>

                ))
              }


              <a className="view-link" onClick={() => [
                navigate("/admin/schedules")
              ]}>
                View All
              </a>


            </section>





            {/* Payments */}


            <section className="dashboard-card">

              <span>
                PAYMENT
              </span>


              <h2>
                Recent Payments
              </h2>


              <div className="table-header">
                <p>Applicant</p>
                <p>Amount</p>
              </div>


              {
                payments.map((item,index)=>(

                  <div
                    className="small-row"
                    key={index}
                  >

                    <div className="user">

                      <div className="avatar">
                        {item.initials}
                      </div>

                      {item.name}

                    </div>


                    <p>
                      {item.amount}
                    </p>


                  </div>

                ))
              }


              <a className="view-link">
                View All
              </a>


            </section>



          </div>



        </div>





        {/* Activity */}


        <section className="dashboard-card activity-card">


          <span>
            RECENT ACTIVITY
          </span>


          <h2>
            What's happening
          </h2>



          <div className="activity-list">

            {
              activities.map((item,index)=>{

                const Icon = item.icon;

                return (

                  <div
                    className="activity"
                    key={index}
                  >

                    <div className="activity-left">

                      <div className="activity-icon">

                        <Icon size={16}/>

                      </div>


                      <div>

                        <strong>
                          {item.title}
                        </strong>


                        <p>
                          {item.subtitle}
                        </p>

                      </div>


                    </div>


                    <time>
                      {item.time}
                    </time>


                  </div>

                );

              })
            }

          </div>


          <a className="view-link">
            View All
          </a>


        </section>


      </main>



    </div>
  );
}