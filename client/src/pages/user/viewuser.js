// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../context/auth";
// import Alert from "react-bootstrap/Alert";
// import Button from "react-bootstrap/Button";

// const Viewuser = () => {
//   const [Alluser, setAlluser] = useState([]);
//   const [auth, setAuth] = useAuth();
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertVariant, setAlertVariant] = useState("success");
//   const [searchQuery, setSearchQuery] = useState("");

//   const Getalluser = async () => {
//     try {
//       const response = await axios.get("/api/v1/general/viewuser");
//       setAlluser(response.data);
//     } catch (error) {
//       console.error("Error fetching all user data:", error);
//     }
//   };

//   const GetFilteredUsers = async () => {
//     try {
//       const response = await axios.get("/api/v1/general/viewFilteredUsers", {
//         params: { search: searchQuery },
//       });

//       if (Array.isArray(response.data)) {
//         setAlluser(response.data);
//       } else {
//         setAlluser([]);
//       }
//     } catch (error) {
//       console.error("Error fetching filtered user data:", error);
//     }
//   };

//   const Blockuser = async (id, name) => {
//     try {
//       await axios.post("/api/v1/general/blockuser", {
//         id,
//       });
//       setAlertVariant("success");
//       setAlertMessage(`${name} is blocked temporarily`);
//       setShowAlert(true);
//       Getalluser(); // Refresh the user list without a page reload
//     } catch (error) {
//       console.log(error);
//       setAlertVariant("danger");
//       setAlertMessage("Something went wrong");
//       setShowAlert(true);
//     }
//   };

//   const Allowuser = async (id, name) => {
//     try {
//       await axios.post("/api/v1/general/unblockuser", {
//         id,
//       });
//       setAlertVariant("success");
//       setAlertMessage(`${name} is unblocked`);
//       setShowAlert(true);
//       Getalluser(); // Refresh the user list without a page reload
//     } catch (error) {
//       console.log(error);
//       setAlertVariant("danger");
//       setAlertMessage("Something went wrong");
//       setShowAlert(true);
//     }
//   };

//   const handleSearch = () => {
//     if (searchQuery.trim() !== "") {
//       GetFilteredUsers();
//     } else {
//       Getalluser();
//     }
//   };

//   useEffect(() => {
//     Getalluser();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div>
//       <div
//         style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
//       >
//         <input
//           type="text"
//           placeholder="Search by registration ID"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           style={{
//             padding: "8px",
//             marginRight: "8px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//             width: "200px",
//           }}
//         />
//         <Button
//           variant="primary"
//           onClick={handleSearch}
//           style={{ padding: "8px", borderRadius: "4px" }}
//         >
//           Search
//         </Button>
//       </div>
//       {showAlert && (
//         <Alert
//           variant={alertVariant}
//           onClose={() => setShowAlert(false)}
//           dismissible
//         >
//           {alertMessage}
//         </Alert>
//       )}

//       {Alluser.map((c) => (
//         <div key={c.reg} style={{ marginBottom: "20px" }}>
//           <h4 style={{ fontWeight: "bold" }}>Name: {c.name}</h4>
//           <h4 style={{ fontWeight: "bold" }}>Reg no.: {c.reg}</h4>
//           <h4 style={{ fontWeight: "bold" }}>Email : {c.email}</h4>
//           <h4 style={{ fontWeight: "bold" }}>Phone no.: {c.phone}</h4>
//           <h4 style={{ fontWeight: "bold" }}>Hostel : {c.hostel}</h4>
//           {c.blocked === "0" ? (
//             <Button variant="danger" onClick={() => Blockuser(c._id, c.name)}>
//               Block User
//             </Button>
//           ) : (
//             <Button variant="success" onClick={() => Allowuser(c._id, c.name)}>
//               Allow User
//             </Button>
//           )}
//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Viewuser;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { Button, Alert, Card } from "react-bootstrap";
import "./viewuser.css";

