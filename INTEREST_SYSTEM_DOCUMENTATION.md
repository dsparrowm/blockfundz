# Interest Calculation System

## Overview
The BlockFundz platform now automatically calculates and credits interest to users' accounts every 24 hours based on their active investment subscriptions.

## How It Works

### Automatic Interest Calculation
- **Schedule**: Runs daily at 00:00 UTC
- **Frequency**: Every 24 hours
- **Target**: All active investment subscriptions (transactions with type='SUBSCRIPTION' and status='ACTIVE')

### Interest Calculation Formula
```
Daily Interest = (Investment Amount × Annual Interest Rate × Days Since Last Calculation) / 365
```

### Database Changes
- Added `lastInterestCalculation` field to `Transaction` model
- Tracks when interest was last calculated for each investment
- Prevents double-calculation within 24-hour periods

### Process Flow
1. **Daily Cron Job** runs at midnight UTC
2. **Fetch Active Investments** - Get all active investment subscriptions
3. **Calculate Interest** - For each investment:
   - Check if 24+ hours have passed since last calculation
   - Calculate daily interest based on plan's interest rate
   - Credit interest to user's main balance
   - Update lastInterestCalculation timestamp
   - Create transaction record for the interest credit
4. **Log Results** - Record total processed investments and credited amounts

## Admin Features

### Manual Interest Calculation
- **Location**: Admin > Investment Management
- **Button**: "Calculate Interest" (green button with calculator icon)
- **Purpose**: Allows admins to manually trigger interest calculation for testing or emergency processing
- **Response**: Shows number of investments processed and total amount credited

### API Endpoint
```
POST /api/investments/calculate-interest
Authorization: Bearer {adminToken}
```

## User Experience

### Overview Page
- **Interest Banner**: Displays information about automatic interest earnings
- **Timing Info**: Shows next calculation time (daily at 12:00 AM UTC)
- **Balance Updates**: Main balance automatically increases with interest credits

### Investments Page
- **Last Interest Column**: Shows when interest was last calculated for each investment
- **Current Profit**: Displays estimated profit based on time elapsed
- **Status**: "Pending" for investments that haven't had interest calculated yet

## Technical Implementation

### Backend Components
1. **InterestCalculationService.ts** - Core service handling interest calculations
2. **calculateInterest.ts** - API handler for manual interest calculation
3. **Database Migration** - Added lastInterestCalculation field
4. **Cron Scheduler** - Automatic daily execution

### Frontend Updates
1. **InvestmentManagement.tsx** - Admin manual calculation button
2. **Overview.tsx** - Interest information banner
3. **Investments.tsx** - Last interest calculation tracking
4. **Interface Updates** - Added lastInterestCalculation to Investment type

## Benefits

### For Users
- **Passive Income**: Automatic daily interest earnings
- **Transparency**: Clear tracking of when interest was last calculated
- **Real-time Updates**: Balance increases reflect immediately in main balance

### For Platform
- **Automated Process**: No manual intervention required
- **Accurate Tracking**: Prevents double-calculation and missed payments
- **Admin Control**: Manual override capability for special circumstances
- **Audit Trail**: Complete transaction history for all interest payments

## Security & Reliability

### Transaction Safety
- Uses database transactions to ensure data consistency
- Rollback protection if any step fails
- Duplicate prevention through timestamp checking

### Error Handling
- Comprehensive error logging
- Graceful failure handling for individual investments
- Continues processing even if one investment fails

### Monitoring
- Console logging for all interest calculations
- Success/failure tracking
- Admin notification of calculation results

## Configuration

### Cron Schedule
```javascript
cron.schedule('0 0 * * *', ...) // Daily at midnight UTC
```

### Interest Rate Application
- Stored in InvestmentPlan.interestRate as annual percentage
- Automatically converted to daily rate (interestRate / 100 / 365)
- Applied based on actual days since last calculation

## Getting Started

### For Admins
1. Navigate to Admin > Investment Management
2. Use "Calculate Interest" button to test functionality
3. Monitor results and user feedback

### For Users
1. Make investment subscriptions through the Invest page
2. Interest will automatically start accruing after 24 hours
3. Check Overview page for interest information
4. View Investments page to track calculation history

## Troubleshooting

### Common Issues
1. **No Interest Calculated**: Check if investment status is 'ACTIVE'
2. **Incorrect Amounts**: Verify interest rate configuration in investment plans
3. **Missing Calculations**: Check server logs for cron job execution

### Manual Recovery
- Use admin manual calculation button
- Check database for lastInterestCalculation timestamps
- Verify investment plan interest rates are set correctly
