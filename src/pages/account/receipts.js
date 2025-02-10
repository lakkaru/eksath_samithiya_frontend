import React, { useEffect, useState, useRef } from "react"
import Layout from "../../components/layout"
import StickyHeadTable from "../../components/StickyHeadTable"
import { Box, Button, TextField } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { navigate } from "gatsby"

import api from "../../utils/api"
//un authorized access preventing
import loadable from "@loadable/component"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)

const baseUrl = process.env.GATSBY_API_BASE_URL


export default function Receipts() {
  const columnsArray = [
    { id: "memberId", label: "Member Id" },
    { id: "name", label: "Name", minWidth: 250 },
    { id: "finePayment", label: "හිග මුදල්" },
    { id: "memPayment", label: "සාමාජික මුදල්" },
    { id: "totPayment", label: "එකතුව" },
    { id: "delete", label: "Delete" }, // Add delete column
  ]
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [memberId, setMemberId] = useState("")
  const [memberData, setMemberData] = useState()
  const [membershipPayment, setMembershipPayment] = useState("")
  const [finePayment, setFinePayment] = useState("")
  const [paymentsArray, setPaymentsArray] = useState([])
  const [paymentDate, setPaymentDate] = useState(dayjs())
  const [savingData, setSavingData] = useState(false)

  const inputRef = useRef(null)

  //un authorized access preventing
  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!isAuthenticated || !roles.includes("treasurer")) {
      navigate("/login/user-login")
    }
  }
  // console.log('logout:', logout)
  // console.log("isAuthenticated:", isAuthenticated)
  // console.log("roles:", roles)
  useEffect(() => {
    // if (memberData?.member?._id) {
    //   Axios.get(`${baseUrl}/member/due?member_id=${memberData._id}`)
    //     .then(response => {
    //       console.log(response.data)
    //     })
    //     .catch(error => {
    //       console.error("Axios error: ", error)
    //     })
    // }
  }, [])

  const getMemberDueId = e => {
    if (e.target.value) {
      api
        .get(`${baseUrl}/member/due?member_id=${e.target.value}`)
        .then(response => {
          // console.log(response?.data)
          setMemberData(response?.data)
        })
        .catch(error => {
          console.error("Axios error: ", error)
        })
    }
  }

  const resetFields = () => {
    setMemberId("")
  }

  const handleNext = () => {
    const newEntry = {
      memberId: memberId,
      member_Id: memberData.member._id,
      name: memberData.member.name || "N/A",
      memPayment: membershipPayment,
      finePayment: finePayment,
      id: Date.now(),
    }
    // console.log("newEntry:", newEntry)
    setPaymentsArray(prevArray => [...prevArray, newEntry])

    if (inputRef.current) {
      inputRef.current.focus()
    }

    setMemberId("")
    setMemberData()
    setMembershipPayment("")
    setFinePayment("")
  }

  const handleDelete = id => {
    setPaymentsArray(prevArray =>
      prevArray.filter(payment => payment.id !== id)
    )
  }

  const handleAddRecords = async () => {
    setSavingData(true)
    try {
      await api
        .post(`${baseUrl}/account/receipts`, {
          date: paymentDate,
          paymentsArray: paymentsArray,
        })
        .then(response => {
          // console.log("response:", response, paymentsArray)
          setPaymentsArray([])
        })
    } catch (error) {
      console.error("Error recording payment:", error)
    }
    setSavingData(false)
  }

  let totalMemPayment = 0
  let totalFinePayment = 0

  paymentsArray.forEach(payment => {
    totalMemPayment += parseFloat(payment.memPayment || 0)
    totalFinePayment += parseFloat(payment.finePayment || 0)
  })

  const totalsRow = {
    memberId: "Total",
    name: "Total",
    memPayment: totalMemPayment.toFixed(2),
    finePayment: totalFinePayment.toFixed(2),
    delete: (totalMemPayment + totalFinePayment).toFixed(2),
  }

  let dataArray = [
    ...[...paymentsArray].reverse().map(payment => ({
      ...payment,
      totPayment:
        parseFloat(payment.finePayment || 0) +
        parseFloat(payment.memPayment || 0),
      delete: (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(payment.id)}
        >
          Delete
        </Button>
      ),
    })),
    totalsRow,
  ]

  // Calculate dynamic states directly in the render logic
  // const memPayDisabled = !(
  //   memberData?.totalDue === 0 ||
  //   (finePayment && parseFloat(finePayment) >= memberData?.totalDue)
  // )
  const nextDisabled =
    !memberData ||
    (!finePayment && !membershipPayment) ||
    parseFloat(finePayment || 0) < 0 ||
    parseFloat(membershipPayment || 0) < 0

  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <section>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 3,
          }}
        >
          <TextField
            id="outlined-basic"
            inputRef={inputRef}
            label="සාමාජික අංකය"
            variant="outlined"
            type="number"
            value={memberId}
            onChange={e => setMemberId(e.target.value)}
            onBlur={getMemberDueId}
            onFocus={resetFields}
            sx={{ maxWidth: "120px" }}
          />
          
          <TextField
            id="outlined-basic"
            label="සාමාජික මුදල්"
            placeholder={String(memberData?.membershipDue || "")}
            variant="outlined"
            type="number"
            value={membershipPayment}
            onChange={e => setMembershipPayment(e.target.value)}
            sx={{ maxWidth: "120px" }}
            // disabled={memPayDisabled}
          />
          <TextField
            id="outlined-basic"
            label="හිග මුදල්"
            placeholder={String(memberData?.totalDue || "")}
            variant="outlined"
            type="number"
            value={finePayment}
            onChange={e => setFinePayment(e.target.value)}
            sx={{ maxWidth: "120px" }}
          />
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={nextDisabled}
          >
            Next
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 4,
            padding: "10px 0px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label={"ගෙවන දිනය"}
                value={paymentDate}
                onChange={newDate => setPaymentDate(newDate)}
                format="YYYY/MM/DD"
                maxDate={dayjs()}
              />
            </DemoContainer>
          </LocalizationProvider>
          <Button
            variant="contained"
            disabled={!paymentsArray.length > 0}
            onClick={handleAddRecords}
          >
            Add all Records
          </Button>
        </Box>
        <hr />
        <StickyHeadTable
          columnsArray={columnsArray}
          dataArray={dataArray}
          headingAlignment={"left"}
          dataAlignment={"left"}
        />
      </section>
    </Layout>
  )
}
