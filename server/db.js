const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'database.json');

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: [],
      products: [],
      categories: [],
      brands: [],
      orders: [],
      payments: [],
      feedback: [],
      reviews: [],
      settings: {
        storeName: 'NEXBUY Flagship Store',
        companyName: 'NEXBUY ENTERPRISES PVT LTD',
        storeEmail: 'reach2nexbuy@gmail.com',
        storePhone: '+91 74483 76974',
        phones: ['+91 74483 76974', '+91 97890 33393', '+91 44 3154 4371'],
        registeredAddress: 'Flat No. 2, Plot No. 1051, 35th Street, 18th Main Road, Anna Nagar, Chennai – 600040',
        branchAddress: '1st Floor, Shop No. F49, No. 18/19, UNO Arcade Complex, Meeran Sahib Street, Chennai – 600002',
        gstin: '33AMCN1317Q1Z5',
        taxEnabled: false,
        taxRate: 0,
        shippingCharge: 0,
        freeShippingThreshold: 1999,
        paymentGateway: 'Razorpay',
        paymentGatewayConnected: true,
        allowCOD: true,
        promotionalBanner: {
          heading: 'Boost Your Productivity',
          subheading: 'Premium gear designed for modern workstations and digital creators.',
          ctaText: 'Browse Now',
          ctaLink: '/products',
          image: 'https://images.unsplash.com/photo-1751200065687-a126e7c304da?auto=format&fit=crop&w=1600&q=80'
        }
      },
      auditLogs: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
    return defaultData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file:', err);
    return {
      users: [],
      products: [],
      categories: [],
      brands: [],
      orders: [],
      payments: [],
      feedback: [],
      reviews: [],
      settings: {},
      auditLogs: []
    };
  }
}

let db = initDb();

function saveDb() {
  try {
    const tmpFile = DB_FILE + '.tmp';
    fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

function logAudit(adminId, action, entity, entityId, details = '') {
  const log = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    adminId: adminId || 'system',
    action,
    entity,
    entityId: String(entityId),
    details,
    createdAt: new Date().toISOString()
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveDb();
  return log;
}

function getDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(content);
    }
  } catch (err) {
    console.error('Error refreshing database from disk:', err);
  }
  return db;
}

module.exports = {
  get: getDb,
  save: saveDb,
  reload: () => {
    db = initDb();
    return db;
  },
  logAudit
};
