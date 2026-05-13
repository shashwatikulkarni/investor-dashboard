const fs = require('fs');
const path = require('path');

const industries = ['Fintech', 'Healthtech', 'SaaS', 'E-commerce', 'Edtech', 'Greentech', 'AI/ML', 'Web3', 'Cybersecurity', 'Logistics'];
const statuses = ['Active', 'Closed', 'Pending', 'In Review'];
const risks = ['Low', 'Medium', 'High'];

const generateDeals = (count) => {
  const deals = [];
  for (let i = 1; i <= count; i++) {
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const risk = risks[Math.floor(Math.random() * risks.length)];
    const amount = Math.floor(Math.random() * 5000000) + 100000; // 100k to 5.1m
    const roi = (Math.random() * 15 + 5).toFixed(2); // 5% to 20%
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();
    
    deals.push({
      id: `deal_${i}`,
      companyName: `Company ${i} (${industry})`,
      description: `Innovative ${industry} startup focusing on revolutionizing the market with cutting-edge technology.`,
      industry,
      amount,
      roi: parseFloat(roi),
      risk,
      status,
      createdAt,
      metrics: {
        revenue: Math.floor(amount * (Math.random() * 2 + 0.5)),
        burnRate: Math.floor(amount * (Math.random() * 0.2)),
        users: Math.floor(Math.random() * 100000) + 1000
      }
    });
  }
  return deals;
};

const generateInvestors = (count) => {
  const investors = [];
  for (let i = 1; i <= count; i++) {
    const preferredIndustries = industries.sort(() => 0.5 - Math.random()).slice(0, 3);
    const riskTolerance = risks[Math.floor(Math.random() * risks.length)];
    
    investors.push({
      id: `inv_${i}`,
      name: `Investor ${i}`,
      type: i % 3 === 0 ? 'Corporate' : 'Individual',
      totalInvested: Math.floor(Math.random() * 20000000) + 1000000,
      activeDeals: Math.floor(Math.random() * 10) + 1,
      preferences: {
        industries: preferredIndustries,
        riskTolerance,
        minRoi: Math.floor(Math.random() * 5) + 5
      }
    });
  }
  return investors;
};

const deals = generateDeals(75);
const investors = generateInvestors(15);

fs.writeFileSync(path.join(__dirname, 'src/data/mockDeals.json'), JSON.stringify(deals, null, 2));
fs.writeFileSync(path.join(__dirname, 'src/data/mockInvestors.json'), JSON.stringify(investors, null, 2));

console.log('Mock data generated successfully!');
