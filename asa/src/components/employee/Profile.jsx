import React, { useState, useEffect } from "react";
import "../../assets/css/main.css";
import profileImage from "../../assets/img/Thinley.jpeg";
import UserServices from "../services/UserServices";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    fetchUserDetails();
    fetchUserPermissions();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await UserServices.showDetail();
      if (response && response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchUserPermissions = async () => {
    try {
      const response = await UserServices.getUserPermission();
      if (response && response.status === 200) {
        setUserPermissions(response.data);
      }
    } catch (error) {
      console.error("Error fetching user permission:", error);
    }
  };

  // Function to convert resource names
  const getResourceDisplayName = (resource) => {
    switch (resource) {
      case "salary_advance":
        return "Salary Advance";
      case "tour_advance":
        return "Tour Advance";
      case "other_advance":
        return "Other Advance";
      case "dashboard":
        return "Dashboard";
      case "requested_advance":
        return "Requested Advance";
      default:
        return resource; // Return original resource name if not matched
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="col-lg-5 mb-1 col-xl-5 col-12">
        <div className="card w-100">
          <div className="upper-user-container">
            <div className="upper"></div>
            <div className="user text-center">
              <div className="profile">
                <img
                  src={profileImage}
                  className="rounded-circle"
                  width="100"
                  alt="Profile"
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="stats">
              <h5 className="mb-0">{user.name}</h5>
              <p className="p-0 m-0">EID: {user.username}</p>
              {user.grade && (
                <p className="p-0 m-0">{user.grade.position_title}</p>
              )}
            </div>
          </div>

          <div className="divider pt-4"></div>

          <div className="basicdetails col px-5 pb-4">
            <h5>Basic Details</h5>
            <div className="mt-2">
              <p className="p-0 m-0 detailhead">Name</p>
              <p className="p-0 m-0 detailtail">{user.name}</p>
            </div>

            <div className="mt-2">
              <p className="p-0 m-0 detailhead">Email</p>
              <p className="p-0 m-0 detailtail">{user.email}</p>
            </div>

            <div className="mt-2">
              <p className="p-0 m-0 detailhead">Mobile Number</p>
              <p className="p-0 m-0 detailtail">+975 {user.mobile_number}</p>
            </div>

            <div className="mt-2">
              <p className="p-0 m-0 detailhead">Role</p>
              {user.grade && (
                <p className="p-0 m-0 detailtail">
                  {user.grade.position_title}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-7 col-xl-7 col-12 permission">
        <div className="permissionheading py-1">
          <h5>Permissions</h5>
        </div>
        <div className="permissiondetails mt-2 mb-3 pb-3">
          <div className="px-2 py-2">
            <div className="d-flex">
              <i className="bi bi-justify"></i>
              <h5 className="px-2">Permissions</h5>
            </div>
            <p className="px-4">Here you can find your permissions</p>
          </div>

          {userPermissions.map((permission, index) => (
            <div key={index} className="px-4">
              <div className="px-2 ">
                <p className="detailhead p-0 m-0">
                  {getResourceDisplayName(permission.resource)}
                </p>
                <div className="row">
                  {Object.entries(permission.actions).map(
                    ([action, value], idx) => (
                      <div
                        key={idx}
                        className="col-6 d-flex align-items-center"
                      >
                        {value ? (
                          <i className="bi bi-check2 text-success fs-5"></i>
                        ) : (
                          <i className="bi bi-x text-danger fs-4"></i>
                        )}
                        <span className="px-2">
                          {capitalizeFirstLetter(action)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
