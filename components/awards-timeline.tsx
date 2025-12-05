"use client";
import React from 'react';
import Award from "@/interfaces/i-award";
import AwardsTimelineItem from './awards-timeline-item';
import "./awards-timeline.scss";

interface AwardsTimelineProps {
  awards: Award[];
}

const AwardsTimeline: React.FC<AwardsTimelineProps> = ({awards}) => {

  return (
    <div className='awards-timeline'>
      {/* Timeline */}
      <div className="timeline">
        {awards.map((award, index) => (
          <AwardsTimelineItem 
            key={award.id} 
            award={award} 
            isFirst={index === 0}
            isLast={index === awards.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export default AwardsTimeline;