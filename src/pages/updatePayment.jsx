import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSave, FiArrowLeft, FiCreditCard } from "react-icons/fi";


export default function PaymentEdit(){

  const {id}=useParams();
  const navigate=useNavigate();


  const [form,setForm]=useState({
    amount:"",
    paymentMethod:"Cash",
    paymentDate:"",
    notes:""
  });


  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);



  useEffect(()=>{
    fetchPayment();
  },[]);



  const fetchPayment=async()=>{

    try{

      const res=await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/payment/${id}`
      );


      const p=res.data.data;


      setForm({
        amount:p.amount,
        paymentMethod:p.paymentMethod,
        paymentDate:p.paymentDate?.slice(0,10) || "",
        notes:p.notes || ""
      });


    }
    catch(err){

      toast.error("Payment load failed");

    }
    finally{

      setLoading(false);

    }

  };





  const handleChange=(e)=>{

    setForm({
      ...form,
      [e.target.name]:e.target.value
    });

  };






  const submit=async(e)=>{

    e.preventDefault();

    try{

      setSaving(true);


      await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/payment/${id}`,
        form
      );


      toast.success("Payment updated successfully");


      navigate("/payments");


    }
    catch(err){

      toast.error(
        err.response?.data?.message || "Update failed"
      );

    }
    finally{

      setSaving(false);

    }

  };






  if(loading){

    return(

      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">

        <div className="flex flex-col items-center gap-5">

          <div className="
          w-16 h-16
          border-4
          border-blue-500/30
          border-t-blue-500
          rounded-full
          animate-spin
          ">
          </div>


          <p className="text-gray-300 text-lg animate-pulse">
            Loading payment details...
          </p>


        </div>

      </div>

    );

  }





  return(

    <div className="min-h-screen bg-[#0f172a] p-6 md:p-10">


      <div className="max-w-3xl mx-auto">


        {/* Header */}

        <div className="flex items-center justify-between mb-8">


          <div>

            <h1 className="text-3xl font-bold text-white">
              Edit Payment
            </h1>

            <p className="text-gray-400 mt-2">
              Update transaction information
            </p>

          </div>



          <button

            onClick={()=>navigate("/payments")}

            className="
            flex items-center gap-2
            px-4 py-2
            rounded-xl
            bg-white/10
            text-gray-300
            hover:bg-white/20
            transition
            "

          >

            <FiArrowLeft/>
            Back

          </button>


        </div>





        {/* Card */}

        <div className="
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-3xl
        shadow-2xl
        p-8
        ">



          <div className="
          flex items-center gap-3
          mb-8
          ">

            <div className="
            w-12 h-12
            rounded-xl
            bg-blue-500/20
            flex items-center justify-center
            text-blue-400
            text-xl
            ">

              <FiCreditCard/>

            </div>


            <div>

              <h2 className="text-xl text-white font-semibold">
                Payment Information
              </h2>

              <p className="text-gray-400 text-sm">
                Modify and save payment details
              </p>

            </div>

          </div>






          <form
            onSubmit={submit}
            className="space-y-6"
          >



            {/* Amount */}

            <div>

              <label className="text-gray-300 block mb-2">
                Amount
              </label>


              <input

                type="number"

                name="amount"

                value={form.amount}

                onChange={handleChange}

                className="
                w-full
                p-4
                rounded-xl
                bg-black/30
                border border-white/10
                text-white
                outline-none
                focus:border-blue-500
                "

                required

              />


            </div>







            {/* Method */}

            <div>

              <label className="text-gray-300 block mb-2">
                Payment Method
              </label>


              <select

                name="paymentMethod"

                value={form.paymentMethod}

                onChange={handleChange}

                className="
                w-full
                p-4
                rounded-xl
                bg-black/30
                border border-white/10
                text-white
                "

              >

                <option className="bg-slate-900">
                  Cash
                </option>

                <option className="bg-slate-900">
                  Card
                </option>

                <option className="bg-slate-900">
                  Bank Transfer
                </option>

                <option className="bg-slate-900">
                  Online
                </option>


              </select>


            </div>







            {/* Date */}

            <div>

              <label className="text-gray-300 block mb-2">
                Payment Date
              </label>


              <input

                type="date"

                name="paymentDate"

                value={form.paymentDate}

                onChange={handleChange}

                className="
                w-full
                p-4
                rounded-xl
                bg-black/30
                border border-white/10
                text-white
                "

              />

            </div>







            {/* Notes */}

            <div>

              <label className="text-gray-300 block mb-2">
                Notes
              </label>


              <textarea

                rows="5"

                name="notes"

                value={form.notes}

                onChange={handleChange}

                placeholder="Enter notes..."

                className="
                w-full
                p-4
                rounded-xl
                bg-black/30
                border border-white/10
                text-white
                resize-none
                "

              />


            </div>








            {/* Buttons */}


            <div className="flex gap-4 pt-4">


              <button

                type="button"

                onClick={()=>navigate("/payments")}

                className="
                flex-1
                py-3
                rounded-xl
                bg-gray-600
                hover:bg-gray-700
                text-white
                font-semibold
                "

              >

                Cancel

              </button>





              <button

                disabled={saving}

                className="
                flex-1
                py-3
                rounded-xl
                bg-gradient-to-r
                from-blue-500
                to-indigo-600
                text-white
                font-semibold
                flex
                justify-center
                items-center
                gap-2
                disabled:opacity-50
                "

              >

                {
                  saving ?
                  "Saving..." :
                  <>
                    <FiSave/>
                    Update Payment
                  </>
                }


              </button>


            </div>




          </form>



        </div>



      </div>


    </div>


  );

}