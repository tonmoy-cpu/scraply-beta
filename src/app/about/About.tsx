"use client"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import feature from "../../assets/features/banner.svg";
import animationData from "../../assets/animation-1.json";
import Lottie from "lottie-react";

const teamMembers = [
  {
    name: "Sajal Mittal",
    branch: "Computer Science",
    age: 22,
    year: "4th Year",
    image: "https://www.pngall.com/wp-content/uploads/12/Avatar-No-Background.png",
    role: "Backend Developer"
  },
  {
    name: "Sarvagya Pratap Singh",
    branch: "Computer Science", 
    age: 22,
    year: "4th Year",
    image: "https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-man-avatar-with-circle-frame-vector-ilustration-png-image_6110328.png",
    role: "Frontend Developer"
  },
  {
    name: "Utkarsh Pratap Singh",
    branch: "Computer Science",
    age: 22,
    year: "4th Year", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxAqe5vlEv-UaxkHoCvryEkwPiJLIH_rjXww&s",
    role: "Frontend Developer"
  },
  {
    name: "Tonmoy Mukherjee",
    branch: "Computer Science",
    age: 22,
    year: "4th Year",
    image: "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg",
    role: "Full Stack Developer"
  }
];

const About = () => {
  return (
    <>
      <section className="section features" id="features" aria-label="features">
      <div className="container mx-auto px-4 text-center">
        <p className="section-subtitle font-bold text-gray-700 mb-2">
        -About Scraply-
        </p>

        <h2 className=" text-4xl section-title font-bold text-black mb-4">
        Revolutionizing E-Waste Locator and Management
        </h2>

        <div className=" mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-10 items-center justify-between text-center md:text-left">
            <div className="md:w-1/2 mb-4 md:mb-0 md:pl-8">
              <p className="section-text text-3xl text-gray-600  font-semibold leading-relaxed">
              In India, the improper disposal of e-waste contributes to the
                alarming annual collection of 1.71 million metric tons. Locating
                trustworthy e-waste collection facilities remains a significant
                challenge, intensifying this environmental issue. <br />
                The Scraply Web Platform is conceived to directly address this
                issue. Our platform offers a dynamic, user-friendly interface for
                individuals and businesses seeking reliable e-waste collection
                facilities.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start">
                <p className="btn btn-primary mr-3">
                  <Link href="/contactus"> Contact Us</Link>
                </p>
                <p className="btn btn-secondary mr-3">
                  <Link href="/recycle"> Recycling Services</Link>
                </p>{" "}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center section-banner has-before">
              {/* <Image
                src={feature}
                alt="Image"
                width={400}
                height={400}
                className="object-cover rounded-lg"
              /> */}
              <Lottie animationData={animationData} className="object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
    
    {/* Team Section */}
    <section className="section bg-gray-50" id="team" aria-label="team">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-subtitle font-bold text-gray-700 mb-2">
            -Meet Our Team-
          </p>
          <h2 className="text-4xl section-title font-bold text-black mb-4">
            The Minds Behind Scraply
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A passionate team of engineering students dedicated to solving e-waste challenges through innovative technology solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="relative mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-go-green"
                  style={{ height: 'auto' }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-go-green font-semibold mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm mb-1">{member.branch}</p>
              <p className="text-gray-500 text-sm">{member.year} • Age {member.age}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default About;
