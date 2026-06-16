#!/usr/bin/env python3
import re

# Read the file
with open('src/components/Blog.tsx', 'r') as f:
    content = f.read()

# Section 1: Find EV Service Centres - Remove bullets, enhance paragraphs
section1_old = r"""      \{
        title: '1\. Find EV Service Centres',
        paragraphs: \[
          'One of the most valuable features of EV Champ is its nationwide network of verified EV service centers\. Whether you own an electric car, scooter, or commercial EV, EV Champ helps you quickly connect with qualified technicians and repair centers\.',
          'Timely maintenance improves vehicle performance, extends battery life, and reduces unexpected breakdowns\.',
        \],
        bullets: \[
          'Locate trusted EV workshops near you',
          'Access battery diagnostics support',
          'Get professional EV repairs',
          'Find authorized service providers',
          'Pan-India service network',
        \],
      \},"""

section1_new = """      {
        title: '1. Find EV Service Centres',
        paragraphs: [
          'One of the most valuable features of EV Champ is its nationwide network of verified EV service centers. Whether you own an electric car, scooter, or commercial EV, EV Champ helps you quickly locate trusted EV workshops near you and connect with qualified technicians and repair centers across the country.',
          'Through EV Champ, you can easily access comprehensive battery diagnostics support and get professional EV repairs from authorized service providers. Our pan-India service network ensures that timely maintenance improves vehicle performance, extends battery life, and reduces unexpected breakdowns. Every service center in our network is verified and authorized, giving you peace of mind when servicing your electric vehicle.',
        ],
      },"""

content = re.sub(section1_old, section1_new, content)

# Section 2: Zeflash
section2_old = r"""      \{
        title: '2\. Zeflash – AI-Powered Battery Diagnostics',
        paragraphs: \[
          'Battery health is the most critical component of any electric vehicle\. EV Champ offers Zeflash, an advanced AI-powered battery diagnostic solution\.',
          'Zeflash helps identify battery issues before they become major problems\. This proactive approach saves money and improves vehicle reliability\.',
          'Fleet managers can monitor battery performance across multiple vehicles and reduce downtime significantly\.',
        \],
        bullets: \[
          'Rapid battery diagnostics',
          'AI-driven analysis',
          'SoP and SoF evaluation',
          'Health reports within minutes',
          'Charging performance insights',
          'Predictive maintenance recommendations',
        \],
      \},"""

section2_new = """      {
        title: '2. Zeflash – AI-Powered Battery Diagnostics',
        paragraphs: [
          'Battery health is the most critical component of any electric vehicle. EV Champ offers Zeflash, an advanced AI-powered battery diagnostic solution that provides rapid battery diagnostics and AI-driven analysis in just minutes.',
          'Zeflash evaluates crucial metrics like State of Health (SoH) and State of Charge (SoC), while also analyzing charging performance insights and overall battery condition. The platform generates comprehensive health reports that help identify battery issues before they become major problems. This proactive approach saves money and improves vehicle reliability significantly.',
          'For fleet managers, Zeflash enables comprehensive fleet-wide battery performance monitoring and alerts across multiple vehicles. By identifying vehicles at risk of battery failure early, fleet operators can schedule preventive maintenance and reduce downtime substantially. Individual EV owners receive detailed health reports with predictive maintenance recommendations to extend battery lifespan, improve range, and maximize their vehicle\\'s resale value.',
        ],
      },"""

content = re.sub(section2_old, section2_new, content)

# Section 3: Smart EV Telematics
section3_old = r"""      \{
        title: '3\. Smart EV Telematics & Fleet Plans',
        paragraphs: \[
          'Managing electric vehicle fleets requires real-time data and actionable insights\. EV Champ's Smart EV Telematics solution provides a powerful system for fleet operators to monitor and manage vehicles remotely\.',
          'This makes EV Champ one of the most comprehensive EV fleet management platforms in India\.',
        \],
        bullets: \[
          'Live GPS tracking',
          'Fleet monitoring dashboard',
          'Driver behavior analytics',
          'Vehicle performance monitoring',
          'Energy consumption reports',
          'Route optimization',
          'Real-time alerts',
          'Improve operational efficiency',
          'Reduce maintenance costs',
          'Increase vehicle uptime',
          'Enhance driver safety',
          'Monitor vehicle health remotely',
        \],
      \},"""

