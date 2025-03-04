import React, { useState, useRef, useEffect } from "react"
import Layout from "../../components/layout"
import StickyHeadTable from "../../components/StickyHeadTable"
import {
  Grid2,
  TextField,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
} from "@mui/material"

import { navigate } from "gatsby"
import api from "../../utils/api"
import loadable from "@loadable/component"
const AuthComponent = loadable(() =>
  import("../../components/common/AuthComponent")
)

const baseUrl = process.env.GATSBY_API_BASE_URL

export default function ExtraDue() {
  //un authorized access preventing
  const [roles, setRoles] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [memberId, setMemberId] = useState("")
  const [member, setMember] = useState({})
  const [dueMemberId, setDueMemberId] = useState("")
  const [deceasedOptions, setDeceasedOptions] = useState([])
  const [selectedDeceased, setSelectedDeceased] = useState("")
  const [amount, setAmount] = useState("")
  const [updateTrigger, setUpdateTrigger] = useState(false)

  // const [dueData, setDueData] = useState(0)
  const [dataArray, setDataArray] = useState([])

  const inputRef = useRef(null)

  const columnsArray = [
    { id: "memberId", label: "සා. අංකය" },
    { id: "name", label: "නම", minWidth: 250 },
    // { id: "memPayment", label: "සාමාජික මුදල්" },
    { id: "extraDue", label: "හිග මුදල" },
    // { id: "totPayment", label: "එකතුව" },
    { id: "delete", label: "" },
  ]

  const handleAuthStateChange = ({ isAuthenticated, roles }) => {
    setIsAuthenticated(isAuthenticated)
    setRoles(roles)
    if (!roles.includes("vice-secretary")) {
      navigate("/login/user-login")
    }
  }

  const getMemberById = e => {
    // console.log('search:', memberId)
    api
      .get(`${baseUrl}/member/getMembershipDeathById?member_id=${memberId}`)
      .then(response => {
        const data = response?.data?.data || {}
        console.log(data.member)
        setMember(data.member || {})
        // setDependents(data.dependents || [])

        // Prepare deceased options
        const deceased = []
        // console.log(data.member?.dateOfDeath)
        if (data.member?.dateOfDeath) {
          deceased.push({
            name: data.member.name,
            id: "member",
            isMember: true,
          })
        }
        data.dependents.forEach(dependent => {
          if (dependent.dateOfDeath) {
            deceased.push({
              name: dependent.name,
              id: dependent._id,
              isMember: false,
            })
          }
        })
        setDeceasedOptions(deceased)
      })
      .catch(error => {
        console.error("Axios error: ", error)
      })
  }
  const handleSelectChange = event => {
    setSelectedDeceased(event.target.value)
    // console.log(event.target.value)
  }
  const nextDisabled = dueMemberId === "" || amount === ""

  const handleDelete = async (fine_id, member_id) => {
    console.log("fine_id: ", fine_id)
    console.log("member_id: ", member_id)

    const fineData = { member_id, fine_id }

    try {
      const res = await api.post(`${baseUrl}/member/deleteFine`, fineData)
      console.log(res)

      // Ensure re-render by updating state
      setUpdateTrigger(prev => !prev)
    } catch (err) {
      console.error("Error deleting fine:", err)
    }
  }

  const handleNext = async () => {
    try {
      let dueData = {
        dueMemberId,
        amount,
        deceased_id: selectedDeceased,
      }

      await api
        .post(`${baseUrl}/funeral/updateMemberExtraDueFines`, dueData)
        .then(res => {
          dueData = {}
          // Ensure re-render by updating state
          setUpdateTrigger(prev => !prev)
          // console.log(res.data.updatedDue)
          // const { member_id, name, fines } = res.data.updatedDue
          // Get the last fine without modifying the array
          // const lastFine = fines[fines.length - 1]
          // setDataArray(prevData => [
          //   ...prevData,
          //   {
          //     memberId: member_id,
          //     name: name,
          //     extraDue: lastFine.amount,
          //     delete: (
          //       <Button
          //         variant="contained"
          //         color="error"
          //         onClick={() => handleDelete(lastFine._id, member_id)}
          //       >
          //         Delete
          //       </Button>
          //     ),
          //   },
          // ])
        })
        .catch(err => {
          console.log(err)
        })
      setDueMemberId("")
      console.log("dueData: ", dueData)
    } catch (error) {
      console.error("Error in handleNext:", error)
    }
  }
  useEffect(() => {
    if (selectedDeceased !== "") {
      api
        .get(
          `${baseUrl}/funeral/getFuneralExDueMembersByDeceasedId?deceased_id=${selectedDeceased}`
        )
        .then(res => {
          console.log(res.data.extraDueMembersPaidInfo)
          const addedDues = res.data.extraDueMembersPaidInfo
          setDataArray(
            addedDues.map(addedDue => ({
              ...addedDue,
              delete: (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(addedDue.id, addedDue.memberId)}
                >
                  Delete
                </Button>
              ),
            }))
          )
        })
    }
  }, [selectedDeceased, updateTrigger])
  return (
    <Layout>
      <AuthComponent onAuthStateChange={handleAuthStateChange} />
      <Box>
        <Typography variant="h6">අවමංගල්‍ය අදාළ සාමාජිකත්වය</Typography>
      </Box>
      <Grid2
        container
        justifyContent={"flex-start"}
        alignItems={"flex-end"}
        gap={5}
        sx={{ mb: "20px" }}
      >
        {/* <Typography>සාමාජික අංකය</Typography> */}
        <TextField
          id="outlined-basic"
          label="සා. අංකය"
          variant="outlined"
          type="number"
          value={memberId}
          onChange={e => {
            setMemberId(e.target.value)
            setDeceasedOptions([])
          }}
          sx={{ maxWidth: "120px" }}
          // onBlur={getMemberById}
        />
        <Button
          variant="contained"
          onClick={getMemberById}
          disabled={Object.keys(member).length !== 0}
        >
          Search
        </Button>
        <Box>
          {/* <Typography>Deceased Options</Typography> */}
          <Select
            value={selectedDeceased}
            onChange={handleSelectChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              තෝරන්න
            </MenuItem>
            {deceasedOptions.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.isMember ? `${option.name}` : `${option.name}`}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <TextField
          id="outlined-basic"
          label="මුදල"
          variant="outlined"
          type="number"
          value={amount}
          onChange={e => {
            setAmount(e.target.value)
          }}
          sx={{ maxWidth: "120px" }}
          // onBlur={getMemberById}
        />
      </Grid2>
      <hr />
      {selectedDeceased && (
        <Box>
          <Typography>අතිරේක ආධාර හිඟ සාමාජිකයන්</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 3,
            }}
          >
            <TextField
              id="outlined-basic"
              inputRef={inputRef}
              label="සා. අංකය"
              variant="outlined"
              type="number"
              value={dueMemberId}
              onChange={e => setDueMemberId(e.target.value)}
              // onBlur={getMemberDueId}
              // onFocus={resetFields}
              sx={{ maxWidth: "120px" }}
            />

            {/* <TextField
            id="outlined-basic"
            label="සා. මුදල්"
            placeholder={String(memberData?.membershipDue || "")}
            variant="outlined"
            type="number"
            value={membershipPayment}
            onChange={e => setMembershipPayment(e.target.value)}
            sx={{ maxWidth: "120px" }}
            // disabled={memPayDisabled}
          /> */}
            <Typography>{amount}</Typography>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={nextDisabled}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
      <hr />
      {dataArray.length > 0 && (
        <StickyHeadTable
          columnsArray={columnsArray}
          dataArray={dataArray}
          headingAlignment={"left"}
          dataAlignment={"left"}
          totalRow={false}
        />
      )}
    </Layout>
  )
}