const Viewuser = () => {
  const [Alluser, setAlluser] = useState([]);
  const [auth, setAuth] = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const Getalluser = async () => {
    try {
      const response = await axios.get("/api/v1/general/viewuser");
      setAlluser(response.data);
    } catch (error) {
      console.error("Error fetching all user data:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Trigger search on Enter key press
      handleSearch();
    }
  };

  const handleCardHover = (index) => {
    setHoveredCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const GetFilteredUsers = async () => {
    try {
      const response = await axios.get("/api/v1/general/viewFilteredUsers", {
        params: { search: searchQuery },
      });

      if (Array.isArray(response.data)) {
        setAlluser(response.data);
      } else {
        setAlluser([]);
      }
    } catch (error) {
      console.error("Error fetching filtered user data:", error);
    }
  };

  const Blockuser = async (id, name) => {
    try {
      await axios.post("/api/v1/general/blockuser", {
        id,
      });
      setAlertVariant("success");
      setAlertMessage(`${name} is blocked temporarily`);
      setShowAlert(true);
      Getalluser(); // Refresh the user list without a page reload
    } catch (error) {
      console.log(error);
      setAlertVariant("danger");
      setAlertMessage("Something went wrong");
      setShowAlert(true);
    }
  };

  const Allowuser = async (id, name) => {
    try {
      await axios.post("/api/v1/general/unblockuser", {
        id,
      });
      setAlertVariant("success");
      setAlertMessage(`${name} is unblocked`);
      setShowAlert(true);
      Getalluser(); // Refresh the user list without a page reload
    } catch (error) {
      console.log(error);
      setAlertVariant("danger");
      setAlertMessage("Something went wrong");
      setShowAlert(true);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      GetFilteredUsers();
    } else {
      Getalluser();
    }
  };

  useEffect(() => {
    Getalluser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by registration ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: "8px",
            marginRight: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <Button
          variant="primary"
          onClick={handleSearch}
          style={{ padding: "8px", borderRadius: "4px" }}
        >
          Search
        </Button>
      </div>

      {showAlert && (
        <Alert
          variant={alertVariant}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}

      {/* <div style={{ display: "flex", flexWrap: "wrap" }} >
        {Alluser.map((c, index) => (
          <Card
            key={c.reg}
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={handleCardLeave}
            onClick={handleCardLeave}
            style={{
              width: "30%",
              margin: "1.5%",
              boxSizing: "border-box",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "2px solid #ccc",
              borderRadius: "8px",
              transition: "transform 0.3s ease-in-out",
              transform: `scale(${hoveredCard === index ? 1.05 : 1})`,
            }}
          >
            <Card.Body>
              <Card.Title style={{ fontWeight: "bold" }}>Name: {c.name}</Card.Title>
              <Card.Text style={{ fontWeight: "bold" }}>Reg no.: {c.reg}</Card.Text>
              <Card.Text style={{ fontWeight: "bold" }}>Email: {c.email}</Card.Text>
              <Card.Text style={{ fontWeight: "bold" }}>Phone no.: {c.phone}</Card.Text>
              <Card.Text style={{ fontWeight: "bold" }}>Hostel: {c.hostel}</Card.Text>
              {c.blocked === "0" ? (
                <Button variant="danger" onClick={() => Blockuser(c._id, c.name)}>
                  Block User
                </Button>
              ) : (
                <Button variant="success" onClick={() => Allowuser(c._id, c.name)}>
                  Allow User
                </Button>
              )}
            </Card.Body>
            <hr />
          </Card>







        ))}
      </div> */}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {Alluser.map((c, index) => (
          <div
            className="flip-card"
            key={c.reg}
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={handleCardLeave}
            onClick={handleCardLeave}
            style={{
              width: "30%",
              margin: "1.5%",
              boxSizing: "border-box",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              // border: "2px solid #ccc",
              borderRadius: "8px",
              transition: "transform 0.3s ease-in-out",
              transform: `scale(${hoveredCard === index ? 1.05 : 1})`,
            }}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <p className="title">Name: {c.name}</p>
                <p>Reg no.: {c.reg}</p>
              </div>
              <div className="flip-card-back">
                <p className="title">
                  <p>Email: {c.email}</p>
                  <p>Phone no.: {c.phone}</p>
                  <p>Hostel: {c.hostel}</p>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Viewuser;
