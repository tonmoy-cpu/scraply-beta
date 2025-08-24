import React from 'react'
import Hero from './Hero'
import Features from './Features'
import FAQ from './FAQ'
import EducationalPopup from './EducationalPopup'
import EducationalPopup from './EducationalPopup'

type Props = {}

const Home = (props: Props) => {
  return (
    <>
    <EducationalPopup currentPage="home" />
    <EducationalPopup currentPage="home" />
    <Hero/>
    <Features/>
    <FAQ/>
    </>
  )
}

export default Home