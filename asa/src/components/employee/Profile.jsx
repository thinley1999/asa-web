import React from "react";
import "../../assets/css/main.css";
import profileImage from "../../assets/img/Thinley.jpeg";

const Profile = () => {
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
              <h5 className="mb-0">Thinley Yoezer</h5>
              <p className="p-0 m-0">EID: 2023003</p>
              <p className="p-0 m-0">Asst. ICT Officer</p>
            </div>
          </div>

          <div className="divider pt-4"></div>

          <div className="basicdetails col px-5 pb-4">
            <h5>Basic Details</h5>
            <div className="mt-2">
              <p className="p-0 m-0 detailhead">Name</p>
              <p className="p-0 m-0 detailtail">Thinley Yoezer</p>
            </div>

            <div className="mt-2">
              <p className="p-0 m-0 detailhead">Email</p>
              <p className="p-0 m-0 detailtail">tyoezer@rma.org.bt</p>
            </div>

            <div className="mt-2">
              <p className="p-0 m-0 detailhead">Mobile Number</p>
              <p className="p-0 m-0 detailtail">+975 17479380</p>
            </div>

            <div className="mt-2">
              <p className="p-0 m-0 detailhead">Role</p>
              <p className="p-0 m-0 detailtail">Asst. ICT Officer</p>
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
          <div className="px-4">
            <div className="px-2 ">
              <p className="detailhead p-0 m-0">Freelancer</p>
              <div class="row">
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Create Freelancer</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Permission Update</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Update Freelancer</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="px-2 ">
              <p className="detailhead p-0 m-0">Role</p>
              <div class="row">
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Permission Read</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Permission Update</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Update</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="px-2 ">
              <p className="detailhead p-0 m-0">Team Board</p>
              <div class="row">
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Read</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="px-2 ">
              <p className="detailhead p-0 m-0">Team</p>
              <div class="row">
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Add member</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Create</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Group member</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Read</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Update</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Update group user</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="px-2 ">
              <p className="detailhead p-0 m-0">Task</p>
              <div class="row">
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Create</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Delete</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Update</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="px-2 ">
              <p className="detailhead p-0 m-0">Time Tackers</p>
              <div class="row">
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Create</span>
                </div>
                <div class="col-6 d-flex align-items-center">
                  <i className="bi bi-check2 text-success fs-5"></i>
                  <span className="px-2">Read</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="px-2 ">
              <p className="detailhead p-0 m-0">Current Orders and Tasks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
