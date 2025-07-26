const fs = require('fs');
const path = require('path');

class JsonStorage {
  constructor(fileName) {
    this.filePath = path.join(__dirname, '../data', `${fileName}.json`);
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  readData() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  writeData(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${this.filePath}:`, error);
      return false;
    }
  }

  findAll() {
    return this.readData();
  }

  findById(id) {
    const data = this.readData();
    return data.find(item => item._id === id);
  }

  create(itemData) {
    const data = this.readData();
    const newItem = {
      _id: this.generateId(),
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newItem);
    this.writeData(data);
    return newItem;
  }

  update(id, updateData) {
    const data = this.readData();
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    data[index] = {
      ...data[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this.writeData(data);
    return data[index];
  }

  delete(id) {
    const data = this.readData();
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    const deletedItem = data.splice(index, 1)[0];
    this.writeData(data);
    return deletedItem;
  }

  findByField(field, value) {
    const data = this.readData();
    return data.filter(item => item[field] === value);
  }

  findOneByField(field, value) {
    const data = this.readData();
    return data.find(item => item[field] === value);
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // For compatibility with existing code that expects populate functionality
  populate(items, field, populateFrom) {
    if (!Array.isArray(items)) {
      items = [items];
    }
    
    return items.map(item => {
      if (item[field]) {
        const populatedData = populateFrom.findById(item[field]);
        if (populatedData) {
          return {
            ...item,
            [field]: populatedData
          };
        }
      }
      return item;
    });
  }
}

module.exports = JsonStorage;