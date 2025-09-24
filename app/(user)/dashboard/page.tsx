'use client';
import CardTemplate from '@/components/card-template'
import { useInvestments } from '@/hooks/useInvestments';
import React from 'react'
  
  const UserDashboard = () => {
    const {
      data: investments = [],
      isLoading,
      error,
      refetch,
    } = useInvestments();
    const totalMemberInvestment = investments.filter((investment) => investment.isInvited).reduce((acc, investment) => acc + investment.amount, 0);
    const totalTeamIncome = totalMemberInvestment * 0.02;
    const myInvestment = investments.filter((investment) => !investment.isInvited).reduce((acc, investment) => acc + investment.amount, 0);
    const myIncome = myInvestment * 0.02;
    const myTotalDailyIncome = totalMemberInvestment * 0.01 + myIncome;
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <CardTemplate className=''>
          <div>Total Team Member</div>
          <div className='mt-4 text-right'>
            <span className='font-bold text-3xl'>
              <span className='text-xs text-primary mr-2'>Active</span>{investments.filter((investment) => investment.isInvited).filter((investment) => investment.amount > 0).length} <span className='text-base text-gray-500'>/ {investments.filter((investment) => investment.isInvited).length}</span>
            </span>
          </div>
        </CardTemplate>
        <CardTemplate className=''>
          <div>Total Team Investment</div>
          <div className='mt-4 text-right'>
            <span className='font-bold text-3xl'>
              {totalMemberInvestment + myInvestment}
            </span> Php
          </div>
        </CardTemplate>
        <CardTemplate className=''>
          <div>Team Income Per Day</div>
          <div className='mt-4 text-right'>
            <span className='font-bold text-3xl'>
              {(myTotalDailyIncome + totalTeamIncome).toFixed(2)}
            </span> Php
          </div>
        </CardTemplate>
        <CardTemplate className=''>
          <div>Personal Income Per Day</div>
          <div className='mt-4 text-right'>
            <span className='font-bold text-3xl'>{myTotalDailyIncome.toFixed(2)}</span> Php
          </div>
        </CardTemplate>
      </div>
    )
  }
  
  export default UserDashboard