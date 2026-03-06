 
 import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

 export const AppContext = createContext()

 export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const {user} = useUser()
    const {getToken} = useAuth()

    const [searchFilter,setSearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched,setIsSearched] = useState(false)

    const [jobs,setJobs] = useState([])

    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)

    const [companyToken,setCompanyToken] = useState(null)
    const [companyData,setCompanyData] = useState(null)

    const [userData,setUserData] = useState(null)
    const [userApplications,setUserApplications] = useState([])
    const [userDataLoading, setUserDataLoading] = useState(false)



   // Function to Fetch Jobs data
    const fetchJobs = async () => {
      try {
        
        const {data} = await axios.get(backendUrl + '/api/jobs')

        if(data.success){
          setJobs(data.jobs)
          console.log(data.jobs);
        }
        else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }  
      
    }

    const fetchCompanyData = async()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/company/company',{headers:{token:companyToken}})
            if (data.success) {
                setCompanyData(data.company)
                console.log(data);
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const fetchUserData = async (retryCount = 0) => {
  try {
    setUserDataLoading(true);
    const token = await getToken();

    const {data} = await axios.get(backendUrl+"/api/users/user",
      {headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        setUserData(data.user);
        setUserDataLoading(false);
      }else{
        // User not found - wait and retry (server will create user on-demand)
        console.log("User data not found, retrying in 1 second... (attempt", retryCount + 1, ")");
        if (retryCount < 3) { // Retry up to 3 times
          setTimeout(() => {
            fetchUserData(retryCount + 1);
          }, 1000);
        } else {
          console.log("Max retries reached, user data not found");
          setUserDataLoading(false);
          // Don't show error toast - let user try to apply anyway
        }
      }
  } catch (error) {
    console.log("Error fetching user data:", error.message);
    setUserDataLoading(false);
  }
}


  const fetchUserApplications = async () =>{
    try {
      
      const token = await getToken()

      const {data} = await axios.get(backendUrl+"/api/users/applications",
        {headers: {Authorization: `Bearer ${token}`}}
      )

      if(data.success){
        setUserApplications(data.applications)
      }
      else{
        // Retry if user not found
        if (data.message && data.message.includes("not found")) {
          console.log("Applications not found, retrying...");
          setTimeout(() => {
            fetchUserApplications();
          }, 2000);
        }
      }

    } catch (error) {
      console.log("Error fetching applications:", error.message);
    }
  }

    useEffect(()=>{

        fetchJobs()
        const storedCompanyToken = localStorage.getItem('companyToken')

        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }

    },[])

    useEffect(()=>{
        if (companyToken) {
            fetchCompanyData()
        }
    },[companyToken])

  useEffect(()=>{
        if (user) {
            fetchUserData()
            fetchUserApplications()
        }
    },[user])


    const value={
        setSearchFilter,searchFilter,isSearched,setIsSearched,jobs,setJobs,showRecruiterLogin,setShowRecruiterLogin,
        companyToken,setCompanyToken,companyData,setCompanyData,backendUrl,userData,setUserData,userApplications,
        setUserApplications,fetchUserData,fetchUserApplications,userDataLoading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
 }