section3_new = """      {
        title: '3. Smart EV Telematics & Fleet Plans',
        paragraphs: [
          'Managing electric vehicle fleets requires real-time data and actionable insights. EV Champ\\'s Smart EV Telematics solution provides a powerful system for fleet operators to monitor and manage vehicles remotely.',
          'The platform offers comprehensive live GPS tracking and a real-time fleet monitoring dashboard that provides complete visibility across all vehicles. Fleet managers can access detailed driver behavior analytics and vehicle performance monitoring to identify inefficiencies and safety concerns. Advanced energy consumption reports help optimize routes and reduce operational costs.',
          'Route optimization algorithms help minimize fuel consumption and maximize efficiency, while real-time alerts notify managers of any issues instantly. This makes EV Champ one of the most comprehensive EV fleet management platforms in India.',
          'For commercial operators, the platform delivers significant operational benefits. Fleet managers can improve operational efficiency by tracking every aspect of vehicle performance, reduce maintenance costs through predictive analytics and proactive servicing, increase vehicle uptime by identifying issues before breakdowns occur, enhance driver safety with real-time monitoring and behavior insights, and monitor vehicle health remotely to prevent costly failures.',
        ],
      },"""

content = re.sub(section3_old, section3_new, content)

# Section 4: RSA Plans
section4_old = r"""      \{
        title: '4\. RSA Plans – 24×7 Roadside Assistance',
        paragraphs: \[
          'Breakdowns can happen anytime, even with electric vehicles\. EV Champ offers comprehensive Roadside Assistance plans to keep drivers protected wherever they travel\.',
          'Roadside support is especially valuable for users traveling long distances or operating commercial fleets\.',
        \],
        bullets: \[
          'Vehicle towing support',
          'Battery assistance',
          'Flat tyre support',
          'Emergency response',
          'On-road technical help',
          '24×7 availability',
          'Affordable annual plans',
          'Faster response times',
          'Peace of mind for EV owners',
        \],
      \},"""

section4_new = """      {
        title: '4. RSA Plans – 24×7 Roadside Assistance',
        paragraphs: [
          'Breakdowns can happen anytime, even with electric vehicles. EV Champ offers comprehensive Roadside Assistance plans to keep drivers protected wherever they travel. Our services include swift vehicle towing support, battery emergency assistance and diagnostics, flat tyre support and replacement services, emergency response capabilities, and on-road technical guidance with remote troubleshooting.',
          'Roadside support is especially valuable for users traveling long distances or operating commercial fleets. EV Champ\\'s Roadside Assistance is available 24/7/365 across major Indian cities, ensuring that help is always just a phone call away. Our plans are designed with flexible coverage options at affordable annual rates, giving you access to EV-trained technicians who understand battery systems, electrical components, and specialized repair procedures unique to electric vehicles.',
          'Whether a vehicle has a flat tyre, battery drain, software glitch, or mechanical issue, EV Champ dispatches trained professionals within the promised timeframe. Plans provide peace of mind for daily commuters, long-distance travelers, and commercial fleet operators alike. Our faster response times and EV-specific expertise ensure that your vehicle\\'s back on the road as quickly as possible, minimizing downtime and keeping you moving safely.',
        ],
      },"""

content = re.sub(section4_old, section4_new, content)

# Section 5: Sell Your EV
section5_old = r"""      \{
        title: '5\. Sell Your EV',
        paragraphs: \[
          'Selling an electric vehicle can be challenging due to concerns about battery condition and resale value\. EV Champ simplifies the process by providing a trusted platform for EV buyers and sellers\.',
        \],
        bullets: \[
          'Reach genuine buyers',
          'Faster listings',
          'Better price discovery',
          'Verified vehicle information',
          'Zero commission opportunities',
        \],
      \},"""

section5_new = """      {
        title: '5. Sell Your EV',
        paragraphs: [
          'Selling an electric vehicle can be challenging due to concerns about battery condition and resale value. EV Champ simplifies the process by providing a trusted platform for EV buyers and sellers to connect confidently. Our platform allows you to reach genuine buyers quickly, with faster listings and better price discovery than traditional channels.',
          'Every vehicle listing on EV Champ includes verified vehicle information, ensuring transparency for both buyers and sellers. The platform offers zero commission opportunities on select vehicle types, making it more economical to sell your EV. Whether you\\'re upgrading to a newer model or transitioning your fleet, EV Champ\\'s marketplace connects you with serious buyers who understand the value of electric vehicles.',
        ],
      },"""

content = re.sub(section5_old, section5_new, content)

# Section 6: ZipBattery
section6_old = r"""      \{
        title: '6\. ZipBattery – AI-Powered Battery Health Management',
        paragraphs: \[
          'ZipBattery is another innovative service offered through EV Champ\. It helps EV owners understand battery performance, degradation, and long-term health\.',
          'The battery accounts for a significant portion of an EV's total cost\. Monitoring battery health helps owners avoid expensive replacements, improve performance, increase resale value, and extend battery lifespan\.',
          'ZipBattery empowers EV owners with data-driven battery management\.',
        \],
        bullets: \[
          'Monitors battery performance',
          'Predicts battery degradation',
          'Improves battery lifespan',
          'Generates detailed health reports',
          'Uses patented AI technology',
        \],
      \},"""

