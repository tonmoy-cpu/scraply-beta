"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
// Dynamically import IonIcon for client-side only
const IonIcon = dynamic(() => import("@ionic/react").then(mod => mod.IonIcon), { ssr: false });
import { menuOutline } from "ionicons/icons";
import { closeOutline } from "ionicons/icons";
import { location } from "ionicons/icons"
import logo from "../../assets/logo-1.png"
import { getEmail, getUser, getUserName, handleLogout, isAuthenticated } from "../sign-in/auth";
import { FiUser } from 'react-icons/fi';
import getLocation from "../utils/getLocation";


interface NavItemProps {
  label: string;
}

const Header = () => {
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [locations, setLocation] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    document.documentElement.classList.remove('no-js');
    setMounted(true);

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=pk.eyJ1Ijoic2h1ZW5jZSIsImEiOiJjbG9wcmt3czMwYnZsMmtvNnpmNTRqdnl6In0.vLBhYMBZBl2kaOh1Fh44Bw`)
            .then(response => response.json())
            .then(data => {
              const city = data.features[0].context.find((context: { id: string | string[]; }) => context.id.includes('place')).text;
              const state = data.features[0].context.find((context: { id: string | string[]; }) => context.id.includes('region')).text;
              setLocation(`${city}, ${state}`);
            })
            .catch(error => {
              console.error('Error:', error);
            });
        },
        (error) => {
          console.error(error);
        },
        options
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsHeaderActive(true);
      } else {
        setIsHeaderActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

const user = getUser();

  const toggleNavbar = () => {
    setIsNavbarActive(!isNavbarActive);
  };

  return (
    <header className={`header ${isHeaderActive ? "active" : ""}`} data-header>
      <div className="container shadow-md">
        <Link href="/">
          <Image
            src={logo}
            alt="Scraply"
            width={90}
            height={40}
            className="logo ml-4 logo md:ml-16 relative top-2"
          />
        </Link>

        <nav className={`navbar ${isNavbarActive ? "active" : ""}`} data-navbar>
          <div className="wrapper">
            <Link href="/" className="logo">
              Scraply
            </Link>
            <button
              className="nav-close-btn"
              aria-label="close menu"
              data-nav-toggler
              onClick={toggleNavbar}
            >
              <IonIcon
                icon={closeOutline}
                className={`close-icon ${isNavbarActive ? "" : "hidden"}`}
              ></IonIcon>
            </button>
          </div>

          <ul className="navbar-list">
            <NavItem label="Home" />
            <NavItem label="About" />
            <NavItem label="E-Facilities" />
            <NavItem label="Recycle" />
            <NavItem label="Price Prediction" />
            <NavItem label="Tracking" />
            <NavItem label="Blog" />
            {mounted && user?.role === "admin" && <NavItem label="Add Blog" />}
            <NavItem label="Contact Us" />
            <NavItem label="Rules" />
            {mounted && user?.role === "admin" && <NavItem label="Admin" />}
          </ul>
        </nav>

        <h1 className='font-montserrat font-bold text-xl ml-12 md:ml-4 md:text-2xl text-sky-600 flex items-center gap-[1vh]'>
          <IonIcon icon={location} aria-hidden="true" role="img" />
          {locations || 'Loading...'}
        </h1>

        {user ? (
          <div className="relative">
            <button
              className="md:mr-8 text-sm md:text-xl font-semibold"
              onClick={handleToggleDropdown}
            >
              {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </button>
            {isDropdownOpen && (
              <div className="absolute top-12 right-0 projects p-4  shadow-md divide-y rounded-lg w-44 mt-2">
                <Link href="/profile" className="hover:text-sky-500">
                  Profile
                </Link>
                <Link href="/tracking" className="hover:text-sky-500">
                  Track Pickups
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" className="hover:text-sky-500">
                    Admin Panel
                  </Link>
                )}
                <button
                  className="hover:text-sky-500"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
                ) : (
                  <>
                      <Link href="/sign-in" className="btn-md btn-outline md:mr-4">Sign In</Link>
                  </>
                )}
        <button
          className="nav-open-btn"
          aria-label="open menu"
          data-nav-toggler
          onClick={toggleNavbar}
        >
          <IonIcon icon={menuOutline} aria-hidden="true" role="img" />
        </button>

        <div
          className={`overlay ${isNavbarActive ? "active" : ""}`}
          data-nav-toggler
          data-overlay
          onClick={toggleNavbar}
        ></div>
      </div>
    </header>
  );
};

const NavItem = ({ label }: NavItemProps) => {
  let href = "/";
  if (label === "Home") href = "/";
  else if (label === "Blog") href = "/blog";
  else if (label === "Add Blog") href = "/blog/AddBlog";
  else if (label === "Admin") href = "/admin";
  else if (label === "Contact Us") href = "/contactus";
  else href = `/${label.toLowerCase().replace(/ /g, "-")}`;
  return (
    <li className="navbar-link">
      <Link href={href}>
        {label}
      </Link>
    </li>
  );
};

export default Header;