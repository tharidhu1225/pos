import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiX } from "react-icons/fi";

export default function Booking() {

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedPackages, setSelectedPackages] = useState([]);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    bookingDate: "",
    eventDate: "",
    packages: [],
    extraCharges: 0,
    discount: 0,
    advancePayment: 0,
    notes: "",
  });


  // Load packages
  useEffect(() => {

    const fetchPackages = async () => {

      try {

        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/package`
        );

        setPackages(res.data.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };


    fetchPackages();

  }, []);



  // Input Change
  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev)=>({
      ...prev,
      [name]: value
    }));

  };



  // Add Package
  const addPackage = (id)=>{

    const pkg = packages.find(
      (item)=> item._id === id
    );


    if(!pkg) return;


    const already =
      selectedPackages.some(
        (item)=> item._id === id
      );


    if(already) return;


    const updated = [
      ...selectedPackages,
      pkg
    ];


    setSelectedPackages(updated);


    setForm((prev)=>({
      ...prev,
      packages: updated.map(
        (item)=>item._id
      )
    }));

  };



  // Remove Package
  const removePackage = (id)=>{


    const updated =
      selectedPackages.filter(
        (item)=>item._id !== id
      );


    setSelectedPackages(updated);


    setForm((prev)=>({
      ...prev,
      packages: updated.map(
        (item)=>item._id
      )
    }));

  };



  // Calculations

  const packagePrice =
    selectedPackages.reduce(
      (sum,item)=>
        sum + Number(item.price),
      0
    );


  const extra =
    Number(form.extraCharges) || 0;


  const discount =
    Number(form.discount) || 0;


  const advance =
    Number(form.advancePayment) || 0;



  const total =
    packagePrice + extra - discount;



  const balance =
    total - advance;// Submit Booking
const handleSubmit = async (e) => {

  e.preventDefault();


  if(selectedPackages.length === 0){
    alert("Please select at least one package");
    return;
  }


  try {

    setSubmitting(true);


    await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/booking`,
      {
        ...form,
        totalAmount: total,
        balance: balance,
      }
    );


    alert("Booking Created Successfully");


    setForm({
      customerName:"",
      phone:"",
      bookingDate:"",
      eventDate:"",
      packages:[],
      extraCharges:0,
      discount:0,
      advancePayment:0,
      notes:"",
    });


    setSelectedPackages([]);


  } catch(error){

    console.log(error);
    alert("Error creating booking");


  } finally {

    setSubmitting(false);

  }

};



return (

<div className="space-y-8">


{/* HEADER */}

<div>

<h1 className="text-2xl font-bold text-white">
Create New Booking
</h1>

<p className="text-gray-400 text-sm">
Create photography booking with multiple packages
</p>

</div>



<form
onSubmit={handleSubmit}
className="grid grid-cols-1 lg:grid-cols-3 gap-6"
>


{/* LEFT SIDE */}

<div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">


<input

name="customerName"

value={form.customerName}

onChange={handleChange}

placeholder="Customer Name"

className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"

required

/>



<input

name="phone"

value={form.phone}

onChange={handleChange}

placeholder="Phone Number"

className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"

required

/>





<div className="grid md:grid-cols-2 gap-4">


<div>

<label className="text-gray-300 text-sm">
Booking Date
</label>


<input

type="date"

name="bookingDate"

value={form.bookingDate}

onChange={handleChange}

className="w-full mt-1 p-3 rounded-xl bg-black/30 border border-white/10 text-white"

/>

</div>




<div>

<label className="text-gray-300 text-sm">
Event Date
</label>


<input

type="date"

name="eventDate"

value={form.eventDate}

onChange={handleChange}

className="w-full mt-1 p-3 rounded-xl bg-black/30 border border-white/10 text-white"

/>

</div>


</div>





{/* PACKAGE SELECT */}


<select

onChange={(e)=>{

addPackage(e.target.value);

e.target.value="";

}}

className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white"

>

<option value="">
Add Package
</option>


{
packages.map((pkg)=>(

<option
key={pkg._id}
value={pkg._id}
>

{pkg.packageName} - Rs.{pkg.price}

</option>

))

}


</select>





{/* SELECTED PACKAGES */}


<div className="space-y-3">


<h3 className="text-white font-semibold">
Selected Packages
</h3>



{
selectedPackages.map((pkg)=>(


<div

key={pkg._id}

className="flex justify-between items-center bg-black/30 p-3 rounded-xl"

>


<div>

<p className="text-white font-medium">
{pkg.packageName}
</p>


<p className="text-green-400 text-sm">
Rs. {pkg.price}
</p>

</div>



<button

type="button"

onClick={()=>removePackage(pkg._id)}

className="text-red-400"

>

<FiX/>

</button>


</div>


))

}


</div>
{/* COST INPUTS */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">


<div className="relative">

<label className="absolute -top-2 left-3 text-xs text-gray-300 bg-black px-1">
Extra Charges
</label>


<input

type="number"

name="extraCharges"

value={form.extraCharges}

onChange={handleChange}

className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"

/>

</div>




<div className="relative">

<label className="absolute -top-2 left-3 text-xs text-gray-300 bg-black px-1">
Discount
</label>


<input

type="number"

name="discount"

value={form.discount}

onChange={handleChange}

className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"

/>

</div>




<div className="relative">

<label className="absolute -top-2 left-3 text-xs text-gray-300 bg-black px-1">
Advance Payment
</label>


<input

type="number"

name="advancePayment"

value={form.advancePayment}

onChange={handleChange}

className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"

/>

</div>


</div>





<textarea

name="notes"

value={form.notes}

onChange={handleChange}

placeholder="Notes (optional)"

className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"

/>


</div>





{/* RIGHT SUMMARY */}

<div className="space-y-4">


<div className="bg-blue-600/80 p-5 rounded-2xl">

<p className="text-sm">
Package Price
</p>


<h2 className="text-2xl font-bold">
Rs. {packagePrice}
</h2>


</div>





<div className="bg-green-600/80 p-5 rounded-2xl">


<p className="text-sm">
Total Amount
</p>


<h2 className="text-2xl font-bold">
Rs. {total}
</h2>


</div>





<div className="bg-red-600/80 p-5 rounded-2xl">


<p className="text-sm">
Balance
</p>


<h2 className="text-2xl font-bold">
Rs. {balance}
</h2>


</div>





<button

type="submit"

disabled={submitting}

className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition"

>


<FiPlus/>


{
submitting
?
"Creating..."
:
"Create Booking"
}


</button>



</div>




</form>


</div>

);


}