section6_new = """      {
        title: '6. ZipBattery – AI-Powered Battery Health Management',
        paragraphs: [
          'ZipBattery is another innovative service offered through EV Champ. It helps EV owners understand battery performance, degradation, and long-term health.',
          'The battery accounts for a significant portion of an EV\\'s total cost. Monitoring battery health helps owners avoid expensive replacements, improve performance, increase resale value, and extend battery lifespan.',
          'ZipBattery empowers EV owners with data-driven battery management using patented AI technology. The system continuously monitors battery performance and predicts battery degradation patterns before they become critical issues. This proactive approach improves battery lifespan significantly and extends the overall value of the vehicle.',
          'ZipBattery generates detailed health reports that provide owners with comprehensive understanding of their battery\\'s condition, performance metrics, and longevity predictions. By leveraging advanced analytics and machine learning, ZipBattery enables EV owners to make informed decisions about vehicle maintenance and future usage patterns.',
        ],
      },"""

content = re.sub(section6_old, section6_new, content)

# Benefits section
benefits_old = r"""  \{
    heading: 'Benefits of Using EV Champ',
    paragraphs: \[
      'Instead of using multiple apps and service providers, EV Champ centralizes all major EV services under one platform\. This gives EV owners, fleet operators, dealers, and service providers a more convenient and intelligent way to manage electric mobility\.',
    \],
    bullets: \[
      'Convenience',
      'Real-time monitoring',
      'Verified service providers',
      'AI-powered diagnostics',
      'Fleet management tools',
      'Battery health tracking',
      'Emergency support',
    \],
  \},"""

benefits_new = """  {
    heading: 'Benefits of Using EV Champ',
    paragraphs: [
      'Instead of using multiple apps and service providers, EV Champ centralizes all major EV services under one platform. This gives EV owners, fleet operators, dealers, and service providers a more convenient and intelligent way to manage electric mobility.',
      'The platform provides unmatched convenience by consolidating EV service discovery, battery monitoring, fleet management, and roadside assistance into a single application. Users enjoy real-time monitoring capabilities that provide instant visibility into vehicle performance and health metrics. EV Champ connects you with verified service providers who have been thoroughly checked and authorized, ensuring quality service.',
      'AI-powered diagnostics enable predictive maintenance and early issue detection, while comprehensive fleet management tools help operators track and optimize entire vehicle fleets. The platform includes advanced battery health tracking that monitors performance and predicts maintenance needs. Emergency support available 24/7/365 ensures help is always available when you need it.',
    ],
  },"""

content = re.sub(benefits_old, benefits_new, content)

# Why EV Champ is the Future section
future_old = r"""  \{
    heading: 'Why EV Champ is the Future of EV Services in India',
    paragraphs: \[
      'India's EV market is expected to grow exponentially over the next decade\. With increasing vehicle adoption, digital support systems will become essential\.',
      'EV Champ combines artificial intelligence, predictive diagnostics, fleet intelligence, battery analytics, roadside support, and service center discovery\. This integrated approach positions EV Champ as a leading EV Service App India solution for modern electric mobility\.',
    \],
    bullets: \[
      'Artificial Intelligence',
      'Predictive Diagnostics',
      'Fleet Intelligence',
      'Battery Analytics',
      'Roadside Support',
      'Service Center Discovery',
    \],
  \},"""

future_new = """  {
    heading: 'Why EV Champ is the Future of EV Services in India',
    paragraphs: [
      'India\\'s EV market is expected to grow exponentially over the next decade. With increasing vehicle adoption, digital support systems will become essential.',
      'EV Champ is built on foundational technologies that define the future of electric mobility. Artificial Intelligence powers predictive analytics, battery health forecasting, and driver behavior insights across the platform. Predictive Diagnostics identify potential issues before they become problems, significantly reducing vehicle downtime and maintenance costs.',
      'Fleet Intelligence provides operators with comprehensive visibility and control over entire vehicle fleets, enabling data-driven decision-making and optimization. Battery Analytics help owners understand and maintain the most critical component of their vehicles. Integrated Roadside Support ensures drivers are never stranded, and Service Center Discovery connects users with authorized, verified repair facilities.',
      'This comprehensive integrated approach positions EV Champ as a leading EV Service App India solution for modern electric mobility. By combining all these capabilities in one platform, EV Champ delivers unparalleled value for EV owners, fleet operators, and the broader electric vehicle ecosystem.',
    ],
  },"""

content = re.sub(future_old, future_new, content)

# Write the file
with open('src/components/Blog.tsx', 'w') as f:
    f.write(content)

print("Blog.tsx updated successfully!")
