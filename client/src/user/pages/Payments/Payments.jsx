import { CreditCard, ArrowRight } from "lucide-react";
import "./Payments.css";
import AnimatedAmount from "./AnimatedAmount";

export default function Payments() {

  const payments = [
    {
      date: "08/07/2026",
      reference: "TXN-4A39DD",
      description: "Application processing fee",
      amount: "Rs. 500",
      status: "Paid",
    },
    {
      date: "05/06/2026",
      reference: "TXN-45DG90",
      description: "Written exam fee",
      amount: "Rs. 300",
      status: "Paid",
    },
    {
      date: "--/--/----",
      reference: "TXN-34ED44",
      description: "Licence issuance fee",
      amount: "Rs. 2,150",
      status: "Due",
    },
  ];


  return (
    <div className="payments-page">


      <div className="payments-container">


        <h1 className="page-title">
          My <span>Payments</span>
        </h1>

        <p>
          View your payment history.
        </p>



        {/* Payment Card */}

        <div className="payment-card">


          <div className="payment-header">

            <h2>
              Make a payment
            </h2>

            <p>
              Licence issuance fee
            </p>

          </div>



          <div className="payment-body">


            <div>

              <span className="amount-label">
                Amount due
              </span>


              <h3 className="amount">
                <AnimatedAmount value={2150} />
              </h3>


            </div>



            <button className="pay-button">

              <CreditCard size={16}/>

              Pay with eSewa

              <ArrowRight size={16}/>

            </button>



          </div>


        </div>




        {/* History */}


        <div className="history-card">


          <h2>
            Payment History
          </h2>



          <div className="table-wrapper">


            <table>


              <thead>

                <tr>

                  <th>Date</th>
                  <th>Reference</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>

                </tr>

              </thead>



              <tbody>


                {
                  payments.map((payment,index)=>(

                    <tr key={index}>

                      <td>
                        {payment.date}
                      </td>


                      <td>
                        {payment.reference}
                      </td>


                      <td>
                        {payment.description}
                      </td>


                      <td>
                        {payment.amount}
                      </td>


                      <td className="status-cell">

                        <span
                          className={
                            payment.status === "Paid"
                            ? "badge paid"
                            : "badge due"
                          }
                        >
                          {payment.status}
                        </span>

                      </td>


                    </tr>


                  ))
                }


              </tbody>


            </table>


          </div>


        </div>


      </div>


    </div>
  );
}